// Usage: npm run new "My post title"
// Creates the post in src/content/blog/drafts/, which git ignores, so it stays private.
// When it's ready, give it a cover (add it to scripts/covers/covers.html, then `npm run covers <slug>`),
// set draft: false and move it to src/content/blog/ to publish.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new "My post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');
mkdirSync('src/content/blog/drafts', { recursive: true });
const file = `src/content/blog/drafts/${slug}.mdx`;
if (existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
description: ""
pubDate: ${today}
tags: []
draft: true
---

Start writing here.
`,
);
console.log(`Created ${file} (private draft, not tracked by git)`);
