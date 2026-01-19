import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  DB: D1Database
}

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const stripParens = (value: string) => value.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim()
const stripSuffix = (value: string) =>
  value.replace(/(遗址|故居|旧址|古城|城墙|城|府|宫|桥|馆|园|坊|寨|堡|楼|院|关|门|街|巷)$/g, '').trim()

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const normalize = (value: string) => stripHtml(value).toLowerCase().replace(/\s+/g, '')

const isImageFile = (title: string) => /\.(jpg|jpeg|png|webp|tif|tiff)$/i.test(title)

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

const safeFetchJson = async (url: string) => {
  try {
    return await fetchJson(url)
  } catch {
    return null
  }
}

const uniq = (items: Array<string | null | undefined>) => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of items) {
    if (!item) continue
    if (seen.has(item)) continue
    seen.add(item)
    result.push(item)
  }
  return result
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

const resolveCommonsFromCategory = async (category: string) => {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmtype=file&cmlimit=5`
  const data = await safeFetchJson(api)
  const members = (data?.query as { categorymembers?: Array<{ title: string }> })?.categorymembers || []
  const candidate = members.find((item) => isImageFile(item.title))
  return candidate?.title || null
}

const isAllowedLicense = (value: string) => {
  const normalized = value.toLowerCase()
  if (!normalized) return false
  if (normalized.includes('cc by')) return true
  if (normalized.includes('cc0')) return true
  if (normalized.includes('public domain')) return true
  if (normalized.includes('pd')) return true
  return false
}

const resolveFromWikipedia = async (query: string, language: string) => {
  const base = `https://${language}.wikipedia.org/w/api.php`
  const searchUrl = `${base}?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5`
  const searchData = await safeFetchJson(searchUrl)
  const results = (searchData?.query as { search?: Array<{ title: string; snippet: string }> })?.search || []

  let best: { title: string; snippet: string } | null = null
  let bestScore = 0

  for (const item of results) {
    const score = scoreMatch(item.title, item.snippet, query, stripSuffix(stripParens(query)))
    if (score > bestScore) {
      best = item
      bestScore = score
    }
  }

  if (!best || bestScore < 2) return null

  const pageUrl = `${base}?action=query&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(best.title)}`
  const pageData = await safeFetchJson(pageUrl)
  const pages = (pageData?.query as { pages?: Record<string, { pageimage?: string }> })?.pages || {}
  const page = Object.values(pages)[0]
  const pageImage = page?.pageimage
  if (!pageImage) return null

  const fileTitle = pageImage.startsWith('File:') ? pageImage : `File:${pageImage}`
  const fileUrl = `${base}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&titles=${encodeURIComponent(fileTitle)}`
  const fileData = await safeFetchJson(fileUrl)
  const filePages = (fileData?.query as { pages?: Record<string, { title: string; imageinfo?: Array<Record<string, unknown>> }> })?.pages || {}
  const filePage = Object.values(filePages)[0]
  const info = filePage?.imageinfo?.[0] as {
    url?: string
    thumburl?: string
    descriptionurl?: string
    extmetadata?: Record<string, { value?: string }>
  } | undefined

  if (!info?.thumburl && !info?.url) return null

  const ext = info.extmetadata || {}
  const license = stripHtml(ext.LicenseShortName?.value || ext.UsageTerms?.value || '')
  if (!isAllowedLicense(license)) return null

  const licenseUrl = ext.LicenseUrl?.value || ''
  const author = stripHtml(ext.Artist?.value || ext.Credit?.value || '')

  return {
    fileTitle: filePage?.title || fileTitle,
    thumbUrl: info.thumburl || info.url || '',
    imageUrl: info.url || info.thumburl || '',
    sourceUrl: info.descriptionurl || `https://${language}.wikipedia.org/wiki/${encodeURIComponent(best.title)}`,
    license,
    licenseUrl,
    author,
  }
}

type WikidataClaims = Record<string, Array<{ mainsnak?: { datavalue?: { value?: string } } }>>
type WikidataEntity = { claims?: WikidataClaims }

const resolveFromWikidata = async (query: string, language: string) => {
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&search=${encodeURIComponent(query)}&language=${language}&limit=5`
  const searchData = await safeFetchJson(searchUrl)
  const results = (searchData?.search as Array<{ id: string }> | undefined) || []

  for (const result of results) {
    const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${encodeURIComponent(result.id)}`
    const entityData = await safeFetchJson(entityUrl)
    const entities = (entityData?.entities as Record<string, WikidataEntity>) || {}
    const entity = entities[result.id]
    if (!entity?.claims) continue

    const imageClaim = entity.claims.P18?.[0]?.mainsnak?.datavalue?.value
    if (imageClaim && typeof imageClaim === 'string') {
      return `File:${imageClaim}`
    }

    const categoryClaim = entity.claims.P373?.[0]?.mainsnak?.datavalue?.value
    if (categoryClaim && typeof categoryClaim === 'string') {
      const fileTitle = await resolveCommonsFromCategory(categoryClaim)
      if (fileTitle) return fileTitle
    }
  }

  return null
}

const fetchCommonsImageByTitle = async (title: string) => {
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&titles=${encodeURIComponent(title)}`
  const infoData = await safeFetchJson(infoUrl)
  const pages = (infoData?.query as { pages?: Record<string, { title: string; imageinfo?: Array<Record<string, unknown>> }> })?.pages || {}
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
    fileTitle: page?.title || title,
    thumbUrl: info.thumburl || info.url || '',
    imageUrl: info.url || info.thumburl || '',
    sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
    license,
    licenseUrl,
    author,
  }
}

const resolveCommonsImage = async (query: string) => {
  const queryAlt = stripParens(query)
  const queryCore = stripSuffix(queryAlt)
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5`
  const searchData = await safeFetchJson(searchUrl)
  const results = (searchData?.query as { search?: Array<{ title: string; snippet: string }> })?.search || []

  let best: { title: string; snippet: string } | null = null
  let bestScore = 0

  for (const item of results) {
    if (!isImageFile(item.title)) continue
    const score = scoreMatch(item.title, item.snippet, query, queryCore)
    if (score > bestScore) {
      best = item
      bestScore = score
    }
  }

  if (!best || bestScore < 2) return null
  return fetchCommonsImageByTitle(best.title)
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const slug = getParam(ctx.params.slug)
  if (!slug) {
    return new Response('Not found', { status: 404 })
  }

  const url = new URL(ctx.request.url)
  const query = url.searchParams.get('q')?.trim()
  const region = url.searchParams.get('r')?.trim()
  const province = url.searchParams.get('p')?.trim()
  const english = url.searchParams.get('e')?.trim()

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
    const baseQuery = stripParens(query)
    const coreQuery = stripSuffix(baseQuery)
    const queries = uniq([
      query,
      baseQuery,
      coreQuery,
      query && region ? `${query} ${region}` : null,
      query && province ? `${query} ${province}` : null,
      coreQuery && region ? `${coreQuery} ${region}` : null,
      coreQuery && province ? `${coreQuery} ${province}` : null,
      query && region && province ? `${query} ${region} ${province}` : null,
      english,
      english && region ? `${english} ${region}` : null,
      english && province ? `${english} ${province}` : null,
    ])

    let result = null
    for (const item of queries) {
      const wikidataFile = await resolveFromWikidata(item, /[a-zA-Z]/.test(item) ? 'en' : 'zh')
      if (wikidataFile) {
        result = await fetchCommonsImageByTitle(wikidataFile)
      } else {
        result = await resolveCommonsImage(item)
      }
      if (result) break
    }

    if (!result) {
      for (const item of queries) {
        const wikiResult = await resolveFromWikipedia(item, /[a-zA-Z]/.test(item) ? 'en' : 'zh')
        if (wikiResult) {
          result = wikiResult
          break
        }
      }
    }

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
