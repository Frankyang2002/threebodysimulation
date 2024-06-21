import React, { useState } from 'react';

const SimulationControls = ({
  isRunning,
  setIsRunning,
  handleRestart,
  showGrid,
  setShowGrid,
  handleSpeedUp,
  handleSlowDown,
  handleReverse,
  timeScale,
  handleIncreaseFrameRate,
  handleDecreaseFrameRate,
  frameRateMultiplier,
  bodies,
  setBodies,
  setHoveredBody,
  bodiesRef
}) => {
  const [hoveredMass, setHoveredMass] = useState(null);

  const handleChangeMass = (id, newMass) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, mass: parseFloat(newMass).toFixed(4) || body.mass.toFixed(4) }; // Parse float to handle empty string or invalid input
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangeRadius = (id, newRadius) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, radius: parseFloat(newRadius).toFixed(4) || body.radius.toFixed(4) };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangePositionX = (id, newX) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, position: [parseFloat(newX).toFixed(4) || body.position[0].toFixed(4), body.position[1].toFixed(4)] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangePositionY = (id, newY) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, position: [body.position[0].toFixed(4), parseFloat(newY).toFixed(4) || body.position[1].toFixed(4)] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangeVelocityX = (id, newVX) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, velocity: [parseFloat(newVX).toFixed(4) || body.velocity[0].toFixed(4), body.velocity[1].toFixed(4)] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangeVelocityY = (id, newVY) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, velocity: [body.velocity[0].toFixed(4), parseFloat(newVY).toFixed(4) || body.velocity[1].toFixed(4)] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleAddMass = () => {
    const newId = bodies.length + 1; // Generate new ID
    const newMass = {
      id: newId,
      position: [0, 0],
      velocity: [0, 0],
      mass: 0,
      radius: 0.2, // Initial radius, adjust as needed
    };
    setBodies(prevBodies => [...prevBodies, newMass]);
  };

  
  return (
    <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <button onClick={() => setIsRunning(prev => !prev)}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={handleRestart}>Restart</button>
      </div>
      <div>
        <button onClick={() => setShowGrid(prev => !prev)}>
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>
      <div>
        <span>Time Scale: {timeScale}</span>
        <button onClick={handleSpeedUp}>Speed Up</button>
        <button onClick={handleSlowDown}>Slow Down</button>
        <button onClick={handleReverse}>Reverse Time</button>
      </div>
      <div>
        <span>Frame Rate: {frameRateMultiplier * 60}</span>
        <button onClick={handleIncreaseFrameRate}>Increase Frame Rate</button>
        <button onClick={handleDecreaseFrameRate}>Decrease Frame Rate</button>
      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <h3>Masses</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {bodies.map(body => (
            <li
              key={body.id}
              onMouseEnter={() => {
                setHoveredBody(body.id);
                setHoveredMass(body.id);
              }}
              onMouseLeave={() => {
                setHoveredBody(null);
                setHoveredMass(null);
              }}
              style={{
                cursor: 'pointer',
                border: '1px solid black',
                borderRadius: '4px',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: hoveredMass === body.id ? '#ddd' : 'white',
                transition: 'background-color 0.3s ease',
                color: 'black'
              }}
            >
              <div>
                <label>Mass:</label>
                <input
                  type="text"
                  value={parseFloat(body.mass).toFixed(4)}
                  onChange={e => handleChangeMass(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Radius:</label>
                <input
                  type="text"
                  value={parseFloat(body.radius).toFixed(4)}
                  onChange={e => handleChangeRadius(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Position X:</label>
                <input
                  type="text"
                  value={parseFloat(body.position[0]).toFixed(4)}
                  onChange={e => handleChangePositionX(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Y:</label>
                <input
                  type="text"
                  value={parseFloat(body.position[1]).toFixed(4)}
                  onChange={e => handleChangePositionY(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Velocity X:</label>
                <input
                  type="text"
                  value={parseFloat(body.velocity[0]).toFixed(4)}
                  onChange={e => handleChangeVelocityX(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Y:</label>
                <input
                  type="text"
                  value={parseFloat(body.velocity[1]).toFixed(4)}
                  onChange={e => handleChangeVelocityY(body.id, e.target.value)}
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
            </li>
          ))}
          <li>
            <button onClick={handleAddMass}>Add Mass</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationControls;


