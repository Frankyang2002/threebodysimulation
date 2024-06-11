import React from 'react';
import { Line } from '@react-three/drei';

const Grid = () => {
  const lines = [];

  for (let i = -10; i <= 10; i++) {
    lines.push(
      <Line key={`h${i}`} points={[[-10, i, 0], [10, i, 0]]} color="gray" lineWidth={0.5} />,
      <Line key={`v${i}`} points={[[i, -10, 0], [i, 10, 0]]} color="gray" lineWidth={0.5} />
    );
  }

  return <group>{lines}</group>;
};

export default Grid;