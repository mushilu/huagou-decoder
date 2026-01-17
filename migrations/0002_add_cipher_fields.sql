-- 追加知识库扩展字段
ALTER TABLE cipher_knowledge ADD COLUMN image_url TEXT;
ALTER TABLE cipher_knowledge ADD COLUMN related_buildings TEXT;

-- 补充索引
CREATE INDEX IF NOT EXISTS idx_cipher_difficulty ON cipher_knowledge(difficulty);
CREATE INDEX IF NOT EXISTS idx_decoder_category ON decoder_challenges(category);
CREATE INDEX IF NOT EXISTS idx_decoder_building ON decoder_challenges(building_id);
