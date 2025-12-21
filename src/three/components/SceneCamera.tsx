import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'

interface SceneCameraProps {
  position?: [number, number, number]
  lookAt?: [number, number, number]
}

export function SceneCamera({ position = [0, 1.6, 0], lookAt = [0, 1, -5] }: SceneCameraProps) {
  const { camera } = useThree()

  useEffect(() => {
    if (!camera) return

    // 设置相机类型为透视相机
    if (camera instanceof PerspectiveCamera) {
      camera.fov = 75
      camera.near = 0.1
      camera.far = 1000
    }

    // 设置相机位置和朝向
    camera.position.set(...position)
    camera.lookAt(...lookAt)
    camera.updateProjectionMatrix()
  }, [camera, position, lookAt])

  return null
}
