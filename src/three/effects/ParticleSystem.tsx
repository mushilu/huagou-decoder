import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  size?: number
  color?: string
  opacity?: number
  spread?: [number, number, number]
  velocity?: [number, number, number]
  turbulence?: number
  lifetime?: number
  emitRate?: number
}

/**
 * 水墨飘散粒子系统
 * 模拟墨点/墨雾飘散效果
 */
export function InkParticleSystem({
  count = 100,
  size = 0.05,
  color = '#1a1a2e',
  opacity = 0.6,
  spread = [5, 5, 5],
  velocity = [0, 0.1, 0],
  turbulence = 0.02,
  lifetime = 10,
  // 预留参数
  emitRate: _emitRate = 0.1,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesData = useRef<{
    positions: Float32Array
    velocities: Float32Array
    ages: Float32Array
    sizes: Float32Array
    opacities: Float32Array
  } | null>(null)

  // 初始化粒子数据
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const ages = new Float32Array(count)
    const sizes = new Float32Array(count)
    const opacities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // 随机初始位置
      positions[i * 3] = (Math.random() - 0.5) * spread[0]
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]

      // 随机速度
      velocities[i * 3] = (Math.random() - 0.5) * 0.02 + velocity[0]
      velocities[i * 3 + 1] = Math.random() * 0.02 + velocity[1]
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02 + velocity[2]

      // 随机年龄（用于生命周期）
      ages[i] = Math.random() * lifetime

      // 随机大小
      sizes[i] = size * (0.5 + Math.random())

      // 初始不透明度
      opacities[i] = opacity * Math.random()
    }

    particlesData.current = { positions, velocities, ages, sizes, opacities }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })

    return { geometry: geo, material: mat }
  }, [count, size, color, opacity, spread, velocity, lifetime])

  useFrame((_, delta) => {
    if (!pointsRef.current || !particlesData.current) return

    const { positions, velocities, ages, opacities } = particlesData.current
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < count; i++) {
      // 更新年龄
      ages[i] += delta

      // 生命周期结束，重置粒子
      if (ages[i] > lifetime) {
        ages[i] = 0
        positions[i * 3] = (Math.random() - 0.5) * spread[0]
        positions[i * 3 + 1] = -spread[1] / 2
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
        opacities[i] = opacity
      }

      // 应用速度
      positions[i * 3] += velocities[i * 3] + (Math.random() - 0.5) * turbulence
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2] + (Math.random() - 0.5) * turbulence

      // 淡出效果
      const lifeRatio = ages[i] / lifetime
      opacities[i] = opacity * (1 - lifeRatio)
    }

    positionAttr.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

/**
 * 墨滴粒子
 */
export function InkDropParticles({
  origin = [0, 2, 0],
  count = 20,
  size = 0.1,
  color = '#1a1a2e',
  gravity = 9.8,
  spread = 0.5,
  onComplete,
}: {
  origin?: [number, number, number]
  count?: number
  size?: number
  color?: string
  gravity?: number
  spread?: number
  onComplete?: () => void
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const startTime = useRef<number | null>(null)
  const particlesData = useRef<{
    positions: Float32Array
    velocities: Float32Array
    initialY: number[]
  } | null>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const initialY: number[] = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = origin[0]
      positions[i * 3 + 1] = origin[1]
      positions[i * 3 + 2] = origin[2]

      // 随机向外的初速度
      velocities[i * 3] = (Math.random() - 0.5) * spread
      velocities[i * 3 + 1] = Math.random() * spread * 0.5
      velocities[i * 3 + 2] = (Math.random() - 0.5) * spread

      initialY.push(origin[1])
    }

    particlesData.current = { positions, velocities, initialY }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    return { geometry: geo, material: mat }
  }, [count, size, color, origin, spread])

  useFrame((_, delta) => {
    if (!pointsRef.current || !particlesData.current) return

    if (startTime.current === null) {
      startTime.current = performance.now()
    }

    const { positions, velocities } = particlesData.current
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    let allFallen = true

    for (let i = 0; i < count; i++) {
      // 应用重力
      velocities[i * 3 + 1] -= gravity * delta

      // 更新位置
      positions[i * 3] += velocities[i * 3] * delta
      positions[i * 3 + 1] += velocities[i * 3 + 1] * delta
      positions[i * 3 + 2] += velocities[i * 3 + 2] * delta

      // 检查是否落地
      if (positions[i * 3 + 1] > -2) {
        allFallen = false
      }
    }

    positionAttr.needsUpdate = true

    if (allFallen) {
      onComplete?.()
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

/**
 * 烟雾/雾气粒子系统
 */
export function FogParticles({
  position = [0, 0, 0],
  size = [10, 2, 10],
  density = 50,
  color = '#e8e4de',
  opacity = 0.3,
  speed = 0.2,
}: {
  position?: [number, number, number]
  size?: [number, number, number]
  density?: number
  color?: string
  opacity?: number
  speed?: number
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(density * 3)
    const sizes = new Float32Array(density)

    for (let i = 0; i < density; i++) {
      positions[i * 3] = (Math.random() - 0.5) * size[0]
      positions[i * 3 + 1] = Math.random() * size[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * size[2]
      sizes[i] = 0.5 + Math.random() * 1.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 1,
      transparent: true,
      opacity,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return { geometry: geo, material: mat }
  }, [density, size, color, opacity])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < density; i++) {
      // 缓慢移动
      positions.array[i * 3] += Math.sin(state.clock.elapsedTime + i) * speed * 0.01
      positions.array[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 0.5 + i) * speed * 0.005
      positions.array[i * 3 + 2] += Math.sin(state.clock.elapsedTime * 0.3 + i) * speed * 0.01

      // 边界检查
      if (Math.abs(positions.array[i * 3]) > size[0] / 2) {
        positions.array[i * 3] *= -0.9
      }
      if (positions.array[i * 3 + 1] > size[1]) {
        positions.array[i * 3 + 1] = 0
      }
      if (Math.abs(positions.array[i * 3 + 2]) > size[2] / 2) {
        positions.array[i * 3 + 2] *= -0.9
      }
    }

    positions.needsUpdate = true
  })

  return (
    <group position={position}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  )
}
