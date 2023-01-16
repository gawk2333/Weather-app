import React, { useState, useRef, useMemo, useCallback } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { v4 } from "uuid";
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
    click({ latlng }) {
      if (latlng) {
        const newMark = _.cloneDeep(latlng);
        newMark.id = v4();
        newMark.draggable = false;
        handleSaveResult(newMark);
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
      position={{
        lat: marker.lat,
        lng: marker.lng,
      }}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={() => toggleDraggable(marker)}>
          {marker.id}
          {marker.draggable
            ? "Marker is draggable"
            : "Click here to make marker draggable"}
        </span>
      </Popup>
    </Marker>
  ));
}
