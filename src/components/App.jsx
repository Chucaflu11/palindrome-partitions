import React, { useState, useEffect } from 'react';
import InputArea from './InputArea.jsx';
import GraphArea from './GraphArea.jsx';
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from '@tauri-apps/api/event';
import "../styles/App.css";

function App() {

  const [progress, setProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  // Función para cargar datos (fuera del useEffect)
  const cargarDatos = async (lowerBound, upperBound) => {
    try {
      const datosJson = await invoke('send_data', { lowerBound, upperBound });
      const datos = JSON.parse(datosJson);
      // Aquí puedes hacer algo con los datos si es necesario
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  // handleProcesar (también fuera del useEffect)
  const handleProcesar = (lowerBound, upperBound) => {
    if (!isFetching) {
      setIsFetching(true);
      cargarDatos(lowerBound, upperBound);
    }
  };

  useEffect(() => {

    // Escuchar eventos de progreso
    const unlisten = listen('progress', event => {
      setProgress(event.payload * 100);
    });

    // Limpiar el listener
    return () => {
      unlisten.then(f => f());
    };
  }, []);

    return (
        <div className="app-container">
            <div className="input-container">
            <InputArea onProcesar={handleProcesar} /> 
            </div>
            <div className="graphs-container">
                <GraphArea />
            </div>
            <div style={{ width: '100%', background: '#ccc', marginTop: '10px' }}>
              <div style={{ width: `${progress}%`, background: '#4caf50', height: '24px' }}>
                {progress.toFixed(2)}%
              </div>
          </div>
        </div>
    );
}

export default App;
