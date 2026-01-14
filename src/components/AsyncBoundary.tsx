import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { InkLoading } from '@/components/ink'

interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

// 异步边界
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

// 页面级Suspense边界
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
