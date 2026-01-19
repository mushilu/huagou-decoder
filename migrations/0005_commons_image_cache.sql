-- Wikimedia Commons 图片缓存
CREATE TABLE IF NOT EXISTS commons_image_cache (
  slug TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  file_title TEXT,
  thumb_url TEXT,
  image_url TEXT,
  source_url TEXT,
  license TEXT,
  license_url TEXT,
  author TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commons_image_cache_updated_at
  ON commons_image_cache (updated_at);
