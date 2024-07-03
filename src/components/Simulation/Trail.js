import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Trail = ({ body, maxLength, trailWidth }) => {
  const trailRef = useRef();
  const [trailPoints, setTrailPoints] = useState([]);

  const geometryRef = useRef(new THREE.BufferGeometry());
  const materialRef = useRef(new THREE.LineBasicMaterial({ color: body.color, linewidth: trailWidth }));

  useEffect(() => {
    geometryRef.current = new THREE.BufferGeometry();
    materialRef.current = new THREE.LineBasicMaterial({ color: body.color, linewidth: trailWidth });

    const line = new THREE.Line(geometryRef.current, materialRef.current);
    trailRef.current = line;

    return () => {
      // Cleanup logic if needed
    };
  }, [trailWidth, body.color]);

  useEffect(() => {
    // Update trail points based on body movement
    const newTrailPoints = [...trailPoints, new THREE.Vector3(body.position[0], body.position[1], body.position[2])];
    setTrailPoints(newTrailPoints.slice(-maxLength)); // Limit trail length to maxLength

    // Update geometry
    const positions = newTrailPoints.flatMap(point => [point.x, point.y, point.z]);
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  }, [body.position, maxLength, trailPoints]);

  return trailRef.current ? <primitive object={trailRef.current} /> : null;
};

export default Trail;