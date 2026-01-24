import { useState, useEffect, useCallback, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { Group, Object3D, Camera } from 'three'
import * as THREE from 'three'

// 模型加载 Hook
export function useModel(url: string) {
  const { scene, animations } = useGLTF(url)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (scene) {
      setIsLoaded(true)
    }
  }, [scene])

  return {
    scene,
    animations,
    isLoaded,
  }
}

// 场景状态 Hook
export function useScene() {
  const { gl, scene, camera, size, viewport, clock } = useThree()

  return {
    renderer: gl,
    scene,
    camera,
    size,
    viewport,
    clock,
    aspect: size.width / size.height,
  }
}

// 性能监控 Hook
export function usePerformance() {
  const [fps, setFps] = useState(60)
  const [drawCalls, setDrawCalls] = useState(0)
  const [triangles, setTriangles] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const { gl } = useThree()

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const elapsed = now - lastTime.current

    if (elapsed >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / elapsed))
      setDrawCalls(gl.info.render.calls)
      setTriangles(gl.info.render.triangles)
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return { fps, drawCalls, triangles }
}

// 鼠标拾取 Hook
export function useRaycast() {
  const { camera, scene, size } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  const raycast = useCallback(
    (clientX: number, clientY: number, objects?: Object3D[]) => {
      mouse.current.x = (clientX / size.width) * 2 - 1
      mouse.current.y = -(clientY / size.height) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera as Camera)

      const targets = (objects || scene.children) as any[]
      return raycaster.current.intersectObjects(targets, true)
    },
    [camera, scene, size]
  )

  return { raycast }
}

// 对象选择 Hook
export function useSelection<T extends Object3D>() {
  const [selected, setSelected] = useState<T | null>(null)
  const [hovered, setHovered] = useState<T | null>(null)

  const select = useCallback((object: T | null) => {
    setSelected(object)
  }, [])

  const hover = useCallback((object: T | null) => {
    setHovered(object)
  }, [])

  const clear = useCallback(() => {
    setSelected(null)
    setHovered(null)
  }, [])

  return {
    selected,
    hovered,
    select,
    hover,
    clear,
  }
}

// 动画控制 Hook
export function useAnimations(animations: THREE.AnimationClip[], ref: React.RefObject<Group>) {
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const actions = useRef<Map<string, THREE.AnimationAction>>(new Map())

  useEffect(() => {
    if (!ref.current || animations.length === 0) return

    mixer.current = new THREE.AnimationMixer(ref.current)

    animations.forEach((clip) => {
      const action = mixer.current!.clipAction(clip)
      actions.current.set(clip.name, action)
    })

    return () => {
      mixer.current?.stopAllAction()
      actions.current.clear()
    }
  }, [animations, ref])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
  })

  const play = useCallback((name: string, options?: { loop?: boolean; clampWhenFinished?: boolean }) => {
    const action = actions.current.get(name)
    if (action) {
      if (options?.loop === false) {
        action.setLoop(THREE.LoopOnce, 1)
      }
      if (options?.clampWhenFinished) {
        action.clampWhenFinished = true
      }
      action.reset().play()
    }
  }, [])

  const stop = useCallback((name: string) => {
    const action = actions.current.get(name)
    action?.stop()
  }, [])

  const pause = useCallback((name: string) => {
    const action = actions.current.get(name)
    if (action) {
      action.paused = true
    }
  }, [])

  const resume = useCallback((name: string) => {
    const action = actions.current.get(name)
    if (action) {
      action.paused = false
    }
  }, [])

  return {
    play,
    stop,
    pause,
    resume,
    actions: actions.current,
  }
}

// 相机距离 Hook
export function useCameraDistance(targetPosition: [number, number, number]) {
  const { camera } = useThree()
  const [distance, setDistance] = useState(0)
  const target = useRef(new THREE.Vector3(...targetPosition))

  useFrame(() => {
    const newDistance = camera.position.distanceTo(target.current)
    if (Math.abs(newDistance - distance) > 0.1) {
      setDistance(newDistance)
    }
  })

  return distance
}

// 鼠标转3D坐标
export function useMouseToWorld(planeHeight = 0) {
  const { camera, size } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeHeight))
  const intersection = useRef(new THREE.Vector3())

  const getWorldPosition = useCallback(
    (clientX: number, clientY: number) => {
      mouse.current.x = (clientX / size.width) * 2 - 1
      mouse.current.y = -(clientY / size.height) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera as Camera)
      raycaster.current.ray.intersectPlane(plane.current, intersection.current)

      return intersection.current.clone()
    },
    [camera, size]
  )

  return { getWorldPosition }
}

// 窗口可见性 Hook
export function useVisibility() {
  const [visible, setVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return visible
}

// 帧率限制 Hook
export function useThrottledFrame(callback: (delta: number) => void, fps = 30) {
  const lastTime = useRef(0)
  const interval = 1000 / fps

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime * 1000
    if (now - lastTime.current >= interval) {
      callback(delta)
      lastTime.current = now
    }
  })
}
