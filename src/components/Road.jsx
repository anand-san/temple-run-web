import React, { forwardRef, useMemo } from 'react';
import { TextureLoader, RepeatWrapping, DoubleSide, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';

const Road = forwardRef((props, ref) => {
  // Create temple road texture
  const roadTexture = useMemo(() => {
    // Create canvas for road texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background for stone path
    const grd = ctx.createLinearGradient(0, 0, 0, 1024);
    grd.addColorStop(0, '#7D6D61');
    grd.addColorStop(1, '#5A4F45');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Draw stone blocks pattern
    ctx.strokeStyle = '#483C32';
    ctx.lineWidth = 6;
    
    // Create more realistic stone pattern
    // Large stone blocks in center
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 16; j++) {
        const x = 256 + i * 64;
        const y = j * 64;
        ctx.fillStyle = `rgba(${100 + Math.random() * 40}, ${80 + Math.random() * 40}, ${60 + Math.random() * 40}, 1)`;
        ctx.fillRect(x, y, 64, 64);
        ctx.strokeRect(x, y, 64, 64);
      }
    }
    
    // Decorative patterns on sides
    ctx.fillStyle = '#8B7355';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 32; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * 64, j * 32, 64, 32);
          ctx.fillRect(1024 - (i+1) * 64, j * 32, 64, 32);
        }
      }
    }
    
    // Lane markers (decorative ancient symbols)
    ctx.fillStyle = '#A89078';
    for (let i = 0; i < 32; i++) {
      // Left lane marker
      ctx.beginPath();
      ctx.arc(192, i * 32, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Right lane marker
      ctx.beginPath();
      ctx.arc(832, i * 32, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add detailed lane symbols every few blocks
    ctx.fillStyle = '#DEB887';
    for (let i = 0; i < 8; i++) {
      // Draw ancient symbols
      const y = i * 128;
      
      // Symbol in left lane
      ctx.beginPath();
      ctx.moveTo(192 - 16, y + 32);
      ctx.lineTo(192 + 16, y + 32);
      ctx.lineTo(192, y + 64);
      ctx.closePath();
      ctx.fill();
      
      // Symbol in right lane
      ctx.beginPath();
      ctx.moveTo(832 - 16, y + 32);
      ctx.lineTo(832 + 16, y + 32);
      ctx.lineTo(832, y + 64);
      ctx.closePath();
      ctx.fill();
    }
    
    // Create texture from canvas
    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 50);
    
    return texture;
  }, []);
  
  // Create temple wall texture with ancient carvings
  const wallTexture = useMemo(() => {
    // Create canvas for wall texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill with stone color (gradient for depth)
    const grd = ctx.createLinearGradient(0, 0, 0, 512);
    grd.addColorStop(0, '#9A7B4F');
    grd.addColorStop(0.5, '#8A6642');
    grd.addColorStop(1, '#785530');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add temple wall pattern with stone blocks
    ctx.strokeStyle = '#483C32';
    ctx.lineWidth = 4;
    
    // Create alternating stone brick pattern
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 16; j++) {
        // Offset every other row for realistic brick pattern
        const offsetX = j % 2 === 0 ? 0 : 32;
        const x = offsetX + i * 64;
        const y = j * 32;
        
        // Varied stone colors
        ctx.fillStyle = `rgba(${140 + Math.random() * 40}, ${100 + Math.random() * 40}, ${60 + Math.random() * 30}, 1)`;
        ctx.fillRect(x, y, 64, 32);
        ctx.strokeRect(x, y, 64, 32);
      }
    }
    
    // Add ancient temple carvings
    ctx.fillStyle = '#3A2914';
    
    // Horizontal decorative bands
    for (let j = 3; j < 16; j += 4) {
      ctx.fillRect(0, j * 32, 512, 6);
    }
    
    // Add hieroglyphic-like symbols
    ctx.fillStyle = '#5D4037';
    const symbols = [
      (x, y, s) => {
        // Circle symbol
        ctx.beginPath();
        ctx.arc(x, y, s * 10, 0, Math.PI * 2);
        ctx.fill();
      },
      (x, y, s) => {
        // Square symbol
        ctx.fillRect(x - s * 8, y - s * 8, s * 16, s * 16);
      },
      (x, y, s) => {
        // Triangle symbol
        ctx.beginPath();
        ctx.moveTo(x, y - s * 12);
        ctx.lineTo(x + s * 10, y + s * 8);
        ctx.lineTo(x - s * 10, y + s * 8);
        ctx.closePath();
        ctx.fill();
      },
      (x, y, s) => {
        // Line symbol
        ctx.fillRect(x - s * 12, y, s * 24, s * 3);
      }
    ];
    
    // Add random symbols throughout
    for (let i = 0; i < 24; i++) {
      const x = 32 + Math.random() * 448;
      const y = 32 + Math.random() * 448;
      const symbolIndex = Math.floor(Math.random() * symbols.length);
      const scale = 0.8 + Math.random() * 0.6;
      symbols[symbolIndex](x, y, scale);
    }
    
    // Create texture from canvas
    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2, 100);
    
    return texture;
  }, []);
  
  // Create more realistic ground texture
  const groundTexture = useMemo(() => {
    // Create canvas for ground
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background for richer soil color
    const grd = ctx.createLinearGradient(0, 0, 1024, 1024);
    grd.addColorStop(0, '#3B2F2F');
    grd.addColorStop(0.3, '#4A3C2C');
    grd.addColorStop(0.7, '#3B2F2F');
    grd.addColorStop(1, '#352A20');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add soil texture details
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 4;
      
      // Varied earth tones
      const r = 40 + Math.random() * 50;
      const g = 30 + Math.random() * 40;
      const b = 20 + Math.random() * 30;
      const a = 0.1 + Math.random() * 0.4;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add small pebbles and rocks
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = 1 + Math.random() * 5;
      
      // Stone colors
      const stoneVal = 100 + Math.random() * 80;
      const stoneSaturation = Math.random() * 20;
      
      ctx.fillStyle = `rgb(${stoneVal}, ${stoneVal - stoneSaturation}, ${stoneVal - stoneSaturation * 2})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add various grass tufts in different shades
    const grassColors = [
      '#3A5F0B', // Dark green
      '#4C7D0F', // Medium green
      '#5A9611', // Light green
      '#2E4D09'  // Very dark green
    ];
    
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const width = 2 + Math.random() * 6;
      const height = 5 + Math.random() * 15;
      const colorIndex = Math.floor(Math.random() * grassColors.length);
      
      ctx.fillStyle = grassColors[colorIndex];
      
      // Draw varied grass shapes
      if (Math.random() > 0.5) {
        // Blade of grass
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI - Math.PI/2); // Random angle
        ctx.fillRect(-width/2, 0, width, height);
        ctx.restore();
      } else {
        // Tuft of grass (multiple blades)
        for (let j = 0; j < 3; j++) {
          ctx.save();
          ctx.translate(x + (Math.random() * 4 - 2), y + (Math.random() * 4 - 2));
          ctx.rotate(Math.random() * Math.PI - Math.PI/2);
          ctx.fillRect(-width/3, 0, width/2, height * (0.7 + Math.random() * 0.6));
          ctx.restore();
        }
      }
    }
    
    // Add subtle ground moisture variations
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 20 + Math.random() * 80;
      
      const grdRadial = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grdRadial.addColorStop(0, 'rgba(30, 20, 10, 0.2)');
      grdRadial.addColorStop(1, 'rgba(30, 20, 10, 0)');
      
      ctx.fillStyle = grdRadial;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create texture from canvas
    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10, 100);
    
    return texture;
  }, []);
  
  // Create decorative column tops
  const columnTopTexture = useMemo(() => {
    // Create canvas for column top decorations
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fill with base color
    ctx.fillStyle = '#B38867';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add decorative patterns
    ctx.fillStyle = '#8D6E63';
    
    // Center design
    ctx.beginPath();
    ctx.arc(128, 128, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#A1887F';
    ctx.beginPath();
    ctx.arc(128, 128, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative outer ring
    ctx.strokeStyle = '#6D4C41';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(128, 128, 100, 0, Math.PI * 2);
    ctx.stroke();
    
    // Create radial patterns
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = 128 + Math.cos(angle) * 40;
      const y1 = 128 + Math.sin(angle) * 40;
      const x2 = 128 + Math.cos(angle) * 90;
      const y2 = 128 + Math.sin(angle) * 90;
      
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Create texture from canvas
    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    
    return texture;
  }, []);
  
  return (
    <group ref={ref} position={[0, 0, 490]}>
      {/* Extra wide ground plane with realistic terrain features */}
      <group>
        {/* Base extra-wide ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[100, 2000]} />
          <meshStandardMaterial map={groundTexture} side={DoubleSide} roughness={0.9} />
        </mesh>
        
        {/* Scattered ground rocks */}
        {[...Array(80)].map((_, i) => {
          const xPos = (Math.random() - 0.5) * 80; // Spread across the wide ground
          const zPos = Math.random() * 1800; // Spread along the length
          const scale = 0.2 + Math.random() * 0.8;
          const rotation = Math.random() * Math.PI;
          
          // Skip rocks that would be on the path
          if (Math.abs(xPos) < 6) return null;
          
          return (
            <mesh 
              key={`rock-${i}`} 
              position={[xPos, 0, zPos]} 
              rotation={[0, rotation, 0]} 
              scale={scale}
              castShadow
              receiveShadow
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#A0A0A0" roughness={0.9} />
            </mesh>
          );
        })}
        
        {/* Ground patches and height variations */}
        {[...Array(40)].map((_, i) => {
          const xPos = (Math.random() - 0.5) * 80;
          const zPos = Math.random() * 1800;
          const scale = 2 + Math.random() * 6;
          const height = 0.1 + Math.random() * 0.3;
          
          // Skip bumps that would be on the path
          if (Math.abs(xPos) < 7) return null;
          
          return (
            <mesh
              key={`bump-${i}`}
              position={[xPos, -0.05 + height/2, zPos]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[scale, scale * 0.8, height, 8]} />
              <meshStandardMaterial map={groundTexture} roughness={0.9} />
            </mesh>
          );
        })}
      </group>
      
      {/* Main temple road surface - made much longer and wider for 4 lanes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[8, 2000]} />
        <meshStandardMaterial 
          map={roadTexture} 
          side={DoubleSide} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Removed walls as requested */}
      
      {/* Lane markers and decorations for 4 lanes */}
      {[...Array(40)].map((_, i) => {
        // For every 3rd marker, make a more elaborate design
        const isSpecialMarker = i % 3 === 0;
        
        return (
          <group key={`marker-${i}`} position={[0, 0, i * 50]}>
            {/* Lane dividers - now positioned to separate the 4 lanes */}
            <mesh position={[2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 4, 0.1]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.8} />
            </mesh>
            
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 4, 0.1]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.8} />
            </mesh>
            
            <mesh position={[-2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 4, 0.1]} />
              <meshStandardMaterial color="#D7CCC8" roughness={0.8} />
            </mesh>
            
            {/* Special decorative markers every few segments */}
            {isSpecialMarker && (
              <>
                {/* Center lane decoration */}
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[1, 1, 0.1, 8]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.6} />
                </mesh>
                
                {/* Lane edge decorations */}
                <mesh position={[3.5, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.8, 0.8, 0.1]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.6} />
                </mesh>
                
                <mesh position={[-3.5, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.8, 0.8, 0.1]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.6} />
                </mesh>
              </>
            )}
          </group>
        );
      })}
      
      {/* Steps at start of path */}
      {[...Array(5)].map((_, i) => (
        <mesh 
          key={`step-${i}`} 
          position={[0, i * 0.1, 980 - i * 0.5]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[6 + i * 0.4, 1]} />
          <meshStandardMaterial color="#A1887F" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
});

export default Road;