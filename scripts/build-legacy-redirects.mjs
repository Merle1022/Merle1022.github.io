import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';

// Only the GitHub Pages workflow runs this. Cloudflare serves the normal dist.
const source = resolve(process.argv[2] || 'dist');
const destination = resolve(process.argv[3] || 'legacy-dist');
if (source === destination) throw new Error('Redirect output must differ from the website build');
const origin = 'https://merle188.com';
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let count = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!entry.name.endsWith('.html') || entry.name === '404.html') continue;
    const path = relative(source, file).split('\\').join('/').replace(/index\.html$/, '');
    const target = new URL(path, `${origin}/`).href;
    // Run before the meta refresh to retain query parameters and fragments.
    const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>網站已搬家｜梅爾 Merle</title><link rel="canonical" href="${escape(target)}"><script>location.replace(${JSON.stringify(origin)} + location.pathname + location.search + location.hash);</script><meta http-equiv="refresh" content="0; url=${escape(target)}"></head><body><p>網站已搬家至 <a href="${escape(target)}">merle188.com</a>。</p></body></html>\n`;
    await writeFile(join(destination, relative(source, file)), html);
    count++;
  }
}
await visit(source);
console.log(`Prepared ${count} page redirects for GitHub Pages in ${destination}`);
