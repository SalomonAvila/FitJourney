import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../API/client";

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

    useEffect(() => {
        conseguirRutas()
    }, [])

    return(
        <div>
            <h1>Prueba de visualización</h1>
            <h2>Rutas asociadas al usuario:</h2>
            <ul>
                {rutas.map((ruta) => (
                    <li key={ruta.idrutapersonalizada}>
                        <strong>Nombre de la ruta:</strong> {ruta.nombreruta} <br />
                        <strong>Direcciones:</strong> {ruta.direcciones.join(", ")} <br />
                    </li>
                ))}
            </ul>
        </div>
    )

};

export default VerRuta;