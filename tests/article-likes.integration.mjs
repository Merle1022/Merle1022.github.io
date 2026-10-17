// Run against isolated `wrangler pages dev` after applying db/article-likes.sql locally.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const origin = process.env.ENGAGEMENT_TEST_ORIGIN || 'http://127.0.0.1:4333';
if (!['localhost','127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Integration test must only target a local test database');
const article = '/blog/why-i-built-my-own-website/';
const cookie = () => `__Host-merle-reader=${randomUUID()}`;
const prefix = randomUUID();
async function call({ method = 'GET', page = article, reader, ip = prefix, body, extra = {}, contentType = 'application/json', raw } = {}) {
  return fetch(`${origin}/api/likes?article=${encodeURIComponent(page)}`, {
    method, headers: { Origin: origin, 'CF-Connecting-IP': ip, ...(reader ? { Cookie: reader } : {}),
      ...(method === 'PUT' ? { 'Content-Type': contentType } : {}), ...extra },
    ...(method === 'PUT' ? { body: raw ?? JSON.stringify(body) } : {}),
  });
}
const first = await call();
assert.equal(first.status, 200);
assert.match(first.headers.get('set-cookie'), /__Host-merle-reader=.*HttpOnly; Secure; SameSite=Lax/);
assert.equal(first.headers.get('cache-control'), 'no-store');
assert.equal(first.headers.get('access-control-allow-origin'), null);
const initial = await first.json();
const a = cookie(), b = cookie();
let response = await call({ method:'PUT',reader:a,body:{liked:true} });
assert.deepEqual(await response.json(),{count:initial.count+1,liked:true});
const results = await Promise.all(Array.from({length:8},()=>call({method:'PUT',reader:a,body:{liked:true}}).then(r=>r.json())));
assert.ok(results.every(x=>x.count===initial.count+1 && x.liked));
response = await call({reader:a});assert.equal((await response.json()).liked,true);
response = await call({reader:b});assert.equal((await response.json()).liked,false);
response = await call({method:'PUT',reader:b,body:{liked:true}});assert.equal((await response.json()).count,initial.count+2);
response = await call({reader:a,page:'/blog/ai-confirm-understanding-before-prompt/'});assert.equal((await response.json()).liked,false);
for (let i=0;i<2;i++) {
  response=await call({method:'PUT',reader:a,body:{liked:false}});
  assert.deepEqual(await response.json(),{count:initial.count+1,liked:false});
}
response=await call({method:'PUT',reader:b,body:{liked:false}});assert.equal((await response.json()).count,initial.count);
for (const [options,status] of [
  [{page:'/blog/not-published/'},404],
  [{method:'POST'},405],
  [{method:'PUT',body:{liked:true}},400],
  [{method:'PUT',reader:a,body:{liked:true},extra:{Origin:'https://other.example'}},403],
  [{method:'PUT',reader:a,body:{liked:true},extra:{'Sec-Fetch-Site':'cross-site'}},403],
  [{method:'PUT',reader:a,body:{liked:'true'}},400],
  [{method:'PUT',reader:a,raw:'{broken'},400],
  [{method:'PUT',reader:a,raw:JSON.stringify({liked:true,padding:'x'.repeat(2000)})},400],
  [{method:'PUT',reader:a,contentType:'text/plain',body:{liked:true}},415],
]) assert.equal((await call(options)).status,status,JSON.stringify(options));
// At the limit, switching cookies must not bypass the network write cap.
const rateIP=prefix+'-rate'; const rateReader=cookie();
for(let i=0;i<60;i++) assert.equal((await call({method:'PUT',reader:rateReader,ip:rateIP,body:{liked:false}})).status,200);
const limited=await call({method:'PUT',reader:cookie(),ip:rateIP,body:{liked:true}});
assert.equal(limited.status,429);assert.ok(Number(limited.headers.get('retry-after'))>0);
assert.equal((await (await call()).json()).count,initial.count);
console.log('PASS: shared count, cookie persistence, reader isolation, concurrent deduplication, idempotent cancellation, article isolation, CSRF, body validation, private responses, network rate limiting, test cleanup');
