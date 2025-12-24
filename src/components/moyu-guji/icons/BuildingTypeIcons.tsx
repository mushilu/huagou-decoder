import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { BuildingType } from '@/types/building'

const ICON_MAP: Record<BuildingType, string> = {
  '民居': '/assets/moyu-guji/building-types/residence.svg',
  '宫府': '/assets/moyu-guji/building-types/mansion.svg',
  '皇宫': '/assets/moyu-guji/building-types/palace.svg',
  '桥梁': '/assets/moyu-guji/building-types/bridge.svg',
  '防御': '/assets/moyu-guji/building-types/defense.svg',
  '园林': '/assets/moyu-guji/building-types/garden.svg',
  '寺庙': '/assets/moyu-guji/building-types/temple.svg',
  '陵墓': '/assets/moyu-guji/building-types/tomb.svg',
  '城镇': '/assets/moyu-guji/building-types/town.svg',
  '要塞': '/assets/moyu-guji/building-types/fortress.svg',
}

interface BuildingTypeIconProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  type: BuildingType
  size?: 'list' | 'card' // 32px | 48px
  state?: 'default' | 'hover' | 'selected'
  animated?: boolean
}

/**
 * 建筑类型图标组件
 *
 * 使用现代线描风格展示建筑类型
 *
 * @example
 * ```tsx
 * <BuildingTypeIcon type="皇宫" size="card" state="selected" />
 * ```
 */
export function BuildingTypeIcon({
  type,
  size = 'list',
  state = 'default',
  animated = true,
  className,
  ...props
}: BuildingTypeIconProps) {
  const sizeClass = size === 'card' ? 'w-12 h-12' : 'w-8 h-8'

  const colorClass = {
    default: 'text-ink-black',
    hover: 'text-vermilion',
    selected: 'text-vermilion bg-vermilion/10 rounded-lg p-1',
  }[state]

  return (
    <motion.div
      className={cn(
        'inline-flex items-center justify-center',
        sizeClass,
        colorClass,
        className
      )}
      whileHover={animated ? { scale: 1.1 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      <img
        src={ICON_MAP[type]}
        alt={`${type}图标`}
        className="w-full h-full object-contain"
        style={{
          filter:
            state === 'selected' || state === 'hover'
              ? 'brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(2421%) hue-rotate(340deg) brightness(95%) contrast(93%)'
              : 'none',
        }}
        loading="lazy"
      />
    </motion.div>
  )
}
