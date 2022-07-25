import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ToggleButtonGroup name="modeSwitch" className="d-flex justify-content-center">
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        id="visualize"
        name="visualize"
        value="visualize"
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Visualize
      </ToggleButton>
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        id="add"
        name="add"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        id="view"
        name="view"
        value="view"
        checked={view === "view"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Assess Condition
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SidebarMode;
