import React, { useState } from 'react';

function InputArea() {
    const [inputText, setInputText] = useState('');

    return (
        <div className="input-area">
            <input 
                type="text" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
            />
            {/* Puedes agregar más inputs de texto aquí si es necesario */}
        </div>
    );
}

export default InputArea;