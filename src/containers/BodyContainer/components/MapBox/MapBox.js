import React from "react";
import styles from "./mapBox.module.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { SearchBar, MarkerTool } from "./controls";
import SideBar from "./SideBar";

const baseLayerUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const baseAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export default function MapBox({
  markers,
  setMarkers,
  onSidebarHide,
  showSidebar,
  userLocation,
}) {
  return (
    <>
      <MapContainer
        center={[41.2448, 172]}
        zoom={5}
        maxZoom={19}
        minZoom={3}
        // scrollWheelZoom={false}
        id="map"
        className={styles.map}
        placeholder={<div>this is a placeholder</div>}
      >
        <TileLayer url={baseLayerUrl} attribution={baseAttribution} />
        <MarkerTool
          markers={markers}
          setMarkers={setMarkers}
          userLocation={userLocation}
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
