import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Dynasty } from '@/types/building'

const SEAL_MAP: Record<Dynasty, string> = {
  '先秦': '/moyu-guji/seals/seal-pre-qin.svg',
  '秦汉': '/moyu-guji/seals/seal-qin-han.svg',
  '魏晋南北朝': '/moyu-guji/seals/seal-wei-jin.svg',
  '隋唐': '/moyu-guji/seals/seal-sui-tang.svg',
  '宋': '/moyu-guji/seals/seal-song.svg',
  '元': '/moyu-guji/seals/seal-yuan.svg',
  '明': '/moyu-guji/seals/seal-ming.svg',
  '清': '/moyu-guji/seals/seal-qing.svg',
}

interface DynastySealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  dynasty: Dynasty
  size?: 'standard' | 'emphasis' // 48px | 64px
  state?: 'default' | 'hover' | 'selected'
  animated?: boolean
}

/**
 * 朝代印章组件
 *
 * 使用印章雕刻风格展示朝代标识
 *
 * @example
 * ```tsx
 * <DynastySeal dynasty="唐" size="standard" state="selected" />
 * ```
 */
export function DynastySeal({
  dynasty,
  size = 'standard',
  state = 'default',
  animated = true,
  className,
  ...props
}: DynastySealProps) {
  const sizeClass = size === 'emphasis' ? 'w-16 h-16' : 'w-12 h-12'

  const stateStyles = {
    default: '',
    hover: 'shadow-[0_0_12px_rgba(200,16,46,0.6)]',
    selected: 'ring-2 ring-ink-black ring-offset-2',
  }

  return (
    <motion.div
      className={cn(
        'relative inline-block',
        sizeClass,
        stateStyles[state],
        className
      )}
      whileHover={animated ? { scale: 1.05 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      <img
        src={SEAL_MAP[dynasty]}
        alt={`${dynasty}印章`}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </motion.div>
  )
}
