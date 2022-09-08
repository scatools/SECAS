import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ToggleButtonGroup name="modeSwitch" className="d-flex justify-content-center">
      <ToggleButton
        id="visualize"
        type="radio"
        variant="outline-secondary"
        name="visualize"
        value="visualize"
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Visualize Habitat
      </ToggleButton>
      <ToggleButton
        id="add"
        type="radio"
        variant="outline-secondary"
        name="add"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Import AOI
      </ToggleButton>
      <ToggleButton
        id="view"
        type="radio"
        variant="outline-secondary"
        name="view"
        value="view"
        checked={view === "view"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Summarize AOI
      </ToggleButton>
      <ToggleButton
        id="act"
        type="radio"
        variant="outline-secondary"
        name="act"
        value="act"
        checked={view === "act"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Take Actions
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SidebarMode;
