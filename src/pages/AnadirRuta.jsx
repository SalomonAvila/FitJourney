import React, { useState } from "react";

function AnadirRuta() {
    const [rutas, setRutas] = useState([""]);

    const handleAddRuta = () => {
        setRutas([...rutas, ""]);
    };

    const handleChangeRuta = (index, value) => {
        const nuevasRutas = [...rutas];
        nuevasRutas[index] = value;
        setRutas(nuevasRutas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({e});
    };

    const handleRetirarRuta = () => {
        if (rutas.length > 1) {
            setRutas(rutas.slice(0, -1));
        }
    }

    return (
        <div>
            <h1>Creación de ruta</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required />
                </div>
                {rutas.map((ruta, index) => (
                    <div key={index}>
                        <label htmlFor={`ruta-${index}`}>Dirección {index + 1}:</label>
                        <input
                            type="text"
                            id={`ruta-${index}`}
                            value={ruta}
                            onChange={(e) => handleChangeRuta(index, e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddRuta}>
                    Añadir otra dirección
                </button>
                <button type="button" onClick={handleRetirarRuta}>
                    Retirar ultima direccion
                </button>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default AnadirRuta;