import React, { forwardRef } from 'react';

// Spherical body in 3D using three.js (Currenrtly only doing 2d now)
// forwardRef allows parent components to interact with Three.js mesh directly
const Body = forwardRef(({ body, isSelected, isHovered }, ref) => (
  <mesh ref={ref} position={[body.position[0], body.position[1], body.position[2]]}>
    <sphereGeometry args={[body.radius, 32, 32, 32]} />
    <meshStandardMaterial color={isSelected ? 'red' : isHovered ? 'yellow' : 'blue'} />
  </mesh>
));

export default Body;