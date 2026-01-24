// Decoder集成

import { decoderSystems, decoderChallenges } from '@/../../content_tab/decoders/cipher_systems'
import { expandedDecoderChallenges } from '@/../../content_tab/documentation/complete_challenges_and_images'

// 合并所有挑战
export const allDecoderChallenges = [
  ...decoderChallenges,
  ...expandedDecoderChallenges
].sort((a, b) => a.level - b.level)

// 按难度分类
export const challengesByDifficulty = {
  easy: allDecoderChallenges.filter(c => c.difficulty === 'easy'),
  medium: allDecoderChallenges.filter(c => c.difficulty === 'medium'),
  hard: allDecoderChallenges.filter(c => c.difficulty === 'hard'),
  expert: allDecoderChallenges.filter(c => c.difficulty === 'expert'),
}

// 导出
export { decoderSystems, allDecoderChallenges as decoderChallenges }
