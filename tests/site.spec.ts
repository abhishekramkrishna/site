import { test, expect, type Page } from '@playwright/test';

const pages = ['/', '/about', '/blog', '/tags/agents', '/tags/strategy', '/tags/business', '/tags/leadership', '/blog/agents-that-answer-with-screens', '/blog/more-code-not-more-software', '/blog/moderating-ai-agents', '/blog/what-a-good-agent-eval-looks-like', '/blog/skills-are-the-new-team-wiki', '/blog/stop-counting-tokens', '/blog/model-retirement-is-the-new-dependency-upgrade', '/blog/fail-stop-containment-for-agents', '/blog/what-each-part-of-an-agent-harness-is-worth', '/blog/agent-loops-and-graphs-do-different-jobs', '/blog/test-your-agent-skills-like-code'];

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const path of pages) {
  test(`${path} renders without errors or overflow`, async ({ page }) => {
    const errors = await collectErrors(page);
    const res = await page.goto(path, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, 'page scrolls horizontally').toBe(false);
    expect(errors, errors.join('\n')).toEqual([]);
  });
}

test('header has logo, nav, X and LinkedIn links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-header .logo-mark')).toBeVisible();
  await expect(page.locator('.site-header a[href*="x.com/abhi_ramkrishna"]')).toHaveCount(1);
  await expect(page.locator('.site-header a[href*="linkedin.com/in/"]')).toHaveCount(1);
  for (const label of ['Writing', 'About']) await expect(page.getByRole('link', { name: label, exact: true }).first()).toBeVisible();
});

test('hero agent console runs and switches questions', async ({ page }) => {
  await page.goto('/');
  const consoleEl = page.locator('.console');
  await expect(consoleEl).toBeVisible();
  await expect(consoleEl.locator('.log li').first()).toBeVisible({ timeout: 8000 });
  await consoleEl.locator('[data-run="1"]').click();
  await expect(consoleEl.locator('[data-run="1"]')).toHaveAttribute('aria-selected', 'true');
  await expect(consoleEl.locator('.task')).toContainText('build or buy', { timeout: 5000 });
});

test('reduced motion shows the finished console without animating', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('.console .log li')).toHaveCount(6);
  await expect(page.locator('.console .readmore a')).toBeVisible();
  await ctx.close();
});

test('dark mode renders the home page', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(10, 31, 51)');
  await ctx.close();
});

test('feeds and crawler files are served', async ({ request }) => {
  for (const path of ['/rss.xml', '/sitemap-index.xml', '/robots.txt', '/favicon.svg', '/og-default.png']) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
  const rss = await (await request.get('/rss.xml')).text();
  expect(rss).toContain('<rss');
});

test('every post has its own banner, listing thumbnail and link preview', async ({ page, request }) => {
  const loaded = (el: HTMLImageElement) => el.complete && el.naturalWidth > 0;
  await page.goto('/blog');
  const posts: string[] = [];
  const thumbs = new Set<string>();
  for (const card of await page.locator('main .card').all()) {
    const img = card.locator('.thumb img');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(loaded)).toBe(true);
    thumbs.add(await img.evaluate((el: HTMLImageElement) => el.currentSrc));
    posts.push((await card.getAttribute('href'))!);
  }
  expect(posts.length, 'posts listed').toBeGreaterThan(1);
  expect(thumbs.size, 'each post has its own thumbnail').toBe(posts.length);

  const previews = new Set<string>();
  for (const path of posts) {
    await page.goto(path);
    const banner = page.locator('main figure.cover img');
    await expect(banner).toHaveCount(1);
    await expect.poll(() => banner.evaluate(loaded), `${path} banner loads`).toBe(true);
    expect((await banner.getAttribute('alt'))?.length ?? 0, `${path} banner alt text`).toBeGreaterThanOrEqual(20);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og, `${path} og:image`).toMatch(/^https?:\/\/.+\.png$/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', og!);
    const res = await request.get(new URL(og!).pathname);
    expect(res.status(), `${path} og:image ${og}`).toBe(200);
    const png = await res.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)], `${path} og:image size`).toEqual([1200, 630]);
    previews.add(og!);
  }
  expect(previews.size, 'each post has its own link preview').toBe(posts.length);
});

test('unknown routes return the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
});

test('post images and demo video load', async ({ page, request }) => {
  await page.goto('/blog/agents-that-answer-with-screens', { waitUntil: 'networkidle' });
  const imgs = page.locator('article img, .prose img, main img');
  expect(await imgs.count()).toBeGreaterThanOrEqual(3);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
});

test('review bottleneck post shows its data figures and animates them on scroll', async ({ page }) => {
  await page.goto('/blog/more-code-not-more-software', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(5);
  await expect(page.locator('main')).not.toContainText('Comments per pull request rose 53%');
  const last = figs.last();
  await expect(last).toHaveClass(/motion/);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('reduced motion shows the review figures finished without animating', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/blog/more-code-not-more-software');
  const fig = page.locator('main .dfig').first();
  await expect(fig).not.toHaveClass(/motion/);
  const transform = await fig.locator('.df-bar').first().evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toBe('none');
  await ctx.close();
});

test('agent moderation post shows its figures, animates them and loads its video', async ({ page, request }) => {
  await page.goto('/blog/moderating-ai-agents', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  const last = figs.last();
  await expect(last).toHaveClass(/motion/);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
});

test('reduced motion shows the agent moderation figures finished without animating', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/blog/moderating-ai-agents');
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  for (const fig of await figs.all()) await expect(fig).not.toHaveClass(/motion/);
  await ctx.close();
});

test('test builds load no analytics tracker or third-party requests', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (r) => hosts.add(new URL(r.url()).host));
  for (const path of ['/', '/blog/moderating-ai-agents']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('script[src*="umami"]')).toHaveCount(0);
  }
  const origin = new URL(page.url()).host;
  expect([...hosts].filter((h) => h !== origin)).toEqual([]);
});

test('share clicks, video plays and read-through send analytics events', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { events: [string, Record<string, unknown>][]; umami: unknown };
    w.events = [];
    w.umami = { track: (name: string, data: Record<string, unknown>) => w.events.push([name, data]) };
  });
  await page.goto('/blog/moderating-ai-agents', { waitUntil: 'networkidle' });
  const events = () => page.evaluate(() => (window as unknown as { events: [string, Record<string, unknown>][] }).events);
  const names = async () => (await events()).map(([n]) => n);

  expect(await names()).not.toContain('read-75');
  await page.locator('.post-foot').scrollIntoViewIfNeeded();
  await expect.poll(names).toContain('read-75');
  expect((await events())[0][1]).toMatchObject({ path: '/blog/moderating-ai-agents' });

  await page.locator('.share [data-event="share-linkedin"]').evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()));
  await page.locator('.share [data-event="share-linkedin"]').click();
  await expect.poll(names).toContain('share-linkedin');

  await page.locator('main video').evaluate((v) => {
    v.dispatchEvent(new Event('play'));
    v.dispatchEvent(new Event('play'));
    v.dispatchEvent(new Event('ended'));
  });
  await expect.poll(names).toContain('video-complete');
  expect((await names()).filter((n) => n === 'video-play')).toHaveLength(1);
});

test('agent eval post shows its diagrams and screenshots and loads its video', async ({ page, request }) => {
  await page.goto('/blog/what-a-good-agent-eval-looks-like', { waitUntil: 'networkidle' });
  // The post's own five figures; its cover is checked by the cover test below
  const imgs = page.locator('.prose img');
  await expect(imgs).toHaveCount(5);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
});

test('skills post shows its figures and animates them on scroll', async ({ page }) => {
  await page.goto('/blog/skills-are-the-new-team-wiki', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  const last = figs.last();
  await expect(last).toHaveClass(/motion/);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('reduced motion shows the skills figures finished without animating', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/blog/skills-are-the-new-team-wiki');
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  for (const fig of await figs.all()) await expect(fig).not.toHaveClass(/motion/);
  await ctx.close();
});

test('tokens post shows its figures and animates them on scroll', async ({ page }) => {
  await page.goto('/blog/stop-counting-tokens', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  const last = figs.last();
  await expect(last).toHaveClass(/motion/);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('reduced motion shows the tokens figures finished without animating', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/blog/stop-counting-tokens');
  const figs = page.locator('main .dfig');
  await expect(figs).toHaveCount(4);
  for (const fig of await figs.all()) await expect(fig).not.toHaveClass(/motion/);
  await ctx.close();
});

test('model retirement post shows its labelled figures and a readable comparison table', async ({ page }) => {
  await page.goto('/blog/model-retirement-is-the-new-dependency-upgrade', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig[role="img"]');
  await expect(figs).toHaveCount(3);
  for (const fig of await figs.all()) expect((await fig.getAttribute('aria-label'))?.length).toBeGreaterThan(80);
  await expect(page.locator('main table th').first()).toContainText('Framework upgrade');
  const table = page.locator('main table');
  expect(await table.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  const last = figs.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('fail-stop post shows its labelled figures, and credits and links Stanch', async ({ page }) => {
  await page.goto('/blog/fail-stop-containment-for-agents', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig[role="img"]');
  await expect(figs).toHaveCount(3);
  for (const fig of await figs.all()) expect((await fig.getAttribute('aria-label'))?.length).toBeGreaterThan(80);
  await expect(page.locator('main a[href="https://github.com/getstanch/stanch"]').first()).toBeVisible();
  await expect(figs.nth(1).locator('li')).toHaveCount(5);
  const last = figs.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('harness post shows its labelled figures, links the code, says the numbers are from a mock and loads its video', async ({ page, request }) => {
  await page.goto('/blog/what-each-part-of-an-agent-harness-is-worth', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig[role="img"]');
  await expect(figs).toHaveCount(2);
  for (const fig of await figs.all()) expect((await fig.getAttribute('aria-label'))?.length).toBeGreaterThan(80);
  await expect(page.locator('main a[href="https://github.com/abhishekramkrishna/agent-harness-lab"]').first()).toBeVisible();
  await expect(page.locator('main')).toContainText('mock model');
  await expect(figs.nth(1).locator('li')).toHaveCount(6);
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
  const last = figs.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('loops and graphs post shows its labelled figures, links the code, says the numbers are from a mock and loads its video', async ({ page, request }) => {
  await page.goto('/blog/agent-loops-and-graphs-do-different-jobs', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig[role="img"]');
  await expect(figs).toHaveCount(2);
  for (const fig of await figs.all()) expect((await fig.getAttribute('aria-label'))?.length).toBeGreaterThan(80);
  await expect(page.locator('main a[href="https://github.com/abhishekramkrishna/agent-harness-lab"]').first()).toBeVisible();
  await expect(page.locator('main')).toContainText('mock model');
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
  const last = figs.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});

test('skills post shows its labelled figures, links the code, credits both collections and loads its video', async ({ page, request }) => {
  await page.goto('/blog/test-your-agent-skills-like-code', { waitUntil: 'networkidle' });
  const figs = page.locator('main .dfig[role="img"]');
  await expect(figs).toHaveCount(2);
  for (const fig of await figs.all()) expect((await fig.getAttribute('aria-label'))?.length).toBeGreaterThan(80);
  await expect(page.locator('main a[href="https://github.com/abhishekramkrishna/agent-harness-lab"]').first()).toBeVisible();
  await expect(page.locator('main a[href="https://github.com/mattpocock/skills"]').first()).toBeVisible();
  await expect(page.locator('main a[href="https://github.com/addyosmani/agent-skills"]').first()).toBeVisible();
  await expect(figs.nth(1).locator('li')).toHaveCount(4);
  const video = page.locator('main video');
  await expect(video).toHaveCount(1);
  for (const attr of ['src', 'poster']) {
    const url = await video.getAttribute(attr);
    expect(url, `video ${attr}`).toBeTruthy();
    expect((await request.head(url!)).status(), `video ${attr} ${url}`).toBe(200);
  }
  const last = figs.last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveClass(/in-view/);
});
