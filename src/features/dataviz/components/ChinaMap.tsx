import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 动态导入官方地图数据
let chinaGeoJson: any = null

// 从CDN加载真实中国地图GeoJSON（高德地图数据）
const loadChinaMap = async () => {
  if (chinaGeoJson) return chinaGeoJson

  try {
    const response = await fetch(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    )
    chinaGeoJson = await response.json()
    return chinaGeoJson
  } catch (error) {
    console.warn('Failed to load China map from CDN, using fallback')
    // 如果CDN失败，使用备用URL
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/apache/echarts/master/test/data/china.json'
      )
      chinaGeoJson = await response.json()
      return chinaGeoJson
    } catch (fallbackError) {
      console.error('Failed to load China map:', fallbackError)
      return null
    }
  }
}

interface MapData {
  name: string
  buildingCount: number
  coordinates: [number, number]
}

interface ChinaMapProps {
  data: MapData[]
  selectedProvince?: string | null
  onProvinceSelect?: (province: string) => void
}

export function ChinaMap({ data, selectedProvince, onProvinceSelect }: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current)
    }

    const initMap = async () => {
      const maxCount = Math.max(...data.map((d) => d.buildingCount), 1)

      // 准备数据 - 气泡点
      const scatterData = data.map((item) => ({
        name: item.name,
        value: [...item.coordinates, item.buildingCount] as [number, number, number],
      }))

      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '古建筑地理分布（中国）',
          left: 'center',
          top: 16,
          textStyle: {
            color: '#1a1a2e',
            fontSize: 16,
            fontFamily: 'serif',
            fontWeight: 'bold',
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#c8102e',
          textStyle: { color: '#1a1a2e', fontSize: 12 },
          formatter: (params: any) => {
            if (params.componentType === 'series') {
              const item = data.find((d) => d.name === params.name)
              if (item) {
                return `<div style="color: #1a1a2e; font-size: 12px;">
                  <strong>${item.name}</strong><br/>
                  建筑数量: <strong>${item.buildingCount}</strong>
                </div>`
              }
            } else if (params.componentType === 'geo') {
              return `<div style="color: #1a1a2e; font-size: 12px;">
                <strong>${params.name}</strong>
              </div>`
            }
            return ''
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 0.5, max: 3 },
          label: {
            emphasis: { show: false },
          },
          itemStyle: {
            normal: {
              areaColor: '#e8eef5',
              borderColor: '#b4b4b4',
              borderWidth: 0.5,
            },
            emphasis: {
              areaColor: '#d4e3f7',
              borderColor: '#666',
              borderWidth: 1,
            },
          },
          top: 60,
          bottom: 20,
        },
        series: [
          {
            name: '建筑分布',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: scatterData,
            symbolSize: function (val: number[]) {
              // 减小气泡大小：原来是 (val[2] / maxCount) * 50 + 10
              // 改为：(val[2] / maxCount) * 25 + 4
              return (val[2] / maxCount) * 25 + 4
            },
            itemStyle: {
              color: '#c8102e',
              opacity: 0.8,
              borderColor: '#fff',
              borderWidth: 1.5,
            },
            emphasis: {
              itemStyle: {
                color: '#ff4d4d',
                opacity: 1,
                borderColor: '#fff',
                borderWidth: 2,
                shadowColor: 'rgba(200, 16, 46, 0.6)',
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
              label: {
                show: false,
              },
            },
            label: {
              formatter: '',
              show: false,
              color: '#333',
              fontSize: 10,
              fontWeight: 400,
            },
          },
        ],
      }

      // 加载并注册中国地图
      const mapData = await loadChinaMap()
      if (mapData && !echarts.getMap('china')) {
        echarts.registerMap('china', mapData)
      }

      chartRef.current?.setOption(option)

      // 监听点击事件
      const handleClick = (params: any) => {
        if (params.componentType === 'series' && params.value) {
          const provinceName = params.name
          if (onProvinceSelect) {
            onProvinceSelect(provinceName)
          }
        }
      }

      chartRef.current?.on('click', handleClick)

      // 响应式布局
      const handleResize = () => {
        chartRef.current?.resize()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        chartRef.current?.off('click', handleClick)
        window.removeEventListener('resize', handleResize)
      }
    }

    initMap()
  }, [data, selectedProvince, onProvinceSelect])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  )
}
