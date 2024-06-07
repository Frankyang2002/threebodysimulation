import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Body Component: Input: Position
// Mesh creates 3D object with sphere geometry, material gives our colour
const Body = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

// Simulation Logic
const Simulation = () => {
    // Initialisation
    const [bodies, setBodies] = useState([
        { position: [0, 0, 0], velocity: [0, 0.02, 0], mass: 1 },
        { position: [2, 2, 0], velocity: [0, -0.01, 0], mass: 1 },
        { position: [-2, -2, 0], velocity: [0.01, 0, 0], mass: 1 },
    ]);

    const updateBodies = () => {
        
        const newBodies = bodies.map((body, index) => {
        // Calculate gravitational forces from other bodies
        let fx = 0, fy = 0, fz = 0;
        bodies.forEach((otherBody, otherIndex) => {
            if (index !== otherIndex) {
            // Calculate force components
            const dx = otherBody.position[0] - body.position[0];
            const dy = otherBody.position[1] - body.position[1];
            const dz = otherBody.position[2] - body.position[2];
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            const force = (body.mass * otherBody.mass) / (distance * distance);
            fx += force * (dx / distance);
            fy += force * (dy / distance);
            fz += force * (dz / distance);
            }
        });
        
        // Update velocities
        const vx = body.velocity[0] + fx / body.mass;
        const vy = body.velocity[1] + fy / body.mass;
        const vz = body.velocity[2] + fz / body.mass;
        
        // Update positions
        const x = body.position[0] + vx;
        const y = body.position[1] + vy;
        const z = body.position[2] + vz;
        
        return { ...body, position: [x, y, z], velocity: [vx, vy, vz] };
        });
    
        setBodies(newBodies);
  };

  // function by react-three-fibre which allows frame by frame updates
  useFrame(() => updateBodies());



  // Canvas come from react-three-fibre and now we have 3D rendering context
  // Get illumination and we render the body into scene
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {bodies.map((body, index) => (
        <Body key={index} position={body.position} />
      ))}
    </Canvas>
  );
};

export default Simulation;