import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Body = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

const Simulation = () => {
  const [bodies, setBodies] = useState([
    { position: [0, 0, 0], velocity: [0, 0.02, 0], mass: 1 },
    { position: [2, 2, 0], velocity: [0, -0.01, 0], mass: 1 },
    { position: [-2, -2, 0], velocity: [0.01, 0, 0], mass: 1 },
  ]);

  const updateBodies = () => {
    // Implement the physics of the three-body problem
    // This is just a placeholder for the actual simulation logic
    setBodies([...bodies]);
  };

  useFrame(() => updateBodies());

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