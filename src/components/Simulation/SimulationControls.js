
import React, { useState, useRef, useEffect} from 'react';
import { SketchPicker } from 'react-color';

const SimulationControls = ({
  bodiesRef,
  bodies,
  setBodies,
  setHoveredBody,

  isRunning,
  setIsRunning,
  handleRestart,

  handleSpeedUp,
  handleSlowDown,

  timeScale,
  setTime,
  
  showVelocityArrows,
  setShowVelocityArrows,
  showAccelerationArrows,
  setShowAccelerationArrows,

  showGrid,
  setShowGrid,
  gridSize,
  setGridSize, 
  gridSpacing,
  setGridSpacing,

  showNames,
  setShowNames
}) => {

  const [hoveredMass, setHoveredMass] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedMass, setSelectedMass] = useState(null);
  const colorPickerRef = useRef(null); // Reference to color picker element
  const [editValue, setEditValue] = useState({ id: null, property: '', index: -1, value: '' });





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


  const commitEdit = () => {
    if (editValue.id !== null && editValue.property !== null) {
      setBodies(prevBodies => {
        const newBodies = [...prevBodies];
        const bodyIndex = newBodies.findIndex(body => body.id === editValue.id);
        if (bodyIndex !== -1) {
          const body = { ...newBodies[bodyIndex]};
          let newValue = editValue.value.trim(); // Trim whitespace

          
          // Validate and parse as needed
          if (editValue.property === 'velocity' || editValue.property === 'position') {
            // Parse float for numerical fields
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) {
              newValue = 0; // Replace with 0 if NaN or empty
            }
          } else {
            // For non-numerical fields like mass or radius, handle differently if needed
            newValue = newValue || '0'; // Replace empty with '0'
          }
          // Update body based on the property and index
          if (editValue.property === 'mass') {
            body.mass = parseFloat(newValue)|| body.mass;
          } else if (editValue.property === 'radius') {
            body.radius = parseFloat(newValue) || body.radius;
          } else if (editValue.property === 'velocity') {
            body.velocity[editValue.index] = newValue;
          } else if (editValue.property === 'position') {
            body.position[editValue.index] = newValue;
          } else if (editValue.property === 'name') {
            body.name = newValue;
          }
          newBodies[bodyIndex] = body;
        }
        return newBodies;
      });
      // Clear edit state after commit
      setEditValue({ id: null, property: null, index: null, value: '' });
    }
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
      color: '#7FFFF4',
      name: 'Mass ' + newId
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
        <span>Grid Size:</span>
        <input
          type="number"
          value={gridSize}
          onChange={e => setGridSize(parseFloat(e.target.value))}
          style={{ marginLeft: '5px', width: '50px', textAlign: 'left' }}
        />
        <span>Grid Spacing:</span>
        <input
          type="number"
          value={gridSpacing}
          onChange={e => setGridSpacing(parseFloat(e.target.value))}
          style={{ marginLeft: '5px', width: '50px', textAlign: 'left' }}
        />
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
          Show Velocity
        </label>
        <label>
          <input
            type="checkbox"
            checked={showAccelerationArrows}
            onChange={(e) => setShowAccelerationArrows(e.target.checked)}
          />
          Show Acceleration
        </label>
        <label>
          <input
            type="checkbox"
            checked={showNames}
            onChange={(e) => setShowNames(e.target.checked)}
          />
          Show Names
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
                <label>Name:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'name' ? editValue.value : body.name}
                  onChange={e => setEditValue({ id: body.id, property: 'name', index: 0, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Mass:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'mass' ? editValue.value : body.mass}
                  onChange={e => setEditValue({ id: body.id, property: 'mass', index: 0, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Radius:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'radius' ? editValue.value : body.radius}
                  onChange={e => setEditValue({ id: body.id, property: 'radius', index: 0, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Position X:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'position' && editValue.index === 0 ? editValue.value : body.position[0]}
                  onChange={e => setEditValue({ id: body.id, property: 'position', index: 0, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Y:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'position' && editValue.index === 1 ? editValue.value : body.position[1]}
                  onChange={e => setEditValue({ id: body.id, property: 'position', index: 1, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Z:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'position' && editValue.index === 2 ? editValue.value : body.position[2]}
                  onChange={e => setEditValue({ id: body.id, property: 'position', index: 2, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
              </div>
              <div>
                <label>Velocity X:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'velocity' && editValue.index === 0 ? editValue.value : body.velocity[0]}
                  onChange={e => setEditValue({ id: body.id, property: 'velocity', index: 0, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Y:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'velocity' && editValue.index === 1 ? editValue.value : body.velocity[1]}
                  onChange={e => setEditValue({ id: body.id, property: 'velocity', index: 1, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
                  style={{ marginLeft: '5px', width: '60px' }}
                />
                <label>Z:</label>
                <input
                  type="text"
                  value={editValue.id === body.id && editValue.property === 'velocity' && editValue.index === 2 ? editValue.value : body.velocity[2]}
                  onChange={e => setEditValue({ id: body.id, property: 'velocity', index: 2, value: e.target.value })}
                  onBlur={commitEdit} // Commit edit on blur
                  onKeyUp={e => e.key === 'Enter' && commitEdit()} // Commit edit on Enter key
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


