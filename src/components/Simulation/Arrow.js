import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Arrow = ({ from, to, headLength = 0.3, headWidth = 0.2 }) => {
  const arrowRef = useRef();

  useFrame(() => {
    const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], 0).normalize();
    const length = Math.sqrt(Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2));
    if (arrowRef.current) {
      arrowRef.current.setDirection(dir);
      arrowRef.current.setLength(length / 3, headLength, headWidth);
      arrowRef.current.position.set(from[0], from[1], 0);
    }
  });

  return <primitive object={new THREE.ArrowHelper()} ref={arrowRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xffff00, headLength, headWidth]} />;
};

export default Arrow;