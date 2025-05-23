import React, { useState, useEffect } from "react";
import { client } from "../API/client";
import { useNavigate } from "react-router-dom";
import "../styles/InformacionPerfil.css";

function InformacionPerfil() {
  const [perfil, setPerfil] = useState({
    id: "NULL",
    correo: "NULL",
    nombre: "NULL",
    fechaDeNacimiento: "NULL",
  });

  const [nuevoNombre, setNombreNuevo] = useState(""); 
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoFecha, setEditandoFecha] = useState(false);
  const navigate = useNavigate();

  const extraerNombre = async () => {
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();
    if (userError) {
      console.log("No hay usuario ");
    }
    const { data, error } = await client
      .from("usuario")
      .select("*")
      .eq("id", user.id);
    const { id, correo, nombre, fechanacimiento } = data[0];
    return {
      id: id || "NULL",
      correo: correo || "NULL",
      nombre: nombre || "NULL",
      fechaDeNacimiento: fechanacimiento || "NULL",
    };
  };

  useEffect(() => {
    const obtenerNombre = async () => {
      const datosDelPerfil = await extraerNombre();
      setPerfil(datosDelPerfil);
    };
    obtenerNombre();
  }, []);

  const actualizarNombre = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();

    const { error } = await client
      .from("usuario")
      .update({ nombre: nuevoNombre })
      .eq("id", user.id);

    if (error) {
      console.log("Error al actualizar nombre:", error);
    } else {
      const actualizado = await extraerNombre();
      setPerfil(actualizado);
      setNombreNuevo("");
      setEditandoNombre(false);
    }
  };

  const actualizarFecha = async () => {
    const {
      data: { user },
    } = await client.auth.getUser();

    const { error } = await client
      .from("usuario")
      .update({ fechanacimiento: nuevaFecha })
      .eq("id", user.id);

    if (error) {
      console.log("Error al actualizar la fecha de nacimiento:", error);
    } else {
      const actualizado = await extraerNombre();
      setPerfil(actualizado);
      setNuevaFecha("");
      setEditandoFecha(false);
    }
  };

  return (
    <div className="perfil-bg">
      <header className="perfil-header">
        <div className="perfil-logo-anim">
          <span className="perfil-logo">👤</span>
        </div>
        <h1>Perfil de usuario</h1>
        <p>Consulta y edita tu información personal</p>
      </header>
      <main className="perfil-main">
        <div className="perfil-card fadeInUp">
          <div className="perfil-info-row">
            <span className="perfil-label">Correo:</span>
            <span className="perfil-value">{perfil.correo}</span>
          </div>
          <div className="perfil-info-row">
            <span className="perfil-label">Nombre:</span>
            <span className="perfil-value">{perfil.nombre}</span>
            {!editandoNombre ? (
              <button className="perfil-btn-sec" onClick={() => setEditandoNombre(true)}>
                Cambiar
              </button>
            ) : (
              <div className="perfil-edit-group">
                <input
                  type="text"
                  placeholder="Nuevo nombre"
                  value={nuevoNombre}
                  onChange={(e) => setNombreNuevo(e.target.value)}
                  className="perfil-input"
                />
                <button className="perfil-btn-main" onClick={actualizarNombre}>Guardar</button>
                <button className="perfil-btn-sec" onClick={() => setEditandoNombre(false)}>Cancelar</button>
              </div>
            )}
          </div>
          <div className="perfil-info-row">
            <span className="perfil-label">Fecha de nacimiento:</span>
            <span className="perfil-value">{perfil.fechaDeNacimiento}</span>
            {!editandoFecha ? (
              <button className="perfil-btn-sec" onClick={() => setEditandoFecha(true)}>
                Cambiar
              </button>
            ) : (
              <div className="perfil-edit-group">
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="perfil-input"
                />
                <button className="perfil-btn-main" onClick={actualizarFecha}>Guardar</button>
                <button className="perfil-btn-sec" onClick={() => setEditandoFecha(false)}>Cancelar</button>
              </div>
            )}
          </div>
          <div className="perfil-btn-row">
            <button className="perfil-btn-main" onClick={() => navigate("/")}>
              Volver a la página inicial
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InformacionPerfil;