import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AccelerationArrow = ({ from, to, color = 'red', headLength = 0.3, headWidth = 0.2 }) => {
  const arrowRef = useRef();

  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.setColor(new THREE.Color(color));
    }
  }, [color]); 

  // update arrow direction, length, position each frame
  useFrame(() => {
    const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize();
    let distance = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2) + Math.pow(to[2] - from[2], 2));
    // Apply a diminishing function to the distance so it doesnt go to infinity
    const length = Math.log(distance + 1) + 0.1; 

    if (arrowRef.current) {
      arrowRef.current.setDirection(dir);
      arrowRef.current.setLength(length, headLength, headWidth);
      arrowRef.current.position.set(from[0], from[1], from[2]);
    }
  });

  return <arrowHelper ref={arrowRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, new THREE.Color(color), headLength, headWidth]} />;
};

export default AccelerationArrow;