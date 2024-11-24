import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const SidebarMode = ({ aoiSelected, view, setView }) => {
  if (aoiSelected && view === "add") {
    setView("evaluate");
  };

  return (
    <ButtonGroup className="d-flex justify-content-center">
      <ToggleButton
        id="add"
        type="radio"
        variant="outline-secondary"
        className="sidebar-toggle"
        value="add"
        checked={view === "add"}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        id="evaluate"
        type="radio"
        variant="outline-secondary"
        className="sidebar-toggle"
        value="evaluate"
        checked={view === "evaluate"}
        disabled={aoiSelected ? false : true}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Evaluate Condition
      </ToggleButton>
      <ToggleButton
        id="act"
        type="radio"
        variant="outline-secondary"
        className="sidebar-toggle"
        value="act"
        checked={view === "act"}
        disabled={aoiSelected ? false : true}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Take Action
      </ToggleButton>
    </ButtonGroup>
  );
};

export default SidebarMode;
