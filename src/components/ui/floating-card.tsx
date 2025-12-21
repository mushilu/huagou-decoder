import React, { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { MouseEvent } from 'react'

interface CardTransform {
  rotateX: number
  rotateY: number
  translateY: number
  scale: number
}

export function FloatingCard({
  children,
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) {
  const [transform, setTransform] = useState<CardTransform>({
    rotateX: 0,
    rotateY: 0,
    translateY: 0,
    scale: 1,
  })

  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const rotateX = (y / rect.height) * -20
    const rotateY = (x / rect.width) * 20

    setTransform({
      rotateX,
      rotateY,
      translateY: -20,
      scale: 1.02,
    })
  }

  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      scale: 1,
    })
  }

  return (
    <div
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        className={cn(
          'relative w-96 h-auto min-h-[500px] p-8 rounded-3xl backdrop-blur-3xl transition-all duration-500 transform-gpu preserve-3d',
          'bg-gradient-to-br from-paper-white/80 to-paper-cream/60 border border-ink-gray/10 shadow-xl',
          'hover:shadow-2xl',
          className
        )}
        style={{
          transform: `translateY(${transform.translateY}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
          animation: 'float 6s ease-in-out infinite',
        }}
        {...props}
      >
        {/* Floating animation background */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-30 pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-vermilion"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `particleFloat ${Math.random() * 3 + 2}s linear infinite`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col gap-4">
          {title && <h2 className="text-2xl font-serif font-bold text-ink-black">{title}</h2>}
          {children}
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-vermilion/5 to-glaze-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
