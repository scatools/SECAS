import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import "./main.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import { DrawPolygonMode } from "react-map-gl-draw";

const Main = () => {
  const [mode, setMode] = useState(null);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [aoiSelected, setAoiSelected] = useState(null);
  const [editAOI, setEditAOI] = useState(false);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 35,
    longitude: -95,
    zoom: 5,
  });
  const [habitatType, setHabitatType] = useState(null);

  const autoDraw = async () => {
    setMode(new DrawPolygonMode());
    // Use crosshair as cursor style when drawing new shapes over SCA boundary
    // setInteractiveLayerIds(["secas-boundry"]);
  };

  return (
    <div>
      <Sidebar
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
        setActiveTable={setActiveTable}
        setDrawingMode={setDrawingMode}
        featureList={featureList}
        aoiSelected={aoiSelected}
        setAoiSelected={setAoiSelected}
        editAOI={editAOI}
        setEditAOI={setEditAOI}
        setViewport={setViewport}
        setHabitatType={setHabitatType}
        autoDraw={autoDraw}
      />
      <div style={{ height: "100%", position: "relative" }} className="content">
        <Button
          style={{ position: "absolute", top: "80px", left: "50px", zIndex: 1 }}
          variant="secondary"
          onClick={() => {
            setActiveSidebar(true);
          }}
        >
          <MdMenu />
        </Button>
        <Map
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewport={viewport}
          setViewport={setViewport}
          habitatType={habitatType}
          interactiveLayerIds={interactiveLayerIds}
          setInteractiveLayerIds={setInteractiveLayerIds}
          autoDraw={autoDraw}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
};

export default Main;
