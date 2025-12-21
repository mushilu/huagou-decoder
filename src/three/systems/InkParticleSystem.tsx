import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, BufferAttribute } from 'three'

interface InkParticleSystemProps {
  count?: number
  color?: string
  spread?: [number, number, number]
}

export function InkParticleSystem({
  count = 100,
  color = '#1a1a2e',
  spread = [10, 5, 10],
}: InkParticleSystemProps) {
  const pointsRef = useRef<Points>(null)

  useEffect(() => {
    if (!pointsRef.current) return

    // 创建粒子位置数据
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * spread[0]
      positions[i + 1] = Math.random() * spread[1]
      positions[i + 2] = (Math.random() - 0.5) * spread[2]
    }

    // 更新 geometry
    const geometry = pointsRef.current.geometry as BufferGeometry
    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    // 创建随机速度
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      velocities[i] = (Math.random() - 0.5) * 0.02
      velocities[i + 1] = Math.random() * 0.02 + 0.01
      velocities[i + 2] = (Math.random() - 0.5) * 0.02
    }
    ;(pointsRef.current as any).userData.velocities = velocities
  }, [count, spread])

  useFrame(() => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry as BufferGeometry
    const positions = geometry.attributes.position.array as Float32Array
    const velocities = (pointsRef.current as any).userData.velocities as Float32Array

    // 更新粒子位置
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]

      // 重置超出边界的粒子
      if (positions[i + 1] > spread[1]) {
        positions[i + 1] = 0
      }
    }

    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial size={0.1} sizeAttenuation color={color} transparent opacity={0.6} />
    </points>
  )
}
