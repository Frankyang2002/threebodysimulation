import React, { forwardRef } from 'react';

const Body = forwardRef(({ body, isSelected }, ref) => (
  <mesh ref={ref} position={[body.position[0], body.position[1], 0]}>
    <sphereGeometry args={[0.2, 32, 32]} />
    <meshStandardMaterial color={isSelected ? 'red' : 'blue'} />
  </mesh>
));

export default Body;