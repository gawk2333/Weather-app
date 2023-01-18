import React, { useEffect, useState } from "react";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import styles from "./mapBox.module.css";
import { MapContainer } from "react-leaflet";
import { SearchBar, MarkerTool } from "./controls";
import SideBar from "./SideBar";
import { BASE_MAPS } from "../../../HeaderBar/consts";
import L from "leaflet";

export default function MapBox({
  markers,
  setMarkers,
  onSidebarHide,
  showSidebar,
  userLocation,
  isMarker,
}) {
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (map != null) {
      const baseLayers = {};
      const overLays = {};
      BASE_MAPS.forEach((eachMap) => {
        const mapLayer = vectorBasemapLayer(eachMap.value, {
          apiKey: process.env.REACT_APP_ESRI_API_KEY,
        });
        const mapName = eachMap.value;
        baseLayers[mapName] = mapLayer;
      });
      L.control
        .layers(baseLayers, overLays, { position: "bottomleft" })
        .addTo(map);
      baseLayers["ArcGIS:Streets"].addTo(map);
      return () =>
        map.removeControl(
          L.control.layers(baseLayers, overLays, { position: "bottomleft" })
        );
    }
  }, [map]);
  return (
    <>
      <MapContainer
        center={[41.2448, 172]}
        zoom={5}
        maxZoom={19}
        minZoom={3}
        ref={setMap}
        id="map"
        className={styles.map}
        placeholder={<div>this is a placeholder</div>}
      >
        <MarkerTool
          markers={markers}
          setMarkers={setMarkers}
          userLocation={userLocation}
          isMarker={isMarker}
        />
        <SideBar
          showSidebar={showSidebar}
          onSidebarHide={onSidebarHide}
          markers={markers}
          setMarkers={setMarkers}
        />
        <SearchBar />
      </MapContainer>
    </>
  );
}
