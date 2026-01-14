import React from 'react'
import { cn } from '@/lib/utils'

// 分隔线
export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <div
      className={cn(
        'bg-ink-gray/20',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
}

// 标签页
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({ activeTab: '', setActiveTab: () => {} })

export function Tabs({ defaultValue, children, className, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-paper-cream p-1 text-ink-black',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        activeTab === value
          ? 'bg-paper-white text-ink-black shadow-sm'
          : 'text-ink-gray hover:text-ink-black',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    />
  )
}

export function TabsContent({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { activeTab } = React.useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <div className={cn('mt-2 w-full animate-in fade-in-50 duration-300', className)} {...props} />
  )
}

// 徽章
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'gold' | 'outline'
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-ink-black text-paper-white',
    secondary: 'bg-paper-cream text-ink-black border border-ink-gray/20',
    destructive: 'bg-vermilion text-white',
    gold: 'bg-gold text-ink-black',
    outline: 'border border-ink-gray/30 text-ink-black',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
