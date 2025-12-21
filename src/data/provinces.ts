/**
 * 中国各省份坐标数据（用于地图展示）
 * 坐标为地理中心点，用于echarts地图定位和气泡展示
 */

export interface ProvinceCoord {
  name: string
  value: [number, number] // [longitude, latitude]
}

export const provinceCoordinates: ProvinceCoord[] = [
  { name: '北京', value: [116.4074, 39.9042] },
  { name: '上海', value: [121.4737, 31.2304] },
  { name: '广州', value: [113.2644, 23.1291] },
  { name: '深圳', value: [114.0579, 22.5431] },
  { name: '成都', value: [104.0684, 30.5728] },
  { name: '杭州', value: [120.1551, 30.2875] },
  { name: '西安', value: [108.9399, 34.3416] },
  { name: '南京', value: [118.7969, 32.0603] },
  { name: '武汉', value: [114.3055, 30.5928] },
  { name: '重庆', value: [106.5516, 29.5630] },
  { name: '昆明', value: [102.7103, 25.0420] },
  { name: '太原', value: [112.5489, 37.8706] },
  { name: '郑州', value: [113.6254, 34.7466] },
  { name: '长沙', value: [112.9388, 28.2282] },
  { name: '沈阳', value: [123.4328, 41.8045] },
  { name: '青岛', value: [120.3826, 36.0671] },
  { name: '宁波', value: [121.5540, 29.8683] },
  { name: '苏州', value: [120.5954, 31.2989] },
  { name: '福州', value: [119.2965, 26.0745] },
  { name: '厦门', value: [118.0894, 24.4798] },
  { name: '龙岩', value: [117.2272, 24.5199] },
  { name: '南昌', value: [115.7519, 28.6832] },
  { name: '合肥', value: [117.2272, 31.8206] },
  { name: '黄山', value: [118.3197, 29.7174] },
  { name: '太谷', value: [112.5631, 37.4174] },
  { name: '灵石', value: [112.6128, 36.9278] },
  { name: '应县', value: [113.2144, 39.5711] },
  { name: '赵县', value: [114.8003, 37.7394] },
  { name: '凤凰', value: [109.6069, 27.9486] },
]

// 按省份分类
export const provincesByProvince: Record<string, string[]> = {
  '北京': ['北京'],
  '上海': ['上海'],
  '广东': ['广州', '深圳'],
  '四川': ['成都'],
  '浙江': ['杭州', '宁波'],
  '陕西': ['西安'],
  '江苏': ['南京', '苏州'],
  '湖北': ['武汉'],
  '重庆': ['重庆'],
  '云南': ['昆明'],
  '山西': ['太原', '太谷', '灵石', '应县'],
  '河南': ['郑州'],
  '湖南': ['长沙', '凤凰'],
  '辽宁': ['沈阳'],
  '山东': ['青岛'],
  '江西': ['南昌'],
  '安徽': ['合肥', '黄山'],
  '福建': ['福州', '厦门', '龙岩'],
  '河北': ['赵县'],
}

/**
 * 获取某个地区的所有城市
 */
export function getCitiesByProvince(province: string): string[] {
  return provincesByProvince[province] || []
}

/**
 * 获取某个城市的坐标
 */
export function getCityCoordinates(city: string): [number, number] | null {
  const coord = provinceCoordinates.find((p) => p.name === city)
  return coord ? coord.value : null
}
