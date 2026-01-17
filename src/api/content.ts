import type { Building } from '@/types/building'

const API_BASE = '/api'

// 建筑 API
export const buildingsApi = {
  async list(): Promise<Building[]> {
    const res = await fetch(`${API_BASE}/buildings`)
    if (!res.ok) throw new Error('Failed to fetch buildings')
    return res.json()
  },

  async get(id: string): Promise<Building> {
    const res = await fetch(`${API_BASE}/buildings/${id}`)
    if (!res.ok) throw new Error('Building not found')
    return res.json()
  },

  async create(data: Partial<Building>): Promise<void> {
    const res = await fetch(`${API_BASE}/buildings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create building')
  },

  async update(id: string, data: Partial<Building>): Promise<void> {
    const res = await fetch(`${API_BASE}/buildings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update building')
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/buildings/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete building')
  }
}

// CMS 页面内容
export const pagesApi = {
  async get<T = Record<string, unknown>>(slug: string): Promise<T> {
    const res = await fetch(`${API_BASE}/pages/${slug}`)
    if (!res.ok) throw new Error('Failed to fetch page content')
    const data = (await res.json()) as { content?: T }
    if (!data?.content) throw new Error('Invalid page content')
    return data.content
  },

  async update<T = Record<string, unknown>>(slug: string, content: T): Promise<void> {
    const res = await fetch(`${API_BASE}/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error('Failed to update page content')
  },
}

// 图片上传
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  return url
}
