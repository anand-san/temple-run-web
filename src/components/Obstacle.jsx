import React from "react";

const Obstacle = ({ position, type }) => {
  switch (type) {
    case 0: // Stone block
      return (
        <mesh position={position} castShadow>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>
      );

    case 1: // Fallen log
      return (
        <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>
      );

    case 2: // Temple debris (stack of stones)
      return (
        <group position={position}>
          {[...Array(3)].map((_, i) => {
            // Random values for each stone
            const width = 0.4 + Math.random() * 0.3;
            const height = 0.3 + Math.random() * 0.2;
            const depth = 0.4 + Math.random() * 0.3;
            const offsetX = Math.random() * 0.4 - 0.2;
            const offsetZ = Math.random() * 0.4 - 0.2;
            const rotX = Math.random() * Math.PI;
            const rotY = Math.random() * Math.PI;
            const rotZ = Math.random() * Math.PI;

            return (
              <mesh
                key={i}
                position={[offsetX, i * 0.3, offsetZ]}
                rotation={[rotX, rotY, rotZ]}
                castShadow
              >
                <boxGeometry args={[width, height, depth]} />
                <meshLambertMaterial color="#7c7c7c" />
              </mesh>
            );
          })}
        </group>
      );

    default:
      return null;
  }
};

export default Obstacle;
