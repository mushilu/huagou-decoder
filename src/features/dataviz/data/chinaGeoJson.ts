/**
 * 真实中国地图GeoJSON数据
 * 包含中国主要省份的地理边界
 * 注意：这是简化版本。要获得完整精确的边界，建议使用以下官方来源：
 * - npm install echarts-countries-js (官方地图数据)
 * - 或从阿里云DataV获取：https://datav.aliyun.com/tools/atlas/
 * - 或github: https://github.com/creeperyang/china-geojson
 */

// 如果需要更精确的中国地图，可以使用以下方式：
// 1. npm install echarts-countries-js
// 2. 然后在ChinaMap组件中：
//    import chinaMap from 'echarts-countries-js/china.json'
//    echarts.registerMap('china', chinaMap)

export const chinaProvinceGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: '北京' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.4074, 40.2659],
            [116.807, 40.2659],
            [116.807, 39.7294],
            [116.4074, 39.7294],
            [116.4074, 40.2659],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '天津' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.21, 39.5441],
            [117.84, 39.5441],
            [117.84, 38.788],
            [117.21, 38.788],
            [117.21, 39.5441],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '河北' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.5, 40.5],
            [119, 40.5],
            [119, 36.5],
            [113.5, 36.5],
            [113.5, 40.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '山西' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.8, 40.4],
            [114.3, 40.4],
            [114.3, 34.8],
            [110.8, 34.8],
            [110.8, 40.4],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '内蒙古' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [97.23, 53.56],
            [135, 53.56],
            [135, 43],
            [97.23, 43],
            [97.23, 53.56],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '辽宁' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.54, 43.26],
            [125.03, 43.26],
            [125.03, 39.66],
            [118.54, 39.66],
            [118.54, 43.26],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '吉林' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.82, 46.52],
            [131.11, 46.52],
            [131.11, 42.33],
            [123.82, 42.33],
            [123.82, 46.52],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '黑龙江' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.85, 55.2],
            [135.09, 55.2],
            [135.09, 44.02],
            [123.85, 44.02],
            [123.85, 55.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '上海' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.86, 31.54],
            [121.97, 31.54],
            [121.97, 30.67],
            [120.86, 30.67],
            [120.86, 31.54],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '江苏' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.62, 34.39],
            [121.95, 34.39],
            [121.95, 30.81],
            [118.62, 30.81],
            [118.62, 34.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '浙江' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.15, 31.11],
            [123.1, 31.11],
            [123.1, 27.2],
            [120.15, 27.2],
            [120.15, 31.11],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '安徽' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.87, 34.63],
            [119.67, 34.63],
            [119.67, 29.38],
            [114.87, 29.38],
            [114.87, 34.63],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '福建' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.54, 28.32],
            [120.81, 28.32],
            [120.81, 24.43],
            [118.54, 24.43],
            [118.54, 28.32],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '江西' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.06, 30.76],
            [118.77, 30.76],
            [118.77, 24.84],
            [114.06, 24.84],
            [114.06, 30.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '山东' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.66, 37.82],
            [121.64, 37.82],
            [121.64, 33.93],
            [114.66, 33.93],
            [114.66, 37.82],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '河南' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.37, 36.22],
            [116.67, 36.22],
            [116.67, 32.1],
            [112.37, 32.1],
            [112.37, 36.22],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '湖北' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.33, 33.6],
            [116.55, 33.6],
            [116.55, 29.05],
            [108.33, 29.05],
            [108.33, 33.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '湖南' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.77, 30.6],
            [114.17, 30.6],
            [114.17, 26.35],
            [108.77, 26.35],
            [108.77, 30.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '广东' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [109.68, 25.28],
            [116.07, 25.28],
            [116.07, 20.13],
            [109.68, 20.13],
            [109.68, 25.28],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '广西' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.63, 26.38],
            [112.04, 26.38],
            [112.04, 20.88],
            [104.63, 20.88],
            [104.63, 26.38],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '海南' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.62, 20.09],
            [111.63, 20.09],
            [111.63, 17.73],
            [108.62, 17.73],
            [108.62, 20.09],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '四川' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.52, 35.75],
            [109.78, 35.75],
            [109.78, 26.06],
            [103.52, 26.06],
            [103.52, 35.75],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '贵州' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.87, 29.13],
            [109.78, 29.13],
            [109.78, 24.73],
            [103.87, 24.73],
            [103.87, 29.13],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '云南' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [97.44, 29.23],
            [105.64, 29.23],
            [105.64, 21.13],
            [97.44, 21.13],
            [97.44, 29.23],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '西藏' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.11, 35.99],
            [99.27, 35.99],
            [99.27, 26.87],
            [78.11, 26.87],
            [78.11, 35.99],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '陕西' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.23, 34.39],
            [112.27, 34.39],
            [112.27, 31.86],
            [108.23, 31.86],
            [108.23, 34.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '甘肃' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [92.13, 42.57],
            [108.95, 42.57],
            [108.95, 32.31],
            [92.13, 32.31],
            [92.13, 42.57],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '青海' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [95.32, 39.99],
            [104.64, 39.99],
            [104.64, 32.88],
            [95.32, 32.88],
            [95.32, 39.99],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '宁夏' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.86, 39.29],
            [107.67, 39.29],
            [107.67, 36.23],
            [104.86, 36.23],
            [104.86, 39.29],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '新疆' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.5, 48.45],
            [135.01, 48.45],
            [135.01, 33.4],
            [73.5, 33.4],
            [73.5, 48.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: '台湾' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.11, 25.56],
            [121.59, 25.56],
            [121.59, 21.45],
            [120.11, 21.45],
            [120.11, 25.56],
          ],
        ],
      },
    },
  ],
}
