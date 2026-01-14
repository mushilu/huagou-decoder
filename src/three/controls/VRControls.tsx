import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { createXRStore, XR } from '@react-three/xr'

interface VRModeProps {
  children: ReactNode
  onEnterVR?: () => void
  onExitVR?: () => void
}

const xrStore = createXRStore()

// VR 模式包装组件
export function VRMode({
  children,
  onEnterVR,
  onExitVR,
}: VRModeProps) {
  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      if (state.session) {
        onEnterVR?.()
      } else {
        onExitVR?.()
      }
    })
    return unsubscribe
  }, [onEnterVR, onExitVR])

  return (
    <XR store={xrStore}>
      {children}
    </XR>
  )
}

// VR 进入按钮
export function VREnterButton({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(setSupported)
    }
  }, [])

  const enterVR = useCallback(async () => {
    try {
      await xrStore.enterVR()
    } catch (error) {
      console.error('Failed to enter VR:', error)
    }
  }, [])

  if (!supported) return null

  return (
    <button
      onClick={enterVR}
      className={className}
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        background: '#c73e3e',
        color: '#f5f0e8',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        zIndex: 100,
      }}
    >
      {children || '进入 VR 模式'}
    </button>
  )
}

// AR 进入按钮
export function AREnterButton({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then(setSupported)
    }
  }, [])

  const enterAR = useCallback(async () => {
    try {
      await xrStore.enterAR()
    } catch (error) {
      console.error('Failed to enter AR:', error)
    }
  }, [])

  if (!supported) return null

  return (
    <button
      onClick={enterAR}
      className={className}
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        background: '#2d5a7b',
        color: '#f5f0e8',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        zIndex: 100,
      }}
    >
      {children || '进入 AR 模式'}
    </button>
  )
}

// VR 传送点
export function TeleportPoint({
  position,
  onTeleport,
}: {
  position: [number, number, number]
  onTeleport?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback(() => {
    onTeleport?.()
  }, [onTeleport])

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial
          color={hovered ? '#c73e3e' : '#2d5a7b'}
          transparent
          opacity={0.8}
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.3, 1, 16]} />
        <meshBasicMaterial
          color={hovered ? '#c73e3e' : '#2d5a7b'}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

// VR 信息面板
export function VRInfoPanel({
  position = [0, 1.5, -1],
  rotation = [0, 0, 0],
  width = 1,
  height = 0.6,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[width + 0.02, height + 0.02]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#f5f0e8" transparent opacity={0.95} />
      </mesh>
    </group>
  )
}

// 检查 WebXR 支持
export function useWebXRSupport() {
  const [supported, setSupported] = useState<{
    vr: boolean
    ar: boolean
    checked: boolean
  }>({
    vr: false,
    ar: false,
    checked: false,
  })

  useEffect(() => {
    const checkSupport = async () => {
      if (!navigator.xr) {
        setSupported({ vr: false, ar: false, checked: true })
        return
      }

      const [vrSupported, arSupported] = await Promise.all([
        navigator.xr.isSessionSupported('immersive-vr').catch(() => false),
        navigator.xr.isSessionSupported('immersive-ar').catch(() => false),
      ])

      setSupported({
        vr: vrSupported,
        ar: arSupported,
        checked: true,
      })
    }

    checkSupport()
  }, [])

  return supported
}

export { xrStore }
