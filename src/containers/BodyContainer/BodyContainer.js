import React, { useState, useEffect } from "react";
import HeaderBar from "../HeaderBar";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";
import { getWeatherByGeoPositionApi } from "../../api/weatherApi";
import { toast } from "react-toastify";

export default function BodyContainer() {
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isMarker, setIsMarker] = useState(true);

  useEffect(() => {
    try {
      const updateSavedMarkers = async (localMarkers) => {
        const promises = await localMarkers.map(async (marker) => {
          const position = {
            lat: marker.lat,
            lng: marker.lng,
          };
          const result = await getWeatherByGeoPositionApi(position);
          if (result) {
            marker.weather = result.current;
            marker.location = result.location;
          }
          return marker;
        });
        const updatedMarkers = await Promise.all(promises);
        setMarkers(updatedMarkers);
      };

      const markerString = window.localStorage.getItem("markers") || [];
      if (markerString) {
        const savedMarkers = JSON.parse(markerString);
        updateSavedMarkers(savedMarkers);
      }
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({
          lat,
          lng,
        });
      });
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
      <HeaderBar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        userLocation={userLocation}
        isMarker={isMarker}
        setIsMarker={setIsMarker}
      />
      <MapBox
        markers={markers}
        setMarkers={setMarkers}
        onSidebarHide={onSidebarHide}
        showSidebar={showSidebar}
        userLocation={userLocation}
        isMarker={isMarker}
      />
    </div>
  );
}
