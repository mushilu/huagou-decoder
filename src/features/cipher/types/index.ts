/**
 * 文化密码知识体系类型定义
 */

export interface CipherKnowledge {
  id: string
  title: string
  description: string
  content: string
  relatedBuildings: string[] // building slugs
  imageUrl?: string
  tags: string[]
}

export interface CipherCategory {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  bgColor: string
  knowledge: CipherKnowledge[]
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'gold'
}
