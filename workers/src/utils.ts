export function genId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

export function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function now(): number {
  return Math.floor(Date.now() / 1000)
}
