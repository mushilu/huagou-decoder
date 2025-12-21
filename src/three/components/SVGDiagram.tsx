import { useEffect, useRef } from 'react'

interface SVGDiagramProps {
  svgContent: string
  selectedComponentId?: string
}

export function SVGDiagram({
  svgContent,
  selectedComponentId
}: SVGDiagramProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgContainerRef.current) return

    // 将SVG内容插入DOM
    svgContainerRef.current.innerHTML = svgContent

    // 给所有带data-component的SVG元素添加交互样式
    const elements = svgContainerRef.current.querySelectorAll('[data-component]')
    elements.forEach((element) => {
      // 初始样式
      element.setAttribute('class', 'svg-component transition-all duration-300 cursor-pointer')

      // 添加悬停效果
      element.addEventListener('mouseenter', () => {
        element.setAttribute('opacity', '0.8')
        element.setAttribute('filter', 'drop-shadow(0 0 8px rgba(0,0,0,0.3))')
      })

      element.addEventListener('mouseleave', () => {
        if (selectedComponentId !== element.getAttribute('data-component')) {
          element.setAttribute('opacity', '1')
          element.setAttribute('filter', 'none')
        }
      })
    })

    // 高亮选中的部件
    if (selectedComponentId) {
      const selectedElement = svgContainerRef.current.querySelector(
        `[data-component="${selectedComponentId}"]`
      )
      if (selectedElement) {
        selectedElement.setAttribute('opacity', '0.6')
        selectedElement.setAttribute('stroke-width', '2')
        selectedElement.setAttribute('stroke', '#ff6b35')
        selectedElement.setAttribute('filter', 'drop-shadow(0 0 8px rgba(255,107,53,0.6))')
      }
    }

    // 清空其他选中状态
    elements.forEach((element) => {
      const componentId = element.getAttribute('data-component')
      if (componentId !== selectedComponentId) {
        element.setAttribute('opacity', '1')
        element.setAttribute('stroke', '')
        element.setAttribute('filter', 'none')
      }
    })
  }, [svgContent, selectedComponentId])

  return (
    <div
      ref={svgContainerRef}
      className="w-full flex items-center justify-center bg-white rounded-lg overflow-auto"
      style={{
        aspectRatio: '16 / 9',
        maxHeight: '500px'
      }}
    />
  )
}
