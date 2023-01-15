import React from "react";
import styles from "./headerBar.module.css";
import { Button } from "react-bootstrap";

export default function HeaderBar({ showSidebar, setShowSidebar }) {
  return (
    <div className={styles.header}>
      <div as="h1" className={styles.logo}>
        Weather App
        {/* <AuthenticationButton /> */}
      </div>
      <div className="spacer" />
      <Button onClick={() => setShowSidebar(!showSidebar)}>Selected</Button>
    </div>
  );
}
