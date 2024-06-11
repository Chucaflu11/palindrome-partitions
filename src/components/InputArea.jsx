import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/tauri";

function InputArea({ onProcesar }) {
  const [inputText1, setInputText1] = useState('100');
  const [inputText2, setInputText2] = useState('300');
  const [outputText, setOutputText] = useState('');

  const handleGenerateFile = async (inputText1, inputText2) => {
    try {
        await invoke('generate_file', { inputText1, inputText2 });
        console.log('File generated successfully');
    } catch (error) {
        console.error('Error generating file:', error);
    }
    };

    const loadData = async () => {
        try {
            const dataJson = await invoke('send_data', { lowerBound: lowerBound.toString(), upperBound: upperBound.toString() });
            const data = JSON.parse(dataJson);
            console.log('Data loaded:', data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const readFromFile = async () => {
        try {
            const content = await invoke('read_file', { filePath: 'random_content.txt' });
            setFileContent(content.join('\n'));
            console.log('File content:', content);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };
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
        <button onClick={handleGenerateFile}>Generate File</button>
        <button onClick={loadData}>Load Data</button>
        <div className="output-box" style={{ height: '100px', overflowY: 'auto' }}>
            {outputText}
        </div>
    </div>
  );
}

export default InputArea;