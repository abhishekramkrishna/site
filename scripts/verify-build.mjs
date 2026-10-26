// Checks the production build in dist/ for regressions. Exits non-zero on any failure.
// Run after `npm run build`.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

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
  ...['what-a-good-agent-eval-looks-like', 'skills-are-the-new-team-wiki'].map((s) => `blog/${s}/index.html`),
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

// 4. Internal links and assets resolve
const refRe = /(?:href|src|poster)="([^"#?]+)[^"]*"/g;
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  for (const [, ref] of s.matchAll(refRe)) {
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

if (errors.length) {
  console.error(`verify-build: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`verify-build: ok (${html.length} pages, ${files.length} files)`);
