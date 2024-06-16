import React from 'react';

const SimulationControls = ({
  isRunning,
  setIsRunning,
  handleRestart,
  showGrid,
  setShowGrid,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => setIsRunning(prev => !prev)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleRestart}>Restart</button>
      <button onClick={() => setShowGrid(prev => !prev)}>
        {showGrid ? 'Hide Grid' : 'Show Grid'}
      </button>
    </div>
  );
};

export default SimulationControls;