import { useEffect, useState, type ChangeEvent } from 'react'
import { ImagePlus, Save, ScrollText } from 'lucide-react'
import { pagesApi, uploadImage } from '@/api/content'
import {
  cmsDefaults,
  mergeCmsContent,
  type CmsPageSlug,
  type CmsPageContentMap,
  type HomePageContent,
  type HomeFeatureIconKey,
  type CipherPageContent,
  type ImmersivePageContent,
  type CodexPageContent,
  type DecoderPageContent,
  type DataVizPageContent,
  type BadgeVariant,
} from '@/content/cmsDefaults'
import { PaperCard, PaperCardContent, PaperCardHeader } from '@/components/ink/PaperCard'

const pageOptions: Array<{
  slug: CmsPageSlug
  title: string
  description: string
}> = [
  { slug: 'home', title: '首页', description: '首屏、功能模块与行动召唤' },
  { slug: 'codex', title: '建筑图鉴', description: '列表页标题与搜索提示' },
  { slug: 'cipher', title: '文化密码', description: '栏目说明与精选叙事' },
  { slug: 'decoder', title: '结构解码', description: '页面头部文案' },
  { slug: 'immersive', title: '沉浸漫游', description: '标题文案与建筑列表' },
  { slug: 'dataviz', title: '数据可视', description: '标题与描述' },
]

const featureColorOptions = [
  { label: '绛红', value: 'text-vermilion' },
  { label: '釉蓝', value: 'text-glaze-blue' },
  { label: '鎏金', value: 'text-gold' },
  { label: '墨黑', value: 'text-ink-black' },
]

const badgeVariantOptions: Array<{ label: string; value: BadgeVariant }> = [
  { label: '默认', value: 'default' },
  { label: '浅色', value: 'secondary' },
  { label: '强调', value: 'destructive' },
  { label: '描边', value: 'outline' },
  { label: '鎏金', value: 'gold' },
]

const statColorOptions = [
  { label: '绛红渐变', value: 'from-vermilion/20 to-transparent' },
  { label: '釉蓝渐变', value: 'from-glaze-blue/20 to-transparent' },
  { label: '鎏金渐变', value: 'from-gold/20 to-transparent' },
]

const featureIconOptions = [
  { label: '书卷', value: 'BookOpen' },
  { label: '层叠', value: 'Layers' },
  { label: '星光', value: 'Sparkles' },
  { label: '地球', value: 'Globe' },
  { label: '图表', value: 'BarChart3' },
]

export function ContentAdmin() {
  const [selected, setSelected] = useState<CmsPageSlug>('home')
  const [content, setContent] = useState<CmsPageContentMap[CmsPageSlug]>(cmsDefaults.home)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setNotice(null)
    setError(null)

    pagesApi
      .get(selected)
      .then((data) => {
        if (!active) return
        const defaults = cmsDefaults[selected]
        setContent(mergeCmsContent(defaults, data))
      })
      .catch(() => {
        if (!active) return
        setContent(cmsDefaults[selected])
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [selected])

  async function handleSave() {
    setSaving(true)
    setNotice(null)
    setError(null)
    try {
      await pagesApi.update(selected, content)
      setNotice('保存成功，前台刷新后即可查看。')
    } catch {
      setError('保存失败，请检查后端服务或登录状态。')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-ink-gray">正在加载页面内容...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            CMS 文案
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">页面内容管理</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            以报纸式分区整理首页与栏目内容，统一调整文字与展示图片。
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-gray/20 bg-ink-black px-5 py-2 text-xs font-semibold text-paper-white shadow-ink transition hover:shadow-ink-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {saving ? '正在保存...' : '保存当前页面'}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {pageOptions.map((page) => {
          const isActive = page.slug === selected
          return (
            <button
              key={page.slug}
              onClick={() => setSelected(page.slug)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                isActive
                  ? 'border-ink-black bg-ink-black text-paper-white shadow-ink-lg'
                  : 'border-ink-gray/20 bg-paper-white/80 text-ink-black hover:border-ink-black/40'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? 'bg-paper-white/15 text-paper-white' : 'bg-ink-black/5 text-ink-black'}`}>
                <ScrollText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{page.title}</div>
                <div className={`text-xs ${isActive ? 'text-paper-white/70' : 'text-ink-gray/70'}`}>
                  {page.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {selected === 'home' && (
        <HomeEditor
          value={content as HomePageContent}
          onChange={(next) => setContent(next)}
        />
      )}
      {selected === 'cipher' && (
        <CipherEditor
          value={content as CipherPageContent}
          onChange={(next) => setContent(next)}
        />
      )}
      {selected === 'immersive' && (
        <ImmersiveEditor
          value={content as ImmersivePageContent}
          onChange={(next) => setContent(next)}
        />
      )}
      {selected === 'codex' && (
        <SimpleEditor
          value={content as CodexPageContent}
          onChange={(next) => setContent(next)}
          title="建筑图鉴"
          showSearch
        />
      )}
      {selected === 'decoder' && (
        <SimpleEditor
          value={content as DecoderPageContent}
          onChange={(next) => setContent(next)}
          title="结构解码"
        />
      )}
      {selected === 'dataviz' && (
        <SimpleEditor
          value={content as DataVizPageContent}
          onChange={(next) => setContent(next)}
          title="数据可视"
        />
      )}
    </div>
  )
}

function normalizeHomeFeatures(
  incoming: HomePageContent['features'] | undefined,
  defaults: HomePageContent['features'],
) {
  const safeIncoming = Array.isArray(incoming) ? incoming : []
  const length = Math.max(defaults.length, safeIncoming.length)
  const result: HomePageContent['features'] = []

  for (let index = 0; index < length; index += 1) {
    const template = defaults[index] ?? defaults[0]
    const item = safeIncoming[index]
    if (!item || typeof item !== 'object') {
      result.push(template)
      continue
    }
    result.push({ ...template, ...item })
  }

  return result
}

function HomeEditor({
  value,
  onChange,
}: {
  value: HomePageContent
  onChange: (next: HomePageContent) => void
}) {
  const hero = value.hero
  const features = normalizeHomeFeatures(value.features, cmsDefaults.home.features)
  const stats = Array.isArray(value.stats) ? value.stats : cmsDefaults.home.stats
  const cta = value.cta

  const updateHero = (patch: Partial<HomePageContent['hero']>) => {
    onChange({ ...value, hero: { ...hero, ...patch } })
  }

  const updateFeature = (index: number, patch: Partial<HomePageContent['features'][number]>) => {
    const next = [...features]
    next[index] = { ...next[index], ...patch }
    onChange({ ...value, features: next })
  }

  const updateStat = (index: number, patch: Partial<HomePageContent['stats'][number]>) => {
    const next = [...stats]
    next[index] = { ...next[index], ...patch }
    onChange({ ...value, stats: next })
  }

  const updateCta = (patch: Partial<HomePageContent['cta']>) => {
    onChange({ ...value, cta: { ...cta, ...patch } })
  }

  return (
    <div className="space-y-6">
      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">首页首屏</h3>
          <p className="mt-2 text-sm text-ink-gray/70">设置主标题、副标题与首屏背景图。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="标题" value={hero.title} onChange={(v) => updateHero({ title: v })} />
          <TextAreaField
            label="副标题"
            value={hero.subtitle}
            onChange={(v) => updateHero({ subtitle: v })}
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="主按钮文案"
              value={hero.primaryButtonText}
              onChange={(v) => updateHero({ primaryButtonText: v })}
            />
            <TextField
              label="主按钮链接"
              value={hero.primaryButtonLink}
              onChange={(v) => updateHero({ primaryButtonLink: v })}
            />
            <TextField
              label="副按钮文案"
              value={hero.secondaryButtonText}
              onChange={(v) => updateHero({ secondaryButtonText: v })}
            />
            <TextField
              label="副按钮链接"
              value={hero.secondaryButtonLink}
              onChange={(v) => updateHero({ secondaryButtonLink: v })}
            />
          </div>
          <ImageField
            label="背景图"
            value={hero.backgroundImage}
            onChange={(v) => updateHero({ backgroundImage: v })}
            folder="cms/home/hero"
          />
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">功能模块</h3>
          <p className="mt-2 text-sm text-ink-gray/70">控制首页五大模块的标题、描述与标签。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-6">
          {features.map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="rounded-2xl border border-ink-gray/15 bg-paper-white/80 p-5 shadow-ink">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
                模块 {index + 1}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="标题"
                  value={feature.title}
                  onChange={(v) => updateFeature(index, { title: v })}
                />
                <TextField
                  label="入口路径"
                  value={feature.path}
                  onChange={(v) => updateFeature(index, { path: v })}
                />
                <TextField
                  label="标签"
                  value={feature.badge}
                  onChange={(v) => updateFeature(index, { badge: v })}
                />
                <TextField
                  label="栏目"
                  value={feature.category}
                  onChange={(v) => updateFeature(index, { category: v })}
                />
              </div>
              <TextAreaField
                label="描述"
                value={feature.description}
                onChange={(v) => updateFeature(index, { description: v })}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField
                  label="图标"
                  value={feature.icon}
                  options={featureIconOptions}
                  onChange={(v) => updateFeature(index, { icon: v as HomeFeatureIconKey })}
                />
                <SelectField
                  label="主色调"
                  value={feature.color}
                  options={featureColorOptions}
                  onChange={(v) => updateFeature(index, { color: v })}
                />
                <SelectField
                  label="徽记样式"
                  value={feature.badgeVariant}
                  options={badgeVariantOptions}
                  onChange={(v) => updateFeature(index, { badgeVariant: v as BadgeVariant })}
                />
              </div>
            </div>
          ))}
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">数据规模</h3>
          <p className="mt-2 text-sm text-ink-gray/70">更新统计数值与标签。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="grid gap-4 md:grid-cols-4">
              <TextField
                label="数值"
                value={stat.value}
                onChange={(v) => updateStat(index, { value: v })}
              />
              <TextField
                label="标签"
                value={stat.label}
                onChange={(v) => updateStat(index, { label: v })}
              />
              <TextField
                label="图标"
                value={stat.icon}
                onChange={(v) => updateStat(index, { icon: v })}
              />
              <SelectField
                label="背景"
                value={stat.color}
                options={statColorOptions}
                onChange={(v) => updateStat(index, { color: v })}
              />
            </div>
          ))}
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">行动召唤</h3>
          <p className="mt-2 text-sm text-ink-gray/70">设置结尾 CTA 文字与按钮。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="徽记" value={cta.badge} onChange={(v) => updateCta({ badge: v })} />
          <TextField label="标题" value={cta.title} onChange={(v) => updateCta({ title: v })} />
          <TextAreaField
            label="描述"
            value={cta.description}
            onChange={(v) => updateCta({ description: v })}
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="主按钮文案"
              value={cta.primaryButtonText}
              onChange={(v) => updateCta({ primaryButtonText: v })}
            />
            <TextField
              label="主按钮链接"
              value={cta.primaryButtonLink}
              onChange={(v) => updateCta({ primaryButtonLink: v })}
            />
            <TextField
              label="副按钮文案"
              value={cta.secondaryButtonText}
              onChange={(v) => updateCta({ secondaryButtonText: v })}
            />
            <TextField
              label="副按钮链接"
              value={cta.secondaryButtonLink}
              onChange={(v) => updateCta({ secondaryButtonLink: v })}
            />
          </div>
        </PaperCardContent>
      </PaperCard>
    </div>
  )
}

function CipherEditor({
  value,
  onChange,
}: {
  value: CipherPageContent
  onChange: (next: CipherPageContent) => void
}) {
  const hero = value.hero ?? cmsDefaults.cipher.hero
  const highlight = value.highlight ?? cmsDefaults.cipher.highlight
  const cta = value.cta ?? cmsDefaults.cipher.cta
  const categories = Array.isArray(value.categories)
    ? value.categories
    : cmsDefaults.cipher.categories
  const highlightParagraphs = Array.isArray(highlight?.paragraphs)
    ? highlight.paragraphs
    : cmsDefaults.cipher.highlight.paragraphs
  const ctaStats = Array.isArray(cta?.stats)
    ? cta.stats
    : cmsDefaults.cipher.cta.stats

  const updateHero = (patch: Partial<CipherPageContent['hero']>) => {
    onChange({ ...value, hero: { ...hero, ...patch } })
  }

  const updateCategory = (index: number, patch: Partial<CipherPageContent['categories'][number]>) => {
    const next = [...categories]
    next[index] = { ...next[index], ...patch }
    onChange({ ...value, categories: next })
  }

  const updateHighlight = (patch: Partial<CipherPageContent['highlight']>) => {
    onChange({ ...value, highlight: { ...highlight, ...patch } })
  }

  const updateCta = (patch: Partial<CipherPageContent['cta']>) => {
    onChange({ ...value, cta: { ...cta, ...patch } })
  }

  const updateCtaStat = (index: number, patch: Partial<CipherPageContent['cta']['stats'][number]>) => {
    const next = [...ctaStats]
    next[index] = { ...next[index], ...patch }
    updateCta({ stats: next })
  }

  const updateHighlightParagraph = (index: number, valueText: string) => {
    const next = [...highlightParagraphs]
    next[index] = valueText
    updateHighlight({ paragraphs: next })
  }

  return (
    <div className="space-y-6">
      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">页面头部</h3>
          <p className="mt-2 text-sm text-ink-gray/70">更新文化密码页的标题与简介。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="栏目标签" value={hero.eyebrow} onChange={(v) => updateHero({ eyebrow: v })} />
          <TextField label="标题" value={hero.title} onChange={(v) => updateHero({ title: v })} />
          <TextAreaField label="简介" value={hero.description} onChange={(v) => updateHero({ description: v })} />
          <TextField label="补充说明" value={hero.subtext} onChange={(v) => updateHero({ subtext: v })} />
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">栏目卡片</h3>
          <p className="mt-2 text-sm text-ink-gray/70">调整四大知识体系的标题与描述。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.id} className="rounded-2xl border border-ink-gray/15 bg-paper-white/80 p-5 shadow-ink">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
                {category.id}
              </div>
              <TextField
                label="标题"
                value={category.title}
                onChange={(v) => updateCategory(index, { title: v })}
              />
              <TextAreaField
                label="描述"
                value={category.description}
                onChange={(v) => updateCategory(index, { description: v })}
              />
            </div>
          ))}
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">精选叙事</h3>
          <p className="mt-2 text-sm text-ink-gray/70">设置精选卡片的标题与正文段落。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="徽记" value={highlight.badge} onChange={(v) => updateHighlight({ badge: v })} />
          <TextField label="标题" value={highlight.title} onChange={(v) => updateHighlight({ title: v })} />
          <TextField label="封面文字" value={highlight.coverText} onChange={(v) => updateHighlight({ coverText: v })} />
          <TextField label="按钮文案" value={highlight.actionText} onChange={(v) => updateHighlight({ actionText: v })} />
          <TextField
            label="关联知识 ID"
            value={highlight.knowledgeId}
            onChange={(v) => updateHighlight({ knowledgeId: v })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {highlightParagraphs.map((paragraph, index) => (
              <TextAreaField
                key={`${index}`}
                label={`段落 ${index + 1}`}
                value={paragraph}
                onChange={(v) => updateHighlightParagraph(index, v)}
                rows={4}
              />
            ))}
          </div>
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">底部引导</h3>
          <p className="mt-2 text-sm text-ink-gray/70">更新 CTA 文案与统计信息。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="标题" value={cta.title} onChange={(v) => updateCta({ title: v })} />
          <TextAreaField label="描述" value={cta.description} onChange={(v) => updateCta({ description: v })} />
          <div className="grid gap-4 md:grid-cols-3">
            {ctaStats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="space-y-2">
                <TextField
                  label={`数值 ${index + 1}`}
                  value={stat.value}
                  onChange={(v) => updateCtaStat(index, { value: v })}
                />
                <TextField
                  label={`标签 ${index + 1}`}
                  value={stat.label}
                  onChange={(v) => updateCtaStat(index, { label: v })}
                />
              </div>
            ))}
          </div>
        </PaperCardContent>
      </PaperCard>
    </div>
  )
}

function ImmersiveEditor({
  value,
  onChange,
}: {
  value: ImmersivePageContent
  onChange: (next: ImmersivePageContent) => void
}) {
  const hero = value.hero
  const buildings = Array.isArray(value.buildings) ? value.buildings : cmsDefaults.immersive.buildings

  const updateHero = (patch: Partial<ImmersivePageContent['hero']>) => {
    onChange({ ...value, hero: { ...hero, ...patch } })
  }

  const updateBuilding = (index: number, patch: Partial<ImmersivePageContent['buildings'][number]>) => {
    const next = [...buildings]
    next[index] = { ...next[index], ...patch }
    onChange({ ...value, buildings: next })
  }

  return (
    <div className="space-y-6">
      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">页面头部</h3>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          <TextField label="栏目标签" value={hero.eyebrow} onChange={(v) => updateHero({ eyebrow: v })} />
          <TextField label="标题" value={hero.title} onChange={(v) => updateHero({ title: v })} />
          <TextAreaField label="简介" value={hero.description} onChange={(v) => updateHero({ description: v })} />
          <TextField label="补充说明" value={hero.subtext} onChange={(v) => updateHero({ subtext: v })} />
        </PaperCardContent>
      </PaperCard>

      <PaperCard variant="raised" hoverEffect={false}>
        <PaperCardHeader>
          <h3 className="font-serif text-xl font-bold text-ink-black">建筑列表</h3>
          <p className="mt-2 text-sm text-ink-gray/70">可修改展示名称与所在地区。</p>
        </PaperCardHeader>
        <PaperCardContent className="space-y-4">
          {buildings.map((building, index) => (
            <div key={building.id} className="rounded-2xl border border-ink-gray/15 bg-paper-white/80 p-5 shadow-ink">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60 mb-3">
                {building.id}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="展示名称"
                  value={building.name}
                  onChange={(v) => updateBuilding(index, { name: v })}
                />
                <TextField
                  label="地区"
                  value={building.region}
                  onChange={(v) => updateBuilding(index, { region: v })}
                />
              </div>
            </div>
          ))}
        </PaperCardContent>
      </PaperCard>
    </div>
  )
}

function SimpleEditor({
  value,
  onChange,
  title,
  showSearch = false,
}: {
  value: CodexPageContent | DecoderPageContent | DataVizPageContent
  onChange: (next: CodexPageContent | DecoderPageContent | DataVizPageContent) => void
  title: string
  showSearch?: boolean
}) {
  const hero = value.hero
  const searchPlaceholder = 'searchPlaceholder' in value ? value.searchPlaceholder : ''

  const updateHero = (patch: Partial<SimpleHeroFields>) => {
    onChange({ ...value, hero: { ...hero, ...patch } } as typeof value)
  }

  return (
    <PaperCard variant="raised" hoverEffect={false}>
      <PaperCardHeader>
        <h3 className="font-serif text-xl font-bold text-ink-black">{title} 页面头部</h3>
      </PaperCardHeader>
      <PaperCardContent className="space-y-4">
        <TextField label="标题" value={hero.title} onChange={(v) => updateHero({ title: v })} />
        <TextAreaField label="描述" value={hero.description} onChange={(v) => updateHero({ description: v })} />
        {showSearch && (
          <TextField
            label="搜索提示"
            value={searchPlaceholder}
            onChange={(v) => onChange({ ...(value as CodexPageContent), searchPlaceholder: v })}
          />
        )}
      </PaperCardContent>
    </PaperCard>
  )
}

type SimpleHeroFields = {
  title: string
  description: string
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-2 text-sm text-ink-black">
      <span className="font-semibold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="block space-y-2 text-sm text-ink-black">
      <span className="font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-2 text-sm text-ink-black">
      <span className="font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ImageField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  folder: string
}) {
  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch {
      // 上传失败无需打断编辑
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-ink-black">{label}</div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-ink-gray/20 bg-paper-white/80">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-ink-gray/50" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="填写图片地址或上传"
            className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 px-3 py-2 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
          />
        </div>
      </div>
    </div>
  )
}
