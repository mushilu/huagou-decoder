import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

interface LODLevel {
  url: string
  distance: number
}

interface LODControllerProps {
  levels: LODLevel[]
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
  onLevelChange?: (level: number) => void
}

/**
 * LOD 多级细节控制器
 * 根据相机距离自动切换不同精度的模型
 */
export function LODController({
  levels,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  onLevelChange,
}: LODControllerProps) {
  const groupRef = useRef<Group>(null)
  const lodRef = useRef<THREE.LOD>(null)
  const { camera } = useThree()
  const [currentLevel, setCurrentLevel] = useState(0)

  // 预加载所有 LOD 级别的模型
  const models = levels.map((level) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { scene } = useGLTF(level.url)
    return { scene: scene.clone(), distance: level.distance }
  })

  // 创建 LOD 对象
  const lod = useMemo(() => {
    const lodObject = new THREE.LOD()

    models.forEach(({ scene, distance }) => {
      // 设置阴影
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh
          mesh.castShadow = castShadow
          mesh.receiveShadow = receiveShadow
        }
      })

      lodObject.addLevel(scene, distance)
    })

    return lodObject
  }, [models, castShadow, receiveShadow])

  // 更新 LOD
  useFrame(() => {
    if (lodRef.current) {
      lodRef.current.update(camera)

      // 检测当前级别变化
      const newLevel = lodRef.current.getCurrentLevel()
      if (newLevel !== currentLevel) {
        setCurrentLevel(newLevel)
        onLevelChange?.(newLevel)
      }
    }
  })

  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scaleArray as [number, number, number]}
    >
      <primitive ref={lodRef} object={lod} />
    </group>
  )
}

/**
 * 简化的 LOD 组件
 * 只有两个级别：高质量和低质量
 */
export function SimpleLOD({
  highUrl,
  lowUrl,
  threshold = 10,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  highUrl: string
  lowUrl: string
  threshold?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}) {
  return (
    <LODController
      levels={[
        { url: highUrl, distance: 0 },
        { url: lowUrl, distance: threshold },
      ]}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

/**
 * 基于视锥体的可见性控制
 */
export function FrustumCulled({
  children,
  boundingRadius = 1,
}: {
  children: React.ReactNode
  boundingRadius?: number
}) {
  const groupRef = useRef<Group>(null)
  const [visible, setVisible] = useState(true)
  const { camera } = useThree()

  const frustum = useMemo(() => new THREE.Frustum(), [])
  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const sphere = useMemo(() => new THREE.Sphere(), [])

  useFrame(() => {
    if (!groupRef.current) return

    // 更新视锥体
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    // 检查边界球是否在视锥体内
    groupRef.current.getWorldPosition(sphere.center)
    sphere.radius = boundingRadius

    const isVisible = frustum.intersectsSphere(sphere)
    if (isVisible !== visible) {
      setVisible(isVisible)
    }
  })

  return (
    <group ref={groupRef} visible={visible}>
      {children}
    </group>
  )
}

/**
 * 距离淡出组件
 * 根据距离逐渐降低透明度
 */
export function DistanceFade({
  children,
  fadeStart = 20,
  fadeEnd = 50,
}: {
  children: React.ReactNode
  fadeStart?: number
  fadeEnd?: number
}) {
  const groupRef = useRef<Group>(null)
  const { camera } = useThree()
  const [opacity, setOpacity] = useState(1)

  useFrame(() => {
    if (!groupRef.current) return

    const position = new THREE.Vector3()
    groupRef.current.getWorldPosition(position)
    const distance = camera.position.distanceTo(position)

    let newOpacity = 1
    if (distance > fadeStart) {
      newOpacity = Math.max(0, 1 - (distance - fadeStart) / (fadeEnd - fadeStart))
    }

    if (Math.abs(newOpacity - opacity) > 0.01) {
      setOpacity(newOpacity)

      // 更新所有子网格的透明度
      groupRef.current.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh
          const material = mesh.material as THREE.MeshStandardMaterial
          if (material) {
            material.transparent = true
            material.opacity = newOpacity
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {children}
    </group>
  )
}

/**
 * LOD 级别指示器 Hook
 */
export function useLODLevel(position: [number, number, number], thresholds: number[]) {
  const { camera } = useThree()
  const [level, setLevel] = useState(0)
  const positionVec = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame(() => {
    const distance = camera.position.distanceTo(positionVec)

    let newLevel = 0
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (distance > thresholds[i]) {
        newLevel = i + 1
        break
      }
    }

    if (newLevel !== level) {
      setLevel(newLevel)
    }
  })

  return level
}
