import { useRef, useCallback } from 'react';
import * as THREE from 'three';

// Raycasting allows us to detect intersections between objects
const useMouseInteractions = (bodiesRefs, setSelectedBody, setBodies, isRunning, cameraRef, selectedBody) => {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const handleMouseDown = useCallback((event) => {
    // Moving masses only works when paused
    if (isRunning) return;

    // prevent default browser behaviour, such as highlighting text and text selection so our drag can work
    event.preventDefault();

    // getBoundingClientRect gives size of element relative to browser window
    // Then we get mouse positions as a percentage across the simulation, allows it to work for different screen sizes and zooms
    const rect = event.target.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create raycaster and check intersection with other bodies
    raycaster.current.setFromCamera(mouse.current, cameraRef.current);
    const intersects = raycaster.current.intersectObjects(
      Array.from(bodiesRefs.current.values()).map(ref => ref.current)
    );

    // Now we select the selected bdoy
    if (intersects.length > 0) {
      const selected = Array.from(bodiesRefs.current.keys()).find(
        key => bodiesRefs.current.get(key).current === intersects[0].object
      );
      setSelectedBody(selected);
    }
  }, [isRunning, bodiesRefs, cameraRef, setSelectedBody]);

  const handleMouseMove = useCallback((event) => {
    // if no selection or is not paused, cannot move a body
    if (isRunning || selectedBody === null) return;

    // Same as handleMouseDown
    event.preventDefault();

    // Same as handleMouseDown
    const rect = event.target.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Concerts 
    const newPosition = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    newPosition.unproject(cameraRef.current);

    // Calculate direction vector to 3d Position
    const dir = newPosition.sub(cameraRef.current.position).normalize();
    const distance = -cameraRef.current.position.z / dir.z;
    const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

    // Update body position
    setBodies(prevBodies => {
      const newBodies = [...prevBodies];
      const bodyIndex = newBodies.findIndex(body => body.id === selectedBody);
      const body = newBodies[bodyIndex];

      newBodies[bodyIndex] = {
        ...body,
        position: [pos.x, pos.y]
      };
      return newBodies;
    });
  }, [isRunning, selectedBody, cameraRef, setBodies]);

  // Deselect selected mass
  const handleMouseUp = useCallback(() => {
    setSelectedBody(null);
  }, [setSelectedBody]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useMouseInteractions;