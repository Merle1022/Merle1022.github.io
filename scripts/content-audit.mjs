import fs from 'node:fs';
import path from 'node:path';

const postsDirectory = path.resolve('content/posts');
const now = new Date();
const reviewAfterDays = 180;

const formatDate = (date) => date.toISOString().slice(0, 10);
const parseFrontmatter = (source) => {
	const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
	if (!match) return {};
	const get = (key) => match[1].match(new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?\\s*$`, 'm'))?.[1]?.trim();
	return { title: get('title'), date: get('updatedDate') ?? get('date') };
};

const findings = fs
	.readdirSync(postsDirectory)
	.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
	.map((file) => {
		const metadata = parseFrontmatter(fs.readFileSync(path.join(postsDirectory, file), 'utf8'));
		const reviewedAt = new Date(metadata.date);
		const ageInDays = Math.floor((now - reviewedAt) / 86_400_000);
		return { file, ...metadata, ageInDays, needsReview: Number.isFinite(ageInDays) && ageInDays >= reviewAfterDays };
	})
	.filter((post) => post.needsReview)
	.sort((a, b) => b.ageInDays - a.ageInDays);

const lines = [
	'## 每月內容健檢',
	'',
	`產生時間：${formatDate(now)}。此清單僅提醒人工複查，不會自動變更文章內容或更新日期。`,
	'',
];

if (findings.length === 0) {
	lines.push(`目前沒有超過 ${reviewAfterDays} 天未複查的文章。`);
} else {
	lines.push(`以下文章距離發布或上次實質更新已超過 ${reviewAfterDays} 天：`, '');
	for (const post of findings) {
		lines.push(`- [ ] \`${post.file}\`｜${post.title ?? '未命名'}｜最後日期 ${post.date ?? '未填寫'}（${post.ageInDays} 天前）`);
	}
	lines.push('', '複查時請確認：官方來源是否仍有效、工具／價格／規則是否更新、截圖是否仍準確，以及是否有值得補充的實作結果。');
}

console.log(lines.join('\n'));
