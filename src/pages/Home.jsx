import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css'
import { client } from '../API/client'

function Home(){

    const [datosDeUsuario, establecerDatos] = useState(null)
    const navigate = useNavigate()

    const obtenerDatos = async () => {
        const { data, error } = await client.auth.getUser()

        if(error){
            console.log("Error, revisa el codigo")
        }else{
            establecerDatos(data.user)
        }
        
    };

    const logOut = async (e) => {
        try{
            await client.auth.signOut()
        }catch(error){
            console.log("Un error cerrando sesion")
        }
    }

    useEffect(() => {
        obtenerDatos();
    }, []);

    const logIn = async () => {
        navigate("/login")
    }
    

    return (
        
        <div id="titulo">
            <h1>Bienvenido a FitJourney</h1>
            <form onSubmit={logOut}>
                <button>Log out</button>
            </form>
            <form onSubmit={logIn}>
                <button>Iniciar sesion</button>
            </form>
        </div>
    )
}
export default Home