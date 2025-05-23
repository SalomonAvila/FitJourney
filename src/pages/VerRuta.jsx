import React, { useEffect, useState } from "react";
import { client } from "../API/client";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import '../styles/VerRuta.css';

function VerRuta() {
    const [rutas, setRutas] = useState([]);
    const [map, setMap] = useState(null);

    const conseguirRutas = async () => {
        try {
            const { data, error } = await client
                .from("rutapersonalizada")
                .select('idrutapersonalizada, nombreruta, direcciones, usuario!inner(id)')
                .eq("usuario.id", (await (client.auth.getUser())).data.user.id);
            if (error) {
                console.log("Revisa el codigo");
            } else {
                setRutas(data);
            }
        } catch (error) {
            console.log("Error, revisa el codigo");
        }
    };

    const eliminarRuta = async (idDeRuta) => {
        try {
            const { error } = await client
                .from("rutapersonalizada")
                .delete()
                .eq("idrutapersonalizada", idDeRuta);
            if (error) {
                console.log("Revise el codigo pa");
            } else {
                setRutas(rutas.filter((ruta) => ruta.idrutapersonalizada !== idDeRuta));
            }
        } catch (error) {
            console.log("Error, revise la consulta de eliminacion");
        }
    };

    useEffect(() => {
        conseguirRutas();
    }, []);

    // Suponiendo que cada dirección ya es un objeto {lat, lng}
    // Si son strings, necesitas geocodificarlas antes de usarlas aquí
    const allMarkers = rutas.flatMap(ruta =>
        Array.isArray(ruta.direcciones)
            ? ruta.direcciones.map((dir, idx) => ({
                key: `${ruta.idrutapersonalizada}-${idx}`,
                position: typeof dir === "object" ? dir : null, // Si es string, ignora o geocodifica
                nombreruta: ruta.nombreruta
            }))
            : []
    ).filter(marker => marker.position);

    return (
        <div id="contenedor">
            <h1>Prueba de visualización</h1>
            <h2>Rutas asociadas al usuario:</h2>
            <ul>
                {rutas.map((ruta) => (
                    <li key={ruta.idrutapersonalizada}>
                        <strong>Nombre de la ruta:</strong> {ruta.nombreruta} <br />
                        <strong>Direcciones:</strong> {Array.isArray(ruta.direcciones) ? ruta.direcciones.join(", ") : ruta.direcciones}
                        <br />
                        <button onClick={() => eliminarRuta(ruta.idrutapersonalizada)}>
                            Eliminar ruta
                        </button>
                    </li>
                ))}
            </ul>
            <div style={{ width: "100%", height: "400px", marginTop: "2rem" }}>
                <APIProvider apiKey={import.meta.env.VITE_MAPS}>
                    <Map
                        className="map-container"
                        defaultZoom={13}
                        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                        onMapLoad={setMap}
                    >
                        {allMarkers.map(marker => (
                            <AdvancedMarker
                                key={marker.key}
                                position={marker.position}
                                title={marker.nombreruta}
                            >
                                <Pin background="#FBBC04" glyphColor="#000" borderColor="#000" glyph="" />
                            </AdvancedMarker>
                        ))}
                    </Map>
                </APIProvider>
            </div>
        </div>
    );
}

export default VerRuta;