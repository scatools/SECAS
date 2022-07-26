import React, { useState } from "react";
import { Container } from "react-bootstrap";
import SidebarMode from "./SidebarMode";
import AddAOIView from "../ViewAddAOI/AddAOIView";
import SidebarViewDetail from "./SidebarViewDetail";
import SelectHabitatView from "../ViewHabitatSelect/SelectHabitatView";
import "../main.css";
import "./sidebar.css";

const Sidebar = ({
  activeSidebar,
  setActiveSidebar,
  setActiveTable,
  setDrawingMode,
  featureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  setEditAOI,
  setViewState,
  habitatLayer,
  setHabitatLayer,
  hexGrid,
  setHexGrid,
  hexOpacity,
  setHexOpacity,
  setDualMap,
}) => {
  const [view, setView] = useState("visualize");
  const [alerttext, setAlerttext] = useState(false);

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <div
        id="dismiss"
        onClick={() => {
          setActiveSidebar(false);
        }}
      >
        X
      </div>

      <div className="ControlWrapper">
        <h5>&nbsp;&nbsp;Options:</h5>
        <br />
        <SidebarMode view={view} setView={setView} />
        <br />
        {view === "visualize" && (
          <SelectHabitatView
            habitatLayer={habitatLayer}
            setHabitatLayer={setHabitatLayer}
            setView={setView}
          />
        )}

        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setView={setView}
            setHabitatLayer={setHabitatLayer}
          />
        )}

        {view === "view" && (
          <Container>
            <SidebarViewDetail
              setHabitatLayer={setHabitatLayer}
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
              hexGrid={hexGrid}
              setHexGrid={setHexGrid}
              setViewState={setViewState}
              hexOpacity={hexOpacity}
              setHexOpacity={setHexOpacity}
              setDualMap={setDualMap}
            />
          </Container>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
