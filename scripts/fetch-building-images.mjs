import fs from 'fs/promises'

const DATA_PATH = new URL('../content_tab/buildings/complete_buildings_data.ts', import.meta.url)
const OUT_PATH = new URL('../content_tab/buildings/building_images.ts', import.meta.url)
const OUTPUT_JSON = new URL('../content_tab/buildings/building_images.json', import.meta.url)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const uniq = (items) => Array.from(new Set(items.filter(Boolean)))

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'huagou-decoder/1.0 (image fetcher)'
    },
    redirect: 'follow'
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`)
  }
  const html = await res.text()
  return { html, finalUrl: res.url }
}

function normalizeImageUrl(url) {
  if (!url) return null
  const [base] = url.split('?')
  return base || url
}

async function fetchBaikeImageDirect(name) {
  const searchUrl = `https://baike.baidu.com/search/word?word=${encodeURIComponent(name)}`
  const { html, finalUrl } = await fetchText(searchUrl)
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  const nameMatch = html.match(/<meta[^>]+name=["']image["'][^>]+content=["']([^"']+)["']/i)
  const ogImage = ogMatch ? ogMatch[1] : null
  const nameImage = nameMatch ? nameMatch[1] : null
  const chosen = ogImage || nameImage
  if (!chosen) return null
  const original = normalizeImageUrl(chosen)
  return {
    thumbnail: chosen,
    original,
    source: finalUrl,
  }
}

async function fetchBaikeImage(name) {
  const candidates = uniq([
    name,
    name.replace(/（.*?）/g, ''),
    name.replace(/\(.*?\)/g, ''),
  ])

  for (const candidate of candidates) {
    const result = await fetchBaikeImageDirect(candidate)
    if (result) return result
    await sleep(80)
  }

  return null
}

function loadBuildings(code) {
  const wrapped = code.replace('export const fullBuildingsData =', 'globalThis.fullBuildingsData =')
  eval(wrapped)
  return globalThis.fullBuildingsData || []
}

function formatMapping(mapping) {
  const entries = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, info]) => {
      const lines = [
        `  ${JSON.stringify(slug)}: {`,
        `    thumbnail: ${JSON.stringify(info.thumbnail)},`,
        `    images: ${JSON.stringify(info.images)},`,
      ]
      if (info.source) {
        lines.push(`    source: ${JSON.stringify(info.source)},`)
      }
      lines.push('  }')
      return lines.join('\n')
    })

  return `export const buildingImages = {\n${entries.join(',\n')}\n} as const\n`
}

const code = await fs.readFile(DATA_PATH, 'utf8')
const buildings = loadBuildings(code)

const mapping = {}
const missing = []
const used = new Map()

for (const building of buildings) {
  try {
    const result = await fetchBaikeImage(building.nameZh)
    if (!result?.thumbnail) {
      missing.push({ slug: building.slug, name: building.nameZh })
      continue
    }

    const images = uniq([result.original, result.thumbnail])

    if (used.has(result.thumbnail)) {
      used.get(result.thumbnail).push(building.slug)
    } else {
      used.set(result.thumbnail, [building.slug])
    }

    mapping[building.slug] = {
      thumbnail: result.thumbnail,
      images: images.length > 0 ? images : [result.thumbnail],
      source: result.source,
    }
  } catch (error) {
    missing.push({ slug: building.slug, name: building.nameZh, error: String(error) })
  }

  await sleep(150)
}

await fs.writeFile(OUT_PATH, formatMapping(mapping), 'utf8')
await fs.writeFile(OUTPUT_JSON, JSON.stringify({ missing, duplicates: Array.from(used).filter(([, slugs]) => slugs.length > 1) }, null, 2), 'utf8')

console.log(`total=${buildings.length} mapped=${Object.keys(mapping).length} missing=${missing.length}`)
if (missing.length > 0) {
  console.log('missing list written to building_images.json')
}
