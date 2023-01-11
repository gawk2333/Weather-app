import React from "react";
import styles from "./headerBar.module.css";

export default function HeaderBar() {
  return (
    <div className={styles.header}>
      <div as="h1" className={styles.logo}>
        Weather App
        {/* <AuthenticationButton /> */}
      </div>
    </div>
  );
}
