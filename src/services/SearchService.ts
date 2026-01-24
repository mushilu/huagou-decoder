import Fuse from 'fuse.js'

export interface SearchableItem {
  id: string
  type: 'building' | 'knowledge' | 'province'
  title: string
  description?: string
  url: string
  tags?: string[]
}

export interface SearchResult extends SearchableItem {
  matchScore: number
}

class SearchIndex {
  private fuse: Fuse<SearchableItem> | null = null
  private items: SearchableItem[] = []
  private pendingItems: SearchableItem[] = []
  private rebuildTimer: ReturnType<typeof setTimeout> | null = null
  private readonly REBUILD_DELAY = 300 // 延迟重建

  constructor(items: SearchableItem[] = []) {
    this.items = items
    this.buildIndex()
  }

  private buildIndex() {
    // 合并待处理的项目
    if (this.pendingItems.length > 0) {
      this.items.push(...this.pendingItems)
      this.pendingItems = []
    }

    this.fuse = new Fuse(this.items, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      distance: 100,
    })
  }

  private scheduleRebuild() {
    // 清除之前的定时器
    if (this.rebuildTimer) {
      clearTimeout(this.rebuildTimer)
    }

    // 延迟重建，允许批量添加
    this.rebuildTimer = setTimeout(() => {
      this.buildIndex()
      this.rebuildTimer = null
    }, this.REBUILD_DELAY)
  }

  add(item: SearchableItem) {
    this.pendingItems.push(item)
    this.scheduleRebuild()
  }

  addMultiple(items: SearchableItem[]) {
    this.pendingItems.push(...items)
    this.scheduleRebuild()
  }

  search(query: string, limit: number = 10): SearchResult[] {
    // 确保待处理的项目被合并
    if (this.pendingItems.length > 0) {
      this.buildIndex()
    }

    if (!this.fuse || !query.trim()) {
      return []
    }

    const results = this.fuse.search(query)
    return results.slice(0, limit).map((result) => ({
      ...result.item,
      matchScore: 1 - (result.score || 0),
    }))
  }

  clear() {
    this.items = []
    this.pendingItems = []
    this.fuse = null
    if (this.rebuildTimer) {
      clearTimeout(this.rebuildTimer)
      this.rebuildTimer = null
    }
  }

  getAll(): SearchableItem[] {
    return [...this.items, ...this.pendingItems]
  }
}

// 全局搜索索引实例
let globalSearchIndex: SearchIndex | null = null

export function getSearchIndex(): SearchIndex {
  if (!globalSearchIndex) {
    globalSearchIndex = new SearchIndex()
  }
  return globalSearchIndex
}

export function initializeSearchIndex(items: SearchableItem[]): SearchIndex {
  globalSearchIndex = new SearchIndex(items)
  return globalSearchIndex
}
