import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        // Drafts show up in `npm run dev` but never in the published site.
        draft: z.boolean().default(false),
        // The post's own picture, made with `npm run covers` (see scripts/covers/covers.html).
        // `image` is the banner on the post and the link preview on LinkedIn and X; `thumb` is the 4:3 listing thumbnail.
        cover: z.object({ image: image(), thumb: image(), alt: z.string().min(20) }).optional(),
      })
      .refine((post) => post.draft || post.cover, {
        message: 'A published post needs its own cover: add it to scripts/covers/covers.html and run `npm run covers`',
        path: ['cover'],
      }),
});

export const collections = { blog };
