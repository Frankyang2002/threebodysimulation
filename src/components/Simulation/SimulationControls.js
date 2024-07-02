
import React, { useState } from 'react';

const SimulationControls = ({
  isRunning,
  setIsRunning,
  handleRestart,
  showGrid,
  setShowGrid,
  handleSpeedUp,
  handleSlowDown,
  timeScale,
  bodies,
  setBodies,
  setHoveredBody,
  setTime,
  bodiesRef
}) => {
  const [hoveredMass, setHoveredMass] = useState(null);
  const handleChangeTime = (newTime) => {
    setTime(newTime)
  };

  const toggleGrid = () => {
    setShowGrid(1);

  };

  const toggle2DGrid = () => {
    setShowGrid(2);
  };

  const toggle3DGrid = () => {
    setShowGrid(3);

  };


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
          return { ...body, position: [parseFloat(newX) || body.position[0], body.position[1], body.position[2]] };
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
          return { ...body, position: [body.position[0], parseFloat(newY) || body.position[1], body.position[2]] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangePositionZ = (id, newZ) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, position: [body.position[0], body.position[1], parseFloat(newZ) || body.position[2]] };
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
          return { ...body, velocity: [parseFloat(newVX) || body.velocity[0], body.velocity[1], body.velocity[2]] };
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
          return { ...body, velocity: [body.velocity[0], parseFloat(newVY) || body.velocity[1], body.velocity[2]] };
        }
        return body;
      });
      return newBodies;
    });
  };

  const handleChangeVelocityZ = (id, newVZ) => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => {
        if (body.id === id) {
          return { ...body, velocity: [body.velocity[0], body.velocity[1], parseFloat(newVZ) || body.velocity[2]] };
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
      position: [0, 0, 0],
      velocity: [0, 0, 0],
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
        <button onClick={toggleGrid} style={{ fontWeight: showGrid === 1 ? 'bold' : 'normal' }}>
          Hide Grid
        </button>
        <button onClick={toggle2DGrid} style={{ fontWeight: showGrid === 2 ? 'bold' : 'normal' }}>
          2D Grid
        </button>
        <button onClick={toggle3DGrid} style={{ fontWeight: showGrid === 3 ? 'bold' : 'normal' }}>
          3D Grid
        </button>
      </div>
      <div>
        <span>Speed:</span>
        <button onClick={handleSlowDown}>&lt;</button>
        <input
          type="text"
          value={parseFloat(timeScale)}
          onChange={e => handleChangeTime(e.target.value)}
          style={{ marginLeft: '5px', width: '60px', textAlign: 'center'}}
        />
        <button onClick={handleSpeedUp}>&gt;</button>
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
                <label>Z:</label>
                <input
                  type="text"
                  value={parseFloat(body.position[2]).toFixed(4)}
                  onChange={e => handleChangePositionZ(body.id, e.target.value)}
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
                <label>Z:</label>
                <input
                  type="text"
                  value={parseFloat(body.velocity[2]).toFixed(4)}
                  onChange={e => handleChangeVelocityZ(body.id, e.target.value)}
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


