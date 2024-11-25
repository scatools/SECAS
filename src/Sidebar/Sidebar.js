import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { WebMercatorViewport } from "viewport-mercator-project";
import bbox from "@turf/bbox";
import SidebarMode from "./SidebarMode";
import SidebarViewDetail from "./SidebarViewDetail";
import AddAOIView from "../ViewAddAOI/AddAOIView";
import TakeActionView from "../ViewTakeAction/TakeActionView";
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
  hexData,
  setActionHexData,
  hexGrid,
  setHexGrid,
  hexOpacity,
  setHexOpacity,
  setDualMap,
  setHexIdInBlue,
  actionScores,
  setActionScores,
  zoomToAOI,
  stochasticityChecked,
  setStochasticityChecked,
  setProgress,
  setShowProgress
}) => {
  const [view, setView] = useState("add");
  const [showAlert, setShowAlert] = useState(false);
  const [alerttext, setAlerttext] = useState(false);
  
  useEffect(() => {
    if (alerttext) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [alerttext]);

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
        <SidebarMode aoiSelected={aoiSelected} view={view} setView={setView} />
        <br />

        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setHabitatLayer={setHabitatLayer}
            setView={setView}
            setProgress={setProgress}
            setShowProgress={setShowProgress}
          />
        )}

        {view === "evaluate" && (
          <Container>
            <SidebarViewDetail
              zoomToAOI={zoomToAOI}
              setHabitatLayer={setHabitatLayer}
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
              hexData={hexData}
              hexGrid={hexGrid}
              setHexGrid={setHexGrid}
              setViewState={setViewState}
              hexOpacity={hexOpacity}
              setHexOpacity={setHexOpacity}
              setDualMap={setDualMap}
              setActiveSidebar={setActiveSidebar}
              setView={setView}
              stochasticityChecked={stochasticityChecked}
              setStochasticityChecked={setStochasticityChecked}
            />
          </Container>
        )}

        {view === "act" && (
          <TakeActionView
            aoiSelected={aoiSelected}
            hexData={hexData}
            setActionHexData={setActionHexData}
            setHexIdInBlue={setHexIdInBlue}
            actionScores={actionScores}
            setActionScores={setActionScores}
          />
        )}
      </div>
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          {alerttext}
        </Alert>
      )}
    </div>
  );
};

export default Sidebar;
