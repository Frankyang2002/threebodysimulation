import React from 'react';

const SimulationControls = ({
  isRunning,
  setIsRunning,
  handleRestart,
  showGrid,
  setShowGrid,
  combineOnCollision,
  setCombineOnCollision,
}) => {
  const handleToggleCollision = () => {
    setCombineOnCollision(prev => !prev); // Toggle between true and false
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => setIsRunning(prev => !prev)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleRestart}>Restart</button>
      <button onClick={() => setShowGrid(prev => !prev)}>
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
      <label style={{ marginLeft: '10px' }}>
        <input
          type="checkbox"
          checked={combineOnCollision}
          onChange={handleToggleCollision}
        />
        Combine Collisions
      </label>
    </div>
  );
};

export default SimulationControls;