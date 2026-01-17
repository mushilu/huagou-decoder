import { useState, useEffect } from 'react'
import { Landmark, Pencil, ImagePlus } from 'lucide-react'
import { buildingsApi, uploadImage } from '@/api/content'
import type { Building, Dynasty, BuildingType } from '@/types/building'
import { PaperCard, PaperCardContent, PaperCardFooter, PaperCardHeader } from '@/components/ink/PaperCard'

export function BuildingsAdmin() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [editing, setEditing] = useState<Building | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBuildings()
  }, [])

  async function loadBuildings() {
    try {
      const data = await buildingsApi.list()
      setBuildings(data)
    } catch {
      // 开发环境用本地数据
      const { buildings } = await import('@/data/buildings')
      setBuildings(buildings)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editing) return
    try {
      await buildingsApi.update(editing.id, editing)
      await loadBuildings()
      setEditing(null)
    } catch (e) {
      alert('保存失败')
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    try {
      const url = await uploadImage(file, `buildings/${editing.slug}`)
      setEditing({ ...editing, thumbnail: url })
    } catch {
      alert('上传失败')
    }
  }

  if (loading) {
    return <div className="text-sm text-ink-gray">正在加载建筑数据...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            建筑档案
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">建筑管理</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            校验建筑资料、封面与图文信息，让展陈内容保持稳定一致。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-ink-gray/20 bg-paper-white/80 px-4 py-2 text-xs font-semibold text-ink-black shadow-ink">
            总计 {buildings.length} 条
          </span>
          <button
            onClick={loadBuildings}
            className="rounded-full border border-ink-gray/20 bg-ink-black px-4 py-2 text-xs font-semibold text-paper-white shadow-ink transition hover:shadow-ink-lg"
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
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-black">{editing.nameZh}</h3>
                <p className="text-xs text-ink-gray/70">更新建筑信息与关键展示图</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(null)}
              className="rounded-full border border-ink-gray/20 px-4 py-2 text-xs font-semibold text-ink-black transition hover:border-ink-black/40"
            >
              取消编辑
            </button>
          </PaperCardHeader>

          <PaperCardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="中文名"
                value={editing.nameZh || ''}
                onChange={(v) => setEditing({ ...editing, nameZh: v })}
              />
              <Field
                label="英文名"
                value={editing.nameEn || ''}
                onChange={(v) => setEditing({ ...editing, nameEn: v })}
              />
              <Field
                label="朝代"
                value={editing.dynasty || ''}
                onChange={(v) => setEditing({ ...editing, dynasty: v as Dynasty })}
              />
              <Field
                label="类型"
                value={editing.buildingType || ''}
                onChange={(v) => setEditing({ ...editing, buildingType: v as BuildingType })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">简介</label>
              <textarea
                value={editing.summary || ''}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 p-3 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-black mb-2">缩略图</label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-gray/20 bg-paper-white/80">
                  {editing.thumbnail ? (
                    <img
                      src={editing.thumbnail}
                      className="h-24 w-24 rounded-2xl object-cover"
                      alt={editing.nameZh}
                    />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ink-gray/60" />
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                  <p className="mt-2 text-xs text-ink-gray/60">
                    建议使用 1:1 尺寸封面，以保证展示卡片一致性。
                  </p>
                </div>
              </div>
            </div>
          </PaperCardContent>

          <PaperCardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-xs text-ink-gray/70">
              保存后将同步管理后台与公开展示页面。
            </span>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-black px-6 py-2.5 text-sm font-semibold text-paper-white shadow-ink transition hover:shadow-ink-lg"
            >
              <Pencil className="h-4 w-4" />
              保存更新
            </button>
          </PaperCardFooter>
        </PaperCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-gray/15 bg-paper-white/90 shadow-ink-lg">
          <table className="w-full text-sm">
            <thead className="bg-paper-cream/80 text-ink-black">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">名称</th>
                <th className="text-left px-4 py-3 font-semibold">朝代</th>
                <th className="text-left px-4 py-3 font-semibold">类型</th>
                <th className="text-left px-4 py-3 font-semibold">状态</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr
                  key={building.id}
                  className="border-t border-ink-gray/10 hover:bg-ink-black/[0.02] transition"
                >
                  <td className="px-4 py-3 font-medium text-ink-black">{building.nameZh}</td>
                  <td className="px-4 py-3 text-ink-gray">{building.dynasty}</td>
                  <td className="px-4 py-3 text-ink-gray">{building.buildingType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        building.status === 'draft'
                          ? 'border border-ink-gray/20 text-ink-gray'
                          : 'border border-gold/40 bg-gold/15 text-ink-black'
                      }`}
                    >
                      {building.status === 'draft' ? '草稿' : '已发布'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(building)}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink-gray/20 bg-paper-white/80 px-3 py-1.5 text-xs font-semibold text-ink-black shadow-ink transition-all hover:-translate-y-0.5 hover:border-ink-black/40 hover:bg-ink-black/5 hover:shadow-ink-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black/20 active:translate-y-0"
                    >
                      编辑
                      <Pencil className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </td>
                </tr>
              ))}
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
  onChange: (v: string) => void
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
