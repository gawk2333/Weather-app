/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { DomEvent } from "leaflet";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};
export default function ModuleContainer({ position, icon, title, content }) {
  const [isSelected, setIsSelected] = useState(false);
  const moduleRef = useRef(null);

  const handleControlClick = (e) => {
    e.preventDefault();
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    if (moduleRef) {
      DomEvent.disableClickPropagation(moduleRef.current);
    }
  }, [moduleRef]);

  return (
    <div className={POSITION_CLASSES[position]} ref={moduleRef} title={title}>
      <div className="leaflet-control leaflet-bar">
        <a href="#" className="leaflet-bar-part leaflet-bar-part-single">
          <Popup
            basic
            content={content}
            trigger={
              <Icon name={icon} onClick={(e) => handleControlClick(e)} />
            }
            open={isSelected}
          />
        </a>
      </div>
    </div>
  );
}
