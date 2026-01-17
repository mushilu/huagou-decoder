import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, encodeKey, errorResponse, jsonResponse, normalizePathSegment } from './_shared'

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

// POST /api/upload
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const formData = await ctx.request.formData()
  const file = formData.get('file')
  const folderValue = formData.get('folder')
  const rawFolder = typeof folderValue === 'string' ? folderValue : 'uploads'
  const folder = normalizePathSegment(rawFolder)

  if (!(file instanceof File)) {
    return errorResponse(400, '未找到上传文件')
  }

  if (!file.type.startsWith('image/')) {
    return errorResponse(415, '仅支持图片文件')
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return errorResponse(413, '文件过大（最大 4MB）')
  }

  const ext = file.name.split('.').pop()?.toLowerCase()
  const suffix = ext ? `.${ext}` : ''
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}${suffix}`

  const mimeType = file.type || 'application/octet-stream'
  const bytes = new Uint8Array(await file.arrayBuffer())

  try {
    await ctx.env.DB.prepare(
      'INSERT INTO cms_assets (key, mime_type, size, data) VALUES (?, ?, ?, ?)'
    )
      .bind(key, mimeType, file.size, bytes)
      .run()
  } catch {
    return errorResponse(500, '上传失败，请稍后重试')
  }

  const encodedKey = encodeKey(key)

  return jsonResponse({
    ok: true,
    url: `/images/${encodedKey}`,
    key,
    encodedKey,
  })
}
