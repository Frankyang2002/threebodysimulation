import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import Body from './Body';
import Arrow from './Arrow';

const initialBodies = [
  { position: [1, 2], prevPosition: [1, 1.99], velocity: [0, -0.2], mass: 40},
  { position: [5, 2], prevPosition: [5, 2.01], velocity: [0, -0.2], mass: 80},
  { position: [-4, -2], prevPosition: [-4, -2.01], velocity: [2, 0], mass: 40 },
]
  
// Simulation Logic
const Simulation = () => {
  // Initialisation
  const [bodies, setBodies] = useState(initialBodies)
  const [showGrid, setShowGrid] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBody, setSelectedBody] = useState(null);
  const [mousePosition, setMousePosition] = useState([0, 0]);

  const computeAcceleration = (body, bodies) => {
    const G = 1; // Gravitational constant
    let ax = 0, ay = 0;

    bodies.forEach(otherBody => {
      if (body !== otherBody) {
        const dx = otherBody.position[0] - body.position[0];
        const dy = otherBody.position[1] - body.position[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (G * body.mass * otherBody.mass) / (distance * distance);
        ax += force * dx / distance / body.mass;
        ay += force * dy / distance / body.mass;
      }
    });

    return [ax, ay];
  };

  const detectAndHandleCollisions = (bodies) => {
    const collisionDistance = 0.2; // Distance at which we consider two bodies to have collided
    let newBodies = [...bodies];
    const combinedIndices = new Set(); // To keep track of already combined bodies
  
    for (let i = 0; i < bodies.length; i++) {
      if (combinedIndices.has(i)) continue;
  
      for (let j = i + 1; j < bodies.length; j++) {
        if (combinedIndices.has(j)) continue;
  
        const dx = bodies[i].position[0] - bodies[j].position[0];
        const dy = bodies[i].position[1] - bodies[j].position[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < collisionDistance) {
          // Calculate total mass
          const totalMass = bodies[i].mass + bodies[j].mass;
  
          // Calculate new position as the center of mass
          const newPosition = [
            (bodies[i].position[0] * bodies[i].mass + bodies[j].position[0] * bodies[j].mass) / totalMass,
            (bodies[i].position[1] * bodies[i].mass + bodies[j].position[1] * bodies[j].mass) / totalMass,
          ];
  
          // Calculate new velocity to conserve momentum
          const newVelocity = [
            (bodies[i].velocity[0] * bodies[i].mass + bodies[j].velocity[0] * bodies[j].mass) / totalMass,
            (bodies[i].velocity[1] * bodies[i].mass + bodies[j].velocity[1] * bodies[j].mass) / totalMass,
          ];
  
          // Create new combined body
          const newBody = {
            position: newPosition,
            prevPosition: newPosition, // Initial prev position same as position
            velocity: newVelocity,
            mass: totalMass,
          };
  
          // Mark the original bodies as combined
          combinedIndices.add(i);
          combinedIndices.add(j);
  
          // Add the new combined body
          newBodies.push(newBody);
        }
      }
    }
  
    // Filter out the original bodies that have been combined
    newBodies = newBodies.filter((_, index) => !combinedIndices.has(index));
  
    return newBodies;
  };


  // Using verlet integration method, apparently much better and more stable
  // it avoids velocity computation and uses approximations so its not so accurate, will change if important
  // Need to test time steps as it is very sensitive to it
  const updateBodies = useCallback(() => {
    const dt = 0.01; // Time step

    let newBodies = bodies.map(body => {
      const [ax, ay] = computeAcceleration(body, bodies);

      // New position using Verlet integration
      const newPosition = [
        2 * body.position[0] - body.prevPosition[0] + ax * dt * dt,
        2 * body.position[1] - body.prevPosition[1] + ay * dt * dt,
      ];

      return {
        ...body,
        prevPosition: body.position, // Update previous position
        position: newPosition,       // Update current position
        velocity: [
          (newPosition[0] - body.prevPosition[0]) / (2 * dt),
          (newPosition[1] - body.prevPosition[1]) / (2 * dt),
        ],
      };
    });

    newBodies = detectAndHandleCollisions(newBodies);

    setBodies(newBodies);
  }, [bodies]);

  useEffect(() => {
  if (isRunning) {
    const interval = setInterval(updateBodies, 16); // Update at approximately 60fps
    return () => clearInterval(interval);
  }
  }, [isRunning, updateBodies]);


  const handleRestart = () => {
    setBodies([...initialBodies]);
    setIsRunning(false);
  };

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const x = (offsetX / event.target.clientWidth) * 2 - 1;
    const y = -(offsetY / event.target.clientHeight) * 2 + 1;
    setMousePosition([x, y]);

    const selected = bodies.findIndex((body) => {
      if (!body.position) return false; // Guard clause
      const dx = body.position[0] - x * 10;
      const dy = body.position[1] - y * 10;
      return Math.sqrt(dx * dx + dy * dy) < 0.2;
    });

    if (selected !== -1) {
      setSelectedBody(selected);
    }
  };

  const handleMouseMove = (event) => {
    if (selectedBody !== null) {
      const { offsetX, offsetY } = event.nativeEvent;
      const x = (offsetX / event.target.clientWidth) * 2 - 1;
      const y = -(offsetY / event.target.clientHeight) * 2 + 1;
      setMousePosition([x, y]);

      const newBodies = bodies.map((body, index) => {
        if (index === selectedBody) {
          return {
            ...body,
            position: [x * 10, y * 10],
          };
        }
        return body;
      });
      setBodies(newBodies);
    }
  };

  const handleMouseUp = () => {
    setSelectedBody(null);
  };

  // Canvas come from react-three-fibre and now we have 3D rendering context
  // Get illumination and we render the body into scene
  return (
    <div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleRestart}>
        Restart
      </button>
      <button onClick={() => setShowGrid(!showGrid)}>
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
      <div
        style={{ width: '800px', height: '600px', position: 'relative' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Canvas>
          {showGrid && <Grid />}
          {bodies.map((body, index) => (
            <Body key={index} body={body} isSelected={index === selectedBody} />
          ))}
          {bodies.map((body, index) => (
            <Arrow
              key={`arrow-${index}`}
              from={body.position}
              to={[
                body.position[0] + body.velocity[0],
                body.position[1] + body.velocity[1],
              ]}
              headLength={0.5} // Adjust these values to make the arrow heads larger
              headWidth={0.3}
            />
          ))}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6} // Control the speed of zooming
            minDistance={1} // Minimum distance camera can zoom out
            maxDistance={200} // Maximum distance camera can zoom in
            target={[0, 0, 0]} // Ensure the camera is centered on the scene
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Simulation;