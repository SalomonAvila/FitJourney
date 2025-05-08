import React from "react";
import { useState, useEffect } from "react";
import '../styles/Home.css'
import { client } from '../API/client'

function Home(){

    const [datosDeUsuario, establecerDatos] = useState(null)

    const obtenerDatos = async () => {
        const { data, error } = await client.auth.getUserIdentities()
        if(error){
            console.log("Error, revisa el codigo")
        }else{
            establecerDatos(data.user.id)
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);
    

    return (
        
        <div id="titulo">
            <h1>Bienvenido, tu UID es: {uid ? uid : "Cargando..."}</h1>
        </div>
    )
}
export default Home