import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({ base: './content/posts', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.string().default('梅爾 Merle'),
		tags: z.array(z.string()).default([]),
		series: z
			.object({
				title: z.string(),
				slug: z.string().regex(/^[a-z0-9-]+$/),
			})
			.optional(),
		affiliateDisclosure: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

const works = defineCollection({
	loader: glob({ base: './content/works', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		status: z.string().optional(),
		architecture: z.array(z.string()).default([]),
		tools: z.array(z.string()).default([]),
		detail: z.string().optional(),
		url: z.string().url().optional(),
	}),
});

export const collections = { posts, works };
