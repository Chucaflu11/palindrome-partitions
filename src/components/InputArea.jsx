import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import "../styles/InputArea.css";

function InputArea({ onDataLoaded }) {
    const [inputText1, setInputText1] = useState('500');
    const [inputText2, setInputText2] = useState('800');
    const [outputText, setOutputText] = useState('');


    const [data, setData] = useState(null);
    const loadData = async () => {
        const lowerBound = parseInt(inputText1);
        const upperBound = parseInt(inputText2);
        try {
            const dataJson = await invoke('send_data', { lowerBound: lowerBound, upperBound: upperBound });
            const data = JSON.parse(dataJson);
            setData(data);
            onDataLoaded(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const readFromFile = async () => {
        const lowerBound = parseInt(inputText1);
        const upperBound = parseInt(inputText2);
        try {
            const content = await invoke('read_file', { filePath: '../public/random_content.txt', lowerBound: lowerBound, upperBound: upperBound });
            setOutputText(content.join('\n'));
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };
    readFromFile();

    const handleGenerateFile = async (inputText1, inputText2) => {
      const lowerBound = parseInt(inputText1);
      const upperBound = parseInt(inputText2);
      try {
          await invoke('generate_file', { lowerBound: lowerBound, upperBound: upperBound });
          readFromFile();
          console.log('File generated successfully');
      } catch (error) {
          console.error('Error generating file:', error);
      }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText).then(() => {
        console.log('Text copied to clipboard');
    }).catch((error) => {
        console.error('Error copying text:', error.message);
    });
};

    return (
      <div className="input-area">
        <div className="input-button-container">
          <div className="input-group">
            <label htmlFor="input1"> Límite inferior:</label>
            <input
              type="text"
              id="input1"
              value={inputText1}
              onChange={(e) => setInputText1(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="input2">Límite superior:</label>
            <input
              type="text"
              id="input2"
              value={inputText2}
              onChange={(e) => setInputText2(e.target.value)}
            />
          </div>
        </div>
        <p className='info-text'> *Límites propuestos para un equilibrio entre tiempo y resultados</p>
        <div className="data-button-container">
          <button className="generate-file-button" onClick={() => handleGenerateFile(inputText1, inputText2)}>Generar Archivo</button>
          <button className="load-data-button" onClick={() => loadData(inputText1, inputText2)}>Cargar Datos</button>
        </div>
        <div className="output-box-text">
          <p>Texto utilizado: </p>
          <button className="copy-button" onClick={copyToClipboard}></button>
        </div>
        <div className="output-box">
          {outputText}
        </div>

        <div className='description'>
          <p>
            {data ? (
              <>
                <span className="formatted-text">Pendiente de la escala logarítmica del algoritmo 1:<br /> - </span> &nbsp;&nbsp;&nbsp;{data.slope_times}<br />
                <span className="formatted-text">Pendiente de la escala logarítmica del algoritmo 2:<br /> - </span> &nbsp;&nbsp;&nbsp;{data.slope_times_dp}
              </>
            ) : (
              'Pendientes: -' 
            )}
          </p>
          <p>
            {data ? (
              <>
                <span className="formatted-text">Tiempo promedio del algoritmo 1 (s):<br /> - </span> &nbsp;&nbsp;&nbsp;{data.mean_times}<br />
                <span className="formatted-text">Tiempo promedio del algoritmo 2 (s):<br /> - </span> &nbsp;&nbsp;&nbsp;{data.mean_times_dp}
              </>
            ) : (
              'Promedios: -' 
            )}
          </p>
          <p>
            {data ? (
              <>
                <span className="formatted-text">Tiempo máximo del algoritmo 1 (s):<br /> - </span>&nbsp;&nbsp;&nbsp;{data.max_times}<br />
                <span className="formatted-text">Tiempo mínimo del algoritmo 2 (s):<br /> - </span> &nbsp;&nbsp;&nbsp;{data.min_times}
              </>
            ) : (
              'Tiempos: -' 
            )}
          </p>
          <p>
            {data ? (
              <>
                <span className="formatted-text">Tiempo máximo del algoritmo 2 (s):<br /> - </span> &nbsp;&nbsp;&nbsp;{data.max_times_dp}<br />
                <span className="formatted-text">Tiempo mínimo del algoritmo 2 (s):<br /> - </span> &nbsp;&nbsp;&nbsp;{data.min_times_dp}
              </>
            ) : (
              'Tiempos: -' 
            )}
          </p>
        </div>
      </div>
    );
}

export default InputArea;