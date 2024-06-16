import React, { useState, useEffect } from 'react';
import InputArea from './InputArea.jsx';
import GraphArea from './GraphArea.jsx';
import "../styles/App.css";

function App() {

  const [loadedData, setLoadedData] = useState(null);

    const handleDataLoaded = (data) => {
        setLoadedData(data);
    };

    return (
        <div className="app-container">
            <div className="input-container">
            <InputArea onDataLoaded={handleDataLoaded} /> 
            </div>
            <div className="graphs-container">
                <GraphArea data={loadedData} />
            </div>
            
        </div>
    );
}

export default App;
