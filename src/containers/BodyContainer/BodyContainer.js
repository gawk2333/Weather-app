import React from "react";
import HeaderBar from "../HeaderBar";
import styles from "./bodyContainer.module.css";
import MapBox from "./components/MapBox";

export default function BodyContainer() {
  return (
    <div className={styles.bodyContainer}>
      <HeaderBar />
      <MapBox />
    </div>
  );
}
