// Usage: npm run covers [slug ...]
// Renders each post's cover from scripts/covers/covers.html into src/assets/covers/:
//   <slug>.png        2400x1260, the post banner and (resized to 1200x630 at build) the social preview
//   <slug>-thumb.png  1200x900, the 4:3 thumbnail in post listings
// With no slugs it renders every post the template knows. Commit the PNGs it writes.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const template = pathToFileURL(fileURLToPath(new URL('./covers/covers.html', import.meta.url)));
const outDir = fileURLToPath(new URL('../src/assets/covers/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const formats = [
  { f: 'cover', suffix: '', viewport: { width: 1600, height: 840 }, scale: 1.5 },
  { f: 'thumb', suffix: '-thumb', viewport: { width: 1200, height: 900 }, scale: 1 },
];

const problems = [];
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
try {
  const probe = await browser.newPage();
  await probe.goto(template.href);
  const known = await probe.evaluate(() => Object.keys(window.COVERS));
  await probe.close();
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : known;
  const unknown = slugs.filter((s) => !known.includes(s));
  if (unknown.length) throw new Error(`no cover in covers.html for: ${unknown.join(', ')}`);

  for (const { f, suffix, viewport, scale } of formats) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
    for (const slug of slugs) {
      await page.goto(`${template.href}?post=${encodeURIComponent(slug)}&f=${f}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => img.decode()));
      });
      // Text cut off by the frame or spilling out of its box would be lost in the image
      const overflow = await page.evaluate(() => {
        const frame = document.querySelector('.f').getBoundingClientRect();
        return [...document.querySelectorAll('.f *')]
          .filter((el) => !el.closest('.stage'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.bottom > frame.bottom + 0.5 || r.right > frame.right + 0.5 || el.scrollWidth > el.clientWidth + 1;
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}: ${el.textContent.trim().slice(0, 40)}`);
      });
      if (overflow.length) problems.push(`${slug} (${f}) overflows:\n    ${overflow.join('\n    ')}`);
      const path = `${outDir}${slug}${suffix}.png`;
      await page.locator('.f').screenshot({ path });
      console.log(`wrote ${path}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  process.exit(1);
}
