import { useEffect, useState } from 'react'
import { mergeCmsContent, type CmsPageSlug } from '@/content/cmsDefaults'

interface CmsResponse {
  content?: unknown
}

export function useCmsPage<T extends object>(slug: CmsPageSlug, defaults: T) {
  const [content, setContent] = useState<T>(defaults)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    setIsLoading(true)

    fetch(`/api/pages/${slug}`)
      .then(async (res) => {
        if (!res.ok) return null
        const data = (await res.json()) as CmsResponse
        return data?.content ?? null
      })
      .then((data) => {
        if (!active || !data) return
        setContent(mergeCmsContent(defaults, data))
      })
      .catch(() => {
        // 保持默认内容
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, defaults])

  return { content, isLoading }
}
