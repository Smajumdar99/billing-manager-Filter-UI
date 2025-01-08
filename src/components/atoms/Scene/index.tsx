import { FC, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const Diamond: FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 4)
    meshRef.current.rotation.y = Math.sin(t / 2)
  })

  return (
    <Float
      speed={2} 
      rotationIntensity={2} 
      floatIntensity={4}
      position={position}
    >
      <mesh ref={meshRef} castShadow receiveShadow scale={scale}>
        <octahedronGeometry args={[1]} />
        <meshPhysicalMaterial 
          color="#DC2626"
          metalness={0.9}
          roughness={0.1}
          opacity={0.8}
          transparent
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  )
}

export const Scene: FC = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-50 to-red-100/50">
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={45} />
        <color attach="background" args={['#fafafa']} />
        
        <Environment preset="city" />
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 5, 5]} 
          castShadow 
          intensity={1.5}
          shadow-mapSize={2048}
        />

        {/* Create multiple diamonds with different sizes */}
        <Diamond position={[-6, 2, -2]} scale={1.5} />
        <Diamond position={[4, -1, -3]} scale={2} />
        <Diamond position={[6, 3, -2]} scale={1.2} />
        <Diamond position={[-3, -2, -1]} scale={1.8} />
        <Diamond position={[0, 0, 0]} scale={2.5} />
        <Diamond position={[-2, 4, -2]} scale={1.3} />
        <Diamond position={[3, -3, -1]} scale={1.7} />
      </Canvas>
    </div>
  )
} 