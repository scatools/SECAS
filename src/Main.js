import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import "./main.css";
import Map from "./Map";
import Sidebar from "./Sidebar";
import AoiDetailTable from "./AoiDetailTable";

const Main = () => {
  const [activeSidebar, setActiveSidebar] = useState(false);
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
          habitatType={habitatType}
          hexGrid={hexGrid}
        />
      </div>
    </div>
  );
};

export default Main;
