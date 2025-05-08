import React, {useState, useEffect} from "react";
import { client } from "@/API/client";

function InformacionPerfil() {
  const [perfil, setPerfil] = useState({
    id: "NULL",
    correo: "NULL",
    nombre: "NULL",
    fechaDeNacimiento: "NULL",
  });

  const extraerNombre = async () => {
    // Consulta en supabase
    const {user} = await client.auth.getUser()
    const {datos} = await client.from('usuario').select('*').eq('id',user.data.user.id)
    console.log({datos})
    return {
      id: "NULL",
      correo: "NULL",
      nombre: "NULL",
      fechaDeNacimiento: "NULL",
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
    <div>
      <h1>Informacion del perfil</h1>
      <h2>Nombre: {perfil.nombre}</h2>
      <h2>Email: {perfil.email}</h2>
      <h2>Teléfono: {perfil.telefono}</h2>
      <h2>Dirección: {perfil.direccion}</h2>
    </div>
  );
}

export default InformacionPerfil;
