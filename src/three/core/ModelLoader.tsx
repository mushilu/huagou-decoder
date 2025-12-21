import { useRef, useState, useEffect, Suspense } from 'react'
import { useGLTF, Clone } from '@react-three/drei'
import type { Group, Mesh, Material } from 'three'
import * as THREE from 'three'

interface ModelLoaderProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
  onLoad?: (model: Group) => void
  clone?: boolean
}

/**
 * GLB/GLTF 模型加载器
 * 支持 DRACO 和 Meshopt 压缩
 */
export function ModelLoader({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  onLoad,
  clone = false,
}: ModelLoaderProps) {
  const groupRef = useRef<Group>(null)
  const shadowStateRef = useRef<{ castShadow: boolean; receiveShadow: boolean } | null>(null)

  // 使用 drei 的 useGLTF hook (DRACO 和 Meshopt 自动处理)
  const { scene } = useGLTF(url)

  useEffect(() => {
    if (!scene) return

    // 仅在阴影设置实际改变时才重新遍历模型树
    const shadowChanged =
      !shadowStateRef.current ||
      shadowStateRef.current.castShadow !== castShadow ||
      shadowStateRef.current.receiveShadow !== receiveShadow

    if (shadowChanged) {
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh
          mesh.castShadow = castShadow
          mesh.receiveShadow = receiveShadow
        }
      })
      shadowStateRef.current = { castShadow, receiveShadow }
    }

    onLoad?.(scene as Group)
  }, [scene, castShadow, receiveShadow, onLoad])

  const scaleArray = typeof scale === 'number' ? [scale, scale, scale] : scale

  if (clone) {
    return (
      <Clone
        ref={groupRef as any}
        object={scene as any}
        position={position}
        rotation={rotation}
        scale={scaleArray as [number, number, number]}
      />
    )
  }

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scaleArray}
    />
  )
}

/**
 * 带加载状态的模型容器
 */
export function ModelWithFallback({
  url,
  fallback,
  ...props
}: ModelLoaderProps & { fallback?: React.ReactNode }) {
  return (
    <Suspense fallback={fallback || <ModelPlaceholder />}>
      <ModelLoader url={url} {...props} />
    </Suspense>
  )
}

/**
 * 模型占位符
 */
function ModelPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e8e4de" wireframe />
    </mesh>
  )
}

/**
 * 模型预加载 Hook
 */
export function useModelPreload(urls: string[]) {
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (urls.length === 0) {
      setLoaded(true)
      setProgress(100)
      return
    }

    let isMounted = true

    // 使用 Promise.all 正确处理异步预加载
    Promise.allSettled(
      urls.map((url, index) => {
        return new Promise<void>((resolve) => {
          useGLTF.preload(url)
          // 异步更新进度
          if (isMounted) {
            setProgress(((index + 1) / urls.length) * 100)
          }
          resolve()
        })
      })
    ).then(() => {
      if (isMounted) {
        setLoaded(true)
        setProgress(100)
      }
    })

    return () => {
      isMounted = false
    }
  }, [urls])

  return { loaded, progress }
}

/**
 * 模型实例化组件
 * 用于高效渲染大量相同模型
 */
export function InstancedModel({
  url,
  instances,
  castShadow = true,
  receiveShadow = true,
}: {
  url: string
  instances: Array<{
    position: [number, number, number]
    rotation?: [number, number, number]
    scale?: number | [number, number, number]
  }>
  castShadow?: boolean
  receiveShadow?: boolean
}) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const rotation = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    instances.forEach((instance, i) => {
      position.set(...instance.position)

      if (instance.rotation) {
        rotation.set(...instance.rotation)
        quaternion.setFromEuler(rotation)
      } else {
        quaternion.identity()
      }

      if (instance.scale) {
        if (typeof instance.scale === 'number') {
          scale.set(instance.scale, instance.scale, instance.scale)
        } else {
          scale.set(...instance.scale)
        }
      } else {
        scale.set(1, 1, 1)
      }

      matrix.compose(position, quaternion, scale)
      meshRef.current!.setMatrixAt(i, matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [instances])

  // 从场景中提取第一个网格的几何体和材质
  let geometry: THREE.BufferGeometry | undefined
  let material: Material | undefined

  scene.traverse((child) => {
    if ((child as Mesh).isMesh && !geometry) {
      const mesh = child as Mesh
      geometry = mesh.geometry
      material = mesh.material as Material
    }
  })

  if (!geometry || !material) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instances.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

// 预加载函数
export const preloadModel = useGLTF.preload
