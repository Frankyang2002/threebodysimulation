import React from 'react';
import { Line } from '@react-three/drei';

const Grid = () => {
  const lines = [];

  for (let i = -20; i <= 20; i++) {
    lines.push(
      <Line key={`h${i}`} points={[[-20, i, 0], [20, i, 0]]} color="gray" lineWidth={0.5} />,
      <Line key={`v${i}`} points={[[i, -20, 0], [i, 20, 0]]} color="gray" lineWidth={0.5} />
    );
  }

  return <group>{lines}</group>;
};

export default Grid;