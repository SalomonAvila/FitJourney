import React, { useEffect, useState, useCallback } from "react";
import { client } from "../API/client";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import "../styles/VerRuta.css";

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const MAP_CENTER = { lat: 4.65, lng: -74.08 };

function VerRuta() {
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS,
    libraries: ["places"],
  });

  const conseguirRutas = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    conseguirRutas();
  }, [conseguirRutas]);

  useEffect(() => {
    if (rutas.length > 0 && !rutaSeleccionada) {
      setRutaSeleccionada(rutas[0].idrutapersonalizada);
    }
  }, [rutas, rutaSeleccionada]);

  useEffect(() => {
    const geocode = async (direccion) => {
      const url = `${GEOCODE_URL}?address=${encodeURIComponent(
        direccion
      )}&key=${import.meta.env.VITE_MAPS}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      return null;
    };

    const obtenerMarkers = async () => {
      const allMarkers = [];
      const ruta = rutas.find(
        (r) => r.idrutapersonalizada === rutaSeleccionada
      );
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

    if (rutas.length > 0 && rutaSeleccionada) {
      obtenerMarkers();
    } else {
      setMarkers([]);
    }
  }, [rutas, rutaSeleccionada]);

  useEffect(() => {
    if (markers.length >= 2 && window.google && window.google.maps) {
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
          travelMode: window.google.maps.TravelMode.DRIVING,
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
        if (rutaSeleccionada === idDeRuta) setRutaSeleccionada(null);
      }
    } catch (error) {
      console.log("Error, revise la consulta de eliminacion");
    }
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  const leg = directions?.routes?.[0]?.legs?.[0];
  const tiempo = leg?.duration?.text || "No disponible";
  const distancia = leg?.distance?.text || "No disponible";

  return (
    <div id="contenedor">
      <div className="card">
        <h1>Prueba de visualización</h1>
        <h2>Rutas asociadas al usuario:</h2>
        {/* Selector de ruta */}
        {rutas.length > 0 && (
          <div className="selector-ruta">
            <label>Selecciona una ruta: </label>
            <select
              value={rutaSeleccionada || ""}
              onChange={(e) => setRutaSeleccionada(e.target.value)}
            >
              <option value="" disabled>
                Elige una ruta
              </option>
              {rutas.map((ruta) => (
                <option
                  key={ruta.idrutapersonalizada}
                  value={ruta.idrutapersonalizada}
                >
                  {ruta.nombreruta}
                </option>
              ))}
            </select>
          </div>
        )}
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
        <div className="map-container">
          <GoogleMap
            mapContainerClassName="map-container"
            center={MAP_CENTER}
            zoom={13}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.key}
                position={marker.position}
                label={marker.nombreruta ? marker.nombreruta[0] : ""}
              />
            ))}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
        {/* --- Solo métricas clave --- */}
        {directions && (
          <div className="resumen-ruta">
            <h3>Resumen de la ruta</h3>
            <p>
              <strong>Duración estimada:</strong> {tiempo}
              <br />
              <strong>Distancia:</strong> {distancia}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerRuta;