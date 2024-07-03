import React, { useState, useCallback, useEffect, useRef } from 'react';
import { computeAcceleration} from '../../utils/physics';

const useBodies = (initialBodies, isRunning, timeScale, frameRateMultiplier) => {
    const [bodies, setBodies] = useState([]);
    const bodiesRefs = useRef(new Map());

    // Initialise bodies and puts references on them
    useEffect(() => {
      setBodies(initialBodies.map(body => ({
        ...body,
      }))); 

      initialBodies.forEach(body => {
        if (!bodiesRefs.current.has(body.id)) {
            bodiesRefs.current.set(body.id, React.createRef());
        }
      });
    }, [initialBodies]);

    
    // Calculate new position and velocity for all bodies with dt, works with computeAcceleration to get accel of each body
    const updateBodies = useCallback(() => {
        const dt = 0.001 * (Math.abs(timeScale/frameRateMultiplier)); // Adjust dt by time scale

        setBodies(prevBodies => {
          let newBodies = prevBodies.map(body => {
            const [ax, ay, az] = computeAcceleration(body, prevBodies);

            // s = ut + 1/2 at^2
            const newPosition = [
              body.position[0] + body.velocity[0] * dt + 0.5 * ax * dt * dt,
              body.position[1] + body.velocity[1] * dt + 0.5 * ay * dt * dt,
              body.position[2] + body.velocity[2] * dt + 0.5 * az * dt * dt,
            ];

            // Update velocity using the computed acceleration
            const newVelocity = [
              body.velocity[0] + ax * dt,
              body.velocity[1] + ay * dt,
              body.velocity[2] + az * dt,
            ];

            return {
              ...body,
              velocity: newVelocity,
              position: newPosition,
            };
          });
    
          return newBodies;
        });
      }, [timeScale, frameRateMultiplier]);

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(updateBodies,  0.1); 
            return () => clearInterval(interval); // cleanup function
        }
    }, [isRunning, updateBodies, frameRateMultiplier]);

    // Resets bodies to the initial bodies
    const resetBodies = () => {
      setBodies(initialBodies.map(body => ({
        ...body,
      })));

      bodiesRefs.current.clear()
      initialBodies.forEach(body => {
        if (!bodiesRefs.current.has(body.id)) {
            bodiesRefs.current.set(body.id, React.createRef());
        }
      });

    };

    return { bodies, setBodies, bodiesRefs, resetBodies };
};

export default useBodies;