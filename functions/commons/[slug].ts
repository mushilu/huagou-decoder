import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  DB: D1Database
}

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const stripParens = (value: string) => value.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim()

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const normalize = (value: string) => stripHtml(value).toLowerCase().replace(/\s+/g, '')

const isImageFile = (title: string) => /\.(jpg|jpeg|png|webp)$/i.test(title)

const buildUserAgent = () => 'huagou-decoder/1.0'

const fetchJson = async (url: string) => {
  const res = await fetch(url, {
    headers: { 'User-Agent': buildUserAgent() },
  })
  if (!res.ok) {
    throw new Error(`Commons API ${res.status}`)
  }
  return res.json() as Promise<Record<string, unknown>>
}

const scoreMatch = (title: string, snippet: string, query: string, queryAlt: string) => {
  const titleNorm = normalize(title)
  const snippetNorm = normalize(snippet)
  const queryNorm = normalize(query)
  const altNorm = normalize(queryAlt)

  let score = 0
  if (queryNorm && titleNorm.includes(queryNorm)) score += 3
  if (queryNorm && snippetNorm.includes(queryNorm)) score += 2
  if (altNorm && titleNorm.includes(altNorm)) score += 2
  if (altNorm && snippetNorm.includes(altNorm)) score += 1
  return score
}

const resolveCommonsImage = async (query: string) => {
  const queryAlt = stripParens(query)
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5`
  const searchData = await fetchJson(searchUrl)
  const results = (searchData.query as { search?: Array<{ title: string; snippet: string }> })?.search || []

  let best: { title: string; snippet: string } | null = null
  let bestScore = 0

  for (const item of results) {
    if (!isImageFile(item.title)) continue
    const score = scoreMatch(item.title, item.snippet, query, queryAlt)
    if (score > bestScore) {
      best = item
      bestScore = score
    }
  }

  if (!best || bestScore < 2) return null

  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&titles=${encodeURIComponent(best.title)}`
  const infoData = await fetchJson(infoUrl)
  const pages = (infoData.query as { pages?: Record<string, { title: string; imageinfo?: Array<Record<string, unknown>> }> })?.pages || {}
  const page = Object.values(pages)[0]
  const info = page?.imageinfo?.[0] as {
    url?: string
    thumburl?: string
    descriptionurl?: string
    extmetadata?: Record<string, { value?: string }>
  } | undefined

  if (!info?.thumburl && !info?.url) return null

  const ext = info.extmetadata || {}
  const license = stripHtml(ext.LicenseShortName?.value || ext.UsageTerms?.value || '')
  const licenseUrl = ext.LicenseUrl?.value || ''
  const author = stripHtml(ext.Artist?.value || ext.Credit?.value || '')

  return {
    fileTitle: page?.title || best.title,
    thumbUrl: info.thumburl || info.url || '',
    imageUrl: info.url || info.thumburl || '',
    sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(best.title)}`,
    license,
    licenseUrl,
    author,
  }
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const slug = getParam(ctx.params.slug)
  if (!slug) {
    return new Response('Not found', { status: 404 })
  }

  const url = new URL(ctx.request.url)
  const query = url.searchParams.get('q')?.trim()

  const cached = await ctx.env.DB.prepare(
    'SELECT thumb_url, image_url, source_url, license, license_url, author FROM commons_image_cache WHERE slug = ?'
  )
    .bind(slug)
    .first<{
      thumb_url: string
      image_url: string
      source_url: string
      license: string
      license_url: string
      author: string
    }>()

  if (!cached && !query) {
    return new Response('Not found', { status: 404 })
  }

  let resolved = cached
  if (!resolved && query) {
    const result = await resolveCommonsImage(query)
    if (!result) {
      return new Response('Not found', { status: 404 })
    }

    await ctx.env.DB.prepare(
      `INSERT INTO commons_image_cache
        (slug, query, file_title, thumb_url, image_url, source_url, license, license_url, author, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          query = excluded.query,
          file_title = excluded.file_title,
          thumb_url = excluded.thumb_url,
          image_url = excluded.image_url,
          source_url = excluded.source_url,
          license = excluded.license,
          license_url = excluded.license_url,
          author = excluded.author,
          updated_at = excluded.updated_at
      `
    )
      .bind(
        slug,
        query,
        result.fileTitle,
        result.thumbUrl,
        result.imageUrl,
        result.sourceUrl,
        result.license,
        result.licenseUrl,
        result.author,
        new Date().toISOString()
      )
      .run()

    resolved = {
      thumb_url: result.thumbUrl,
      image_url: result.imageUrl,
      source_url: result.sourceUrl,
      license: result.license,
      license_url: result.licenseUrl,
      author: result.author,
    }
  }

  const imageUrl = resolved?.thumb_url || resolved?.image_url
  if (!imageUrl) {
    return new Response('Not found', { status: 404 })
  }

  const imageResponse = await fetch(imageUrl, { headers: { 'User-Agent': buildUserAgent() } })
  if (!imageResponse.ok) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers(imageResponse.headers)
  headers.set('Cache-Control', 'public, max-age=2592000, immutable')

  return new Response(imageResponse.body, { headers })
}
