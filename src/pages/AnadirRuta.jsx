import React, { useState } from "react";
import { client } from "../API/client";
import "../styles/AnadirRuta.css";

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
      setRutas([""]);
      e.target.reset();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleRetirarRuta = () => {
    if (rutas.length > 1) {
      setRutas(rutas.slice(0, -1));
    }
  };

  const actualizarBase = async (nombre, rutas) => {
    try {
      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData || !authData.user) {
        throw new Error(
          "No se pudo obtener la información del usuario. Asegúrate de estar autenticado."
        );
      }

      const userId = authData.user.id;

      const { data, error } = await client.from("rutapersonalizada").insert({
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
    <div className="anadir-bg">
      <header className="anadir-header">
        <div className="anadir-logo-anim">
          <span className="anadir-logo">🗺️</span>
        </div>
        <h1>Crear nueva ruta</h1>
        <p>Agrega tus rutas deportivas personalizadas</p>
      </header>
      <main className="anadir-main">
        <form className="anadir-form-card" onSubmit={handleSubmit}>
          <div className="anadir-form-group">
            <label htmlFor="nombre">Nombre de la ruta:</label>
            <input type="text" id="nombre" name="nombre" required />
          </div>
          <div className="anadir-direcciones-list">
            {rutas.map((ruta, index) => (
              <div className="anadir-form-group" key={index}>
                <label htmlFor={`ruta-${index}`}>
                  Dirección {index + 1}:
                </label>
                <input
                  type="text"
                  id={`ruta-${index}`}
                  value={ruta}
                  onChange={(e) => handleChangeRuta(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          <div className="anadir-btn-group">
            <button
              type="button"
              className="anadir-btn anadir-btn-sec"
              onClick={handleAddRuta}
            >
              + Añadir dirección
            </button>
            <button
              type="button"
              className="anadir-btn anadir-btn-sec"
              onClick={handleRetirarRuta}
              disabled={rutas.length === 1}
            >
              - Quitar última
            </button>
          </div>
          <button type="submit" className="anadir-btn anadir-btn-main">
            Guardar ruta
          </button>
        </form>
      </main>
    </div>
  );
}

export default AnadirRuta;