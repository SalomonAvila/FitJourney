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
        setRutas([""])
        e.target.reset()
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
    try {
        const { data: authData, error: authError } = await client.auth.getUser();
        if (authError || !authData || !authData.user) {
            throw new Error("No se pudo obtener la información del usuario. Asegúrate de estar autenticado.");
        }

        const userId = authData.user.id;

        const { data, error } = await client
            .from("rutapersonalizada")
            .insert({
                nombreruta: nombre,
                idusuario: userId,
                direcciones: rutas,
            });

        if (error) {
            console.error("Error al insertar en la base de datos:", error);
        } else {
            console.log("Datos insertados correctamente:", data);
        }
    } catch (error) {
        console.error("Error en actualizarBase:", error.message);
    }
};

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