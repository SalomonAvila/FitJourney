import React, { useCallback, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import "../styles/PruebaMapa.css";

const locations = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];

const PoiMarkers = ({ pois, map }) => {
  const handleClick = useCallback(
    (ev) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked:", ev.latLng.toString());
      map.panTo(ev.latLng);
    },
    [map]
  );

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          onClick={handleClick}
        >
          <Pin background="#FBBC04" glyphColor="#000" borderColor="#000" />
        </AdvancedMarker>
      ))}
    </>
  );
};

const PruebaMapa = () => {
  const [map, setMap] = React.useState(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS}>
      <h1>Hello, world!</h1>
      <Map
        mapId="8880d67f2c003688d6e3925b"
        className="map-container"
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onMapLoad={setMap} // Aquí guardamos la instancia del mapa en el estado
        onCameraChanged={(ev) =>
          console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
        }
      >
        <PoiMarkers pois={locations} map={map} />
      </Map>
    </APIProvider>
  );
};

export default PruebaMapa;
