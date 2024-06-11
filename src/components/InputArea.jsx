import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import "../styles/InputArea.css";

function InputArea({ onProcesar }) {
    const [inputText1, setInputText1] = useState('100');
    const [inputText2, setInputText2] = useState('300');
    const [outputText, setOutputText] = useState('');

    const handleGenerateFile = async (inputText1, inputText2) => {
        const lowerBound = parseInt(inputText1);
        const upperBound = parseInt(inputText2);
        try {
            await invoke('generate_file', { lowerBound: lowerBound, upperBound: upperBound });
            console.log('File generated successfully');
        } catch (error) {
            console.error('Error generating file:', error);
        }
    };

    const loadData = async () => {
        const lowerBound = parseInt(inputText1);
        const upperBound = parseInt(inputText2);
        try {
            const dataJson = await invoke('send_data', { lowerBound: lowerBound, upperBound: upperBound });
            const data = JSON.parse(dataJson);
            console.log('Data loaded:', data);
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
    return (
      <div className="input-area">
        <div className="input-group">
          <label htmlFor="input1">Etiqueta 1:</label>
          <input 
            type="text" 
            id="input1"
            value={inputText1} 
            onChange={(e) => setInputText1(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="input2">Etiqueta 2:</label>
          <input 
            type="text" 
            id="input2"
            value={inputText2} 
            onChange={(e) => setInputText2(e.target.value)} 
          />
        </div>
          <button onClick={() => handleGenerateFile(inputText1, inputText2)}>Generate File</button>
          <button onClick={() => loadData(inputText1, inputText2)}>Load Data</button>
          <div className="output-box">
              {outputText}
          </div>
      </div>
    );
}

export default InputArea;