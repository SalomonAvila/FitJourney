import React, { useState } from "react";
import {client} from "../API/client";
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

    const handleSubmit = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;

    try {
        await actualizarBase(nombre, rutas);
        console.log("Formulario enviado correctamente");
    } catch (error) {
        console.error("Error al enviar el formulario:", error);
    }
};
    const handleRetirarRuta = () => {
        if (rutas.length > 1) {
            setRutas(rutas.slice(0, -1));
        }
    }

    const actualizarBase = async (nombre, rutas) => {
        const {datas} = await client.auth.getUser();
        const userId = datas.user.id;
        const { data, error } = await client
            .from("rutapersonalizada")
            .insert({
                    nombreruta: nombre,
                    idusuario: userId,
                    direcciones: rutas,
                },
            );
        if (error) {
            console.error("Error al insertar en la base de datos:", error);
        } else {
            console.log("Datos insertados correctamente:", data);
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