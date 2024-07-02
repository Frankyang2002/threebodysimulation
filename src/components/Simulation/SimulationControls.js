
import React, { useState, useRef, useEffect} from 'react';
import { SketchPicker } from 'react-color';

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
  bodiesRef,
  showVelocityArrows,
  setShowVelocityArrows,
  showAccelerationArrows,
  setShowAccelerationArrows
}) => {

  const [hoveredMass, setHoveredMass] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedMass, setSelectedMass] = useState(null);
  const colorPickerRef = useRef(null); // Reference to color picker element

 // Update the bodiesRef when bodies change
  useEffect(() => {
  bodies.forEach((body) => {
      if (!bodiesRef.current.has(body.id)) {
        bodiesRef.current.set(body.id, React.createRef());
      }
    });
  }, [bodies, bodiesRef]);

  useEffect(() => {
    // Function to close color picker when clicking outside of it
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
        setSelectedMass(null);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    console.log(bodies)
    console.log(bodies.length)
    const newId = bodies.length + 1; // Generate new ID
    const newMass = {
      id: newId,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      mass: 10,
      radius: 0.2, 
      color: '#7FFFF4' 
    };
    setBodies(prevBodies => [...prevBodies, newMass]);
  };



  const handleColorChange = (color) => {
    if (selectedMass !== null) {
      setBodies(prevBodies => {
        const newBodies = prevBodies.map(body => {
          if (body.id === selectedMass) {
            return { ...body, color: color.hex };
          }
          return body;
        });
        return newBodies;
      });
    }
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
      <div>
        <label>
          <input
            type="checkbox"
            checked={showVelocityArrows}
            onChange={(e) => setShowVelocityArrows(e.target.checked)}
          />
          Show Velocity Arrows
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showAccelerationArrows}
            onChange={(e) => setShowAccelerationArrows(e.target.checked)}
          />
          Show Acceleration Arrows
        </label>
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
                color: 'black',
                position: 'relative', 
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
              <div>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: body.color,
                    border: '1px solid black',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '13px',
                    left: '10px', // Adjust position as needed
                  }}
                  onClick={() => {
                    setShowColorPicker(true);
                    setSelectedMass(body.id);
                  }}
                />
                {showColorPicker && selectedMass === body.id && (
                  <div
                    ref={colorPickerRef}
                    style={{
                      position: 'absolute',
                      zIndex: 10
                    }}
                  >
                    <SketchPicker
                      color={body.color}
                      onChangeComplete={color => handleColorChange(color)}
                    />
                  </div>
                )}
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


