import React from "react";
import styles from "./headerBar.module.css";
import { Icon, Popup } from "semantic-ui-react";

export default function HeaderBar({ showSidebar, setShowSidebar }) {
  return (
    <div className={styles.header}>
      <div as="h1" className={styles.logo}>
        Weather App
        {/* <AuthenticationButton /> */}
      </div>
      <div className="spacer" />
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
