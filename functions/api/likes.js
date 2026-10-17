import { articles } from '../../lib/engagement/generated/articles.js';

const allowedArticles = new Set(articles);
const COOKIE = '__Host-merle-reader';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RATE_LIMIT = 60; // Writes per network address per ten-minute window.
const reply = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex', ...extra },
});
async function digest(secret, value) {
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', bytes.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const result = await crypto.subtle.sign('HMAC', key, bytes.encode(value));
  return [...new Uint8Array(result)].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks = []; let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 1024) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
function readerId(request) {
  const value = (request.headers.get('Cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  return value && UUID.test(value) ? value : null;
}
function stateSQL(db, article, reader) {
  return db.prepare('SELECT COUNT(*) AS count, COALESCE(MAX(reader_hash = ?), 0) AS liked FROM article_likes WHERE article = ?').bind(reader, article);
}
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (!['GET', 'PUT'].includes(request.method)) return reply({ error: 'method_not_allowed' }, 405, { Allow: 'GET, PUT' });
  const article = url.searchParams.get('article');
  if (!allowedArticles.has(article)) return reply({ error: 'unknown_article' }, 404);
  if (request.method === 'PUT' && (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site')) {
    return reply({ error: 'origin_not_allowed' }, 403);
  }
  if (!env.LIKES_DB) return reply({ error: 'temporarily_unavailable' }, 503);
  try {
    const secret = await env.LIKES_DB.prepare("SELECT value FROM engagement_settings WHERE key = 'hash_salt'").first('value');
    if (!secret) return reply({ error: 'temporarily_unavailable' }, 503);
    let id = readerId(request);
    if (request.method === 'GET') {
      const isNew = !id; id ||= crypto.randomUUID();
      const reader = await digest(secret, `reader:${id}`);
      const row = await stateSQL(env.LIKES_DB, article, reader).first();
      return reply({ count: Number(row.count), liked: Boolean(row.liked) }, 200, isNew ? {
        'Set-Cookie': `${COOKIE}=${id}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
      } : {});
    }
    if (!id) return reply({ error: 'cookies_required' }, 400);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({ error: 'json_required' }, 415);
    let body;
    try { body = await readBody(request); } catch { return reply({ error: 'invalid_body' }, 400); }
    if (!body || typeof body.liked !== 'boolean') return reply({ error: 'invalid_body' }, 400);
    const reader = await digest(secret, `reader:${id}`);
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / 600);
    // No raw IP is stored. A private HMAC and time window prevent easy cookie-reset flooding.
    const network = request.headers.get('CF-Connecting-IP') || 'local';
    const bucket = await digest(secret, `network:${network}:${window}`);
    const mutation = body.liked
      ? env.LIKES_DB.prepare('INSERT OR IGNORE INTO article_likes(article, reader_hash) SELECT ?, ? WHERE (SELECT hits FROM like_rate_limits WHERE bucket = ?) <= ?').bind(article, reader, bucket, RATE_LIMIT)
      : env.LIKES_DB.prepare('DELETE FROM article_likes WHERE article = ? AND reader_hash = ? AND (SELECT hits FROM like_rate_limits WHERE bucket = ?) <= ?').bind(article, reader, bucket, RATE_LIMIT);
    // D1 batch is transactional: concurrent duplicate requests cannot inflate the count.
    const result = await env.LIKES_DB.batch([
      env.LIKES_DB.prepare('INSERT INTO like_rate_limits(bucket, hits, expires_at) VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET hits = MIN(hits + 1, ?)').bind(bucket, (window + 1) * 600, RATE_LIMIT + 1),
      mutation,
      env.LIKES_DB.prepare('SELECT hits FROM like_rate_limits WHERE bucket = ?').bind(bucket),
      stateSQL(env.LIKES_DB, article, reader),
      env.LIKES_DB.prepare('DELETE FROM like_rate_limits WHERE bucket IN (SELECT bucket FROM like_rate_limits WHERE expires_at < ? LIMIT 50)').bind(now),
    ]);
    if (result[2].results[0].hits > RATE_LIMIT) return reply({ error: 'rate_limited' }, 429, { 'Retry-After': String(600 - now % 600) });
    const row = result[3].results[0];
    return reply({ count: Number(row.count), liked: Boolean(row.liked) });
  } catch {
    // Do not expose SQL, tokens or visitor information to clients or logs.
    return reply({ error: 'temporarily_unavailable' }, 503);
  }
}
