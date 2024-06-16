import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import Body from './Body';
import Arrow from './Arrow';
import SimulationControls from './SimulationControls';
import useBodies from './useBodies';
import useMouseInteractions from './useMouseInteractions';

// Default bodies
const initialBodies = [
  { id: 1, position: [3, 3], velocity: [0, 0], mass: 40, radius: 0.2 },
  { id: 2, position: [-3, 3], velocity: [0, 0], mass: 80, radius: 0.2 },
  { id: 3, position: [0, -3], velocity: [0, 0], mass: 40, radius: 0.2 },
];

const Simulation = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBody, setSelectedBody] = useState(null);
  const { bodies, setBodies, bodiesRefs, resetBodies } = useBodies(initialBodies, isRunning);
  const cameraRef = useRef();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useMouseInteractions(
    bodiesRefs,
    setSelectedBody,
    setBodies,
    isRunning,
    cameraRef,
    selectedBody
  );

  const handleRestart = useCallback(() => {
    resetBodies();
    setIsRunning(false);
    setSelectedBody(null);
  }, [resetBodies]);

  const handleUpdateVelocity = useCallback((bodyId, velocityDelta) => {
    setBodies(prevBodies => {
      const newBodies = [...prevBodies];
      const bodyIndex = newBodies.findIndex(body => body.id === bodyId);
      const body = newBodies[bodyIndex];

      newBodies[bodyIndex] = {
        ...body,
        velocity: [
          body.velocity[0] + velocityDelta[0],
          body.velocity[1] + velocityDelta[1],
        ],
      };
      return newBodies;
    });
  }, [setBodies]);

  return (
    <div>
      <SimulationControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        handleRestart={handleRestart}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
      />
      <div
        style={{ width: '800px', height: '600px', position: 'relative' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Canvas
          camera={{ position: [0, 0, 10], near: 0.1, far: 1000 }}
          onCreated={({ camera }) => (cameraRef.current = camera)}
        >
          {showGrid && <Grid />}
          {bodies.map(body => (
            <Body
              key={body.id}
              body={body}
              isSelected={body.id === selectedBody}
              ref={bodiesRefs.current.get(body.id)}
            />
          ))}
          {bodies.map(body => (
            <Arrow
              key={`arrow-${body.id}`}
              from={body.position}
              to={[
                body.position[0] + body.velocity[0],
                body.position[1] + body.velocity[1],
              ]}
              velocity={body.velocity}
              onUpdateVelocity={handleUpdateVelocity.bind(null, body.id)}
            />
          ))}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            minDistance={10}
            maxDistance={50}
            target={[0, 0, 0]}
            enabled={selectedBody === null}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Simulation;