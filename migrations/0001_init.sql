-- 建筑表
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT,
  dynasty TEXT,
  dynasty_year INTEGER,
  building_type TEXT,
  region_id TEXT,
  region_name TEXT,
  province TEXT,
  lat REAL,
  lng REAL,
  summary TEXT,
  content TEXT,
  detailed_history TEXT,
  construction_details TEXT,
  artifacts TEXT,
  cultural_significance TEXT,
  visiting_info TEXT,
  thumbnail TEXT,
  images TEXT, -- JSON array
  status TEXT DEFAULT 'published',
  view_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- 密码知识表
CREATE TABLE IF NOT EXISTS cipher_knowledge (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  summary TEXT,
  content TEXT,
  tags TEXT, -- JSON array
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- 解码器挑战表
CREATE TABLE IF NOT EXISTS decoder_challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  category TEXT,
  hint TEXT,
  solution TEXT,
  building_id TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_buildings_dynasty ON buildings(dynasty);
CREATE INDEX IF NOT EXISTS idx_buildings_type ON buildings(building_type);
CREATE INDEX IF NOT EXISTS idx_buildings_province ON buildings(province);
CREATE INDEX IF NOT EXISTS idx_cipher_category ON cipher_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_decoder_difficulty ON decoder_challenges(difficulty);
