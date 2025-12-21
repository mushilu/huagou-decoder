import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PaperCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'flat' | 'raised' | 'layered' | 'scroll'
  hoverEffect?: boolean
  textured?: boolean
  children: React.ReactNode
}

/**
 * 宣纸卡片组件
 * 模拟宣纸质感和层叠效果
 */
export const PaperCard = forwardRef<HTMLDivElement, PaperCardProps>(
  ({ variant = 'flat', hoverEffect = true, textured = true, className, children, ...props }, ref) => {
    const baseStyles = cn(
      'relative rounded-lg overflow-hidden',
      'bg-paper-cream border border-gray-200',
      textured && 'paper-texture',
      className
    )

    const variants = {
      flat: '',
      raised: 'shadow-lg',
      layered: 'paper-layered',
      scroll: 'paper-scroll',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant])}
        whileHover={hoverEffect ? { y: -4, boxShadow: '0 20px 40px -8px rgba(26, 26, 46, 0.15)' } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

PaperCard.displayName = 'PaperCard'

/**
 * 宣纸卡片头部
 */
export function PaperCardHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('px-6 pt-6 pb-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

/**
 * 宣纸卡片内容区
 */
export function PaperCardContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

/**
 * 宣纸卡片底部
 */
export function PaperCardFooter({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50/50', className)}>
      {children}
    </div>
  )
}

/**
 * 卷轴卡片组件
 * 模拟古代卷轴展开效果
 */
export function ScrollCard({
  className,
  title,
  children,
  isOpen = true,
}: {
  className?: string
  title?: string
  children: React.ReactNode
  isOpen?: boolean
}) {
  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: isOpen ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ originY: 0 }}
    >
      {/* 上轴 */}
      <div className="relative h-6 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-sm shadow-md">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-950/30" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-950 rounded-full" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-950 rounded-full" />
      </div>

      {/* 卷轴主体 */}
      <div className="bg-paper-cream border-x-4 border-amber-900/20 px-8 py-6 min-h-[100px]">
        {title && (
          <h3 className="font-serif text-xl font-bold text-ink-black text-center mb-4 border-b border-gray-200 pb-3">
            {title}
          </h3>
        )}
        {children}
      </div>

      {/* 下轴 */}
      <div className="relative h-6 bg-gradient-to-t from-amber-900 to-amber-800 rounded-b-sm shadow-md">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-amber-950/30" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-950 rounded-full" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-950 rounded-full" />
      </div>
    </motion.div>
  )
}

/**
 * 层叠卡片组
 * 多张卡片堆叠效果
 */
export function LayeredCards({
  className,
  children,
  layers = 3,
  offset = 8,
}: {
  className?: string
  children: React.ReactNode
  layers?: number
  offset?: number
}) {
  return (
    <div className={cn('relative', className)}>
      {/* 背景层 */}
      {[...Array(layers - 1)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-paper-cream rounded-lg border border-gray-200"
          style={{
            transform: `translateY(${(layers - 1 - i) * offset}px) rotate(${(layers - 1 - i) * 0.5}deg)`,
            zIndex: i,
            opacity: 0.7 - i * 0.15,
          }}
        />
      ))}

      {/* 主卡片 */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * 折页卡片
 * 模拟经折装效果
 */
export function FoldedCard({
  className,
  pages,
  activePage = 0,
}: {
  className?: string
  pages: React.ReactNode[]
  activePage?: number
}) {
  return (
    <div className={cn('flex gap-0.5', className)}>
      {pages.map((page, index) => (
        <motion.div
          key={index}
          className="relative bg-paper-cream border border-gray-200 p-4 min-w-[120px]"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: index % 2 === 0 ? 'right' : 'left',
          }}
          initial={{ rotateY: index % 2 === 0 ? -10 : 10 }}
          animate={{
            rotateY: index === activePage ? 0 : index % 2 === 0 ? -10 : 10,
            scale: index === activePage ? 1.05 : 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {page}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * 印章装饰
 */
export function SealStamp({
  text,
  size = 'md',
  color = 'vermilion',
  className,
}: {
  text: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'vermilion' | 'ink' | 'gold'
  className?: string
}) {
  const sizeMap = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base',
  }

  const colorMap = {
    vermilion: 'text-vermilion border-vermilion',
    ink: 'text-ink-black border-ink-black',
    gold: 'text-gold border-gold',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center font-serif font-bold',
        'border-2 rounded-sm rotate-[-5deg]',
        'opacity-80',
        sizeMap[size],
        colorMap[color],
        className
      )}
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'upright',
      }}
    >
      {text}
    </div>
  )
}
