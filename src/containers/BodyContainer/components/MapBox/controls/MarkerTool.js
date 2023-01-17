import React, { useState, useRef } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon, Grid, Popup as SemanticPopup } from "semantic-ui-react";
import { v4 } from "uuid";
import { getWeatherByGeoPositionApi } from "../../../../../api/weatherApi";
import L from "leaflet";
import _ from "lodash";

export default function MarkerTool({ markers, setMarkers }) {
  // const [draggingMarker, setDraggingMarker] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [zoom, setZoom] = useState(5);
  const markerRef = useRef(null);

  const handleSaveMarker = (e) => {
    e.preventDefault();
    const savedResult = _.cloneDeep(markers);
    savedResult.push(activeMarker);
    setMarkers(savedResult);
    setActiveMarker(null);
  };

  const handleDeleteMarker = (e, markerForDelete) => {
    e.preventDefault();
    const filteredMarkers = markers.filter(
      (marker) => marker.id !== markerForDelete.id
    );
    setMarkers(filteredMarkers);
  };

  const getMarkerIcon = (marker, zoomlevel) => {
    if (marker.weather.condition.icon) {
      if (zoomlevel >= 3 && zoomlevel < 5) {
        return L.icon({
          iconUrl: marker.weather.condition.icon,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
      } else if (zoomlevel >= 5 && zoomlevel < 8) {
        return L.icon({
          iconUrl: marker.weather.condition.icon,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      } else if (zoomlevel >= 8 && zoomlevel <= 13) {
        return L.icon({
          iconUrl: marker.weather.condition.icon,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        });
      } else {
        return L.icon({
          iconUrl: marker.weather.condition.icon,
          iconSize: [64, 64],
          iconAnchor: [32, 32],
        });
      }
    } else {
      return L.Icon.Default();
    }
  };

  const map = useMapEvents({
    click: async ({ latlng }) => {
      if (latlng) {
        const newMarker = {
          lat: latlng.lat,
          lng: latlng.lng,
        };
        const weatherResult = await getWeatherByGeoPositionApi(latlng);
        if (weatherResult) {
          newMarker.weather = weatherResult.current;
          newMarker.location = weatherResult.location;
          newMarker.id = v4();
          newMarker.draggable = false;
          setActiveMarker(newMarker);
        }
      }
    },
    zoomend: () => {
      const currentZoom = map.getZoom();
      setZoom(currentZoom);
    },
  });

  // const eventHandlers = useMemo(
  //   () => ({
  //     dragend() {
  //       const marker = markerRef.current;
  //       if (marker != null && draggingMarker != null) {
  //         const markerLatLng = marker.getLatLng();
  //         const dragedMarkers = markers.map((marker) => {
  //           if (marker.id === draggingMarker.id) {
  //             marker.lat = markerLatLng.lat;
  //             marker.lng = markerLatLng.lng;
  //           }
  //           return marker;
  //         });
  //         setMarkers(dragedMarkers);
  //       }
  //     },
  //   }),
  //   [draggingMarker, markers, setMarkers]
  // );

  // const toggleDraggable = useCallback(
  //   (markerForDrag) => {
  //     const toggledMarkers = markers.map((marker) => {
  //       if (marker.id === markerForDrag.id) {
  //         marker.draggable = !marker.draggable;
  //         setDraggingMarker(marker);
  //       }
  //       return marker;
  //     });
  //     setMarkers(toggledMarkers);
  //   },
  //   [markers, setMarkers]
  // );

  return (
    <>
      {activeMarker && (
        <Marker
          icon={getMarkerIcon(activeMarker, zoom)}
          position={{
            lat: activeMarker.lat,
            lng: activeMarker.lng,
          }}
        >
          <Popup minWidth={180}>
            <Grid columns={2}>
              <Grid.Row columns="equal">
                <Grid.Column>{activeMarker.location.name}</Grid.Column>
                <Grid.Column>{activeMarker.location.localtime}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>{activeMarker.location.region}</Grid.Column>
                <Grid.Column>{activeMarker.weather.condition.text}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>{activeMarker.location.country}</Grid.Column>
                <Grid.Column>{activeMarker.weather.temp_c}℃</Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    more details
                  </span>
                </Grid.Column>
                <Grid.Column>
                  <SemanticPopup
                    content={"Save marker."}
                    trigger={
                      <Icon
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleSaveMarker(e)}
                        color="green"
                        name="save"
                      />
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Popup>
        </Marker>
      )}
      {markers.map((marker, index) => (
        <Marker
          key={marker.id}
          icon={getMarkerIcon(marker, zoom)}
          position={{
            lat: marker.lat,
            lng: marker.lng,
          }}
          ref={markerRef}
        >
          <Popup minWidth={180}>
            <Grid columns={2}>
              <Grid.Row columns="equal">
                <Grid.Column>{marker.location.name}</Grid.Column>
                <Grid.Column>{marker.location.localtime}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>{marker.location.region}</Grid.Column>
                <Grid.Column>{marker.weather.condition.text}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>{marker.location.country}</Grid.Column>
                <Grid.Column>{marker.weather.temp_c}℃</Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column>
                  <span style={{ color: "blue", cursor: "pointer" }}>
                    more details
                  </span>
                </Grid.Column>
                <Grid.Column>
                  <SemanticPopup
                    content={"Delete marker."}
                    trigger={
                      <Icon
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleDeleteMarker(e, marker)}
                        color="red"
                        name="close"
                      />
                    }
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
