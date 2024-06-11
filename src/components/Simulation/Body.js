import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Body = ({ body }) => {
  const ref = useRef();
  const arrowRef = useRef();

  useFrame(() => {
    ref.current.position.set(body.position[0], body.position[1], 0);

    // Update arrow position and direction
    const velocityVector = new THREE.Vector3(body.velocity[0], body.velocity[1], 0);
    arrowRef.current.position.set(body.position[0], body.position[1], 0);
    arrowRef.current.setDirection(velocityVector.clone().normalize());
    arrowRef.current.setLength(velocityVector.length() * 5); // Scale for visibility
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={'orange'} />
      </mesh>
      <arrowHelper ref={arrowRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000]} />
    </>
  );
};

export default Body;