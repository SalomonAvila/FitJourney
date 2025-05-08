import React, { useState, useEffect } from "react";
import { client } from "../API/client";
import "../styles/InformacionPerfil.css";

function InformacionPerfil() {
  const [perfil, setPerfil] = useState({
    id: "NULL",
    correo: "NULL",
    nombre: "NULL",
    fechaDeNacimiento: "NULL",
  });

  const [nuevoNombre, setNombreNuevo] = useState(""); 
  const [editandoNombre, setEditandoNombre] = useState(false);

  const extraerNombre = async () => {
    // Consulta en supabase
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
    console.log({ data });
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



  return (
    <div id="info">
      <h1>Informacion del perfil</h1>
      <h2>Correo: {perfil.correo}</h2>
      <h2>Nombre: {perfil.nombre}</h2>
      {!editandoNombre ? (
        <button onClick={() => setEditandoNombre(true)}>Cambiar nombre</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Nuevo nombre"
            value={nuevoNombre}
            onChange={(e) => setNombreNuevo(e.target.value)}
          />
          <button onClick={actualizarNombre}>Guardar</button>
          <button onClick={() => setEditandoNombre(false)}>Cancelar</button>
        </div>
      )}
      <h2>Fecha de nacimieto: {perfil.fechaDeNacimiento}</h2>
    </div>
  );
}



export default InformacionPerfil;
