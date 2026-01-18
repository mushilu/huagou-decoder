// 模型集成

import { model3DConfigurations } from '@/../../content_tab/documentation/3d-model-config'

// 按建筑 ID 索引模型
export const modelsByBuildingId = new Map(
  model3DConfigurations.map(m => [m.buildingId, m])
)

// 导出
export { model3DConfigurations }

// 取配置
export function getModelConfig(buildingId: string) {
  return modelsByBuildingId.get(buildingId)
}

// 取全部模型
export function getAvailableModels() {
  return model3DConfigurations.map(m => ({
    id: m.id,
    buildingId: m.buildingId,
    buildingName: m.buildingName,
    modelUrl: m.modelUrl,
    fileSize: m.fileSize,
  }))
}
