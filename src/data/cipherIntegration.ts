// Cipher 知识库集成 - 将 content_tab 的知识库数据整合到项目中

import { cipherKnowledgeLibrary, cipherTerms } from '@/../../content_tab/ciphers/cipher_knowledge_extended'
import { fengshuiKnowledge, symbolKnowledge, colorKnowledge, spaceKnowledge } from '@/features/cipher/data/knowledge'

// 合并所有知识库文章
export const allCipherKnowledge = [
  ...fengshuiKnowledge,
  ...symbolKnowledge,
  ...colorKnowledge,
  ...spaceKnowledge,
  ...cipherKnowledgeLibrary
]

// 按类别分类
export const knowledgeByCategory = {
  fengshui: fengshuiKnowledge,
  symbol: symbolKnowledge,
  color: colorKnowledge,
  space: spaceKnowledge,
  cryptography: cipherKnowledgeLibrary.filter(k => k.category === 'cryptography'),
  symbolism: cipherKnowledgeLibrary.filter(k => k.category === 'symbolism'),
  communication: cipherKnowledgeLibrary.filter(k => k.category === 'communication'),
  organization: cipherKnowledgeLibrary.filter(k => k.category === 'organization'),
  history: cipherKnowledgeLibrary.filter(k => k.category === 'history'),
}

// 按难度分类
export const knowledgeByDifficulty = {
  beginner: cipherKnowledgeLibrary.filter(k => k.difficulty === 'beginner'),
  intermediate: cipherKnowledgeLibrary.filter(k => k.difficulty === 'intermediate'),
  advanced: cipherKnowledgeLibrary.filter(k => k.difficulty === 'advanced'),
}

// 导出词汇表
export { cipherTerms }

// 给 CipherPage 使用
export { allCipherKnowledge as cipherKnowledgeBase }
