import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface BatchData {
  label: string
  total: number
  color: string
}

interface BatchDistributionChartProps {
  data: BatchData[]
}

export function BatchDistributionChart({ data }: BatchDistributionChartProps) {
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
            const index = params[0].dataIndex
            const item = data[index]
            if (!item) return ''
            return `<div style="color: #1a1a2e">
              <strong>${item.label}</strong><br/>
              总计: ${item.total}
            </div>`
          }
          return ''
        },
      },
      grid: {
        left: 40,
        right: 30,
        top: 20,
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.label),
        axisLine: { show: false },
        axisLabel: { color: '#333', fontSize: 12 },
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
          name: '数量',
          type: 'bar',
          data: data.map((item) => ({
            value: item.total,
            itemStyle: { color: item.color },
          })),
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#333',
            fontSize: 12,
            fontWeight: 500,
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
