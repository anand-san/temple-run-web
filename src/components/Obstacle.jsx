import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Obstacle = ({ position, type }) => {
  // References for animation
  const obstacleRef = useRef();
  const partsRefs = useRef([]);
  
  // Use frame to animate the obstacles
  useFrame((state, delta) => {
    if (obstacleRef.current) {
      const time = state.clock.getElapsedTime();
      
      switch (type) {
        case 0: // T-Rex - animate head and tail
          if (partsRefs.current[0]) { // Head
            partsRefs.current[0].rotation.y = Math.sin(time * 2) * 0.2;
          }
          if (partsRefs.current[1]) { // Tail
            partsRefs.current[1].rotation.y = Math.sin(time * 3 + 1) * 0.3;
          }
          break;
          
        case 1: // Lion - animate head and body
          if (partsRefs.current[0]) { // Head
            partsRefs.current[0].rotation.y = Math.sin(time * 2.5) * 0.15;
          }
          if (obstacleRef.current) { // Body movement
            obstacleRef.current.position.y = position[1] + Math.sin(time * 5) * 0.05;
          }
          break;
          
        case 2: // Chimpanzee - jumping and arm movement
          if (obstacleRef.current) {
            // Jump up and down
            obstacleRef.current.position.y = position[1] + Math.abs(Math.sin(time * 6)) * 0.3;
          }
          
          // Arm movement
          if (partsRefs.current[1] && partsRefs.current[2]) {
            partsRefs.current[1].rotation.x = Math.sin(time * 8) * 0.5 - 0.2; // Left arm
            partsRefs.current[2].rotation.x = Math.sin(time * 8 + Math.PI) * 0.5 - 0.2; // Right arm
          }
          break;
      }
    }
  });
  
  switch (type) {
    case 0: // T-Rex
      return (
        <group ref={obstacleRef} position={position} castShadow>
          {/* T-Rex Body */}
          <mesh castShadow position={[0, 0.7, 0]} scale={[1, 1, 1.8]}>
            <boxGeometry args={[1.2, 1.4, 1]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          
          {/* T-Rex Head */}
          <mesh ref={el => partsRefs.current[0] = el} castShadow position={[0, 1.2, 1]} scale={[0.7, 0.7, 1.2]}>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.7} />
            
            {/* Mouth */}
            <mesh position={[0, -0.25, 0.5]} scale={[0.8, 0.3, 0.3]}>
              <boxGeometry />
              <meshStandardMaterial color="#5D4037" roughness={0.7} />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.25, 0.1, 0.5]} scale={[0.1, 0.15, 0.1]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.25, 0.1, 0.5]} scale={[0.1, 0.15, 0.1]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            
            {/* Pupils */}
            <mesh position={[0.25, 0.1, 0.55]} scale={[0.05, 0.07, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[-0.25, 0.1, 0.55]} scale={[0.05, 0.07, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
          </mesh>
          
          {/* T-Rex Tail */}
          <mesh ref={el => partsRefs.current[1] = el} castShadow position={[0, 0.6, -1]} scale={[0.6, 0.6, 1]}>
            <boxGeometry args={[0.6, 0.6, 1.5]} />
            <meshStandardMaterial color="#5D4037" roughness={0.8} />
          </mesh>
          
          {/* T-Rex Legs */}
          <mesh castShadow position={[0.4, 0, 0.2]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, 0.2]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.4, 0, -0.5]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, -0.5]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
        </group>
      );
      
    case 1: // Lion
      return (
        <group ref={obstacleRef} position={position} castShadow>
          {/* Lion Body */}
          <mesh castShadow position={[0, 0.6, 0]} scale={[1, 0.9, 1.5]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#D4A056" roughness={0.8} />
          </mesh>
          
          {/* Lion Head */}
          <mesh ref={el => partsRefs.current[0] = el} castShadow position={[0, 0.9, 0.9]} scale={[0.9, 0.9, 0.9]}>
            <sphereGeometry />
            <meshStandardMaterial color="#C19A5B" roughness={0.7} />
            
            {/* Lion Mane */}
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const radius = 0.7;
              
              return (
                <mesh 
                  key={`mane-${i}`} 
                  position={[
                    Math.cos(angle) * radius * 0.5,
                    Math.sin(angle) * radius * 0.5,
                    Math.min(Math.cos(angle), 0) * 0.2
                  ]} 
                  scale={[0.2, 0.2, 0.1]}
                  rotation={[0, 0, angle]}
                  castShadow
                >
                  <boxGeometry />
                  <meshStandardMaterial color="#8D6E63" roughness={0.9} />
                </mesh>
              );
            })}
            
            {/* Eyes */}
            <mesh position={[0.25, 0.2, 0.6]} scale={[0.1, 0.15, 0.1]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.25, 0.2, 0.6]} scale={[0.1, 0.15, 0.1]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            
            {/* Pupils */}
            <mesh position={[0.25, 0.2, 0.65]} scale={[0.05, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[-0.25, 0.2, 0.65]} scale={[0.05, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            
            {/* Nose */}
            <mesh position={[0, 0, 0.75]} scale={[0.2, 0.15, 0.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#5D4037" roughness={0.7} />
            </mesh>
          </mesh>
          
          {/* Lion Legs */}
          <mesh castShadow position={[0.4, 0, 0.5]} scale={[0.25, 0.6, 0.25]}>
            <boxGeometry />
            <meshStandardMaterial color="#B28553" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, 0.5]} scale={[0.25, 0.6, 0.25]}>
            <boxGeometry />
            <meshStandardMaterial color="#B28553" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.4, 0, -0.5]} scale={[0.25, 0.6, 0.25]}>
            <boxGeometry />
            <meshStandardMaterial color="#B28553" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, -0.5]} scale={[0.25, 0.6, 0.25]}>
            <boxGeometry />
            <meshStandardMaterial color="#B28553" roughness={0.9} />
          </mesh>
          
          {/* Lion Tail */}
          <mesh castShadow position={[0, 0.6, -1]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#C19A5B" roughness={0.8} />
            
            {/* Tail tip */}
            <mesh position={[0, 0.6, 0]} scale={[0.3, 0.2, 0.3]}>
              <sphereGeometry />
              <meshStandardMaterial color="#8D6E63" roughness={0.9} />
            </mesh>
          </mesh>
        </group>
      );
      
    case 2: // Chimpanzee
      return (
        <group ref={obstacleRef} position={position} rotation={[0, 0, 0]} castShadow>
          {/* Body */}
          <mesh ref={el => partsRefs.current[0] = el} castShadow position={[0, 0.6, 0]} scale={[0.8, 0.9, 0.8]}>
            <boxGeometry />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#4E342E" roughness={0.8} />
            
            {/* Face */}
            <mesh position={[0, 0, 0.25]} scale={[0.6, 0.6, 0.3]}>
              <sphereGeometry />
              <meshStandardMaterial color="#8D6E63" roughness={0.7} />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.15, 0.1, 0.35]} scale={[0.08, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.15, 0.1, 0.35]} scale={[0.08, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            
            {/* Pupils */}
            <mesh position={[0.15, 0.1, 0.39]} scale={[0.04, 0.05, 0.02]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[-0.15, 0.1, 0.39]} scale={[0.04, 0.05, 0.02]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            
            {/* Mouth */}
            <mesh position={[0, -0.1, 0.35]} scale={[0.2, 0.06, 0.05]}>
              <boxGeometry />
              <meshBasicMaterial color="#3E2723" />
            </mesh>
            
            {/* Ears */}
            <mesh position={[0.4, 0.1, 0]} scale={[0.1, 0.15, 0.05]}>
              <sphereGeometry />
              <meshStandardMaterial color="#4E342E" roughness={0.8} />
            </mesh>
            <mesh position={[-0.4, 0.1, 0]} scale={[0.1, 0.15, 0.05]}>
              <sphereGeometry />
              <meshStandardMaterial color="#4E342E" roughness={0.8} />
            </mesh>
          </mesh>
          
          {/* Arms */}
          <mesh 
            ref={el => partsRefs.current[1] = el} 
            castShadow 
            position={[0.5, 0.9, 0]} 
            rotation={[0, 0, Math.PI / 3]}
          >
            <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
            
            {/* Hand */}
            <mesh position={[0, -0.5, 0]} scale={[0.15, 0.1, 0.15]}>
              <sphereGeometry />
              <meshStandardMaterial color="#8D6E63" roughness={0.7} />
            </mesh>
          </mesh>
          
          <mesh 
            ref={el => partsRefs.current[2] = el} 
            castShadow 
            position={[-0.5, 0.9, 0]} 
            rotation={[0, 0, -Math.PI / 3]}
          >
            <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
            
            {/* Hand */}
            <mesh position={[0, -0.5, 0]} scale={[0.15, 0.1, 0.15]}>
              <sphereGeometry />
              <meshStandardMaterial color="#8D6E63" roughness={0.7} />
            </mesh>
          </mesh>
          
          {/* Legs */}
          <mesh castShadow position={[0.25, 0, 0]} rotation={[0, 0, 0]} scale={[0.2, 0.6, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
            
            {/* Foot */}
            <mesh position={[0, -0.6, 0.1]} scale={[1.2, 0.2, 1.5]}>
              <boxGeometry />
              <meshStandardMaterial color="#3E2723" roughness={0.7} />
            </mesh>
          </mesh>
          
          <mesh castShadow position={[-0.25, 0, 0]} rotation={[0, 0, 0]} scale={[0.2, 0.6, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
            
            {/* Foot */}
            <mesh position={[0, -0.6, 0.1]} scale={[1.2, 0.2, 1.5]}>
              <boxGeometry />
              <meshStandardMaterial color="#3E2723" roughness={0.7} />
            </mesh>
          </mesh>
        </group>
      );
      
    default:
      return null;
  }
};

export default Obstacle;
