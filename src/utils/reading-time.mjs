/** Site estimate, not a norm for Taiwan's population.
 * Brysbaert (2019), https://doi.org/10.1016/j.jml.2019.104047:
 * Chinese silent reading: 260 words/minute, using 1.5 characters/word
 * in conversions (roughly 390 characters/minute); English non-fiction: 238 wpm.
 * We round the Chinese rate to 400 characters/minute as an editorial default.
 */
export const READING_RATES = { chineseCharacters: 400, englishWords: 238 };
export const READING_TIME_NOTE = '依正文長度，以中文每分鐘約 400 字、英文每分鐘約 238 單字估算，僅供參考；不是台灣人口平均值，不含實作或停下思考的時間。';

export function readingStats(markdown = '') {
	const text = markdown
		.replace(/<!--[^]*?-->/g, ' ')
		.replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, ' ')
		.replace(/^\s*(?:import|export)\s+.*$/gm, ' ')
		.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[^]*?^\s*\1\s*$/gm, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/^\s*\[[^\]]+\]:.*$/gm, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/https?:\/\/\S+/g, ' ');
	const cjk = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
	const words = text
		.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, ' ')
		.match(/[\p{L}\p{N}]+(?:['’’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
	return { characters: cjk, words, minutes: Math.max(1, Math.ceil(cjk / READING_RATES.chineseCharacters + words / READING_RATES.englishWords)) };
}

export function readingTime(markdown = '') {
	return readingStats(markdown).minutes;
}
