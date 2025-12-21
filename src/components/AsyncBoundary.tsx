import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { InkLoading } from '@/components/ink'

interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

/**
 * 异步边界 - 统一处理Suspense加载状态
 * 用于包装可能需要异步加载的组件
 */
export function AsyncBoundary({ children, fallback, name = '数据' }: AsyncBoundaryProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center py-12">
            <InkLoading size="md" variant="brush" text={`正在加载${name}...`} />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}

/**
 * 页面级Suspense边界
 * 用于包装整个页面组件
 */
export function PageAsyncBoundary({ children, name = '页面' }: Omit<AsyncBoundaryProps, 'fallback'>) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-white flex items-center justify-center">
          <InkLoading size="lg" variant="brush" text={`正在加载${name}...`} />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
