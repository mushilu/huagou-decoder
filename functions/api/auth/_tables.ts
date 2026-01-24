export async function ensureAuthTables(db: any) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      github_id TEXT UNIQUE,
      nickname TEXT,
      avatar TEXT,
      created_at INTEGER NOT NULL,
      last_login INTEGER
    )`
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS verification_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0
    )`
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  ).run()

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      source TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )`
  ).run()

  await db.prepare('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)').run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_users_github ON users(github_id)').run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_codes_email ON verification_codes(email)').run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)').run()
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)').run()
}
