import React from 'react';
import { Line } from '@react-three/drei';

const Grid = () => {
  const lines = [];

  for (let i = -50; i <= 50; i++) {
    lines.push(
      <Line key={`h${i}`} points={[[-50, i, 0], [50, i, 0]]} color="gray" lineWidth={0.5} />,
      <Line key={`v${i}`} points={[[i, -50, 0], [i, 50, 0]]} color="gray" lineWidth={0.5} />
    );
  }

  return <group>{lines}</group>;
};

export default Grid;