import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls, PerspectiveCamera, FirstPersonControls as DreiFirstPersonControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import * as THREE from 'three'

interface CameraControlsProps {
  mode?: 'orbit' | 'firstPerson' | 'fly'
  target?: [number, number, number]
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  onUpdate?: (position: THREE.Vector3, target: THREE.Vector3) => void
}

/**
 * 相机控制器
 * 封装 Orbit/FirstPerson 控制模式
 */
export function CameraControls({
  mode = 'orbit',
  target = [0, 0, 0],
  minDistance = 1,
  maxDistance = 100,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI * 0.85,
  enableDamping = true,
  dampingFactor = 0.05,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 2,
  onUpdate,
}: CameraControlsProps) {
  const controlsRef = useRef<OrbitControlsType>(null)

  useFrame(() => {
    if (controlsRef.current && onUpdate) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera
      const targetVec = controlsRef.current.target
      onUpdate(camera.position, targetVec)
    }
  })

  if (mode === 'orbit') {
    return (
      <DreiOrbitControls
        ref={controlsRef}
        target={target}
        minDistance={minDistance}
        maxDistance={maxDistance}
        minPolarAngle={minPolarAngle}
        maxPolarAngle={maxPolarAngle}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        enableZoom={enableZoom}
        enablePan={enablePan}
        enableRotate={enableRotate}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />
    )
  }

  if (mode === 'firstPerson') {
    return (
      <DreiFirstPersonControls
        lookSpeed={0.1}
        movementSpeed={5}
        lookVertical
      />
    )
  }

  return null
}

/**
 * 自定义相机组件
 */
export function SceneCamera({
  position = [0, 2, 5],
  fov = 50,
  near = 0.1,
  far = 1000,
  makeDefault = true,
}: {
  position?: [number, number, number]
  fov?: number
  near?: number
  far?: number
  makeDefault?: boolean
}) {
  return (
    <PerspectiveCamera
      makeDefault={makeDefault}
      position={position}
      fov={fov}
      near={near}
      far={far}
    />
  )
}

/**
 * 相机动画控制器
 * 用于平滑过渡相机位置
 */
export function CameraAnimator({
  targetPosition,
  targetLookAt,
  duration = 1000,
  easing = 'easeInOutCubic',
  onComplete,
}: {
  targetPosition: [number, number, number]
  targetLookAt: [number, number, number]
  duration?: number
  easing?: 'linear' | 'easeInOutCubic' | 'easeOutExpo'
  onComplete?: () => void
}) {
  const { camera } = useThree()
  const startTime = useRef<number | null>(null)
  const startPosition = useRef(new THREE.Vector3())
  const startLookAt = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())
  const isAnimating = useRef(false)

  const easingFunctions = {
    linear: (t: number) => t,
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutExpo: (t: number) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  }

  useEffect(() => {
    startPosition.current.copy(camera.position)
    camera.getWorldDirection(startLookAt.current)
    startLookAt.current.add(camera.position)
    startTime.current = null
    isAnimating.current = true
  }, [targetPosition, targetLookAt, camera])

  useFrame((_state, _delta) => {
    if (!isAnimating.current) return

    if (startTime.current === null) {
      startTime.current = performance.now()
    }

    const elapsed = performance.now() - startTime.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFunctions[easing](progress)

    // 插值位置
    camera.position.lerpVectors(
      startPosition.current,
      new THREE.Vector3(...targetPosition),
      easedProgress
    )

    // 插值朝向
    currentLookAt.current.lerpVectors(
      startLookAt.current,
      new THREE.Vector3(...targetLookAt),
      easedProgress
    )
    camera.lookAt(currentLookAt.current)

    if (progress >= 1) {
      isAnimating.current = false
      onComplete?.()
    }
  })

  return null
}

/**
 * 相机路径动画
 */
export function CameraPath({
  points,
  duration = 5000,
  loop = false,
  onProgress,
  onComplete,
}: {
  points: Array<{
    position: [number, number, number]
    lookAt: [number, number, number]
  }>
  duration?: number
  loop?: boolean
  onProgress?: (progress: number) => void
  onComplete?: () => void
}) {
  const { camera } = useThree()
  const startTime = useRef<number | null>(null)

  useFrame(() => {
    if (points.length < 2) return

    if (startTime.current === null) {
      startTime.current = performance.now()
    }

    const elapsed = performance.now() - startTime.current
    let progress = elapsed / duration

    if (progress >= 1) {
      if (loop) {
        startTime.current = performance.now()
        progress = 0
      } else {
        progress = 1
        onComplete?.()
      }
    }

    onProgress?.(progress)

    // 计算当前段
    const totalSegments = points.length - 1
    const segmentProgress = progress * totalSegments
    const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1)
    const segmentT = segmentProgress - segmentIndex

    const from = points[segmentIndex]
    const to = points[segmentIndex + 1]

    // 插值
    camera.position.lerpVectors(
      new THREE.Vector3(...from.position),
      new THREE.Vector3(...to.position),
      segmentT
    )

    const lookAtTarget = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...from.lookAt),
      new THREE.Vector3(...to.lookAt),
      segmentT
    )
    camera.lookAt(lookAtTarget)
  })

  return null
}

/**
 * 相机抖动效果
 */
export function CameraShake({
  intensity = 0.5,
  decay = true,
  decayRate = 0.95,
}: {
  intensity?: number
  decay?: boolean
  decayRate?: number
}) {
  const { camera } = useThree()
  const originalPosition = useRef(new THREE.Vector3())
  const currentIntensity = useRef(intensity)

  useEffect(() => {
    originalPosition.current.copy(camera.position)
    currentIntensity.current = intensity
  }, [camera, intensity])

  useFrame(() => {
    if (currentIntensity.current < 0.001) return

    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * currentIntensity.current,
      (Math.random() - 0.5) * currentIntensity.current,
      (Math.random() - 0.5) * currentIntensity.current
    )

    camera.position.copy(originalPosition.current).add(offset)

    if (decay) {
      currentIntensity.current *= decayRate
    }
  })

  return null
}
