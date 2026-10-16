// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Hosting builds may override these values. Local development keeps localhost;
// production defaults to the canonical domain, including Cloudflare builds.
const site = process.env.SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://merle188.com' : 'http://localhost:4321');
const base = process.env.BASE_PATH || '/';

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap({ customPages: [`${site}${base}12%E9%80%B1%E9%99%AA%E8%B7%91/`] })],
});
