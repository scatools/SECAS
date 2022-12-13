import React from "react";
import { ToggleButton, ButtonGroup } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
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
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Habitat Select
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="add"
        variant="outline-secondary"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="viewAOI"
        variant="outline-secondary"
        value="viewAOI"
        checked={view === "viewAOI"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Evaluate
      </ToggleButton>
      <ToggleButton
        type="radio"
        id="act"
        variant="outline-secondary"
        value="act"
        checked={view === "act"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Take Action
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
