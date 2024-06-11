import React from 'react';
import Simulation from './components/Simulation/Simulation';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Three-Body Problem Simulation</h1>
        <div>
          <Simulation />
        </div>
        
      </header>
    </div>
  );
}

export default App;