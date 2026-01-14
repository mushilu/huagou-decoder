// 3D 模型集成 - 将 content_tab 的模型配置整合到项目中

import { model3DConfigurations } from '@/../../content_tab/documentation/3d-model-config'

// 按建筑 ID 索引模型
export const modelsByBuildingId = new Map(
  model3DConfigurations.map(m => [m.buildingId, m])
)

// 导出配置给 ModelLoader 使用
export { model3DConfigurations }

// 获取建筑的模型配置
export function getModelConfig(buildingId: string) {
  return modelsByBuildingId.get(buildingId)
}

// 获取所有可用的 3D 模型
export function getAvailableModels() {
  return model3DConfigurations.map(m => ({
    id: m.id,
    buildingId: m.buildingId,
    buildingName: m.buildingName,
    modelUrl: m.modelUrl,
    fileSize: m.fileSize,
  }))
}
