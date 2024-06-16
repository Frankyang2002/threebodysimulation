import React, { useState, useCallback, useEffect, useRef } from 'react';
import { computeAcceleration} from '../../utils/physics';

const useBodies = (initialBodies, isRunning) => {
    const [bodies, setBodies] = useState([]);
    const bodiesRefs = useRef(new Map());

    // Initialise bodies and puts references on them
    useEffect(() => {
        setBodies(initialBodies.map(body => ({ ...body }))); // Clone initial bodies
        initialBodies.forEach(body => {
        if (!bodiesRefs.current.has(body.id)) {
            bodiesRefs.current.set(body.id, React.createRef());
        }
        });
    }, [initialBodies]);

    
    // Calculate new position and velocity for all bodies with dt, works with computeAcceleration to get accel of each body
    const updateBodies = useCallback(() => {
        const dt = 0.01;
        setBodies(prevBodies => {
            let newBodies = prevBodies.map(body => {
                const [ax, ay] = computeAcceleration(body, prevBodies);
                // s = ut + 1/2 at^2
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

            return newBodies;
        });
    }, []);

    // Updates at 60 frames per seconds
    useEffect(() => {
        if (isRunning) {
        const interval = setInterval(updateBodies, 16); 
        return () => clearInterval(interval);
        }
    }, [isRunning, updateBodies]);

    // Resets bodies to the initial bodies
    const resetBodies = () => {
        setBodies(initialBodies.map(body => ({ ...body })));
    };

    return { bodies, setBodies, bodiesRefs, resetBodies };
};

export default useBodies;