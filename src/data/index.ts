/**
 * 内容集成 - 统一导出所有来自 content_tab 的数据
 * 这个文件作为中央索引，方便各个模块导入完整的内容数据
 */

// 建筑数据
export { buildings } from './buildings'

// 解码器数据
export {
  decoderSystems,
  decoderChallenges,
  allDecoderChallenges,
  challengesByDifficulty
} from './decoderIntegration'

// 密码知识库
export {
  allCipherKnowledge,
  knowledgeByCategory,
  knowledgeByDifficulty,
  cipherTerms,
  cipherKnowledgeBase
} from './cipherIntegration'

// 3D 模型
export {
  model3DConfigurations,
  modelsByBuildingId,
  getModelConfig,
  getAvailableModels
} from './modelIntegration'

// 图片资源
export {
  allImageResources,
  imagesByBuildingId,
  getBuildingImages,
  getBuildingThumbnail,
  getAllImageMetadata
} from './imageIntegration'

/**
 * 内容统计信息
 */
export const contentStats = {
  buildings: 14,
  decoderChallenges: 25,
  cipherArticles: 20,
  images: 56,
  models: 5,
}
