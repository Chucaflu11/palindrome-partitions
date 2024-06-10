import React from 'react';
import InputArea from './InputArea.jsx';
import GraphArea from './GraphArea.jsx';
import { invoke } from "@tauri-apps/api/tauri";
import "../styles/App.css";


async function cargarDatos() {
  try {
    const datosJson = await invoke('send_data');
    const datos = JSON.parse(datosJson);
    // Ahora tienes los datos de la struct Data como un objeto JavaScript en 'datos'
    console.log(datos.lengths);
    console.log(datos.times);
    // ... etc.
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function App() {
    cargarDatos();

    return (
        <div className="app-container">
            <div className="input-container">
              <InputArea />
            </div>
            <div className="graphs-container">
                <GraphArea />
            </div>
        </div>
    );
}

export default App;
