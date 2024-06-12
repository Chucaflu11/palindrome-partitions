import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { listen } from '@tauri-apps/api/event';

import "../styles/GraphArea.css";

function ImageGraph({ data }) {

  const graphWidth = 410;
  const graphHeight = 220;

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
    return (
      <div className="progress-bar-empty" >
        <div className="progress-bar-full" style={{ width: `${progress}%`,  background: '#58448f', height: '20px', borderRadius: '5px', color: 'white' }}>
          &nbsp;&nbsp;{progress.toFixed(2)}%
        </div>
      </div>
    );
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
              marker: { color: '#8d7bd9' },
              name: 'Algoritmo 1',
            },
            {
              x: data.lengths,
              y: data.times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: '#a38aab' },
              name: 'Algoritmo 2',
            },
          ]}
          layout={{ 
            width: graphWidth,
            height: graphHeight,
            title: 'Rendimiento General', 
            xaxis: { title: 'Longitud', gridcolor: '#FFFFFF' }, 
            yaxis: { title: 'Tiempo (s)', gridcolor: '#FFFFFF' },
            font: { size: 9 , color: 'white' },
            borderRadius: 10,
            paper_bgcolor: '#27272a',
            plot_bgcolor: '#27272a',
            margin: { autoexpand: true },
            autosize: true,
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
              marker: { color: '#8d7bd9' },
              name: 'Algoritmo 1',
            },
            {
              x: data.log_lengths,
              y: data.log_times_dp,
              type: 'scatter',
              mode: 'lines',
              marker: { color: '#a38aab' },
              name: 'Algoritmo 2',
            },
          ]}
          layout={{
            width: graphWidth,
            height: graphHeight,
            title: 'Escala Logarítmica',
            xaxis: { title: 'Log de Longitud', gridcolor: '#FFFFFF' },
            yaxis: { title: 'Log de Tiempo (s)', gridcolor: '#FFFFFF' },
            font: { size: 9, color: 'white' },
            plot_bgcolor: '#27272a',
            paper_bgcolor: '#27272a',
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
              marker: { color: '#8d7bd9' },
            },
          ]}
          layout={{ 
            width: graphWidth, 
            height: graphHeight, 
            title: 'Rendimiento Algoritmo 1', 
            xaxis: { title: 'Longitud', gridcolor: 'FFFFFF' }, 
            yaxis: { title: 'Tiempo (s)', gridcolor: 'FFFFFF' },
            font: { size: 9, color: 'white' },
            plot_bgcolor: '#27272a',
            paper_bgcolor: '#27272a',
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
              marker: { color: '#a38aab' },
            },
          ]}
          layout={{ 
            width: graphWidth, 
            height: graphHeight, 
            title: 'Rendimiento Algoritmo 2', 
            xaxis: { title: 'Longitud', gridcolor: '#FFFFFF' }, 
            yaxis: { title: 'Tiempo (s)', gridcolor: '#FFFFFF' },
            font: { size: 9, color: 'white' },
            plot_bgcolor: '#27272a',
            paper_bgcolor: '#27272a',
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
              marker: { color: '#8d7bd9' },
            },
          ]}
          layout={{ 
            width: graphWidth, 
            height: graphHeight, 
            title: 'Rendimiento logarítmico 1', 
            xaxis: { title: 'Log de Longitud', gridcolor: "#FFFFFF" }, 
            yaxis: { title: 'Log de Tiempo (s)', gridcolor: "#FFFFFF" },
            font: { size: 9, color: 'white' },
            plot_bgcolor: '#27272a',
            paper_bgcolor: '#27272a',
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
              marker: { color: '#a38aab' },
            },
          ]}
          layout={{ 
            width: graphWidth, 
            height: graphHeight, 
            title: 'Rendimiento logarítmico 2', 
            xaxis: { title: 'Log de Longitud', gridcolor:'#FFFFFF' }, 
            yaxis: { title: 'Log de Tiempo (s)', gridcolor:'#FFFFFF' },
            font: { size: 9, color: 'white' },
            plot_bgcolor: '#27272a',
            paper_bgcolor: '#27272a',
          }}
        />
      </div>
      <div className="progress-bar-empty" >
        <div className="progress-bar-full" style={{ width: `${progress}%`,  background: '#58448f', height: '20px', borderRadius: '5px', color: 'white' }}>
          &nbsp;&nbsp;{progress.toFixed(2)}%
        </div>
      </div>

    </div>
  );
}

export default ImageGraph;
