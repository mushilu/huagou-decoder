import { useEffect, useState } from 'react'

/**
 * 墨韵古建主题配置
 * 使用 CSS 变量驱动，无需 Context
 */
export interface MoyuThemeConfig {
  sizes: {
    sealStandard: number    // 48
    sealEmphasis: number    // 64
    iconList: number        // 32
    iconCard: number        // 48
  }
}

const DEFAULT_CONFIG: MoyuThemeConfig = {
  sizes: {
    sealStandard: 48,
    sealEmphasis: 64,
    iconList: 32,
    iconCard: 48,
  },
}

/**
 * 获取墨韵主题配置
 * 颜色通过 CSS 变量动态读取，支持深色模式自动切换
 */
export function useMoyuTheme(): MoyuThemeConfig {
  return DEFAULT_CONFIG
}

/**
 * 检测当前是否为深色模式
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}
