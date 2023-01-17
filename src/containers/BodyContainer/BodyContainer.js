import React, { useState } from "react";
import HeaderBar from "../HeaderBar";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";

export default function BodyContainer() {
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const onSidebarHide = () => {
    setShowSidebar(false);
  };

  return (
    <div className={styles.bodyContainer}>
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
