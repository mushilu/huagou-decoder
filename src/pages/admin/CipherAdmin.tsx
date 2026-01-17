import { useEffect, useState, type ChangeEvent } from 'react'
import { BookOpen, Pencil, ImagePlus, Trash2, Plus } from 'lucide-react'
import { uploadImage } from '@/api/content'
import { PaperCard, PaperCardContent, PaperCardFooter, PaperCardHeader } from '@/components/ink/PaperCard'

interface CipherAdminItem {
  id: string
  title: string
  category: string
  difficulty: string
  summary: string
  content: string
  tags: string[]
  relatedBuildings: string[]
  imageUrl?: string
}

const categoryOptions = [
  { value: 'fengshui', label: '风水布局' },
  { value: 'symbol', label: '装饰符号' },
  { value: 'color', label: '色彩语言' },
  { value: 'space', label: '空间哲学' },
]

const createEmptyItem = (): CipherAdminItem => ({
  id: '',
  title: '',
  category: 'fengshui',
  difficulty: '',
  summary: '',
  content: '',
  tags: [],
  relatedBuildings: [],
  imageUrl: '',
})

const listToString = (value: string[]) => value.join('，')

const stringToList = (value: string) =>
  value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)

export function CipherAdmin() {
  const [items, setItems] = useState<CipherAdminItem[]>([])
  const [editing, setEditing] = useState<CipherAdminItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/cipher')
      if (!res.ok) throw new Error('加载失败')
      const data = await res.json()
      const rows = Array.isArray(data) ? data : data.items ?? []
      const normalized = rows.map((row: Record<string, unknown>) => ({
        id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
        title: typeof row.title === 'string' ? row.title : '',
        category: typeof row.category === 'string' ? row.category : 'fengshui',
        difficulty: typeof row.difficulty === 'string' ? row.difficulty : '',
        summary: typeof row.summary === 'string'
          ? row.summary
          : typeof row.description === 'string'
            ? row.description
            : '',
        content: typeof row.content === 'string' ? row.content : '',
        tags: Array.isArray(row.tags)
          ? (row.tags.filter((item) => typeof item === 'string') as string[])
          : [],
        relatedBuildings: Array.isArray(row.relatedBuildings)
          ? (row.relatedBuildings.filter((item) => typeof item === 'string') as string[])
          : [],
        imageUrl: typeof row.imageUrl === 'string' ? row.imageUrl : '',
      }))
      setItems(normalized)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editing) return
    const payload = {
      title: editing.title,
      category: editing.category,
      difficulty: editing.difficulty,
      summary: editing.summary,
      content: editing.content,
      tags: editing.tags,
      relatedBuildings: editing.relatedBuildings,
      imageUrl: editing.imageUrl,
    }
    try {
      if (isCreating || !editing.id) {
        await fetch('/api/cipher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`/api/cipher/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      }
      await loadItems()
      setEditing(null)
      setIsCreating(false)
    } catch {
      alert('保存失败，请检查后端服务或登录状态。')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确认删除该知识条目？')) return
    try {
      await fetch(`/api/cipher/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      await loadItems()
      setEditing(null)
      setIsCreating(false)
    } catch {
      alert('删除失败')
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    try {
      const folder = editing.id ? `cipher/${editing.id}` : 'cipher/new'
      const url = await uploadImage(file, folder)
      setEditing({ ...editing, imageUrl: url })
    } catch {
      alert('上传失败')
    }
  }

  if (loading) {
    return <div className="text-sm text-ink-gray">正在加载文化密码数据...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            文化密码
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">密码知识管理</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            维护知识条目、标签与引用建筑，让文化解读与建筑展示保持一致。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditing(createEmptyItem())
              setIsCreating(true)
            }}
            className="inline-flex items-center gap-2 rounded-full border border-ink-gray/20 bg-ink-black px-4 py-2 text-xs font-semibold text-paper-white shadow-ink transition hover:shadow-ink-lg"
          >
            <Plus className="h-4 w-4" />
            新增条目
          </button>
          <button
            onClick={loadItems}
            className="rounded-full border border-ink-gray/20 px-4 py-2 text-xs font-semibold text-ink-black transition hover:border-ink-black/40"
          >
            刷新列表
          </button>
        </div>
      </div>

      {editing ? (
        <PaperCard variant="layered" hoverEffect={false} className="overflow-visible">
          <PaperCardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-black/10 text-ink-black">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-black">
                  {editing.title || '新建条目'}
                </h3>
                <p className="text-xs text-ink-gray/70">填写知识摘要、正文与标签。</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setIsCreating(false)
              }}
              className="rounded-full border border-ink-gray/20 px-4 py-2 text-xs font-semibold text-ink-black transition hover:border-ink-black/40"
            >
              取消编辑
            </button>
          </PaperCardHeader>

          <PaperCardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="标题" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              <div>
                <label className="block text-sm font-semibold text-ink-black mb-2">类别</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="难度"
                value={editing.difficulty}
                onChange={(v) => setEditing({ ...editing, difficulty: v })}
              />
              <Field
                label="标签"
                value={listToString(editing.tags)}
                onChange={(v) => setEditing({ ...editing, tags: stringToList(v) })}
              />
              <Field
                label="关联建筑"
                value={listToString(editing.relatedBuildings)}
                onChange={(v) => setEditing({ ...editing, relatedBuildings: stringToList(v) })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">摘要</label>
              <textarea
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">正文内容</label>
              <textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">配图</label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-gray/20 bg-paper-white/80">
                  {editing.imageUrl ? (
                    <img src={editing.imageUrl} className="h-24 w-24 rounded-2xl object-cover" alt="知识配图" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ink-gray/60" />
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                  <input
                    value={editing.imageUrl || ''}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                    placeholder="或直接填写图片地址"
                  />
                </div>
              </div>
            </div>
          </PaperCardContent>

          <PaperCardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-xs text-ink-gray/70">保存后将同步前台文化密码展示。</span>
            <div className="flex items-center gap-3">
              {!isCreating && editing.id && (
                <button
                  onClick={() => handleDelete(editing.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  删除条目
                </button>
              )}
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-ink-black px-6 py-2.5 text-sm font-semibold text-paper-white shadow-ink transition hover:shadow-ink-lg"
              >
                <Pencil className="h-4 w-4" />
                保存更新
              </button>
            </div>
          </PaperCardFooter>
        </PaperCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-gray/15 bg-paper-white/90 shadow-ink-lg">
          <table className="w-full text-sm">
            <thead className="bg-paper-cream/80 text-ink-black">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">标题</th>
                <th className="text-left px-4 py-3 font-semibold">类别</th>
                <th className="text-left px-4 py-3 font-semibold">难度</th>
                <th className="text-left px-4 py-3 font-semibold">标签</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-ink-gray/10 hover:bg-ink-black/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-ink-black">{item.title}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.category}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.difficulty || '—'}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.tags.length} 个</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(item)
                        setIsCreating(false)
                      }}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink-gray/20 bg-paper-white/80 px-3 py-1.5 text-xs font-semibold text-ink-black shadow-ink transition-all hover:-translate-y-0.5 hover:border-ink-black/40 hover:bg-ink-black/5 hover:shadow-ink-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black/20 active:translate-y-0"
                    >
                      编辑
                      <Pencil className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-gray/70">
                    当前暂无知识条目，可点击右上角新增。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink-black mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
      />
    </div>
  )
}
