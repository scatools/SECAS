import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ButtonGroup className="d-flex justify-content-center">
      <ToggleButton
        id="visualize"
        type="radio"
        variant="outline-secondary"
        name="visualize"
        value="visualize"
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Visualize
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
        Add AOI
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
        Assess Condition
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
