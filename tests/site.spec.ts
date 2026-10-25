import { test, expect, type Page } from '@playwright/test';

const pages = ['/', '/about', '/blog', '/tags/agents', '/tags/strategy', '/tags/business', '/tags/leadership'];

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

test('unknown routes return the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
});
