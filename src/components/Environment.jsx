import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  TextureLoader, 
  RepeatWrapping, 
  SphereGeometry, 
  MeshBasicMaterial, 
  BackSide,
  Vector3,
  Color
} from 'three';

const Environment = () => {
  const treesRef = useRef([]);
  const mountainsRef = useRef();
  const cloudsRef = useRef([]);
  const sunRef = useRef();
  const templeRef = useRef();
  
  // Generate procedural sky texture
  const skyTexture = useMemo(() => {
    // Create canvas for sky
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create gradient sky
    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    // Early morning / temple run atmosphere
    grd.addColorStop(0, '#1a237e'); // Deep blue at top
    grd.addColorStop(0.4, '#4a6491'); // Mid blue
    grd.addColorStop(0.7, '#ff9e80'); // Orange horizon
    grd.addColorStop(1, '#ffcc80'); // Light orange at bottom
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add stars in the upper part of the sky
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5; // Only in top half
      const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create texture
    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    
    return texture;
  }, []);
  
  // Create cloud textures
  const cloudTexture = useMemo(() => {
    // Create canvas for clouds
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw fluffy cloud
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Center blob
    ctx.beginPath();
    ctx.arc(256, 256, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Surrounding blobs to create fluffy look
    const blobs = [
      [200, 220, 70],
      [300, 230, 80],
      [180, 270, 60],
      [250, 320, 80],
      [320, 280, 70]
    ];
    
    blobs.forEach(([x, y, radius]) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Create texture
    const texture = new TextureLoader().load(canvas.toDataURL());
    
    return texture;
  }, []);
  
  // Generate trees with nicer models
  const trees = useMemo(() => {
    const trees = [];
    
    // Tree types
    const treeTypes = [
      // Palm-like tree
      {
        trunk: { height: 7, radius: 0.4, color: '#8B4513' },
        leaves: { 
          type: 'palm',
          color: '#558B2F',
          segmentCount: 5
        }
      },
      // Pine-like tree
      {
        trunk: { height: 8, radius: 0.5, color: '#5D4037' },
        leaves: { 
          type: 'pine',
          color: '#2E7D32',
          segmentCount: 4
        }
      },
      // Tropical tree
      {
        trunk: { height: 6, radius: 0.6, color: '#6D4C41' },
        leaves: { 
          type: 'round',
          color: '#388E3C',
          segmentCount: 1
        }
      }
    ];
    
    // Create trees on both sides of the path
    for (let i = 0; i < 60; i++) {
      // Pick a random tree type
      const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
      
      // Right side trees 
      trees.push({
        id: `right-${i}`,
        position: [-10 - Math.random() * 40, 0, 100 + i * 20], // Positive Z = in front of player
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        type: treeType
      });
      
      // Left side trees
      trees.push({
        id: `left-${i}`,
        position: [10 + Math.random() * 40, 0, 100 + i * 20], // Positive Z = in front of player
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        type: treeType
      });
    }
    
    return trees;
  }, []);
  
  // Generate clouds
  const clouds = useMemo(() => {
    const clouds = [];
    
    // Create clouds at various positions
    for (let i = 0; i < 30; i++) {
      clouds.push({
        id: `cloud-${i}`,
        position: [
          -100 + Math.random() * 200, 
          50 + Math.random() * 30, 
          100 + i * 30
        ],
        scale: 5 + Math.random() * 10,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    return clouds;
  }, []);
  
  // Mountain range data
  const mountains = useMemo(() => {
    const mountainData = [];
    
    // Create several mountain ranges at different distances
    for (let range = 0; range < 3; range++) {
      const z = 300 + range * 100; // Different distances
      const baseHeight = 80 - range * 20; // Taller mountains in back
      const count = 8 + range * 4; // More mountains in distant ranges
      
      for (let i = 0; i < count; i++) {
        const x = -400 + i * (800 / count) + (Math.random() * 40 - 20);
        const height = baseHeight * (0.7 + Math.random() * 0.6);
        
        // Mountain color varies by distance (atmospheric perspective)
        const colorValue = 0.5 - range * 0.1 + Math.random() * 0.1;
        
        mountainData.push({
          position: [x, 0, z],
          height: height,
          radius: height * 0.7,
          color: new Color(
            0.4 + colorValue * 0.2, 
            0.3 + colorValue * 0.1, 
            0.2 + colorValue * 0.05
          )
        });
      }
    }
    
    return mountainData;
  }, []);
  
  // Create ancient temple in the distance
  const templeData = useMemo(() => {
    return {
      position: [0, 0, 500],
      baseSize: [40, 10, 40],
      levels: 3,
      steps: true
    };
  }, []);

  // Move environment elements as player runs
  useFrame((state, delta) => {
    // Move trees
    if (treesRef.current.length > 0) {
      treesRef.current.forEach(tree => {
        if (tree) {
          // Move tree backward to create illusion of forward movement
          tree.position.z -= 15 * delta;
          
          // If tree is behind camera, move it far ahead
          if (tree.position.z < -20) {
            tree.position.z = 1200;
            // Randomize X position when recycling
            tree.position.x = tree.position.x < 0 
              ? -10 - Math.random() * 40 
              : 10 + Math.random() * 40;
          }
        }
      });
    }
    
    // Move clouds slowly
    if (cloudsRef.current.length > 0) {
      cloudsRef.current.forEach((cloud, index) => {
        if (cloud) {
          // Move cloud backward (toward player)
          cloud.position.z -= (5 + clouds[index].speed) * delta;
          
          // Gentle drift sideways
          cloud.position.x += Math.sin(state.clock.elapsedTime * 0.1 + index) * 0.05;
          
          // Reset cloud position when it passes the camera
          if (cloud.position.z < -50) {
            cloud.position.z = 1000;
            cloud.position.x = -100 + Math.random() * 200;
            cloud.position.y = 50 + Math.random() * 30;
          }
        }
      });
    }
    
    // Subtle sun movement
    if (sunRef.current) {
      // Make sun slightly pulse/glow
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime) * 0.04;
      sunRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });
  
  return (
    <>
      {/* Sky dome */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <sphereGeometry args={[500, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial map={skyTexture} side={BackSide} />
      </mesh>
      
      {/* Sun */}
      <mesh ref={sunRef} position={[100, 80, 400]}>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color="#FF9800" />
        <pointLight color="#FFA726" intensity={1} distance={1000} decay={0.2} />
      </mesh>
      
      {/* Fog for atmospheric perspective */}
      <fog attach="fog" args={['#fbe9e7', 70, 500]} />
      
      {/* Directional light for shadows */}
      <directionalLight 
        position={[50, 100, 100]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#E1F5FE" />
      
      {/* Mountains in background */}
      <group ref={mountainsRef}>
        {mountains.map((mountain, i) => (
          <mesh 
            key={`mountain-${i}`} 
            position={mountain.position}
          >
            <coneGeometry args={[mountain.radius, mountain.height, 8]} />
            <meshLambertMaterial color={mountain.color} />
          </mesh>
        ))}
      </group>
      
      {/* Distant temple - destination */}
      <group ref={templeRef} position={templeData.position}>
        {/* Base platform */}
        <mesh position={[0, templeData.baseSize[1] / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={templeData.baseSize} />
          <meshStandardMaterial color="#BCA28C" roughness={0.9} />
        </mesh>
        
        {/* Temple levels (pyramidal structure) */}
        {[...Array(templeData.levels)].map((_, i) => {
          const levelSize = [
            templeData.baseSize[0] * (1 - (i + 1) / (templeData.levels + 1) * 0.7),
            templeData.baseSize[1] * 0.5,
            templeData.baseSize[2] * (1 - (i + 1) / (templeData.levels + 1) * 0.7)
          ];
          const y = templeData.baseSize[1] + i * levelSize[1] + levelSize[1] / 2;
          
          return (
            <mesh key={`level-${i}`} position={[0, y, 0]} castShadow>
              <boxGeometry args={levelSize} />
              <meshStandardMaterial color="#A1887F" roughness={0.8} />
            </mesh>
          );
        })}
        
        {/* Temple entrance (doorway) */}
        <mesh 
          position={[0, templeData.baseSize[1] / 2, templeData.baseSize[2] / 2 - 0.1]} 
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[templeData.baseSize[0] * 0.2, templeData.baseSize[1] * 0.6, 1]} />
          <meshBasicMaterial color="#3E2723" />
        </mesh>
        
        {/* Temple columns */}
        {[-1, 1].map((side, i) => (
          <mesh 
            key={`column-${i}`} 
            position={[
              side * templeData.baseSize[0] * 0.3, 
              templeData.baseSize[1] * 1.5, 
              templeData.baseSize[2] * 0.4
            ]}
            castShadow
          >
            <cylinderGeometry args={[1, 1.2, templeData.baseSize[1] * 1.5, 8]} />
            <meshStandardMaterial color="#D7CCC8" roughness={0.7} />
          </mesh>
        ))}
      </group>
      
      {/* Trees - much more detailed */}
      {trees.map((tree, index) => (
        <group 
          key={tree.id} 
          position={tree.position} 
          scale={tree.scale} 
          rotation={[0, tree.rotation, 0]}
          ref={el => treesRef.current[index] = el}
        >
          {/* Tree trunk */}
          <mesh castShadow position={[0, tree.type.trunk.height / 2, 0]}>
            <cylinderGeometry 
              args={[
                tree.type.trunk.radius * 0.7,
                tree.type.trunk.radius,
                tree.type.trunk.height,
                8
              ]} 
            />
            <meshStandardMaterial color={tree.type.trunk.color} roughness={0.9} />
          </mesh>
          
          {/* Tree leaves - different types */}
          {tree.type.leaves.type === 'palm' && (
            // Palm fronds
            [...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const bendAngle = Math.PI / 4; // Bend outward
              
              return (
                <group 
                  key={`frond-${i}`} 
                  position={[0, tree.type.trunk.height, 0]} 
                  rotation={[
                    Math.sin(angle) * bendAngle,
                    angle,
                    Math.cos(angle) * bendAngle
                  ]}
                >
                  <mesh castShadow>
                    <coneGeometry args={[0.2, 4, 8]} />
                    <meshStandardMaterial color="#8D6E63" />
                  </mesh>
                  
                  {/* Palm leaves */}
                  <mesh castShadow position={[0, 2, 0]}>
                    <boxGeometry args={[3, 0.1, 5]} />
                    <meshStandardMaterial color={tree.type.leaves.color} roughness={0.8} />
                  </mesh>
                </group>
              );
            })
          )}
          
          {tree.type.leaves.type === 'pine' && (
            // Stacked pine cones
            [...Array(tree.type.leaves.segmentCount)].map((_, i) => {
              const segmentHeight = 2.5;
              const segmentSize = 2 * (1 - i / tree.type.leaves.segmentCount * 0.5);
              
              return (
                <mesh 
                  key={`pinecone-${i}`} 
                  castShadow 
                  position={[
                    0, 
                    tree.type.trunk.height + i * segmentHeight, 
                    0
                  ]}
                >
                  <coneGeometry args={[segmentSize, segmentHeight * 2, 8]} />
                  <meshStandardMaterial 
                    color={tree.type.leaves.color} 
                    roughness={0.8} 
                  />
                </mesh>
              );
            })
          )}
          
          {tree.type.leaves.type === 'round' && (
            // Round foliage
            <group position={[0, tree.type.trunk.height + 2, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[3, 16, 16]} />
                <meshStandardMaterial 
                  color={tree.type.leaves.color} 
                  roughness={0.8} 
                />
              </mesh>
              
              {/* Add some smaller spheres for detail */}
              {[...Array(5)].map((_, i) => {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 2.5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                return (
                  <mesh 
                    key={`leaf-cluster-${i}`} 
                    castShadow 
                    position={[x, Math.random() * 2 - 1, z]}
                  >
                    <sphereGeometry args={[1.5, 8, 8]} />
                    <meshStandardMaterial 
                      color={tree.type.leaves.color} 
                      roughness={0.8} 
                    />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      ))}
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <mesh
          key={cloud.id}
          position={cloud.position}
          scale={[cloud.scale, cloud.scale / 2, cloud.scale]}
          ref={el => cloudsRef.current[index] = el}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={cloudTexture} 
            transparent={true} 
            opacity={0.8} 
            depthWrite={false} 
          />
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={cloudTexture} 
              transparent={true} 
              opacity={0.6} 
              depthWrite={false} 
            />
          </mesh>
        </mesh>
      ))}
    </>
  );
};

export default Environment;