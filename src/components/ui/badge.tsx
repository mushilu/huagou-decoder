import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-transparent bg-ink-black text-paper-white hover:bg-ink-deep',
        secondary: 'border border-ink-gray/20 bg-paper-white text-ink-black hover:bg-paper-cream',
        destructive: 'border border-transparent bg-vermilion text-white hover:bg-vermilion-dark',
        outline: 'border border-ink-gray/30 text-ink-black hover:bg-paper-white',
        gold: 'border border-transparent bg-gold text-ink-black hover:bg-gold-light',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
