import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Props: start and end position of arrow, and  also the size of the arrow
const Arrow = ({ from, to, color = 'yellow', headLength = 0.3, headWidth = 0.2 }) => {
  // References the arrowhelper object created
  const arrowRef = useRef();

  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.setColor(new THREE.Color(color));
    }
  }, [color]); 
  // update arrow direction, length, position each frame
  useFrame(() => {
    const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize();
    const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2) + Math.pow(to[2] - from[2], 2));
    if (arrowRef.current) {
      arrowRef.current.setDirection(dir);
      arrowRef.current.setLength(length / 3, headLength, headWidth);
      arrowRef.current.position.set(from[0], from[1], from[2]);
    }
  });

  return <primitive object={new THREE.ArrowHelper()} ref={arrowRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0),  5, new THREE.Color(color), headLength, headWidth]} />;
};

export default Arrow;