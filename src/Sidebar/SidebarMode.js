import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ToggleButtonGroup
      type="radio"
      name="modeSelect"
      className="d-flex justify-content-center"
    >
      <ToggleButton
        id="visualize"
        variant="outline-secondary"
        value="visualize"
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Habitat Select
      </ToggleButton>
      <ToggleButton
        id="add"
        variant="outline-secondary"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        id="viewAOI"
        variant="outline-secondary"
        value="viewAOI"
        checked={view === "viewAOI"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Evaluate
      </ToggleButton>
      <ToggleButton
        id="act"
        variant="outline-secondary"
        value="act"
        checked={view === "act"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Take Action
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SidebarMode;
