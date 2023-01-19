import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "../../../../../../node_modules/leaflet-geosearch/dist/geosearch.css";

export default function SearchBar() {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "button",
      showMarker: false,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}
