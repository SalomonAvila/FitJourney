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

  return (
    <div id="info">
      <h1>Informacion del perfil</h1>
      <h2>ID: {perfil.id}</h2>
      <h2>Correo: {perfil.correo}</h2>
      <h2>Nombre: {perfil.nombre}</h2>
      <h2>Fecha de nacimieto: {perfil.fechaDeNacimiento}</h2>
    </div>
  );
}

export default InformacionPerfil;
