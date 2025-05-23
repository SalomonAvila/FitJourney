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
      if (!error) setRutas(data);
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
          optimizeWaypoints: false,
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
      if (!error) {
        setRutas(rutas.filter((ruta) => ruta.idrutapersonalizada !== idDeRuta));
        if (rutaSeleccionada === idDeRuta) setRutaSeleccionada(null);
      }
    } catch (error) {
      console.log("Error, revise la consulta de eliminacion");
    }
  };

  if (!isLoaded) return <div className="loading">Cargando mapa...</div>;

  const { tiempo, distancia } = getResumenRuta(directions);
  function getResumenRuta(directions) {
    if (!directions?.routes?.[0]?.legs)
      return { tiempo: "No disponible", distancia: "No disponible" };
    const legs = directions.routes[0].legs;
    let totalSegundos = 0;
    let totalMetros = 0;
    legs.forEach((leg) => {
      totalSegundos += leg.duration.value;
      totalMetros += leg.distance.value;
    });
    const minutos = Math.round(totalSegundos / 60);
    const km = (totalMetros / 1000).toFixed(1);
    return {
      tiempo: `${minutos} min`,
      distancia: `${km} km`,
    };
  }

  return (
    <div className="dashboard-bg">
      <header className="dashboard-header">
        <span className="logo-icon">🚴‍♂️</span>
        <h1>FitJourney</h1>
        <p>
          Visualiza y gestiona tus rutas personalizadas de forma fácil y
          atractiva.
        </p>
      </header>

      <main className="dashboard-main">
        <section className="routes-section">
          <div className="routes-header">
            <h2>Mis rutas</h2>
            <div className="selector-ruta">
              <label htmlFor="selector">Selecciona una ruta:</label>
              <select
                id="selector"
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
          </div>
          <div className="routes-list">
            {rutas.map((ruta) => (
              <div
                className={`route-card ${
                  ruta.idrutapersonalizada === rutaSeleccionada
                    ? "selected"
                    : ""
                }`}
                key={ruta.idrutapersonalizada}
                onClick={() => setRutaSeleccionada(ruta.idrutapersonalizada)}
              >
                <div className="route-info">
                  <h3>
                    <span className="route-icon">📍</span> {ruta.nombreruta}
                  </h3>
                  <p>
                    <span className="direcciones-label">Direcciones:</span>
                    <br />
                    {Array.isArray(ruta.direcciones)
                      ? ruta.direcciones.map((dir, idx) => (
                          <span key={idx} className="direccion-item">
                            {dir}
                            {idx < ruta.direcciones.length - 1 ? <br /> : ""}
                          </span>
                        ))
                      : ruta.direcciones}
                  </p>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarRuta(ruta.idrutapersonalizada);
                  }}
                  title="Eliminar ruta"
                >
                  🗑️
                </button>
              </div>
            ))}
            {rutas.length === 0 && (
              <div className="no-routes">No tienes rutas guardadas.</div>
            )}
          </div>
        </section>

        <section className="map-section">
          <div className="map-card">
            <h2>
              <span role="img" aria-label="mapa">
                🗺️
              </span>{" "}
              Mapa de la ruta
            </h2>
            <div className="map-container">
              <GoogleMap
                mapContainerClassName="map-container"
                center={MAP_CENTER}
                zoom={13}
              >
                {markers.map((marker, idx) => (
                  <Marker
                    key={marker.key}
                    position={marker.position}
                    label={`${idx + 1}`}
                  />
                ))}
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
            {directions && (
              <div className="resumen-ruta-card">
                <h3>Resumen de la ruta</h3>
                <div className="resumen-items">
                  <div className="resumen-item">
                    <span className="resumen-icon">⏱️</span>
                    <span>
                      <strong>Duración:</strong> {tiempo}
                    </span>
                  </div>
                  <div className="resumen-item">
                    <span className="resumen-icon">📏</span>
                    <span>
                      <strong>Distancia:</strong> {distancia}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default VerRuta;
