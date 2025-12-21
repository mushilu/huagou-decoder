import { useMemo } from 'react'
import { MeshStandardMaterial, Color } from 'three'

interface InkShaderMaterialProps {
  color?: string
  opacity?: number
}

export function InkShaderMaterial({
  color = '#1a1a2e',
  opacity = 1,
}: InkShaderMaterialProps) {
  const material = useMemo(() => {
    return new MeshStandardMaterial({
      color: new Color(color),
      opacity,
      transparent: opacity < 1,
      roughness: 0.8,
      metalness: 0.1,
    })
  }, [color, opacity])

  return <primitive object={material} attach="material" />
}
