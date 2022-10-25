import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import "./main.css";
import Sidebar from "./Sidebar/Sidebar";
import AoiDetailTable from "./AoiDetailTable";
import MapView from "./Map/MapView";
import { WebMercatorViewport } from "viewport-mercator-project";
import bbox from "@turf/bbox";

const Main = ({ aoiSelected, setAoiSelected }) => {
  const [mode, setMode] = useState(null);
  const [isDual, setIsDual] = useState(false);
  const [currentInteractiveLayerIds, setCurrentInteractiveLayerIds] = useState([
    "current-hex",
  ]);
  const [futureInteractiveLayerIds, setFutureInteractiveLayerIds] = useState([
    "future-hex",
  ]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
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
  const [hexIdInBlue, setHexIdInBlue] = useState([]);
  const [restoreAction, setRestoreAction] = useState(false);
  const [protectAction, setProtectAction] = useState(false);
  const [maintainAction, setMaintainAction] = useState(false);

  const zoomToAOI = (aoi) => {
    if (aoi) {
      // Use Turf to get the bounding box of the collections of features
      let aoiBbox = bbox({
        type: "FeatureCollection",
        features: aoi.geometry,
      });
      // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
      let viewportBbox = [
        [aoiBbox[0], aoiBbox[1]],
        [aoiBbox[2], aoiBbox[3]],
      ];
      // Use WebMercatorViewport to get center longitude/latitude and zoom level
      let newViewport = new WebMercatorViewport({
        width: 800,
        height: 600,
      }).fitBounds(viewportBbox, { padding: 100 });
      setViewState({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
        zoom: newViewport.zoom,
      });
      console.log(newViewport);
    }
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
        setViewState={setViewState}
        habitatLayer={habitatLayer}
        setHabitatLayer={setHabitatLayer}
        hexGrid={hexGrid}
        setHexGrid={setHexGrid}
        hexOpacity={hexOpacity}
        setHexOpacity={setHexOpacity}
        setDualMap={setDualMap}
        setHexIdInBlue={setHexIdInBlue}
        restoreAction={restoreAction}
        setRestoreAction={setRestoreAction}
        protectAction={protectAction}
        setProtectAction={setProtectAction}
        maintainAction={maintainAction}
        setMaintainAction={setMaintainAction}
        zoomToAOI={zoomToAOI}
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
          currentInteractiveLayerIds={currentInteractiveLayerIds}
          futureInteractiveLayerIds={futureInteractiveLayerIds}
          hexOpacity={hexOpacity}
          dualMap={dualMap}
          hexIdInBlue={hexIdInBlue}
          restoreAction={restoreAction}
          protectAction={protectAction}
          maintainAction={maintainAction}
          setActiveSidebar={setActiveSidebar}
        />
      </div>
    </div>
  );
};

export default Main;
