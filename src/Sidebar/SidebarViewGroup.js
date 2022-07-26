import React, { useEffect } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import { WebMercatorViewport } from "viewport-mercator-project";
import bbox from "@turf/bbox";

const SidebarViewGroup = ({ aoiSelected, setAoiSelected, setViewport }) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));

  const zoomToAOI = (aoi) => {
    // Use Turf to get the bounding box of the collections of features
    let aoiBbox = bbox({
      type: "FeatureCollection",
      features: aoi.geometry,
    });
    // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
    let viewportBbox = [
      [aoiBbox[0], aoiBbox[1]],
      [aoiBbox[2], aoiBbox[3]],
    ];
    // Use WebMercatorViewport to get center longitude/latitude and zoom level
    let newViewport = new WebMercatorViewport({
      width: 800,
      height: 600,
    }).fitBounds(viewportBbox, { padding: 100 });
    // console.log(newViewport);
    setViewport({
      latitude: newViewport.latitude,
      longitude: newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
      zoom: newViewport.zoom,
    });
  };

  useEffect(() => {
    let initialAOI = aoiList[0];
    setAoiSelected(initialAOI.id);
    zoomToAOI(initialAOI);
  }, []);

  return (
    <ButtonGroup toggle className="mb-2 " vertical style={{ width: "100%" }}>
      {aoiList.length > 0 &&
        aoiList.map((aoi) => (
          <ToggleButton
            key={aoi.id}
            type="radio"
            variant="outline-secondary"
            name={aoi.id}
            value={aoi.id}
            checked={aoiSelected === aoi.id}
            onChange={(e) => {
              setAoiSelected(e.currentTarget.value);
              zoomToAOI(aoi);
            }}
          >
            {aoi.name}
          </ToggleButton>
        ))}
    </ButtonGroup>
  );
};

export default SidebarViewGroup;
