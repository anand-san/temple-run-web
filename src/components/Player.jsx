import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAnimations } from '@react-three/drei';

const Player = forwardRef(({ isJumping, lane }, ref) => {
  // Model and animation references
  const groupRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef();
  
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
  
  // State for managing animations
  const [animState, setAnimState] = useState({
    currentAnim: 'Running',
    previousAnim: null
  });
  
  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, '/models/gltf/RobotExpressive/RobotExpressive.glb');
  const { animations } = gltf;
  
  // Get animation actions
  const { actions, mixer, names } = useAnimations(animations, modelRef);
  
  // Generate particles for run effect
  useEffect(() => {
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
  
  // Set up animations
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Start with running animation
      actions['Running'].reset().play();
      
      // Configure animations
      Object.keys(actions).forEach(name => {
        // Set up one-time animations to clamp when finished
        if (['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'].includes(name)) {
          actions[name].clampWhenFinished = true;
          actions[name].loop = THREE.LoopOnce;
        }
      });
      
      mixerRef.current = mixer;
    }
  }, [actions, mixer]);
  
  // Handle jumping animation
  useEffect(() => {
    if (!actions) return;
    
    if (isJumping && !jumpAnimRef.current.active) {
      // Start jump animation and physics
      jumpAnimRef.current.active = true;
      jumpAnimRef.current.velocity = 0.5;
      
      // Save previous animation state and transition to Jump
      setAnimState(prev => ({
        previousAnim: prev.currentAnim,
        currentAnim: 'Jump'
      }));
      
      // Play jump animation
      const jumpAction = actions['Jump'];
      if (jumpAction) {
        actions[animState.currentAnim].fadeOut(0.2);
        jumpAction.reset().fadeIn(0.2).play();
        
        // Listen for animation completion and restore previous animation
        mixer.addEventListener('finished', function onJumpFinished() {
          mixer.removeEventListener('finished', onJumpFinished);
          
          // Restore previous animation
          jumpAction.fadeOut(0.2);
          actions[animState.previousAnim].reset().fadeIn(0.2).play();
          
          setAnimState(prev => ({
            ...prev,
            currentAnim: prev.previousAnim
          }));
        });
      }
    }
  }, [isJumping, actions, mixer, animState]);
  
  // Running and jumping animation
  useFrame((state, delta) => {
    // Update the animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Handle jumping with improved physics
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
    }
    
    // Update group position for jump
    if (groupRef.current) {
      groupRef.current.position.y = jumpHeight;
    }
    
    // Move player to correct lane
    if (groupRef.current) {
      const lanePositions = [3, 1, -1, -3]; // Four lanes
      const targetX = lanePositions[lane];
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, 
        targetX, 
        0.3
      );
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
      position={[0, 0, 0]}
      rotation={[0, 0, 0]} // Face away from the camera (running forward)
    >
      {/* The GLTF Robot model */}
      <primitive 
        object={gltf.scene} 
        ref={modelRef}
        position={[0, 0, 0]} 
        scale={[0.5, 0.5, 0.5]} // Scale to appropriate size
        castShadow
        receiveShadow
      />
      
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