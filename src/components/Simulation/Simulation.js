import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import Body from './Body';
import Arrow from './Arrow';
import AccelerationArrow from './AccelerationArrow';
import SimulationControls from './SimulationControls';
import useBodies from './useBodies';
import useMouseInteractions from './useMouseInteractions';
import { computeAcceleration } from '../../utils/physics';
// Default bodies
const initialBodies = [
  { id: 1, position: [3, 3, 0], velocity: [0, 0, 0], mass: 40, radius: 0.2, color: '#0000FF', name: 'Mass 1'},
  { id: 2, position: [-3, 3, 0], velocity: [0, 0, 0], mass: 40, radius: 0.2, color: '#00FF00', name: 'Mass 2'},
  { id: 3, position: [0, -3, 0], velocity: [0, 0, 0], mass: 40, radius: 0.2, color: '#FF0000', name: 'Mass 3'},
];

const Simulation = () => {
  const [showGrid, setShowGrid] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBody, setSelectedBody] = useState(null);
  const [hoveredBody, setHoveredBody] = useState(null);
  const [timeScale, setTimeScale] = useState(1);
  const [frameRateMultiplier, setFrameRateMultiplier] = useState(1);
  const { bodies, setBodies, bodiesRefs, resetBodies, trailsRefs  } = useBodies(initialBodies, isRunning, timeScale, frameRateMultiplier);
  const cameraRef = useRef();
  const [showVelocityArrows, setShowVelocityArrows] = useState(true);
  const [showAccelerationArrows, setShowAccelerationArrows] = useState(true);
  const [gridSize, setGridSize] = useState(50);
  const [gridSpacing, setGridSpacing] = useState(50);
  const [showNames, setShowNames] = useState(true);

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
    setTimeScale(1)
    setIsRunning(false);
    setSelectedBody(null);

    Object.values(bodiesRefs.current).forEach(bodyRef => {
      if (bodyRef.current && bodyRef.current.clearTrail) {
        bodyRef.current.clearTrail(); // Call clearTrail function directly
      }
    });
  }, [resetBodies, bodiesRefs]);

  const handleSpeedUp = () => setTimeScale(prev => prev * 2); // Speed up
  const handleSlowDown = () => setTimeScale(prev => prev / 2); // Slow down
  const handleReverse = () => setTimeScale(prev => -prev); // Reverse time

  const handleIncreaseFrameRate = () => setFrameRateMultiplier(prev => prev * 2); // Double the frame rate
  const handleDecreaseFrameRate = () => setFrameRateMultiplier(prev => prev / 2); // Halve the frame rate

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
          body.velocity[2] + velocityDelta[2]
        ],
      };
      return newBodies;
    });
  }, [setBodies]);


  
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
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
          {showGrid && <Grid showGrid={showGrid} gridSize={gridSize} gridSpacing={gridSpacing}/>}
          {bodies.map(body => (
            <React.Fragment key={body.id}>

              <Body
                key={body.id}
                body={body}
                isSelected={body.id === selectedBody}
                isHovered={body.id === hoveredBody} 
                ref={bodiesRefs.current.get(body.id)}
                showName = {showNames}
                trailRef={trailsRefs.current.get(body.id)}
              />
              <React.Fragment key={body.id}>
                {/*<Trail body={body} maxLength={5000} trailWidth={5} />*/}
              </React.Fragment>
              <React.Fragment key={body.id}>
                {showVelocityArrows && (<Arrow
                  key={`arrow-${body.id}`}
                  from={body.position}
                  to={[
                    body.position[0] + body.velocity[0],
                    body.position[1] + body.velocity[1],
                    body.position[2] + body.velocity[2],
                  ]}
                  velocity={body.velocity}
                  onUpdateVelocity={handleUpdateVelocity.bind(null, body.id)}
                />)}
                
              </React.Fragment>
              <React.Fragment key={body.id}>
                {showAccelerationArrows && <AccelerationArrow
                  key={`accelarrow-${body.id}`}
                  from={body.position}
                  to={[
                    body.position[0] + computeAcceleration(body, bodies)[0],
                    body.position[1] + computeAcceleration(body, bodies)[1],
                    body.position[2] + computeAcceleration(body, bodies)[2],
                  ]}
                />}
              </React.Fragment>
            </React.Fragment>
          ))}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={2}
            target={[0, 0, 0]}
            enabled={selectedBody === null}
          />
        </Canvas>
      </div>
      <SimulationControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        handleRestart={handleRestart}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        handleSpeedUp={handleSpeedUp}
        handleSlowDown={handleSlowDown}
        handleReverse={handleReverse}
        handleIncreaseFrameRate={handleIncreaseFrameRate}
        handleDecreaseFrameRate={handleDecreaseFrameRate}
        frameRateMultiplier={frameRateMultiplier} 
        timeScale={timeScale}
        bodies={bodies} 
        setBodies={setBodies} 
        setHoveredBody={setHoveredBody} 
        bodiesRef={bodiesRefs}
        setTime={setTimeScale}
        showVelocityArrows={showVelocityArrows}
        setShowVelocityArrows={setShowVelocityArrows}
        showAccelerationArrows={showAccelerationArrows}
        setShowAccelerationArrows={setShowAccelerationArrows}
        gridSize={gridSize}
        setGridSize={setGridSize}
        gridSpacing={gridSpacing}
        setGridSpacing={setGridSpacing}
        showNames = {showNames} 
        setShowNames = {setShowNames}
      />

    </div>
  );
};

export default Simulation;