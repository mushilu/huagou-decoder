import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MeanderPatternProps {
  position?: 'top' | 'bottom' | 'left' | 'right'
  thickness?: number
  opacity?: number
  animated?: boolean
  className?: string
}

/**
 * 回纹装饰组件
 *
 * 用于页面边框或分割线的装饰
 *
 * @example
 * ```tsx
 * <MeanderPattern position="top" thickness={2} opacity={0.1} />
 * ```
 */
export function MeanderPattern({
  position = 'top',
  thickness = 2,
  opacity = 0.1,
  animated = true,
  className,
}: MeanderPatternProps) {
  const positionClass = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'top-0 bottom-0 left-0',
    right: 'top-0 bottom-0 right-0',
  }[position]

  const sizeClass =
    position === 'top' || position === 'bottom'
      ? `h-[${thickness}px]`
      : `w-[${thickness}px]`

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none pattern-meander',
        positionClass,
        sizeClass,
        className
      )}
      style={{
        opacity,
        height: position === 'top' || position === 'bottom' ? thickness : '100%',
        width: position === 'left' || position === 'right' ? thickness : '100%',
      }}
      initial={animated ? { opacity: 0 } : undefined}
      animate={animated ? { opacity } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
    />
  )
}
