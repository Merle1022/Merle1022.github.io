import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const articles = [];
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await scan(path);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      const match = html.match(/data-article-path="([^"]+)"/);
      if (match) articles.push(match[1]);
    }
  }
}
await scan('dist/blog');
if (!articles.length) throw new Error('No published articles found for engagement');
await mkdir('lib/engagement/generated', { recursive: true });
await writeFile('lib/engagement/generated/articles.js', `// Generated from published HTML. Do not edit.\nexport const articles = ${JSON.stringify([...new Set(articles)].sort())};\n`);
console.log(`Prepared engagement allowlist for ${articles.length} published articles`);
