import React, { useState, useEffect, useContext } from "react";
import HeaderBar from "../HeaderBar";
import { LoginContext } from "../../store/loginContext";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";
import { getWeatherByGeoPositionApi } from "../../api/weatherApi";
import { validateUserApi } from "../../api/userApi";
import { toast } from "react-toastify";

export default function BodyContainer() {
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isMarker, setIsMarker] = useState(true);
  const loginState = useContext(LoginContext.State);
  const loginDispatch = useContext(LoginContext.Dispatch);

  useEffect(() => {
    try {
      const renewMarkers = async (markersForRenew) => {
        const promises = await markersForRenew.map(async (marker) => {
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
        return await Promise.all(promises);
      };

      const validateUserToken = async (token) => {
        const result = await validateUserApi(token);
        if (result.error) {
          loginDispatch({
            type: LoginContext.types.LOGOUT,
          });
          toast.error(result.message);
        } else {
          const payload = {
            authToken: result.user.token,
            userProfile: {
              firstname: result.user.firstname,
              lastname: result.user.lastname,
              email: result.user.email,
            },
            markers: result.user.markers,
          };
          loginDispatch({
            type: LoginContext.types.LOGIN,
            payload,
          });
          const updatedMarkers = await renewMarkers(result.user.markers);
          setMarkers(updatedMarkers);
        }
      };
      const updateSavedMarkers = async (localMarkers) => {
        if (localMarkers.lenth === 0) {
          setMarkers([]);
          return;
        }
        const updatedMarkers = await renewMarkers(localMarkers);
        setMarkers(updatedMarkers);
      };

      if (!loginState.loggedIn) {
        const authToken = window.localStorage.getItem("authToken");
        // handle markers when user not loged in
        if (!authToken) {
          const markerString = window.localStorage.getItem("markers");
          if (markerString) {
            const savedMarkers = JSON.parse(markerString);
            updateSavedMarkers(savedMarkers);
          } else {
            setMarkers([]);
          }
        } else {
          validateUserToken(authToken); // validate and refresh token
        }
      } else {
        updateSavedMarkers(loginState.markers);
      }
    } catch (error) {
      toast.error(error.message);
    }

    // get loaction the first time user open the app
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({
          lat,
          lng,
        });
      });
    }
  }, [loginDispatch, loginState.loggedIn, loginState.markers, userLocation]);

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
