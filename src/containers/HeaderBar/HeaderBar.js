import React, { useEffect, useState } from "react";
import styles from "./headerBar.module.css";
import { Icon, Popup, Checkbox } from "semantic-ui-react";
import { getWeatherByGeoPositionApi } from "../../api/weatherApi";

export default function HeaderBar({
  showSidebar,
  setShowSidebar,
  userLocation,
  isMarker,
  setIsMarker,
}) {
  const [userState, setUserState] = useState(null);
  useEffect(() => {
    const fetchUserWeather = async (position) => {
      const result = await getWeatherByGeoPositionApi(position);
      if (result) {
        setUserState(result);
      }
    };
    if (userLocation) {
      fetchUserWeather(userLocation);
    }
  }, [userLocation]);

  return (
    <div className={styles.header}>
      <div as="h1" className={styles.logo}>
        Weather App
        {/* <AuthenticationButton /> */}
      </div>
      <div className="spacer" />
      {userState && (
        <>
          <div as="h3" className={styles.logo}>
            {userState.location.name}
          </div>
          <div
            as="h3"
            className={styles.logo}
          >{`${userState.current.temp_c}℃`}</div>
          <img src={userState.current.condition.icon} alt="" />
          <div as="h3" className={styles.logo}>
            {userState.current.condition.text}
          </div>
        </>
      )}
      <div className="halfspacer" />
      <div className={styles.toggle}>
        <Checkbox
          toggle
          label="Use marker"
          checked={isMarker}
          onChange={() => setIsMarker(!isMarker)}
          style={{ marginTop: 8 }}
        />
      </div>
      <div className="halfspacer" />
      <Popup
        trigger={
          <Icon
            onClick={() => setShowSidebar(!showSidebar)}
            name="list"
            color="orange"
            size="large"
            style={{ cursor: "pointer", marginTop: 8 }}
          />
        }
        content="Saved markers"
      />
    </div>
  );
}
