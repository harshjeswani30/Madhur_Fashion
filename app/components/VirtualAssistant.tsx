// 3D Virtual Assistant component with Ready Player Me model
// Displays an interactive 3D avatar that responds to user interactions
// URL: https://models.readyplayer.me/688219d2103749f587d3f6a8.glb

'use client'

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useTheme } from './ThemeProvider'
import * as THREE from 'three'

function AvatarModel() {
  const { scene } = useGLTF('https://models.readyplayer.me/688219d2103749f587d3f6a8.glb')
  const modelRef = useRef<THREE.Group>(null)
  
  // Clone the scene to avoid conflicts
  const clonedScene = scene.clone()
  
  return (
    <group ref={modelRef}>
      <primitive 
        object={clonedScene} 
        scale={1.8} 
        position={[0, -1.8, 0]} 
        rotation={[0, 0, 0]}
      />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  )
}

export default function VirtualAssistant() {
  const { theme } = useTheme()
  
  return (
    <div 
      className={`w-full h-full rounded-lg overflow-hidden border ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-purple-500/30' 
          : 'bg-gradient-to-b from-gray-100 to-white border-gray-200'
      }`}
    >
      <Canvas 
        camera={{ 
          position: [0, 0, 4], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[2, 5, 2]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#8b5cf6" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* 3D Model */}
        <Suspense fallback={<LoadingFallback />}>
          <AvatarModel />
        </Suspense>
        
        {/* Ground shadow */}
        <ContactShadows 
          position={[0, -1.8, 0]} 
          opacity={0.3} 
          scale={3} 
          blur={2} 
          far={1.8} 
        />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={false}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Model Info Overlay */}
      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs ${
        theme === 'dark' 
          ? 'bg-black/50 text-gray-300' 
          : 'bg-white/80 text-gray-600'
      }`}>
        AI Fashion Assistant
      </div>
    </div>
  )
}
