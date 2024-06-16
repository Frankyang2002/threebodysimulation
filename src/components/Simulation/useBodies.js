import React, { useState, useCallback, useEffect, useRef } from 'react';
import { computeAcceleration} from '../../utils/physics';

const useBodies = (initialBodies, isRunning) => {
    const [bodies, setBodies] = useState([]);
    const bodiesRefs = useRef(new Map());

    useEffect(() => {
        setBodies(initialBodies.map(body => ({ ...body }))); // Clone initial bodies
        initialBodies.forEach(body => {
        if (!bodiesRefs.current.has(body.id)) {
            bodiesRefs.current.set(body.id, React.createRef());
        }
        });
    }, [initialBodies]);

    

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

        return newBodies;
        });
    }, []);

    useEffect(() => {
        if (isRunning) {
        const interval = setInterval(updateBodies, 16); // Update at approximately 60fps
        return () => clearInterval(interval);
        }
    }, [isRunning, updateBodies]);

    const resetBodies = () => {
        setBodies(initialBodies.map(body => ({ ...body })));
    };

    return { bodies, setBodies, bodiesRefs, resetBodies };
};

export default useBodies;