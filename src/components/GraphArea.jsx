import React from 'react';

function ImageGraph({ imageSrc }) {
    return (
        <div className="image-graph">
            <img src={imageSrc} alt="Gráfico" />
        </div>
    );
}

export default ImageGraph;
