import React, { useState, useEffect } from "react";
import HeaderBar from "../HeaderBar";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";
import { getWeatherByGeoPositionApi } from "../../api/weatherApi";
import { ToastContainer, toast } from "react-toastify";

export default function BodyContainer() {
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    try {
      const updateSavedMarkers = async (localMarkers) => {
        await localMarkers.map(async (marker) => {
          const position = {
            lat: marker.lat,
            lng: marker.lng,
          };
          const result = await getWeatherByGeoPositionApi(position);
          if (result) {
            marker.weather = result.current;
            marker.location = result.location;
          }
        });
        setMarkers(localMarkers);
      };

      const markerString = window.localStorage.getItem("markers");
      if (markerString) {
        const savedMarkers = JSON.parse(markerString);
        updateSavedMarkers(savedMarkers);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    if (markers) {
      window.localStorage.setItem("markers", JSON.stringify(markers));
    }
  }, [markers]);

  const onSidebarHide = () => {
    setShowSidebar(false);
  };

  return (
    <div className={styles.bodyContainer}>
      <ToastContainer />
      <HeaderBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <MapBox
        markers={markers}
        setMarkers={setMarkers}
        onSidebarHide={onSidebarHide}
        showSidebar={showSidebar}
      />
    </div>
  );
}
