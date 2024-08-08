import React from 'react';

const ControlsPanel = ({ selectedObject, toggleControls, isControlsVisible }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: isControlsVisible ? '200px' : '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: isControlsVisible ? '10px' : '0px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            transition: 'width 0.3s, padding 0.3s',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: isControlsVisible ? 'auto' : '60px',
        }}>
            {isControlsVisible && (
                <>
                    <h4 style={{ margin: 0 }}>Controles</h4>
                    <p>Objeto seleccionado: {selectedObject || 'Ninguno'}</p>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        <li>W / 8: Mover hacia adelante</li>
                        <li>S / 2: Mover hacia atrás</li>
                        <li>A / 4: Mover a la izquierda</li>
                        <li>D / 6: Mover a la derecha</li>
                        <li>X / 9: Mover hacia arriba</li>
                        <li>Z / 3: Mover hacia abajo</li>
                        <li>R: Cambiar objeto seleccionado (persona/cámara)</li>
                        <li>V: Girar a la derecha</li>
                        <li>B: Girar a la izquierda</li>
                        <li>N: Girar hacia abajo</li>
                        <li>M: Girar hacia arriba</li>
                    </ul>
                </>
            )}
            <button
                onClick={toggleControls}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px', // Aumenta el tamaño del botón
                    cursor: 'pointer',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                    margin: '0 auto',
                    display: 'block',
                    fontWeight: 'bold', // Texto en negrita
                    fontSize: '16px', // Aumenta el tamaño de fuente
                    color: 'black', // Color del texto
                }}
            >
                {isControlsVisible ? '-' : '+'} {/* Cambia el texto del botón para maximizar */}
            </button>

            
        </div>
    );
};

export default ControlsPanel;
