import React from "react";
import '../styles/Home.css'
import { client } from '../API/client'

function Home(){
    const obtenerDatos = async () => {
        const { data, error } = await client.auth.getUserIdentities()

    }
    

    return (
        
        <div id="titulo">
            <h1>Bienvenido {obtenerDatos}</h1>
        </div>
    )
}
export default Home