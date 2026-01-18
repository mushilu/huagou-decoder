import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// 水墨Shader
const InkMaterial = shaderMaterial(
  {
    // Uniforms
    uTime: 0,
    uColor: new THREE.Color('#1a1a2e'),
    uOutlineColor: new THREE.Color('#000000'),
    uOutlineWidth: 0.02,
    uSteps: 4,
    uNoiseScale: 0.5,
    uNoiseStrength: 0.1,
    uLightDirection: new THREE.Vector3(1, 1, 1).normalize(),
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uOutlineColor;
    uniform float uOutlineWidth;
    uniform float uSteps;
    uniform float uNoiseScale;
    uniform float uNoiseStrength;
    uniform vec3 uLightDirection;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // 简化的噪声函数
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      // 计算光照
      float NdotL = dot(vNormal, uLightDirection);

      // 阶梯化光照（赛璐璐效果）
      float stepSize = 1.0 / uSteps;
      float steppedLight = floor(NdotL / stepSize) * stepSize;
      steppedLight = clamp(steppedLight, 0.2, 1.0);

      // 添加噪声纹理（水墨效果）
      vec2 noiseCoord = vUv * uNoiseScale + uTime * 0.01;
      float n = noise(noiseCoord * 10.0);
      float inkNoise = n * uNoiseStrength;

      // 边缘检测（描边效果）
      float edge = 1.0 - abs(dot(vNormal, normalize(-vPosition)));
      edge = smoothstep(1.0 - uOutlineWidth, 1.0, edge);

      // 混合颜色
      vec3 baseColor = uColor * (steppedLight + inkNoise);
      vec3 finalColor = mix(baseColor, uOutlineColor, edge);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

// 扩展 Three.js 材质类型
extend({ InkMaterial })

// 声明类型以支持 JSX
type InkMaterialProps = {
  ref?: React.Ref<any>
  uTime?: number
  uColor?: THREE.Color
  uOutlineColor?: THREE.Color
  uOutlineWidth?: number
  uSteps?: number
  uNoiseScale?: number
  uNoiseStrength?: number
  uLightDirection?: THREE.Vector3
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    inkMaterial: InkMaterialProps
  }
}

interface InkShaderProps {
  color?: string
  outlineColor?: string
  outlineWidth?: number
  steps?: number
  noiseScale?: number
  noiseStrength?: number
  animated?: boolean
}

// 水墨风格材质组件
export function InkShaderMaterial({
  color = '#1a1a2e',
  outlineColor = '#000000',
  outlineWidth = 0.02,
  steps = 4,
  noiseScale = 0.5,
  noiseStrength = 0.1,
  animated = true,
}: InkShaderProps) {
  const materialRef = useRef<any>(null)

  useFrame((state) => {
    if (materialRef.current && animated) {
      materialRef.current.uTime = state.clock.elapsedTime
    }
  })

  return (
    <inkMaterial
      ref={materialRef}
      uColor={new THREE.Color(color)}
      uOutlineColor={new THREE.Color(outlineColor)}
      uOutlineWidth={outlineWidth}
      uSteps={steps}
      uNoiseScale={noiseScale}
      uNoiseStrength={noiseStrength}
    />
  )
}

// 水墨描边后处理效果
export function InkOutlineEffect(_props: {
  color?: string
  thickness?: number
}) {
  // 用postprocessing
  return null
}

// 简化的水墨材质
export function SimplifiedInkMaterial({
  color = '#1a1a2e',
  gradientSteps = 4,
}: {
  color?: string
  gradientSteps?: number
}) {
  const gradientMap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = gradientSteps
    canvas.height = 1
    const ctx = canvas.getContext('2d')!

    for (let i = 0; i < gradientSteps; i++) {
      const value = Math.floor((i / (gradientSteps - 1)) * 255)
      ctx.fillStyle = `rgb(${value}, ${value}, ${value})`
      ctx.fillRect(i, 0, 1, 1)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    return texture
  }, [gradientSteps])

  return (
    <meshToonMaterial
      color={color}
      gradientMap={gradientMap}
    />
  )
}

// 毛笔笔触效果材质
export function BrushStrokeMaterial({
  color = '#1a1a2e',
  roughness = 0.8,
}: {
  color?: string
  strokeWidth?: number
  roughness?: number
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.1}
    />
  )
}
