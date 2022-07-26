import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import "./main.css";
import Sidebar from "./Sidebar/Sidebar";
import AoiDetailTable from "./AoiDetailTable";
import MapView from "./Map/MapView";

const Main = () => {
  const [mode, setMode] = useState(null);
  const [isDual, setIsDual] = useState(false);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [aoiSelected, setAoiSelected] = useState(null);
  const [editAOI, setEditAOI] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: 34.3,
    longitude: -96.5,
    zoom: 4.9,
  });
  const [habitatLayer, setHabitatLayer] = useState(null);
  const [hexGrid, setHexGrid] = useState(false);
  const [hexOpacity, setHexOpacity] = useState(50);
  const [dualMap, setDualMap] = useState(false);

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
        setViewState={setViewState}
        habitatLayer={habitatLayer}
        setHabitatLayer={setHabitatLayer}
        hexGrid={hexGrid}
        setHexGrid={setHexGrid}
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
        <MapView
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewState={viewState}
          setViewState={setViewState}
          habitatLayer={habitatLayer}
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
