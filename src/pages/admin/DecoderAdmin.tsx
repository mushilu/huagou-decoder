import { useEffect, useState } from 'react'
import { Puzzle, Pencil, Trash2, Plus } from 'lucide-react'
import { PaperCard, PaperCardContent, PaperCardFooter, PaperCardHeader } from '@/components/ink/PaperCard'

interface DecoderAdminItem {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  hint: string
  solution: string
  buildingId: string
}

const createEmptyItem = (): DecoderAdminItem => ({
  id: '',
  title: '',
  description: '',
  difficulty: '',
  category: '',
  hint: '',
  solution: '',
  buildingId: '',
})

export function DecoderAdmin() {
  const [items, setItems] = useState<DecoderAdminItem[]>([])
  const [editing, setEditing] = useState<DecoderAdminItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/decoder', { credentials: 'include' })
      if (!res.ok) throw new Error('加载失败')
      const data = await res.json()
      const rows = Array.isArray(data) ? data : data.items ?? []
      const normalized = rows.map((row: Record<string, unknown>) => ({
        id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
        title: typeof row.title === 'string' ? row.title : '',
        description: typeof row.description === 'string' ? row.description : '',
        difficulty: typeof row.difficulty === 'string' ? row.difficulty : '',
        category: typeof row.category === 'string' ? row.category : '',
        hint: typeof row.hint === 'string' ? row.hint : '',
        solution: typeof row.solution === 'string' ? row.solution : '',
        buildingId: typeof row.buildingId === 'string' ? row.buildingId : '',
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
      description: editing.description,
      difficulty: editing.difficulty,
      category: editing.category,
      hint: editing.hint,
      solution: editing.solution,
      buildingId: editing.buildingId,
    }
    try {
      if (isCreating || !editing.id) {
        await fetch('/api/decoder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(`/api/decoder/${editing.id}`, {
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
    if (!confirm('确认删除该挑战？')) return
    try {
      await fetch(`/api/decoder/${id}`, {
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

  if (loading) {
    return <div className="text-sm text-ink-gray">正在加载解码挑战数据...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            解码挑战
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">挑战内容管理</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            配置挑战标题、提示与解答，让结构解码节奏更清晰。
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
            新增挑战
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
                <Puzzle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-black">
                  {editing.title || '新建挑战'}
                </h3>
                <p className="text-xs text-ink-gray/70">填写挑战描述、提示与解答。</p>
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
              <Field
                label="关联建筑 ID"
                value={editing.buildingId}
                onChange={(v) => setEditing({ ...editing, buildingId: v })}
              />
              <Field
                label="类别"
                value={editing.category}
                onChange={(v) => setEditing({ ...editing, category: v })}
              />
              <Field
                label="难度"
                value={editing.difficulty}
                onChange={(v) => setEditing({ ...editing, difficulty: v })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">描述</label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-ink-black mb-2">提示</label>
                <textarea
                  value={editing.hint}
                  onChange={(e) => setEditing({ ...editing, hint: e.target.value })}
                  className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-black mb-2">解答</label>
                <textarea
                  value={editing.solution}
                  onChange={(e) => setEditing({ ...editing, solution: e.target.value })}
                  className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                  rows={5}
                />
              </div>
            </div>
          </PaperCardContent>

          <PaperCardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-xs text-ink-gray/70">保存后将同步后台挑战配置。</span>
            <div className="flex items-center gap-3">
              {!isCreating && editing.id && (
                <button
                  onClick={() => handleDelete(editing.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  删除挑战
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
                <th className="text-left px-4 py-3 font-semibold">建筑</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-ink-gray/10 hover:bg-ink-black/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-ink-black">{item.title}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.category || '—'}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.difficulty || '—'}</td>
                  <td className="px-4 py-3 text-ink-gray">{item.buildingId || '—'}</td>
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
                    当前暂无挑战条目，可点击右上角新增。
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
