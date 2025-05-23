import React, { useEffect, useState } from "react";
import { client } from "../API/client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  DirectionsRenderer,
} from "@vis.gl/react-google-maps";
import "../styles/VerRuta.css";

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

function VerRuta() {
  const [rutas, setRutas] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);

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

  useEffect(() => {
    conseguirRutas();
  }, []);

  // Geocodifica direcciones que sean string y arma los markers
  useEffect(() => {
    const geocode = async (direccion) => {
      const url = `${GEOCODE_URL}?address=${encodeURIComponent(
        direccion
      )}&key=${import.meta.env.VITE_MAPS}`;
      const resp = await fetch(url);
      const text = await resp.text();
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
      return null;
    };

    const obtenerMarkers = async () => {
      const allMarkers = [];
      // Solo tomamos la primera ruta para DirectionsRenderer
      const ruta = rutas[0];
      if (ruta && Array.isArray(ruta.direcciones)) {
        for (let idx = 0; idx < ruta.direcciones.length; idx++) {
          const dir = ruta.direcciones[idx];
          let position = null;
          if (typeof dir === "object" && dir.lat && dir.lng) {
            position = dir;
          } else if (typeof dir === "string") {
            position = await geocode(dir);
          }
          if (position) {
            allMarkers.push({
              key: `${ruta.idrutapersonalizada}-${idx}`,
              position,
              nombreruta: ruta.nombreruta,
            });
          }
        }
      }
      setMarkers(allMarkers);
    };

    if (rutas.length > 0) {
      obtenerMarkers();
    } else {
      setMarkers([]);
    }
  }, [rutas]);

  // DirectionsRenderer: calcula la ruta real entre los puntos de la primera ruta
  useEffect(() => {
    if (
      markers.length >= 2 &&
      window.google &&
      window.google.maps &&
      typeof window.google.maps.DirectionsService === "function"
    ) {
      const origin = markers[0].position;
      const destination = markers[markers.length - 1].position;
      const waypoints = markers.slice(1, -1).map((m) => ({
        location: m.position,
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING, // Cambia a WALKING si quieres
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            setDirections(null);
            console.error("Directions request failed:", status);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [markers]);

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
            mapId="8880d67f2c003688d6e3925b"
            className="map-container"
            defaultZoom={13}
            defaultCenter={{ lat: 4.65, lng: -74.08 }}
            onMapLoad={setMap}
          >
            {/* Marcadores */}
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
            {/* Ruta real de Google */}
            {directions && <DirectionsRenderer directions={directions} />}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default VerRuta;
