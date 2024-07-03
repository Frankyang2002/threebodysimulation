import React, { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import Trail from './Trail';
// Spherical body in 3D using three.js (Currenrtly only doing 2d now)
// forwardRef allows parent components to interact with Three.js mesh directly
const Body = forwardRef(({ body, isSelected, isHovered, showName, trailRef  }, ref) => (
  <>
  <mesh ref={ref} position={[body.position[0], body.position[1], body.position[2]]}>
    <sphereGeometry args={[body.radius, 32, 32, 32]} />
    <meshStandardMaterial color={isSelected ? '#FA9898' : isHovered ? '#FACF76' : body.color} />
    {showName && (
      <Text
        position={[body.radius * 0, body.radius * 1.5 + 0.3, 0]}
        fontSize={1 * body.radius}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.08}
        textAlign="center"
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="white"
        outlineOpacity={0.9}
      >
        {body.name}
      </Text>
    )}
  </mesh>
  {/*<Trail body={body} ref={trailRef} maxLength={0} trailWidth={0} />*/}
  </>
  
));

export default Body;