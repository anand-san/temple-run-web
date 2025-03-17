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
        case 0: // Goat - animate head and tail
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
          
        case 2: // Dog - jumping and arm movement
          if (obstacleRef.current) {
            // Jump up and down
            obstacleRef.current.position.y = position[1] + Math.abs(Math.sin(time * 6)) * 0.3;
          }
          
          // Leg movement
          if (partsRefs.current[1] && partsRefs.current[2]) {
            partsRefs.current[1].rotation.x = Math.sin(time * 8) * 0.5 - 0.2; // Left leg
            partsRefs.current[2].rotation.x = Math.sin(time * 8 + Math.PI) * 0.5 - 0.2; // Right leg
          }
          break;
      }
    }
  });
  
  switch (type) {
    case 0: // Goat
      return (
        <group ref={obstacleRef} position={position} castShadow>
          {/* Goat Body */}
          <mesh castShadow position={[0, 0.7, 0]} scale={[1, 1, 1.8]}>
            <boxGeometry args={[1.2, 1.4, 1]} />
            <meshStandardMaterial color="#BDB5A5" roughness={0.8} />
          </mesh>
          
          {/* Goat Head */}
          <mesh ref={el => partsRefs.current[0] = el} castShadow position={[0, 1.2, 1]} scale={[0.7, 0.7, 1.2]}>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshStandardMaterial color="#A59D8F" roughness={0.7} />
            
            {/* Mouth */}
            <mesh position={[0, -0.25, 0.5]} scale={[0.8, 0.3, 0.3]}>
              <boxGeometry />
              <meshStandardMaterial color="#8C857A" roughness={0.7} />
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
            
            {/* Horns */}
            <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, 0.7]} scale={[0.1, 0.4, 0.1]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#6D635A" roughness={0.7} />
            </mesh>
            <mesh position={[-0.3, 0.5, 0]} rotation={[0, 0, -0.7]} scale={[0.1, 0.4, 0.1]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#6D635A" roughness={0.7} />
            </mesh>
          </mesh>
          
          {/* Goat Tail */}
          <mesh ref={el => partsRefs.current[1] = el} castShadow position={[0, 0.6, -1]} scale={[0.3, 0.3, 0.3]}>
            <boxGeometry args={[0.6, 0.6, 0.5]} />
            <meshStandardMaterial color="#A59D8F" roughness={0.8} />
          </mesh>
          
          {/* Goat Legs */}
          <mesh castShadow position={[0.4, 0, 0.2]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#8C857A" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, 0.2]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#8C857A" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.4, 0, -0.5]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#8C857A" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[-0.4, 0, -0.5]} scale={[0.3, 0.7, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#8C857A" roughness={0.9} />
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
      
    case 2: // Dog
      return (
        <group ref={obstacleRef} position={position} rotation={[0, 0, 0]} castShadow>
          {/* Body */}
          <mesh ref={el => partsRefs.current[0] = el} castShadow position={[0, 0.6, 0]} scale={[0.8, 0.9, 1.2]}>
            <boxGeometry />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.8, 0.9]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#A0876A" roughness={0.8} />
            
            {/* Snout */}
            <mesh position={[0, 0, 0.3]} scale={[0.5, 0.4, 0.5]}>
              <boxGeometry />
              <meshStandardMaterial color="#8B7355" roughness={0.7} />
              
              {/* Nose */}
              <mesh position={[0, 0, 0.5]} scale={[0.6, 0.6, 0.2]}>
                <sphereGeometry />
                <meshStandardMaterial color="#3E2723" roughness={0.7} />
              </mesh>
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.2, 0.1, 0.3]} scale={[0.08, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[-0.2, 0.1, 0.3]} scale={[0.08, 0.1, 0.05]}>
              <sphereGeometry />
              <meshBasicMaterial color="white" />
            </mesh>
            
            {/* Pupils */}
            <mesh position={[0.2, 0.1, 0.34]} scale={[0.04, 0.05, 0.02]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[-0.2, 0.1, 0.34]} scale={[0.04, 0.05, 0.02]}>
              <sphereGeometry />
              <meshBasicMaterial color="black" />
            </mesh>
            
            {/* Ears */}
            <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, 0.3]} scale={[0.2, 0.3, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color="#7A624D" roughness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, -0.3]} scale={[0.2, 0.3, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color="#7A624D" roughness={0.8} />
            </mesh>
          </mesh>
          
          {/* Tail */}
          <mesh castShadow position={[0, 0.7, -0.8]} rotation={[-0.5, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.05, 0.8, 8]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
          
          {/* Front Legs */}
          <mesh 
            ref={el => partsRefs.current[1] = el} 
            castShadow 
            position={[0.3, 0.3, 0.5]} 
            rotation={[0.2, 0, 0]}
            scale={[0.2, 0.6, 0.2]}
          >
            <cylinderGeometry />
            <meshStandardMaterial color="#7A624D" roughness={0.9} />
            
            {/* Paw */}
            <mesh position={[0, -0.6, 0]} scale={[1.2, 0.2, 1.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#654D40" roughness={0.7} />
            </mesh>
          </mesh>
          
          <mesh 
            ref={el => partsRefs.current[2] = el} 
            castShadow 
            position={[-0.3, 0.3, 0.5]} 
            rotation={[0.2, 0, 0]}
            scale={[0.2, 0.6, 0.2]}
          >
            <cylinderGeometry />
            <meshStandardMaterial color="#7A624D" roughness={0.9} />
            
            {/* Paw */}
            <mesh position={[0, -0.6, 0]} scale={[1.2, 0.2, 1.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#654D40" roughness={0.7} />
            </mesh>
          </mesh>
          
          {/* Back Legs */}
          <mesh castShadow position={[0.3, 0.3, -0.5]} rotation={[-0.2, 0, 0]} scale={[0.2, 0.6, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#7A624D" roughness={0.9} />
            
            {/* Paw */}
            <mesh position={[0, -0.6, 0]} scale={[1.2, 0.2, 1.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#654D40" roughness={0.7} />
            </mesh>
          </mesh>
          
          <mesh castShadow position={[-0.3, 0.3, -0.5]} rotation={[-0.2, 0, 0]} scale={[0.2, 0.6, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#7A624D" roughness={0.9} />
            
            {/* Paw */}
            <mesh position={[0, -0.6, 0]} scale={[1.2, 0.2, 1.2]}>
              <boxGeometry />
              <meshStandardMaterial color="#654D40" roughness={0.7} />
            </mesh>
          </mesh>
        </group>
      );
      
    default:
      return null;
  }
};

export default Obstacle;
