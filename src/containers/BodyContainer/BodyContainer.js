import React, { useState } from "react";
import HeaderBar from "../HeaderBar";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";
import SideBar from "./components/SideBar";

export default function BodyContainer() {
  const [markers, setMarkers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const onSidebarHide = () => {
    setShowSidebar(false);
  };

  return (
    <div className={styles.bodyContainer}>
      <HeaderBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <SideBar
        showSidebar={showSidebar}
        onSidebarHide={onSidebarHide}
        markers={markers}
        setMarkers={setMarkers}
      />
      <MapBox markers={markers} setMarkers={setMarkers} />
    </div>
  );
}
