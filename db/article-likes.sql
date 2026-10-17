-- Additive schema; never resets existing likes. Private salt stays in D1.
CREATE TABLE IF NOT EXISTS engagement_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT OR IGNORE INTO engagement_settings VALUES ('hash_salt', lower(hex(randomblob(32))));
CREATE TABLE IF NOT EXISTS article_likes (
  article TEXT NOT NULL,
  reader_hash TEXT NOT NULL,
  PRIMARY KEY (article, reader_hash)
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS like_rate_limits (
  bucket TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS like_rate_expiry ON like_rate_limits(expires_at);
