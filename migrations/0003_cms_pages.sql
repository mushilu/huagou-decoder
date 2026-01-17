-- CMS 页面内容
CREATE TABLE IF NOT EXISTS cms_pages (
  slug TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at INTEGER DEFAULT (unixepoch())
);
