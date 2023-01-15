import React from "react";
import { Offcanvas } from "react-bootstrap";

export default function SideBar({
  showSidebar,
  onSidebarHide,
  markers,
  setMarkers,
}) {
  return (
    <Offcanvas show={showSidebar} onHide={onSidebarHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cities</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{markers}</Offcanvas.Body>
    </Offcanvas>
  );
}
