import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InkHoverProps {
  children: React.ReactNode
  className?: string
  inkColor?: string
  intensity?: 'subtle' | 'normal' | 'strong'
  disabled?: boolean
}

// 墨滴悬停效果，鼠标悬停时产生墨滴扩散
export function InkHover({
  children,
  className,
  inkColor = 'rgba(26, 26, 46, 0.1)',
  intensity = 'normal',
  disabled = false,
}: InkHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = useRef(0)

  const intensityMap = {
    subtle: { size: 80, duration: 0.6, opacity: 0.5 },
    normal: { size: 120, duration: 0.8, opacity: 0.7 },
    strong: { size: 180, duration: 1.0, opacity: 0.9 },
  }

  const config = intensityMap[intensity]

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = rippleIdRef.current++

    setRipples((prev) => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, config.duration * 1000)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 墨滴涟漪效果 */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: inkColor,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: config.opacity }}
          animate={{
            width: config.size,
            height: config.size,
            opacity: 0,
          }}
          transition={{
            duration: config.duration,
            ease: [0.25, 0.46, 0.45, 0.94], // ink-spread
          }}
        />
      ))}

      {children}
    </motion.div>
  )
}

interface InkSpotProps {
  className?: string
  size?: number
  color?: string
  animated?: boolean
}

// 静态墨点装饰
export function InkSpot({
  className,
  size = 24,
  color = '#1a1a2e',
  animated = true,
}: InkSpotProps) {
  return (
    <motion.div
      className={cn('rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%,
          ${color}dd 0%,
          ${color} 40%,
          ${color}88 70%,
          transparent 100%
        )`,
        filter: 'blur(0.5px)',
      }}
      initial={animated ? { scale: 0 } : undefined}
      animate={animated ? { scale: 1 } : undefined}
      transition={animated ? { type: 'spring', stiffness: 200, damping: 15 } : undefined}
    />
  )
}

interface InkTrailProps {
  children: React.ReactNode
  className?: string
  trailColor?: string
  trailWidth?: number
}

// 鼠标轨迹墨痕，跟随鼠标移动产生淡淡的墨痕
export function InkTrail({
  children,
  className,
  trailColor = 'rgba(26, 26, 46, 0.08)',
  trailWidth = 3,
}: InkTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const trailIdRef = useRef(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 预留的弹性动画值
  const springConfig = { damping: 25, stiffness: 150 }
  const _trailX = useSpring(mouseX, springConfig)
  const _trailY = useSpring(mouseY, springConfig)
  // 消除未使用警告
  void _trailX
  void _trailY

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX.set(x)
      mouseY.set(y)

      const id = trailIdRef.current++
      setTrail((prev) => [...prev.slice(-20), { x, y, id }])
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* SVG 墨痕轨迹 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="inkTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={trailColor} stopOpacity="0" />
            <stop offset="50%" stopColor={trailColor} stopOpacity="1" />
            <stop offset="100%" stopColor={trailColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {trail.length > 1 && (
          <motion.path
            d={trail
              .map((point, i) =>
                i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
              )
              .join(' ')}
            fill="none"
            stroke="url(#inkTrailGradient)"
            strokeWidth={trailWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </svg>

      {children}
    </div>
  )
}
