import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { extend, useThree } from '@react-three/fiber';
import { LineSegments } from 'three';

extend({ LineSegments });

const createGrid = (size, divisions, showGrid) => {
  const halfSize = size / 2;
  const step = size / divisions;
  const vertices = [];

  if (showGrid === 3 || showGrid === 2) {
    for (let i = 0; i <= divisions; i++) {
      const position = -halfSize + i * step;

      // XY plane lines
      vertices.push(-halfSize, position, 0, halfSize, position, 0); // horizontal lines
      vertices.push(position, -halfSize, 0, position, halfSize, 0); // vertical lines

      if (showGrid === 3) {
        // XZ plane lines
        vertices.push(-halfSize, 0, position, halfSize, 0, position); // horizontal lines
        vertices.push(position, 0, -halfSize, position, 0, halfSize); // vertical lines

        // YZ plane lines
        vertices.push(0, -halfSize, position, 0, halfSize, position); // horizontal lines
        vertices.push(0, position, -halfSize, 0, position, halfSize); // vertical lines
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  return geometry;
};

const Grid = ({ size = 50, divisions = 50, color = 'gray', showGrid }) => {
  const { scene } = useThree();
  const gridRef = useRef();

  useEffect(() => {
    const geometry = createGrid(size, divisions, showGrid);
    const material = new THREE.LineBasicMaterial({ color });

    const grid = new LineSegments(geometry, material);
    gridRef.current = grid;
    scene.add(grid);

    return () => {
      scene.remove(grid);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, size, divisions, color, showGrid]);

  return null;
};

export default Grid;