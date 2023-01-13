import React from "react";
import styles from "./mapBox.module.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export default function MapBox() {
  const baseLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const baseAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      // scrollWheelZoom={false}
      className={styles.map}
    >
      <TileLayer url={baseLayerUrl} attribution={baseAttribution} />
    </MapContainer>
  );
}
