import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'

type AnimationState = 'idle' | 'talking'

interface Guide3DProps {
  position?: [number, number, number]
  scale?: number
  isTalking?: boolean
  onClick?: () => void
  showSpeechBubble?: boolean
  speechText?: string
}

function GuideModel({
  position = [0, 0, 0],
  scale = 1,
  isTalking = false,
  onClick,
  showSpeechBubble = false,
  speechText = '点击我开始对话',
}: Guide3DProps) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/models/guide.glb')

  const [hovered, setHovered] = useState(false)
  const [animState, setAnimState] = useState<AnimationState>('idle')

  const timeRef = useRef(0)
  const talkTimeRef = useRef(0)

  useEffect(() => {
    setAnimState(isTalking ? 'talking' : 'idle')
  }, [isTalking])

  // 克隆场景以避免多实例问题
  const clonedScene = scene.clone()

  useFrame((_, delta) => {
    if (!groupRef.current) return

    timeRef.current += delta
    const t = timeRef.current

    // 呼吸动画
    const breathe = Math.sin(t * 1.2) * 0.005
    groupRef.current.position.y = position[1] + breathe

    // 说话时轻微摇晃
    if (animState === 'talking') {
      talkTimeRef.current += delta
      groupRef.current.rotation.y = Math.sin(talkTimeRef.current * 3) * 0.03
    } else {
      talkTimeRef.current = 0
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02
    }

    // 悬停效果
    const targetScale = hovered ? scale * 1.03 : scale
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D模型 */}
      <primitive object={clonedScene} />

      {/* 对话气泡 */}
      {showSpeechBubble && (
        <Html
          position={[0.5, 1.8, 0]}
          center
          distanceFactor={1.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="relative bg-paper-white rounded-xl px-4 py-2.5 shadow-xl border border-ink-gray/10 whitespace-nowrap text-sm text-ink-black">
            {speechText}
            <div className="absolute left-0 bottom-2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-paper-white border-b-[6px] border-b-transparent" />
          </div>
        </Html>
      )}

      {/* 悬停光晕 */}
      {hovered && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#c9a227" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  )
}

export function Guide3D(props: Guide3DProps) {
  return (
    <Suspense fallback={null}>
      <GuideModel {...props} />
    </Suspense>
  )
}

// 预加载模型
useGLTF.preload('/models/guide.glb')

export const guidePresets = {
  scholar: {
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
  },
  mini: {
    scale: 0.6,
    position: [0, 0, 0] as [number, number, number],
  },
  large: {
    scale: 1.3,
    position: [0, 0, 0] as [number, number, number],
  },
}
