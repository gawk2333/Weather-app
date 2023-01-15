import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { Icon } from "semantic-ui-react";
import "../../../../../node_modules/leaflet-geosearch/dist/geosearch.css";

export default function SearchBar({ handleSaveResult }) {
  const map = useMap();

  const PopupContent = ({ query, result }) => {
    const content = (
      <div>
        <span>{result.label}</span>
        <Icon name="save green" />
      </div>
    );
    return ReactDOMServer.renderToString(content);
  };

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ query, result }) => {
        console.log(PopupContent({ query, result }));
        return PopupContent({ query, result });
      }, // optional: function    - default returns result label,
      resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
      maxMarkers: 100, // optional: number      - default 1
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: false, // optional: true|false  - default false
      searchLabel: "Enter address", // optional: string      - default 'Enter address'
      keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}
