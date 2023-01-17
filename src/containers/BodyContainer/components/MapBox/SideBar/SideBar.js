import React from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Icon, Popup } from "semantic-ui-react";
import { useMap } from "react-leaflet";

export default function SideBar({
  showSidebar,
  onSidebarHide,
  markers,
  setMarkers,
}) {
  const map = useMap();

  const handleNavbarSelect = (marker) => {
    const position = {
      lat: marker.location.lat,
      lng: marker.location.lon,
    };
    map.setView(position);
    onSidebarHide();
  };

  const handleMarkerDelete = (markerForDelete) => {
    const filteredMarkers = markers.filter(
      (marker) => marker.id !== markerForDelete.id
    );
    setMarkers(filteredMarkers);
  };

  return (
    <Offcanvas show={showSidebar} onHide={onSidebarHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Markers</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {!markers || markers?.length === 0
          ? null
          : markers?.map((marker, index) => {
              return (
                <>
                  <Navbar bg="dark" variant="dark" key={`navbar-${index}`}>
                    <Container>
                      <Navbar.Brand key={`navbar-brand-${index}-1`}>
                        <img
                          src={marker.weather.condition.icon}
                          width="30"
                          height="30"
                          className="d-inline-block align-top"
                          alt="React Bootstrap logo"
                        />
                      </Navbar.Brand>
                      <Navbar.Brand key={`navbar-brand-${index}-2`}>
                        <span>{`${marker.weather.temp_c}℃`}</span>
                      </Navbar.Brand>
                      <Navbar.Brand
                        key={`navbar-brand-${index}-3`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavbarSelect(marker)}
                      >
                        <Popup
                          trigger={<span>{marker.location.name}</span>}
                          content={"Click to jump to the location"}
                        />
                      </Navbar.Brand>
                      <Navbar.Brand
                        key={`navbar-brand-${index}-4`}
                        style={{ cursor: "pointer" }}
                      >
                        <Popup
                          trigger={
                            <Icon
                              name="close"
                              color="red"
                              onClick={() => handleMarkerDelete(marker)}
                            />
                          }
                          content={"Delete the marker"}
                        />
                      </Navbar.Brand>
                    </Container>
                  </Navbar>
                  <br />
                </>
              );
            })}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
