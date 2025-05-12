import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../API/client";
import '../styles/VerRuta.css'

function VerRuta(){
    const [rutas, setRutas] = useState([])

    const conseguirRutas = async () => {
        try{
            const {data, error} = await client
                                    .from("rutapersonalizada")
                                    .select('nombreruta, direcciones, usuario!inner(id)')
                                    .eq("usuario.id", (await (client.auth.getUser())).data.user.id)
            if(error){
                console.log("Revisa el codigo")
            }else{
                console.log(data)
                setRutas(data)
            }
        }catch(error){
            console.log("Error, revisa el codigo")
        }
    }

    const eliminarRuta = async (idDeRuta) => {
        try{
            const {error} = await client
                                .from("rutapersonalizada")
                                .delete()
                                .eq("idrutapersonalizada", idDeRuta);
            if(error){
                console.log("Revise el codigo pa")
            }else{
                console.log("La ruta se elimino");
                setRutas(rutas.filter((ruta) => ruta.idrutapersonalizada !== idDeRuta))
            }
        }catch(error){
            console.log("Error, revise la consulta de eliminacion")
        }
    }

    useEffect(() => {
        conseguirRutas()
    }, [])

    return(
        <div id="contenedor">
            <h1>Prueba de visualización</h1>
            <h2>Rutas asociadas al usuario:</h2>
            <ul>
                {rutas.map((ruta) => (
                    <li key={ruta.idrutapersonalizada}>
                        <strong>Nombre de la ruta:</strong> {ruta.nombreruta} <br />
                        <strong>Direcciones:</strong> {ruta.direcciones.join(", ")} <br />
                        <button onClick={() => eliminarRuta(ruta.idrutapersonalizada)}>
                            Eliminar ruta
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )

};

export default VerRuta;