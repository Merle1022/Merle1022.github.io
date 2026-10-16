import test from 'node:test';
import assert from 'node:assert/strict';
import { readingTime, readingStats } from '../src/utils/reading-time.mjs';

test('mixed Chinese and English use distinct, documented units', () => {
 assert.equal(readingTime('中'.repeat(400)), 1);
 assert.equal(readingTime('中'.repeat(401)), 2);
 assert.equal(readingTime('word '.repeat(238)), 1);
 assert.equal(readingTime('中'.repeat(400) + ' word'.repeat(238)), 2);
});
test('URLs, code blocks, images and hidden comments do not inflate time', () => {
 const source = '中'.repeat(400) + '\n[說明](https://example.com/' + 'long'.repeat(400) + ')\n![圖片](https://example.com/picture.png)\n<!--' + '中'.repeat(1000) + '-->\n```js\n' + 'code '.repeat(2000) + '\n```';
 assert.equal(readingStats(source).characters, 402);
 assert.equal(readingStats(source).words, 0);
 assert.equal(readingTime(''), 1);
});
