import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Coin = ({ position }) => {
  const coinRef = useRef();
  const sparklesRef = useRef();
  
  // Rotate coin and sparkles
  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.z += 2 * delta;
    }
    
    if (sparklesRef.current) {
      sparklesRef.current.rotation.z -= 1.5 * delta;
    }
  });
  
  return (
    <group position={position}>
      {/* Main coin body */}
      <mesh ref={coinRef} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial 
          color="#ffd700"
          metalness={0.8}
          roughness={0.3}
          emissive="#ffa500"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Coin detail (inner circle) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.11, 16]} />
        <meshStandardMaterial 
          color="#ffe866"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight 
        color="#ffa500"
        intensity={1}
        distance={2}
      />
      
      {/* Simple sparkle effect using small boxes */}
      <group ref={sparklesRef}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i / 8 * Math.PI * 2) * 0.6,
              Math.cos(i / 8 * Math.PI * 2) * 0.6,
              0
            ]}
            scale={0.05}
          >
            <boxGeometry />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default Coin;