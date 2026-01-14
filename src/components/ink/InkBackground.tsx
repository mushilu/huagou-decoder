import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InkBackgroundProps {
  variant?: 'static' | 'animated' | 'parallax' | 'particles'
  className?: string
  opacity?: number
  children?: React.ReactNode
}

// 水墨背景组件，提供多种风格效果
export function InkBackground({
  variant = 'static',
  className,
  opacity = 0.1,
  children,
}: InkBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {variant === 'static' && <StaticInkBackground opacity={opacity} />}
      {variant === 'animated' && <AnimatedInkBackground opacity={opacity} />}
      {variant === 'parallax' && <ParallaxInkBackground opacity={opacity} />}
      {variant === 'particles' && <ParticleInkBackground opacity={opacity} />}

      {/* 内容层 */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// 静态水墨背景
function StaticInkBackground({ opacity }: { opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 主背景渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(26, 26, 46, ${opacity}) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(26, 26, 46, ${opacity * 0.7}) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(45, 90, 123, ${opacity * 0.3}) 0%, transparent 60%)
          `,
        }}
      />

      {/* 纸纹理叠加 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}

// 动态水墨背景，缓慢流动效果
function AnimatedInkBackground({ opacity }: { opacity: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 流动的墨晕 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${40 + i * 20}%`,
            height: `${40 + i * 20}%`,
            left: `${10 + i * 15}%`,
            top: `${10 + i * 15}%`,
            background: `radial-gradient(ellipse at center,
              rgba(26, 26, 46, ${opacity * (1 - i * 0.2)}) 0%,
              transparent 70%
            )`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 纸纹理 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}

// 视差水墨背景，滚动时产生层次感
function ParallaxInkBackground({ opacity }: { opacity: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 远景层 */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y3,
          background: `radial-gradient(ellipse at 30% 20%,
            rgba(26, 26, 46, ${opacity * 0.3}) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* 中景层 */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y1,
          background: `radial-gradient(ellipse at 70% 60%,
            rgba(26, 26, 46, ${opacity * 0.5}) 0%,
            transparent 40%
          )`,
        }}
      />

      {/* 近景层 */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y2,
          background: `radial-gradient(ellipse at 20% 80%,
            rgba(26, 26, 46, ${opacity * 0.7}) 0%,
            transparent 30%
          )`,
        }}
      />
    </div>
  )
}

// 粒子水墨背景，飘散的墨点
function ParticleInkBackground({ opacity }: { opacity: number }) {
  const particles = useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 12,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
      })),
    []
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 基础渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(26, 26, 46, ${opacity * 0.2}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(26, 26, 46, ${opacity * 0.2}) 100%
          )`,
        }}
      />

      {/* 墨点粒子 */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle at 30% 30%,
              rgba(26, 26, 46, ${opacity * 1.5}) 0%,
              rgba(26, 26, 46, ${opacity}) 50%,
              transparent 100%
            )`,
            filter: 'blur(1px)',
          }}
          initial={{ y: '-10%', opacity: 0 }}
          animate={{
            y: '110%',
            opacity: [0, opacity, opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// 山水画背景装饰
export function MountainSilhouette({
  className,
  color = 'rgba(26, 26, 46, 0.1)',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      className={cn('absolute bottom-0 left-0 w-full', className)}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 远山 */}
      <path
        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="url(#mountainGrad)"
        opacity="0.5"
      />

      {/* 近山 */}
      <path
        d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,250.7C672,256,768,288,864,293.3C960,299,1056,277,1152,266.7C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  )
}
