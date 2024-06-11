import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { listen } from '@tauri-apps/api/event';

import "../styles/GraphArea.css";

function ImageGraph({ data }) {
  const [progress, setProgress] = useState(0);

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

  if (!data) {
    return (<div style={{ width: '100%', background: '#ccc', marginTop: '10px' }}>
      <div style={{ width: `${progress}%`, background: '#4caf50', height: '24px' }}>
        {progress.toFixed(2)}%
      </div>
    </div>); // or render a loading state
  }

  return (
    <div className='graph-container'>
      <div className='graph-grid'>
        {/* Rendimiento General */}
        <Plot
          data={[
            {
              x: data.lengths,
              y: data.times,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
              name: 'Algoritmo 1',
            },
            {
              x: data.lengths,
              y: data.times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
              name: 'Algoritmo 2',
            },
          ]}
          layout={{ 
            width: 320, 
            height: 240, 
            title: 'Rendimiento General', 
            xaxis: { title: 'Longitud' }, 
            yaxis: { title: 'Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
        {/* Escala logarítmica */}
        <Plot
          data={[
            {
              x: data.log_lengths,
              y: data.log_times,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
              name: 'Algoritmo 1',
            },
            {
              x: data.log_lengths,
              y: data.log_times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
              name: 'Algoritmo 2',
            },
          ]}
          layout={{
            width: 320,
            height: 240,
            title: 'Escala Logarítmica',
            xaxis: { title: 'Log de Longitud' },
            yaxis: { title: 'Log de Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
        {/* Rendimiento algoritmo 1 */}
        <Plot
          data={[
            {
              x: data.lengths,
              y: data.times,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
            },
          ]}
          layout={{ 
            width: 320, 
            height: 240, 
            title: 'Rendimiento Algoritmo 1', 
            xaxis: { title: 'Longitud' }, 
            yaxis: { title: 'Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
        {/* Rendimiento algoritmo 2 */}
        <Plot
          data={[
            {
              x: data.lengths,
              y: data.times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
            },
          ]}
          layout={{ 
            width: 320, 
            height: 240, 
            title: 'Rendimiento Algoritmo 2', 
            xaxis: { title: 'Longitud' }, 
            yaxis: { title: 'Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
        {/* Rendimiento algoritmo 1 Logarítmica */}
        <Plot
          data={[
            {
              x: data.log_lengths,
              y: data.log_times,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' },
            },
          ]}
          layout={{ 
            width: 320, 
            height: 240, 
            title: 'Rendimiento logarítmico 1', 
            xaxis: { title: 'Log de Longitud' }, 
            yaxis: { title: 'Log de Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
        {/* Rendimiento algoritmo 2 Logarítmica */}
        <Plot
          data={[
            {
              x: data.log_lengths,
              y: data.log_times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
            },
          ]}
          layout={{ 
            width: 320, 
            height: 240, 
            title: 'Rendimiento logarítmico 2', 
            xaxis: { title: 'Log de Longitud' }, 
            yaxis: { title: 'Log de Tiempo (ms)' },
            font: { size: 9 },
          }}
        />
      </div>
      <div style={{ width: '100%', background: '#ccc', marginTop: '10px' }}>
        <div style={{ width: `${progress}%`, background: '#4caf50', height: '24px' }}>
          {progress.toFixed(2)}%
        </div>
      </div>

    </div>
  );
}

export default ImageGraph;
