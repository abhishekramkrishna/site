# Abhishek Ramkrishna: personal site

Personal site and blog. Built with [Astro](https://astro.build), hosted on GitHub Pages.

## Write a post

Drafts stay private. This repository is public, so unpublished writing never goes in it.

1. `npm install`, then `npm run new "My post title"`. This creates `src/content/blog/drafts/my-post-title.mdx`,
   which git ignores.
2. `npm run dev` and open http://localhost:4321 to preview. Drafts show locally with a "draft" badge.
3. When it's ready to publish, set `draft: false` and move the file to `src/content/blog/`. Commit and push.

Front matter:

```md
---
title: "Your title"
description: "One line. Shown in Google, RSS and LinkedIn/X link previews."
pubDate: 2026-11-03
tags: [agents]        # agents, strategy, business, leadership
draft: false
---
```

### Diagrams in posts

Posts are MDX, so you can drop in any diagram from `src/components/diagrams/`:

```mdx
import AgentLoop from '../../components/diagrams/AgentLoop.astro';
import Figure from '../../components/Figure.astro';

<Figure caption="Every agent is this loop." tone="navy">
  <AgentLoop />
</Figure>
```

Tones: default (paper), `navy`, `teal`, `gold`. Each post also gets a cover diagram from its first tag.

## Share a post

Every post ends with **LinkedIn**, **X** and **Copy link** buttons. Link previews use the post title, description and
`public/og-default.png`.

## What's included

- Home, About, Writing, a page per topic, 404
- RSS at `/rss.xml`, sitemap, robots.txt, canonical URLs, Open Graph and X cards, JSON-LD
- Light and dark themes, self-hosted fonts (Inter, Source Serif 4, JetBrains Mono), no tracking, no cookies

Edit name, links and topics in `src/consts.ts`.

## Deploy

1. **Settings → Pages → Source: GitHub Actions**.
2. **Actions → Deploy site → Run workflow**. The site is built and published.
3. Optional custom domain: add it under Settings → Pages, then set a repository variable `SITE_URL`
   (for example `https://abhishekramkrishna.com`) under Settings → Secrets and variables → Actions → Variables.
