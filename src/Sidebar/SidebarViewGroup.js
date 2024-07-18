import React, { useEffect } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";

const SidebarViewGroup = ({ aoiSelected, setAoiSelected, zoomToAOI }) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));

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
