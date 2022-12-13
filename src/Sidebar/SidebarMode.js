import React from "react";
import { ToggleButton, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const SidebarMode = ({ sidebarView, setSidebarView, habitatLayer }) => {
  let aoiList = useSelector((state) => state.aoi);
  let aoiListLength = Object.keys(aoiList).length;
  return (
    <ButtonGroup
      type="radio"
      name="modeSelect"
      className="d-flex justify-content-center"
    >
      <ToggleButton
        type="radio"
        id="visualize"
        variant="outline-secondary"
        value="visualize"
        checked={sidebarView === "visualize"}
        onChange={(e) => setSidebarView(e.currentTarget.value)}
      >
        Habitat Select
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="add"
        variant="outline-secondary"
        value="add"
        checked={sidebarView === "add"}
        onChange={(e) => setSidebarView(e.currentTarget.value)}
        disabled={!habitatLayer}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="viewAOI"
        variant="outline-secondary"
        value="viewAOI"
        checked={sidebarView === "viewAOI"}
        onChange={(e) => setSidebarView(e.currentTarget.value)}
        disabled={aoiListLength < 1}
      >
        Evaluate
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="act"
        variant="outline-secondary"
        value="act"
        checked={sidebarView === "act"}
        onChange={(e) => setSidebarView(e.currentTarget.value)}
        disabled="true"
      >
        Take Action
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
