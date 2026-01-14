import { Suspense, useRef, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import type { Group } from 'three'
import { cn } from '@/lib/utils'
import { InkLoading } from '@/components/ink'

interface SceneManagerProps {
  children: ReactNode
  className?: string
  environment?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby' | null
  shadows?: boolean
  dpr?: [number, number]
  camera?: {
    position?: [number, number, number]
    fov?: number
    near?: number
    far?: number
  }
  onCreated?: () => void
  performance?: 'high' | 'medium' | 'low'
}

// 场景管理器
export function SceneManager({
  children,
  className,
  environment = 'studio',
  shadows = true,
  dpr = [1, 2],
  camera = {
    position: [0, 2, 5],
    fov: 50,
    near: 0.1,
    far: 1000,
  },
  onCreated,
  performance = 'high',
}: SceneManagerProps) {
  const performanceConfig = {
    high: { dpr: [1, 2] as [number, number], antialias: true },
    medium: { dpr: [1, 1.5] as [number, number], antialias: true },
    low: { dpr: [0.5, 1] as [number, number], antialias: false },
  }

  const config = performanceConfig[performance]

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Suspense fallback={<SceneLoadingFallback />}>
        <Canvas
          shadows={shadows}
          dpr={dpr || config.dpr}
          camera={camera}
          gl={{
            antialias: config.antialias,
            alpha: true,
            powerPreference: performance === 'low' ? 'low-power' : 'high-performance',
          }}
          onCreated={(state) => {
            state.gl.toneMapping = 1
            state.gl.toneMappingExposure = 1.2
            onCreated?.()
          }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow={shadows}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {environment && (
            <Environment preset={environment} background={false} />
          )}

          {children}

          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}

function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-paper-white">
      <InkLoading size="lg" variant="brush" text="加载3D场景..." />
    </div>
  )
}

export function SceneGroup({
  children,
  name,
  visible = true,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  children: ReactNode
  name?: string
  visible?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}) {
  const groupRef = useRef<Group>(null)

  return (
    <group
      ref={groupRef}
      name={name}
      visible={visible}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {children}
    </group>
  )
}

export function PerformanceMonitor({
  enabled = true,
  onPerformanceChange,
}: {
  enabled?: boolean
  onPerformanceChange?: (fps: number) => void
}) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    if (!enabled) return

    frameCount.current++
    const now = performance.now()
    const elapsed = now - lastTime.current

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed)
      onPerformanceChange?.(fps)
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return null
}

export function useSceneState() {
  const { gl, scene, camera, size, viewport } = useThree()

  return {
    renderer: gl,
    scene,
    camera,
    size,
    viewport,
    aspect: size.width / size.height,
  }
}
