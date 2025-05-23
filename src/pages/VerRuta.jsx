import React, { useEffect, useState } from "react";
import { client } from "../API/client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import "../styles/VerRuta.css";

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

function VerRuta() {
  const [rutas, setRutas] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const conseguirRutas = async () => {
    try {
      const { data, error } = await client
        .from("rutapersonalizada")
        .select(
          "idrutapersonalizada, nombreruta, direcciones, usuario!inner(id)"
        )
        .eq("usuario.id", (await client.auth.getUser()).data.user.id);
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

  // Geocodifica direcciones que sean string y arma los markers
  useEffect(() => {
    const geocode = async (direccion) => {
      const url = `${GEOCODE_URL}?address=${encodeURIComponent(
        direccion
      )}&key=${import.meta.env.VITE_MAPS}`;
      const resp = await fetch(url);
      const text = await resp.text();
      console.log("Respuesta cruda de geocoding:", text); // <-- LOG IMPORTANTE
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("No es JSON válido:", text);
        return null;
      }
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      console.log(
        "No se pudo geocodificar:",
        direccion,
        data.status,
        data.error_message
      );
      return null;
    };

    const obtenerMarkers = async () => {
      console.log("Ejecutando obtenerMarkers");
      const all = [];
      for (const ruta of rutas) {
        if (Array.isArray(ruta.direcciones)) {
          for (let idx = 0; idx < ruta.direcciones.length; idx++) {
            const dir = ruta.direcciones[idx];
            let position = null;
            if (typeof dir === "object" && dir.lat && dir.lng) {
              position = dir;
            } else if (typeof dir === "string") {
              position = await geocode(dir);
              console.log("Geocodificando:", dir, "->", position);
            }
            if (position) {
              all.push({
                key: `${ruta.idrutapersonalizada}-${idx}`,
                position,
                nombreruta: ruta.nombreruta,
              });
            }
          }
        }
      }
      setMarkers(all);
    };

    if (rutas.length > 0) {
        console.log("Rutas cargadas desde Supabase:", data);
      obtenerMarkers();
    } else {
      setMarkers([]);
    }
  }, [rutas]);

  return (
    <div id="contenedor">
      <h1>Prueba de visualización</h1>
      <h2>Rutas asociadas al usuario:</h2>
      <ul>
        {rutas.map((ruta) => (
          <li key={ruta.idrutapersonalizada}>
            <strong>Nombre de la ruta:</strong> {ruta.nombreruta} <br />
            <strong>Direcciones:</strong>{" "}
            {Array.isArray(ruta.direcciones)
              ? ruta.direcciones.join(", ")
              : ruta.direcciones}
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
            {markers.map((marker) => (
              <AdvancedMarker
                key={marker.key}
                position={marker.position}
                title={marker.nombreruta}
              >
                <Pin
                  background="#FBBC04"
                  glyphColor="#000"
                  borderColor="#000"
                  glyph=""
                />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default VerRuta;
