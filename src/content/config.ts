import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    coverImage: z.string(),
    coverImageMedium: z.string(),
    coverImageSmall: z.string(),
    coverImageDescription: z.string(),
    metaImage: z.string(),
    metaImageDescription: z.string(),
    thumbnail: z.string(),
    thumbnailDescription: z.string(),
    icon: z.string(),
    iconDescription: z.string(),
    tags: z.array(z.string()),
    shadowColor: z.string(),
    date: z.union([z.string(), z.date()]),
    lastMod: z.union([z.string(), z.date()]).optional(),
    draft: z.boolean(),
  }),
});

export const collections = { posts };
