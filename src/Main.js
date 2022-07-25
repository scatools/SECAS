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
    longitude: -90,
    latitude: 35,
    zoom: 5
  });
  const [mapOverlay, setMapOverlay] = useState(null);
  const [hexGrid, setHexGrid] = useState(false);
  const [hexOpacity, setHexOpacity] = useState(50);
  const [dualMap, setDualMap]=useState(false);

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
        setMapOverlay={setMapOverlay}
        hexGrid={hexGrid}
        setHexGrid={setHexGrid}
        autoDraw={autoDraw}
        editMode={editMode}
        hexOpacity={hexOpacity}
        setHexOpacity={setHexOpacity}
        setDualMap={setDualMap}
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
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewport={viewport}
          setViewport={setViewport}
          mapOverlay={mapOverlay}
          hexGrid={hexGrid}
          interactiveLayerIds={interactiveLayerIds}
          hexOpacity={hexOpacity}
          dualMap={dualMap}
        />
      </div>
    </div>
  );
};

export default Main;
