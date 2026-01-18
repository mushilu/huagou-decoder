import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SEARCH_URL = 'http://www.ncha.gov.cn/module/search/index.jsp'
const COLUMN_ID = 2274
const SOURCE = {
  title: '国家文物局全国重点文物保护单位名录（不可移动文物信息查询）',
  url: 'http://www.ncha.gov.cn/col/col2266/index.html',
}

const provinceMatchers = [
  { province: '北京', matches: ['北京市', '北京'] },
  { province: '天津', matches: ['天津市', '天津'] },
  { province: '上海', matches: ['上海市', '上海'] },
  { province: '重庆', matches: ['重庆市', '重庆'] },
  { province: '河北', matches: ['河北省', '河北'] },
  { province: '山西', matches: ['山西省', '山西'] },
  { province: '辽宁', matches: ['辽宁省', '辽宁'] },
  { province: '吉林', matches: ['吉林省', '吉林'] },
  { province: '黑龙江', matches: ['黑龙江省', '黑龙江'] },
  { province: '江苏', matches: ['江苏省', '江苏'] },
  { province: '浙江', matches: ['浙江省', '浙江'] },
  { province: '安徽', matches: ['安徽省', '安徽'] },
  { province: '福建', matches: ['福建省', '福建'] },
  { province: '江西', matches: ['江西省', '江西'] },
  { province: '山东', matches: ['山东省', '山东'] },
  { province: '河南', matches: ['河南省', '河南'] },
  { province: '湖北', matches: ['湖北省', '湖北'] },
  { province: '湖南', matches: ['湖南省', '湖南'] },
  { province: '广东', matches: ['广东省', '广东'] },
  { province: '海南', matches: ['海南省', '海南'] },
  { province: '四川', matches: ['四川省', '四川'] },
  { province: '贵州', matches: ['贵州省', '贵州'] },
  { province: '云南', matches: ['云南省', '云南'] },
  { province: '陕西', matches: ['陕西省', '陕西'] },
  { province: '甘肃', matches: ['甘肃省', '甘肃'] },
  { province: '青海', matches: ['青海省', '青海'] },
  { province: '内蒙古', matches: ['内蒙古自治区', '内蒙古'] },
  { province: '广西', matches: ['广西壮族自治区', '广西'] },
  { province: '西藏', matches: ['西藏自治区', '西藏'] },
  { province: '宁夏', matches: ['宁夏回族自治区', '宁夏'] },
  { province: '新疆', matches: ['新疆维吾尔自治区', '新疆', '新疆生产建设兵团'] },
  { province: '香港', matches: ['香港特别行政区', '香港'] },
  { province: '澳门', matches: ['澳门特别行政区', '澳门'] },
  { province: '台湾', matches: ['台湾省', '台湾'] },
]

const BATCH_LABELS = new Map([
  ['第一批', 1],
  ['第二批', 2],
  ['第三批', 3],
  ['第四批', 4],
  ['第五批', 5],
  ['第六批', 6],
  ['第七批', 7],
  ['第八批', 8],
])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeProvince = (location) => {
  for (const item of provinceMatchers) {
    if (item.matches.some((keyword) => location.includes(keyword))) {
      return item.province
    }
  }
  return '未知'
}

const normalizeText = (value) => {
  if (!value) return ''
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const applyTextFixes = (value) => {
  return value
    .replace(/\?衣堂/g, '䌽衣堂')
    .replace(/马可\?波罗广场建筑群/g, '马可•波罗广场建筑群')
}

const parseBatchLabel = (label) => {
  if (!label) return null
  if (BATCH_LABELS.has(label)) {
    return BATCH_LABELS.get(label)
  }
  const match = label.match(/第([一二三四五六七八九十]+)批/)
  if (!match) return null
  return BATCH_LABELS.get(`第${match[1]}批`) ?? null
}

const parsePagerInfo = (html) => {
  const totalMatch = html.match(/共\s*(\d+)\s*条记录/)
  const pageMatch = html.match(/共\s*(\d+)\s*页/)
  return {
    total: totalMatch ? Number(totalMatch[1]) : null,
    pageCount: pageMatch ? Number(pageMatch[1]) : null,
  }
}

const parseTableRows = (html, page) => {
  const tableMatch = html.match(/<table[^>]*class="table_bd"[\s\S]*?<\/table>/i)
  if (!tableMatch) return []
  const rows = tableMatch[0].match(/<tr[\s\S]*?<\/tr>/gi) ?? []
  const items = []

  for (const row of rows) {
    const cells = Array.from(row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)).map((match) =>
      applyTextFixes(normalizeText(match[1])),
    )

    if (cells.length < 6) continue
    if (cells[0] === '编号') continue

    const serial = Number(cells[0])
    if (!Number.isFinite(serial)) continue

    const name = cells[1] ?? ''
    const categoryCode = cells[2] ?? ''
    const category = cells[3] ?? ''
    const batchLabel = cells[4] ?? ''
    const location = cells[5] ?? ''
    const batch = parseBatchLabel(batchLabel)

    if (!name || !batch) continue

    const safeCategory = category || '未标注'

    items.push({
      id: `ncha-${page}-${serial}`,
      serial,
      name,
      category: safeCategory,
      categoryCode,
      batch,
      batchLabel,
      location,
      province: normalizeProvince(location),
      sourceUrl: SOURCE.url,
    })
  }

  return items
}

const fetchPage = async (page) => {
  const params = new URLSearchParams({
    i_columnid: String(COLUMN_ID),
    field: 'field_1430:1,field_1431:1',
    field_1430: '',
    field_1431: '',
    currentplace: '',
    splitflag: '',
    fullpath: '0',
  })
  if (page && page > 1) {
    params.set('currpage', String(page))
  }

  const response = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`)
  }

  return response.text()
}

const main = async () => {
  console.log('🔍 拉取国家文物局全国重点文物保护单位名录...')

  const firstHtml = await fetchPage(1)
  const pager = parsePagerInfo(firstHtml)
  if (!pager.pageCount) {
    throw new Error('无法解析分页信息，请检查数据源页面是否变更。')
  }

  const items = [...parseTableRows(firstHtml, 1)]
  console.log(`已解析第 1 页，累计 ${items.length} 条，预计 ${pager.pageCount} 页。`)

  for (let page = 2; page <= pager.pageCount; page += 1) {
    const html = await fetchPage(page)
    items.push(...parseTableRows(html, page))

    if (page % 20 === 0 || page === pager.pageCount) {
      console.log(`已解析到第 ${page} 页，累计 ${items.length} 条...`)
    }
    await sleep(120)
  }

  const uniqueMap = new Map()
  for (const item of items) {
    uniqueMap.set(item.id, item)
  }
  const uniqueItems = Array.from(uniqueMap.values())

  const batchSet = new Set(uniqueItems.map((item) => item.batch))
  const batches = Array.from(batchSet).sort((a, b) => a - b)

  const dataset = {
    generatedAt: new Date().toISOString(),
    items: uniqueItems,
    sources: [
      {
        title: SOURCE.title,
        url: SOURCE.url,
        total: uniqueItems.length,
        note: '通过国家文物局公共信息服务栏目查询得到的全国重点文物保护单位名录。',
      },
    ],
    coverage: {
      batches,
      missingBatches: [],
      note: '批次、类别与地域信息以国家文物局公开名录为准。',
    },
    metadata: {
      totalRecords: pager.total ?? uniqueItems.length,
      pageCount: pager.pageCount,
      columnId: COLUMN_ID,
    },
  }

  const outputPath = path.join(ROOT, 'src', 'features', 'dataviz', 'data', 'nationalKeyUnits.json')
  await fs.writeFile(outputPath, JSON.stringify(dataset, null, 2), 'utf-8')

  console.log(`✅ 已生成数据: ${outputPath}`)
  console.log(`总计 ${uniqueItems.length} 条，批次覆盖: ${batches.join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
