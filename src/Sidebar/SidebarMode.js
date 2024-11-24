import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const SidebarMode = ({ aoiSelected, view, setView }) => {
  return (
    <ToggleButtonGroup
      type="radio"
      name="modeSelect"
      className="d-flex justify-content-center"
    >
      <ToggleButton
        id="add"
        variant="outline-secondary"
        className="sidebar-toggle"
        value="add"
        checked={view === "add"}
        defaultChecked={true}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Add AOI
      </ToggleButton>
      <ToggleButton
        id="evaluate"
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
        variant="outline-secondary"
        className="sidebar-toggle"
        value="act"
        checked={view === "act"}
        disabled={aoiSelected ? false : true}
        onChange={(e) => setView(e.currentTarget.value)}
      >
        Take Action
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SidebarMode;
