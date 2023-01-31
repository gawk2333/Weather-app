import React, { useEffect, useState, useContext } from "react";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import styles from "./mapBox.module.css";
import { MapContainer } from "react-leaflet";
import { SearchBar, MarkerTool, ModuleContainer } from "../controls";
import { Checkbox } from "semantic-ui-react";
import SideBar from "./SideBar";
import { BASE_MAPS } from "../../../HeaderBar/consts";
import L from "leaflet";
import { LoginContext } from "../../../../store/loginContext";

export default function MapBox({
  markers,
  setMarkers,
  onSidebarHide,
  showSidebar,
  userLocation,
  isMarker,
}) {
  const loginState = useContext(LoginContext.State);
  const [map, setMap] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);

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
      baseLayers["ArcGIS:Imagery:Standard"].addTo(map);
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
          showMarkers={showMarkers}
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
        {loginState.loggedIn && (
          <ModuleContainer
            position="bottomright"
            icon="list"
            title="Show markers"
            content={
              <div>
                <Checkbox
                  label="showMarkers"
                  onChange={() => setShowMarkers(!showMarkers)}
                  checked={showMarkers}
                />
              </div>
            }
          />
        )}
        <SearchBar />
      </MapContainer>
    </>
  );
}
