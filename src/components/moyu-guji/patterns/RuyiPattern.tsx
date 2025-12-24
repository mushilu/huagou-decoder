import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RuyiPatternProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: number
  opacity?: number
  animated?: boolean
  className?: string
}

/**
 * 如意纹装饰组件
 *
 * 用于卡片或页面角落的装饰点缀
 *
 * @example
 * ```tsx
 * <RuyiPattern position="top-right" size={120} opacity={0.3} />
 * ```
 */
export function RuyiPattern({
  position = 'top-right',
  size = 120,
  opacity = 0.3,
  animated = true,
  className,
}: RuyiPatternProps) {
  const positionClass = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }[position]

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none pattern-ruyi',
        positionClass,
        className
      )}
      style={{
        width: size,
        height: size,
        opacity,
      }}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity } : undefined}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
    />
  )
}
