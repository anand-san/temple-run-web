import React, { forwardRef, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, TextureLoader, Vector3 } from 'three';

const Player = forwardRef(({ isJumping, lane }, ref) => {
  // Body part references for animation
  const headRef = useRef();
  const torsoRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftFootRef = useRef();
  const rightFootRef = useRef();
  const hairRef = useRef();
  const groupRef = useRef();
  
  // Run particle effects
  const dustParticlesRef = useRef([]);
  const [particles, setParticles] = useState([]);
  
  // Jump animation state
  const [jumpHeight, setJumpHeight] = useState(0);
  const jumpAnimRef = useRef({
    active: false,
    velocity: 0,
    maxHeight: 2.5
  });
  
  // Generate particles for run effect
  useMemo(() => {
    const particleCount = 20;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 0.5, // x
          Math.random() * 0.2,         // y
          (Math.random() - 0.5) * 0.5  // z
        ],
        scale: 0.05 + Math.random() * 0.1,
        speed: 0.2 + Math.random() * 0.3,
        lifetime: 0,
        maxLifetime: 1 + Math.random(),
        active: false
      });
    }
    
    setParticles(newParticles);
  }, []);
  
  // Create skin texture with procedural details
  const skinTexture = useMemo(() => {
    // Create canvas for skin
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Base skin tone
    ctx.fillStyle = '#c68642';
    ctx.fillRect(0, 0, 128, 128);
    
    // Add some texture/variation
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const radius = Math.random() * 2;
      ctx.fillStyle = `rgba(150, 100, 60, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create texture
    const texture = new TextureLoader().load(canvas.toDataURL());
    return texture;
  }, []);
  
  // Create clothing texture 
  const clothingTexture = useMemo(() => {
    // Create canvas for clothing
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Base color
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 128, 128);
    
    // Add fabric texture
    for (let i = 0; i < 10; i++) {
      ctx.strokeStyle = `rgba(80, 40, 20, 0.3)`;
      ctx.lineWidth = 1;
      
      // Horizontal fabric lines
      ctx.beginPath();
      ctx.moveTo(0, i * 12);
      ctx.lineTo(128, i * 12);
      ctx.stroke();
      
      // Vertical fabric lines
      ctx.beginPath();
      ctx.moveTo(i * 12, 0);
      ctx.lineTo(i * 12, 128);
      ctx.stroke();
    }
    
    // Add some decorative elements (temple run patterns)
    ctx.fillStyle = '#FFD700';
    
    // Center emblem
    ctx.beginPath();
    ctx.arc(64, 64, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFD700';
    
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(88, 40);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(40, 88);
    ctx.lineTo(88, 88);
    ctx.stroke();
    
    // Create texture
    const texture = new TextureLoader().load(canvas.toDataURL());
    return texture;
  }, []);
  
  // Create hair texture
  const hairTexture = useMemo(() => {
    // Create canvas for hair
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Base color - dark brown
    ctx.fillStyle = '#3b2b1d';
    ctx.fillRect(0, 0, 64, 64);
    
    // Add hair texture - subtle lines
    ctx.strokeStyle = 'rgba(30, 20, 10, 0.7)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 20; i++) {
      const y = i * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(64, y);
      ctx.stroke();
    }
    
    // Create texture
    const texture = new TextureLoader().load(canvas.toDataURL());
    return texture;
  }, []);
  
  // Running and jumping animation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const runSpeed = 1.2; // 3x faster animation
    const runCycle = time * 10 * runSpeed;
    
    // Running animation for arms and legs - more realistic motion
    if (leftArmRef.current && rightArmRef.current && leftLegRef.current && rightLegRef.current) {
      // Arm swing 
      leftArmRef.current.rotation.x = Math.sin(runCycle) * 0.7;
      rightArmRef.current.rotation.x = -Math.sin(runCycle) * 0.7;
      
      // Arms positioned much further away from body during swing
      leftArmRef.current.rotation.z = Math.PI / 3 + Math.sin(runCycle) * 0.15;
      rightArmRef.current.rotation.z = -Math.PI / 3 - Math.sin(runCycle) * 0.15;
      
      // Leg motion - more pronounced for running
      leftLegRef.current.rotation.x = -Math.sin(runCycle) * 0.8;
      rightLegRef.current.rotation.x = Math.sin(runCycle) * 0.8;
      
      // Foot flex
      if (leftFootRef.current && rightFootRef.current) {
        leftFootRef.current.rotation.x = Math.sin(runCycle + Math.PI/4) * 0.3;
        rightFootRef.current.rotation.x = Math.sin(runCycle - Math.PI/4) * 0.3;
      }
      
      // Subtle torso and head motion for more natural running
      if (torsoRef.current) {
        torsoRef.current.rotation.y = Math.sin(runCycle / 2) * 0.05;
        torsoRef.current.position.y = Math.abs(Math.sin(runCycle)) * 0.05 + 1.2;
      }
      
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(runCycle / 2) * 0.1;
        headRef.current.rotation.z = Math.sin(runCycle / 2) * 0.05;
      }
      
      // Hair movement while running
      if (hairRef.current) {
        hairRef.current.rotation.x = 0.1 + Math.sin(runCycle) * 0.05;
      }
    }
    
    // Handle jumping with improved physics
    if (isJumping && !jumpAnimRef.current.active) {
      // Start jump - more powerful jump
      jumpAnimRef.current.active = true;
      jumpAnimRef.current.velocity = 0.5;
    }
    
    if (jumpAnimRef.current.active) {
      // Apply more realistic gravity
      jumpAnimRef.current.velocity -= 0.025;
      
      // Update height
      setJumpHeight(prev => {
        const next = prev + jumpAnimRef.current.velocity;
        
        // Check if we've landed
        if (next <= 0) {
          jumpAnimRef.current.active = false;
          jumpAnimRef.current.velocity = 0;
          
          // Create dust particles on landing
          if (dustParticlesRef.current.length > 0) {
            dustParticlesRef.current.forEach((particle, index) => {
              if (particle && index < particles.length) {
                particles[index].active = true;
                particles[index].lifetime = 0;
                
                // Reset particle position
                particle.position.set(
                  (Math.random() - 0.5) * 0.8,
                  0.1,
                  (Math.random() - 0.5) * 0.8
                );
                
                // Set velocity
                particles[index].velocity = new Vector3(
                  (Math.random() - 0.5) * 0.5,
                  Math.random() * 0.3,
                  (Math.random() - 0.5) * 0.5
                );
              }
            });
          }
          
          return 0;
        }
        
        return next;
      });
      
      // Tucking animation during jump
      if (jumpHeight > 0.5 && leftLegRef.current && rightLegRef.current) {
        const tuckAmount = Math.min(0.8, (jumpHeight / jumpAnimRef.current.maxHeight) * 1.2);
        leftLegRef.current.rotation.x = -Math.PI/6 - tuckAmount;
        rightLegRef.current.rotation.x = -Math.PI/6 - tuckAmount;
        
        if (leftArmRef.current && rightArmRef.current) {
          // Arms extend during jump
          leftArmRef.current.rotation.x = -0.5;
          rightArmRef.current.rotation.x = -0.5;
        }
      }
    }
    
    // Update group position for jump
    if (groupRef.current) {
      groupRef.current.position.y = jumpHeight;
    }
    
    // Update dust particles
    if (dustParticlesRef.current.length > 0) {
      dustParticlesRef.current.forEach((particle, index) => {
        if (particle && particles[index] && particles[index].active) {
          // Update lifetime
          particles[index].lifetime += delta;
          
          // Check if particle has expired
          if (particles[index].lifetime > particles[index].maxLifetime) {
            particles[index].active = false;
            return;
          }
          
          // Update position with velocity
          particle.position.x += particles[index].velocity.x * delta;
          particle.position.y += particles[index].velocity.y * delta;
          particle.position.z += particles[index].velocity.z * delta;
          
          // Apply gravity to velocity
          particles[index].velocity.y -= 0.3 * delta;
          
          // Fade out based on lifetime
          const opacity = 1 - (particles[index].lifetime / particles[index].maxLifetime);
          if (particle.material) {
            particle.material.opacity = opacity;
          }
        }
      });
    }
  });
  
  // Running dust effect when not jumping
  const dustParticlesActive = !jumpAnimRef.current.active && !isJumping;
  
  return (
    <group 
      ref={el => {
        // Connect both refs
        groupRef.current = el;
        if (ref) ref.current = el;
      }}
    >
      {/* Head with more detailed features */}
      <group ref={headRef} position={[0, 1.75, 0]}>
        {/* Base head */}
        <mesh castShadow>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial 
            map={skinTexture} 
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Hair */}
        <mesh ref={hairRef} castShadow position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial 
            map={hairTexture} 
            roughness={0.8} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Eyes */}
        {[-0.1, 0.1].map((x, i) => (
          <mesh key={`eye-${i}`} position={[x, 0.05, 0.2]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="white" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color="#2b1d0e" />
            </mesh>
          </mesh>
        ))}
        
        {/* Mouth */}
        <mesh position={[0, -0.1, 0.2]}>
          <boxGeometry args={[0.1, 0.03, 0.03]} />
          <meshStandardMaterial 
            color="#6c2c00" 
            roughness={0.7}
          />
        </mesh>
      </group>
      
      {/* Neck */}
      <mesh castShadow position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.1, 16]} />
        <meshStandardMaterial 
          map={skinTexture} 
          roughness={0.7} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Body - more detailed, like a tunic */}
      <group ref={torsoRef} position={[0, 1.2, 0]}>
        {/* Main torso */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.7, 12]} />
          <meshStandardMaterial 
            map={clothingTexture} 
            roughness={0.8} 
            metalness={0.2}
          />
        </mesh>
        
        {/* Shoulders */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.32, 0.3, 0.1, 12]} />
          <meshStandardMaterial 
            map={clothingTexture} 
            roughness={0.8} 
            metalness={0.2}
          />
        </mesh>
        
        {/* Belt */}
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.1, 12]} />
          <meshStandardMaterial 
            color="#403020" 
            roughness={0.6} 
            metalness={0.3}
          />
        </mesh>
      </group>
      
      {/* Arms with joints */}
      {/* Left Arm - Upper - positioned much further outward */}
      <group ref={leftArmRef} position={[-0.6, 1.4, 0]} rotation={[0, 0, Math.PI / 3]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.3, 12]} />
          <meshStandardMaterial 
            map={clothingTexture} 
            roughness={0.8} 
            metalness={0.2}
          />
        </mesh>
        
        {/* Left Forearm - angled more outward */}
        <group position={[0, -0.35, 0]} rotation={[0, 0.5, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.35, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
          
          {/* Left Hand - positioned further out */}
          <mesh castShadow position={[0.1, -0.35, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>
      
      {/* Right Arm - Upper - positioned much further outward */}
      <group ref={rightArmRef} position={[0.6, 1.4, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.3, 12]} />
          <meshStandardMaterial 
            map={clothingTexture} 
            roughness={0.8} 
            metalness={0.2}
          />
        </mesh>
        
        {/* Right Forearm - angled more outward */}
        <group position={[0, -0.35, 0]} rotation={[0, -0.5, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.35, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
          
          {/* Right Hand - positioned further out */}
          <mesh castShadow position={[-0.1, -0.35, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>
      
      {/* Shorts/Lower Garment */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.25, 0.22, 0.3, 12]} />
        <meshStandardMaterial 
          color="#65350F" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Legs with joints */}
      {/* Left Leg - Upper */}
      <group ref={leftLegRef} position={[-0.15, 0.6, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.3, 12]} />
          <meshStandardMaterial 
            map={skinTexture} 
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Left Lower Leg */}
        <group position={[0, -0.35, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.35, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
          
          {/* Left Foot */}
          <group ref={leftFootRef} position={[0, -0.35, 0]}>
            <mesh castShadow position={[0, -0.05, 0.05]}>
              <boxGeometry args={[0.1, 0.1, 0.2]} />
              <meshStandardMaterial 
                color="#36454F" 
                roughness={0.6} 
                metalness={0.3}
              />
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Right Leg - Upper */}
      <group ref={rightLegRef} position={[0.15, 0.6, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.3, 12]} />
          <meshStandardMaterial 
            map={skinTexture} 
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Right Lower Leg */}
        <group position={[0, -0.35, 0]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.35, 12]} />
            <meshStandardMaterial 
              map={skinTexture} 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>
          
          {/* Right Foot */}
          <group ref={rightFootRef} position={[0, -0.35, 0]}>
            <mesh castShadow position={[0, -0.05, 0.05]}>
              <boxGeometry args={[0.1, 0.1, 0.2]} />
              <meshStandardMaterial 
                color="#36454F" 
                roughness={0.6} 
                metalness={0.3}
              />
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Dust particles for running and landing effects */}
      {particles.map((particle, index) => (
        <mesh
          key={`particle-${particle.id}`}
          ref={el => dustParticlesRef.current[index] = el}
          position={[particle.position[0], particle.position[1], particle.position[2]]}
          scale={[particle.scale, particle.scale, particle.scale]}
          visible={particle.active || dustParticlesActive}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color="#D2B48C" 
            transparent={true} 
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
});

export default Player;