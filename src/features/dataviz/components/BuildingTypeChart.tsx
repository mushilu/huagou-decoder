import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface TypeData {
  name: string
  count: number
  color: string
  percentage: number
}

interface BuildingTypeChartProps {
  data: TypeData[]
}

export function BuildingTypeChart({ data }: BuildingTypeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current)
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#4a90e2',
        textStyle: { color: '#1a1a2e' },
        formatter: (params: any) => {
          if (Array.isArray(params) && params.length > 0) {
            const p = params[0]
            const item = data.find((d) => d.name === p.name)
            return `<div style="color: #1a1a2e">
              <strong>${p.name}</strong><br/>
              建筑数量: ${p.value}<br/>
              占比: ${item?.percentage}%
            </div>`
          }
          return ''
        },
      },
      grid: {
        left: 40,
        right: 30,
        top: 20,
        bottom: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLine: { show: false },
        axisLabel: { color: '#333', fontSize: 12, interval: 0, rotate: 45 },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#d9d9d9' } },
        axisLabel: { color: '#666', fontSize: 12 },
        splitLine: { lineStyle: { color: '#e8e8e8', type: 'dashed' } },
      },
      series: [
        {
          name: '建筑数量',
          type: 'bar',
          data: data.map((d) => ({
            value: d.count,
            itemStyle: { color: d.color },
          })),
          barWidth: '50%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#333',
            fontSize: 12,
            fontWeight: 500,
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10,
            },
          },
        },
      ],
    }

    chartRef.current.setOption(option)

    const handleResize = () => {
      chartRef.current?.resize()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  )
}
