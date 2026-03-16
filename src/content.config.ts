import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    readTime: z.string().optional(),
    metaLabel: z.string().optional(),
    breadcrumbName: z.string(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalUrl: z.string(),
    cardDescription: z.string(),
    cardDate: z.string(),
    featured: z.boolean().optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});

export const collections = { blog };
