// Checks the production build in dist/ for regressions. Exits non-zero on any failure.
// Run after `npm run build`.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const DIST = 'dist';
const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

// 1. Required routes exist
const required = [
  'index.html',
  'about/index.html',
  'blog/index.html',
  '404.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'favicon.svg',
  'og-default.png',
  ...['agents', 'strategy', 'business', 'leadership'].map((t) => `tags/${t}/index.html`),
  // Posts that scheduled social posts link to: a missing one means a live 404
  ...['what-a-good-agent-eval-looks-like', 'skills-are-the-new-team-wiki', 'stop-counting-tokens', 'model-retirement-is-the-new-dependency-upgrade', 'claude-code-hooks'].map((s) => `blog/${s}/index.html`),
];
for (const r of required) if (!existsSync(join(DIST, r))) fail(`missing required file: ${r}`);

// 2. No draft content in the production build
for (const f of files) {
  const rel = relative(DIST, f);
  if (/(^|\/)drafts?(\/|$)/.test(rel)) fail(`draft path in build: ${rel}`);
}
for (const f of html) {
  if (readFileSync(f, 'utf8').includes('draft-badge')) fail(`draft badge rendered in ${relative(DIST, f)}`);
}

// 3. SEO essentials on every page except 404
for (const f of html) {
  const rel = relative(DIST, f);
  const s = readFileSync(f, 'utf8');
  const need = {
    '<title>': /<title>[^<]{3,}<\/title>/,
    'meta description': /<meta name="description" content="[^"]{20,}"/,
    'lang attribute': /<html lang="en"/,
    'viewport meta': /<meta name="viewport"/,
  };
  if (rel !== '404.html') {
    Object.assign(need, {
      canonical: /<link rel="canonical" href="https?:\/\/[^"]+"/,
      'og:image': /<meta property="og:image" content="https?:\/\/[^"]+"/,
      'twitter:card': /<meta name="twitter:card" content="summary_large_image"/,
      'JSON-LD': /<script type="application\/ld\+json">/,
    });
  }
  for (const [label, re] of Object.entries(need)) if (!re.test(s)) fail(`${rel}: missing ${label}`);
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(`${rel}: expected exactly one <h1>, found ${h1}`);
}

// 4. Internal links and assets resolve, including every candidate in a responsive image's srcset
const refRe = /(?:href|src|poster)="([^"#?]+)[^"]*"/g;
const srcsetRe = /srcset="([^"]+)"/g;
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  const refs = [...s.matchAll(refRe)].map((m) => m[1]);
  for (const [, set] of s.matchAll(srcsetRe)) refs.push(...set.split(',').map((c) => c.trim().split(/\s+/)[0]));
  for (const ref of refs) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(ref)) continue;
    if (!ref.startsWith('/')) continue;
    let p = ref;
    if (base && !(p === base || p.startsWith(base + '/'))) {
      fail(`${relative(DIST, f)}: ${ref} is missing the base path ${base}`);
      continue;
    }
    if (base) p = p.slice(base.length) || '/';
    const candidates = [join(DIST, p), join(DIST, p, 'index.html'), join(DIST, `${p}.html`)];
    if (!candidates.some((c) => existsSync(c) && statSync(c).isFile())) fail(`${relative(DIST, f)}: broken link ${ref}`);
  }
}

// 5. Personal brand: the public site does not name an employer or the old GitHub username
const forbiddenTerms = [/whatfix/i, /abhishekramkrishna002/i];
for (const f of files.filter((f) => /\.(html|xml|txt|json)$/.test(f))) {
  const s = readFileSync(f, 'utf8');
  for (const re of forbiddenTerms) if (re.test(s)) fail(`${relative(DIST, f)}: contains forbidden term ${re}`);
}

// 6. RSS feed is well formed enough to parse
const rss = existsSync(join(DIST, 'rss.xml')) ? readFileSync(join(DIST, 'rss.xml'), 'utf8') : '';
if (rss && !/^<\?xml[\s\S]*<rss[\s\S]*<channel>[\s\S]*<\/channel>\s*<\/rss>\s*$/.test(rss)) fail('rss.xml is malformed');

// 7. Analytics: the cookieless Umami tracker is on every page when configured, and nowhere otherwise.
// No other tracker is allowed.
const umamiId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
const umamiTag = /<script[^>]+src="https:\/\/cloud\.umami\.is\/script\.js"[^>]*data-website-id="([^"]+)"[^>]*data-do-not-track="true"/;
const umamiScript = /<script[^>]+src="https:\/\/cloud\.umami\.is\//;
const otherTrackers = /<script[^>]+src="https:\/\/(?:www\.)?(?:googletagmanager\.com|google-analytics\.com|connect\.facebook\.net|static\.hotjar\.com|snap\.licdn\.com)\//;
for (const f of html) {
  const rel = relative(DIST, f);
  const s = readFileSync(f, 'utf8');
  const m = s.match(umamiTag);
  if (umamiId && m?.[1] !== umamiId) fail(`${rel}: missing the Umami analytics script`);
  if (!umamiId && umamiScript.test(s)) fail(`${rel}: Umami script present without PUBLIC_UMAMI_WEBSITE_ID`);
  if (otherTrackers.test(s)) fail(`${rel}: contains a third-party tracker other than Umami`);
}

// 8. Every post has its own cover (made with `npm run covers`, named after the post): the banner on the post,
// its thumbnail in the blog listing, and its 1200x630 PNG link preview (og:image, twitter:image).
// The shared og-default.png or another post's image is a failure.
const named = (src, name) => basename(new URL(src, 'https://x').pathname).startsWith(`${name}.`);
const posts = html.map((f) => relative(DIST, f)).filter((rel) => /^blog\/[^/]+\/index\.html$/.test(rel));
for (const rel of posts) {
  const slug = rel.split('/')[1];
  const s = readFileSync(join(DIST, rel), 'utf8');
  const og = s.match(/<meta property="og:image" content="(https?:\/\/[^"]+)"/)?.[1];
  if (!og) continue; // reported by check 3
  if (s.match(/<meta name="twitter:image" content="([^"]+)"/)?.[1] !== og) fail(`${rel}: twitter:image differs from og:image`);
  if (!/<meta property="og:image:alt" content="[^"]{20,}"/.test(s)) fail(`${rel}: missing og:image:alt`);
  if (!named(og, slug)) fail(`${rel}: og:image ${og} is not this post's own cover`);
  const path = new URL(og).pathname;
  if (base && !path.startsWith(base + '/')) fail(`${rel}: og:image ${og} is missing the base path ${base}`);
  const file = join(DIST, base ? path.slice(base.length) : path);
  if (!existsSync(file)) fail(`${rel}: og:image ${og} is not in the build`);
  else {
    const png = readFileSync(file);
    const size = png.toString('latin1', 1, 4) === 'PNG' ? `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}` : 'not a PNG';
    if (size !== '1200x630') fail(`${rel}: og:image should be a 1200x630 PNG, got ${size}`);
  }
  const banner = s.match(/<figure class="cover"[^>]*><img src="([^"]+)"[^>]*alt="([^"]*)"/);
  if (!banner) fail(`${rel}: no cover image at the top of the post`);
  else {
    if (!named(banner[1], slug)) fail(`${rel}: the banner ${banner[1]} is not this post's own cover`);
    if (banner[2].length < 20) fail(`${rel}: the banner has no useful alt text`);
  }
}
const listing = existsSync(join(DIST, 'blog/index.html')) ? readFileSync(join(DIST, 'blog/index.html'), 'utf8') : '';
const cards = listing.split('<a class="card"').slice(1);
if (cards.length !== posts.length) fail(`blog/index.html: lists ${cards.length} posts, the build has ${posts.length}`);
for (const card of cards) {
  const slug = card.match(/^[^>]*href="[^"]*\/blog\/([^"/]+)\/?"/)?.[1];
  const thumb = card.match(/<span class="thumb"[^>]*><img src="([^"]+)"/)?.[1];
  if (!thumb) fail(`blog/index.html: the card for ${slug} has no thumbnail image`);
  else if (!named(thumb, `${slug}-thumb`)) fail(`blog/index.html: the card for ${slug} shows ${thumb}, not its own thumbnail`);
}

if (errors.length) {
  console.error(`verify-build: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`verify-build: ok (${html.length} pages, ${files.length} files)`);
