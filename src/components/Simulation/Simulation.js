import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Grid from './Grid';
import Body from './Body';
import Arrow from './Arrow';
import SimulationControls from './SimulationControls';
import { computeAcceleration, combineCollidingBodies } from '../../utils/physics'; // Import other physics utility functions as needed

const initialBodies = [
  { id: 1, position: [3, 3], velocity: [0, 0], mass: 40, radius: 1 },
  { id: 2, position: [-3, 3], velocity: [0, 0], mass: 80, radius: 1 },
  { id: 3, position: [0, -3], velocity: [0, 0], mass: 40, radius: 1 },
];

const Simulation = () => {
  const [bodies, setBodies] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBody, setSelectedBody] = useState(null);
  const [combineOnCollision, setCombineOnCollision] = useState(false); // Switch state for collision behavior
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const cameraRef = useRef();
  const bodiesRefs = useRef(new Map());

  // Initialize bodies and refs
  useEffect(() => {
    setBodies(initialBodies.map(body => ({ ...body }))); // Clone initial bodies
    initialBodies.forEach(body => {
      if (!bodiesRefs.current.has(body.id)) {
        bodiesRefs.current.set(body.id, React.createRef());
      }
    });
  }, []);

  // Restart simulation
  const handleRestart = useCallback(() => {
    setBodies(initialBodies.map(body => ({ ...body }))); // Reset bodies to initial state
    setIsRunning(false);
    setSelectedBody(null);
  }, []);

  useEffect(() => {
    handleRestart(); // Call restart when component mounts
  }, [handleRestart]);

  // Update bodies based on physics
  const updateBodies = useCallback(() => {
    const dt = 0.01; // Time step

    setBodies(prevBodies => {
      let newBodies = prevBodies.map(body => {
        const [ax, ay] = computeAcceleration(body, prevBodies);

        const newPosition = [
          body.position[0] + body.velocity[0] * dt + 0.5 * ax * dt * dt,
          body.position[1] + body.velocity[1] * dt + 0.5 * ay * dt * dt,
        ];

        return {
          ...body,
          position: newPosition,
          velocity: [
            body.velocity[0] + ax * dt,
            body.velocity[1] + ay * dt,
          ],
        };
      });

      if (combineOnCollision) {
        newBodies = combineCollidingBodies(newBodies); // Combine colliding bodies and conserve momentum
      } else {
        // Handle other collision logic here if needed
      }

      return newBodies;
    });
  }, [combineOnCollision]);

  // Start or stop simulation based on isRunning state
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(updateBodies, 16); // Update at approximately 60fps
      return () => clearInterval(interval);
    }
  }, [isRunning, updateBodies]);

  // Handle mouse interaction for selecting and moving bodies
  const handleMouseDown = (event) => {
    if (isRunning) return; // Prevent interaction while simulation is running

    event.preventDefault();

    const rect = event.target.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, cameraRef.current);

    const intersects = raycaster.current.intersectObjects(
      Array.from(bodiesRefs.current.values()).map(ref => ref.current)
    );

    if (intersects.length > 0) {
      const selected = Array.from(bodiesRefs.current.keys()).find(
        key => bodiesRefs.current.get(key).current === intersects[0].object
      );
      setSelectedBody(selected);
    }
  };

  const handleMouseMove = (event) => {
    if (isRunning || selectedBody === null) return; // Prevent interaction while simulation is running or no body is selected

    event.preventDefault();

    const rect = event.target.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const newPosition = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    newPosition.unproject(cameraRef.current);

    const dir = newPosition.sub(cameraRef.current.position).normalize();
    const distance = -cameraRef.current.position.z / dir.z;
    const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

    setBodies(prevBodies => {
      const newBodies = [...prevBodies];
      const bodyIndex = newBodies.findIndex(body => body.id === selectedBody);
      const body = newBodies[bodyIndex];

      // Update the position
      newBodies[bodyIndex] = {
        ...body,
        position: [pos.x, pos.y]
      };
      return newBodies;
    });
  };

  const handleMouseUp = () => {
    setSelectedBody(null);
  };

  const handleUpdateVelocity = useCallback((bodyId, velocityDelta) => {
    setBodies(prevBodies => {
      const newBodies = [...prevBodies];
      const bodyIndex = newBodies.findIndex(body => body.id === bodyId);
      const body = newBodies[bodyIndex];

      // Update velocity based on the arrow drag
      newBodies[bodyIndex] = {
        ...body,
        velocity: [
          body.velocity[0] + velocityDelta[0],
          body.velocity[1] + velocityDelta[1],
        ],
      };
      return newBodies;
    });
  }, []);

  return (
    <div>
      <SimulationControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        handleRestart={handleRestart}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        combineOnCollision={combineOnCollision}
        setCombineOnCollision={setCombineOnCollision} // Pass setCombineOnCollision to the controls
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
            enabled={selectedBody === null} // Disable controls when a mass is selected
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Simulation;