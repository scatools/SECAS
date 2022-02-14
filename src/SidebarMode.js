import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const SidebarMode = ({ view, setView }) => {
  return (
    <ButtonGroup toggle className="d-flex justify-content-center">
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        name="visualize"
        value="visualize"
        checked={view === "visualize"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Habitat
      </ToggleButton>
      <ToggleButton
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
        type="radio"
        variant="outline-secondary"
        name="view"
        value="view"
        checked={view === "view"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        View AOI
      </ToggleButton>
      <ToggleButton
        type="radio"
        variant="outline-secondary"
        name="assess"
        value="assess"
        checked={view === "assess"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Current Condition
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
