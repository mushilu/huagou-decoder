-- CMS 图片资源
CREATE TABLE IF NOT EXISTS cms_assets (
  key TEXT PRIMARY KEY,
  mime_type TEXT NOT NULL,
  size INTEGER,
  data BLOB NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_cms_assets_created_at ON cms_assets(created_at);
