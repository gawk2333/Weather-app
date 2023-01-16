import React, { useState, useRef, useMemo, useCallback } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon, Grid, Popup as SemanticPopup } from "semantic-ui-react";
import { v4 } from "uuid";
import { getWeatherByGeoPositionApi } from "../../../../../api/weatherApi";
import L from "leaflet";
import _ from "lodash";

export default function MarkerTool({ markers, setMarkers }) {
  const [draggingMarker, setDraggingMarker] = useState(null);
  const markerRef = useRef(null);

  const handleSaveResult = (marker) => {
    const savedResult = _.cloneDeep(markers);
    savedResult.push(marker);
    setMarkers(savedResult);
  };

  useMapEvents({
    click: async ({ latlng }) => {
      const newMarker = _.cloneDeep(latlng);
      if (latlng) {
        const weatherResult = await getWeatherByGeoPositionApi(latlng);
        if (weatherResult) {
          newMarker.weather = weatherResult.current;
          newMarker.location = weatherResult.location;
          newMarker.id = v4();
          newMarker.draggable = false;
          handleSaveResult(newMarker);
        }
      }
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null && draggingMarker != null) {
          const markerLatLng = marker.getLatLng();
          const dragedMarkers = markers.map((marker) => {
            if (marker.id === draggingMarker.id) {
              marker.lat = markerLatLng.lat;
              marker.lng = markerLatLng.lng;
            }
            return marker;
          });
          setMarkers(dragedMarkers);
        }
      },
    }),
    [draggingMarker, markers, setMarkers]
  );

  const toggleDraggable = useCallback(
    (markerForDrag) => {
      const toggledMarkers = markers.map((marker) => {
        if (marker.id === markerForDrag.id) {
          marker.draggable = !marker.draggable;
          setDraggingMarker(marker);
        }
        return marker;
      });
      setMarkers(toggledMarkers);
    },
    [markers, setMarkers]
  );

  return markers.map((marker, index) => (
    <Marker
      key={marker.id}
      draggable={marker.draggable}
      eventHandlers={eventHandlers}
      icon={
        marker.weather.condition.icon
          ? L.icon({
              iconUrl: marker.weather.condition.icon,
              iconSize: [64, 64],
              iconAnchor: [32, 32],
            })
          : L.Icon.Default()
      }
      position={{
        lat: marker.lat,
        lng: marker.lng,
      }}
      ref={markerRef}
    >
      <Popup minWidth={180}>
        <Grid columns={2}>
          <Grid.Row stretched>
            <SemanticPopup
              content={
                marker.draggable
                  ? "Click to lock current marker"
                  : "Click to make marker draggable"
              }
              trigger={
                <Icon
                  name={marker.draggable ? "lock red" : "move green"}
                  onClick={() => toggleDraggable(marker)}
                />
              }
            />
          </Grid.Row>
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
        </Grid>
      </Popup>
    </Marker>
  ));
}
