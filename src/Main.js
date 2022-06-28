import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import "./main.css";
import Map from "./Map";
import Sidebar from "./Sidebar/Sidebar";
import AoiDetailTable from "./AoiDetailTable";
import { DrawPolygonMode, EditingMode } from "react-map-gl-draw";

const Main = () => {
  const [mode, setMode] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [aoiSelected, setAoiSelected] = useState(null);
  const [editAOI, setEditAOI] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 35,
    longitude: -95,
    zoom: 5,
  });
  const [habitatType, setHabitatType] = useState(null);
  const [hexGrid, setHexGrid] = useState(false);

  const autoDraw = async () => {
    setMode(new DrawPolygonMode());
    // Use crosshair as cursor style when drawing new shapes over SCA boundary
    setInteractiveLayerIds(["SECASlayer"]);
  };

  const editMode = async () => {
    setMode(new EditingMode());
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
        hexGrid={hexGrid}
        setHexGrid={setHexGrid}
        autoDraw={autoDraw}
        editMode={editMode}
      />
      <AoiDetailTable
        activeTable={activeTable}
        setActiveTable={setActiveTable}
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
          mode={mode}
          setMode={setMode}
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewport={viewport}
          setViewport={setViewport}
          habitatType={habitatType}
          hexGrid={hexGrid}
          autoDraw={autoDraw}
          interactiveLayerIds={interactiveLayerIds}
          setInteractiveLayerIds={setInteractiveLayerIds}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default Main;
