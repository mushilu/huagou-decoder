import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

// 全局错误边界
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
    // 在生产环境可以发送到错误追踪服务
    // reportErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper-white flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto h-16 w-16 text-vermilion mb-4" />
            <h1 className="text-2xl font-serif font-bold text-ink-black mb-2">出现错误</h1>
            <p className="text-ink-gray mb-4">
              {this.state.error?.message || '应用遇到了一个意外的错误'}
            </p>

            {import.meta.env.MODE === 'development' && this.state.errorInfo && (
              <details className="mt-4 bg-red-50 p-4 rounded text-left text-sm text-red-900 overflow-auto max-h-64">
                <summary className="cursor-pointer font-semibold mb-2">错误详情</summary>
                <pre className="text-xs">{this.state.errorInfo.componentStack}</pre>
              </details>
            )}

            <Button onClick={this.handleReset} className="mt-6 w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              重新加载
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
