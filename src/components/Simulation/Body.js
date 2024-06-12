import React from 'react';

const Body = ({ body, isSelected }) => {
  if (!body.position) return null; // Guard clause

  return (
    <mesh position={[body.position[0], body.position[1], 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={isSelected ? 'red' : 'blue'} />
    </mesh>
  );
};


export default Body;