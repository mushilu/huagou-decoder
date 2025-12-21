import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface DynastyData {
  name: string
  buildings: number
  percentage: number
  color: string
}

interface DynastyDistributionChartProps {
  data: DynastyData[]
}

export function DynastyDistributionChart({ data }: DynastyDistributionChartProps) {
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
        borderColor: '#c8102e',
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
        left: 60,
        right: 20,
        top: 20,
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#d9d9d9' } },
        axisLabel: { color: '#666', fontSize: 12 },
        splitLine: { lineStyle: { color: '#e8e8e8', type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLine: { show: false },
        axisLabel: { color: '#333', fontSize: 13, fontWeight: 500 },
        splitLine: { show: false },
      },
      series: [
        {
          name: '建筑数量',
          type: 'bar',
          data: data.map((d) => ({
            value: d.buildings,
            itemStyle: { color: d.color },
          })),
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
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
