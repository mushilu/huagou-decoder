import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CloudPatternProps {
  position?: 'top' | 'bottom'
  opacity?: number
  animated?: boolean
  className?: string
}

/**
 * 祥云纹装饰组件
 *
 * 用于页面顶部或底部的装饰，营造传统水墨氛围
 *
 * @example
 * ```tsx
 * <CloudPattern position="top" opacity={0.4} />
 * ```
 */
export function CloudPattern({
  position = 'top',
  opacity = 0.4,
  animated = true,
  className,
}: CloudPatternProps) {
  const positionClass =
    position === 'top' ? 'top-0 left-0 right-0' : 'bottom-0 left-0 right-0'

  return (
    <motion.div
      className={cn(
        'absolute h-32 pointer-events-none',
        positionClass,
        'pattern-cloud',
        className
      )}
      style={{ opacity }}
      initial={
        animated ? { y: position === 'top' ? -20 : 20, opacity: 0 } : undefined
      }
      animate={animated ? { y: 0, opacity } : undefined}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  )
}
