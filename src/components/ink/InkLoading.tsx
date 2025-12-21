import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InkLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'brush' | 'dots' | 'wave' | 'stroke'
  className?: string
  text?: string
}

/**
 * 毛笔加载动画组件
 * 模拟毛笔书写梁架结构的加载效果
 */
export function InkLoading({
  size = 'md',
  variant = 'brush',
  className,
  text,
}: InkLoadingProps) {
  const sizeMap = {
    sm: { width: 40, height: 40, strokeWidth: 2 },
    md: { width: 80, height: 80, strokeWidth: 3 },
    lg: { width: 120, height: 120, strokeWidth: 4 },
    xl: { width: 160, height: 160, strokeWidth: 5 },
  }

  const config = sizeMap[size]

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {variant === 'brush' && (
        <BrushLoading width={config.width} height={config.height} strokeWidth={config.strokeWidth} />
      )}
      {variant === 'dots' && <DotsLoading size={config.width} />}
      {variant === 'wave' && <WaveLoading width={config.width} height={config.height / 2} />}
      {variant === 'stroke' && (
        <StrokeLoading width={config.width} height={config.height} strokeWidth={config.strokeWidth} />
      )}

      {text && (
        <motion.p
          className="text-ink-gray text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

/**
 * 毛笔书写梁架结构动画
 */
function BrushLoading({
  width,
  height,
  strokeWidth,
}: {
  width: number
  height: number
  strokeWidth: number
}) {
  // 简化的古建筑梁架轮廓路径
  const buildingPath = `
    M ${width * 0.1} ${height * 0.8}
    L ${width * 0.3} ${height * 0.4}
    L ${width * 0.5} ${height * 0.2}
    L ${width * 0.7} ${height * 0.4}
    L ${width * 0.9} ${height * 0.8}
    M ${width * 0.2} ${height * 0.8}
    L ${width * 0.2} ${height * 0.5}
    M ${width * 0.8} ${height * 0.8}
    L ${width * 0.8} ${height * 0.5}
    M ${width * 0.35} ${height * 0.4}
    L ${width * 0.65} ${height * 0.4}
  `

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#1a1a2e" stopOpacity="1" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 背景路径（淡色） */}
      <path
        d={buildingPath}
        fill="none"
        stroke="#e8e4de"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 动画路径 */}
      <motion.path
        d={buildingPath}
        fill="none"
        stroke="url(#brushGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.22, 0.61, 0.36, 1], // brush-stroke
        }}
      />
    </svg>
  )
}

/**
 * 墨点跳动动画
 */
function DotsLoading({ size }: { size: number }) {
  const dotSize = size / 6

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full bg-ink-black"
          style={{
            width: dotSize,
            height: dotSize,
            background: `radial-gradient(circle at 30% 30%, #2d2d44 0%, #1a1a2e 100%)`,
          }}
          animate={{
            y: [0, -dotSize, 0],
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: [0.68, -0.55, 0.265, 1.55], // bounce
          }}
        />
      ))}
    </div>
  )
}

/**
 * 水墨波浪动画
 */
function WaveLoading({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M 0 ${height * 0.5}
              Q ${width * 0.25} ${height * 0.2}, ${width * 0.5} ${height * 0.5}
              T ${width} ${height * 0.5}
              L ${width} ${height}
              L 0 ${height} Z`}
          fill="url(#waveGradient)"
          opacity={0.3 - i * 0.08}
          animate={{
            d: [
              `M 0 ${height * 0.5}
               Q ${width * 0.25} ${height * 0.2}, ${width * 0.5} ${height * 0.5}
               T ${width} ${height * 0.5}
               L ${width} ${height}
               L 0 ${height} Z`,
              `M 0 ${height * 0.5}
               Q ${width * 0.25} ${height * 0.8}, ${width * 0.5} ${height * 0.5}
               T ${width} ${height * 0.5}
               L ${width} ${height}
               L 0 ${height} Z`,
              `M 0 ${height * 0.5}
               Q ${width * 0.25} ${height * 0.2}, ${width * 0.5} ${height * 0.5}
               T ${width} ${height * 0.5}
               L ${width} ${height}
               L 0 ${height} Z`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  )
}

/**
 * 单笔画书写动画
 */
function StrokeLoading({
  width,
  height,
  strokeWidth,
}: {
  width: number
  height: number
  strokeWidth: number
}) {
  // "华" 字的简化笔画路径
  const strokePath = `
    M ${width * 0.2} ${height * 0.3}
    L ${width * 0.8} ${height * 0.3}
    M ${width * 0.5} ${height * 0.15}
    L ${width * 0.5} ${height * 0.85}
    M ${width * 0.2} ${height * 0.5}
    L ${width * 0.8} ${height * 0.5}
    M ${width * 0.3} ${height * 0.7}
    L ${width * 0.7} ${height * 0.7}
  `

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <motion.path
        d={strokePath}
        fill="none"
        stroke="#1a1a2e"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{
          pathLength: [0, 1, 1, 0],
          opacity: [0.3, 1, 1, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      />
    </svg>
  )
}

/**
 * 全屏加载覆盖层
 */
export function InkLoadingOverlay({
  isLoading,
  text = '加载中...',
}: {
  isLoading: boolean
  text?: string
}) {
  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper-white/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <InkLoading size="lg" variant="brush" text={text} />
    </motion.div>
  )
}
