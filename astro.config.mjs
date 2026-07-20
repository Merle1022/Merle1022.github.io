// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// GitHub Actions supplies these automatically. For a custom domain, set SITE_URL
// to the domain and BASE_PATH to "/" in the repository environment variables.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
});
