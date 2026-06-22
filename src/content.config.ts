import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dates = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/dates' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    locationCoords: z.tuple([z.number(), z.number()]).nullable().optional(),
    mood: z.array(z.string()).optional().default([]),
    heroPhoto: z.string().optional(),
    photos: z.array(z.object({
      src: z.string(),
      caption: z.string().optional(),
    })).optional().default([]),
    rating: z.number().min(1).max(5).optional(),
  }),
});

export const collections = { dates };
