import { useRef, useCallback } from 'react';
import * as THREE from 'three';

const useMouseInteractions = (bodiesRefs, setSelectedBody, setBodies, isRunning, cameraRef, selectedBody) => {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const handleMouseDown = useCallback((event) => {
    if (isRunning) return;

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
  }, [isRunning, bodiesRefs, cameraRef, setSelectedBody]);

  const handleMouseMove = useCallback((event) => {
    if (isRunning || selectedBody === null) return;

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

      newBodies[bodyIndex] = {
        ...body,
        position: [pos.x, pos.y]
      };
      return newBodies;
    });
  }, [isRunning, selectedBody, cameraRef, setBodies]);

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