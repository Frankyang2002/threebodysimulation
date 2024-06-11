import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import Body from './Body';

const initialBodies = [
  { position: [0, 2], prevPosition: [0, 1.99], velocity: [0, -0.2], mass: 60},
  { position: [8, 2], prevPosition: [8, 2.01], velocity: [0, -0.2], mass: 60},
  { position: [-2, -2], prevPosition: [-2, -2.01], velocity: [2, 0], mass: 60 },
]
  
// Simulation Logic
const Simulation = () => {
  // Initialisation
  const [bodies, setBodies] = useState(initialBodies)
  const [showGrid, setShowGrid] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

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
    const newBodies = [...bodies];
    const combinedBodies = new Set(); // To keep track of already combined bodies

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const dx = bodies[i].position[0] - bodies[j].position[0];
        const dy = bodies[i].position[1] - bodies[j].position[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < collisionDistance && !combinedBodies.has(i) && !combinedBodies.has(j)) {
          // Calculate total mass
          const totalMass = bodies[i].mass + bodies[j].mass;

          // Calculate new position as a center of mass
          const newPosition = [
            (bodies[i].position[0] * bodies[i].mass + bodies[j].position[0] * bodies[j].mass) / totalMass,
            (bodies[i].position[1] * bodies[i].mass + bodies[j].position[1] * bodies[j].mass) / totalMass,
          ];

          // Calculate new velocity as a momentum conservation
          const newVelocity = [
            (bodies[i].velocity[0] * bodies[i].mass + bodies[j].velocity[0] * bodies[j].mass) / totalMass,
            (bodies[i].velocity[1] * bodies[j].mass + bodies[j].velocity[1] * bodies[j].mass) / totalMass,
          ];

          // Create new combined body
          const newBody = {
            position: newPosition,
            prevPosition: newPosition, // Initial prev position same as position
            velocity: newVelocity,
            mass: totalMass,
          };

          // Mark the original bodies as combined
          combinedBodies.add(i);
          combinedBodies.add(j);

          // Replace the first body with the new combined body
          newBodies[i] = newBody;
          // Remove the second body
          newBodies.splice(j, 1);
          j--; // Adjust the index after removal
        }
      }
    }

    return newBodies.filter((_, index) => !combinedBodies.has(index));
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
      <div style={{ width: '800px', height: '600px', position: 'relative' }}>
        <Canvas
          camera={{
            position: [0, 0, 20], // Initial position to view the entire simulation
            fov: 75,              // Field of view
            near: 0.1,            // Near clipping plane
            far: 1000,            // Far clipping plane
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {bodies.map((body, index) => (
            <Body key={index} body={body} />
          ))}
          {showGrid && <Grid />}
          <OrbitControls
            enablePan={true}
            panSpeed={1}
            enableZoom={true}
            zoomSpeed={0.5} // Adjust zoom speed
            enableRotate={false} // Disable rotation
            maxDistance={40} // Maximum distance camera can zoom out
            minDistance={5} // Minimum distance camera can zoom in
            target={[0, 0, 0]} // Ensure the camera is centered on the scene
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Simulation;