import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { WebMercatorViewport } from "viewport-mercator-project";
import bbox from "@turf/bbox";
import SidebarMode from "./SidebarMode";
import SidebarViewDetail from "./SidebarViewDetail";
import SelectHabitatView from "../ViewHabitatSelect/SelectHabitatView";
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
  hexGrid,
  setHexGrid,
  hexOpacity,
  setHexOpacity,
  setDualMap,
  setHexIdInBlue,
  zoomToAOI,
}) => {
  const [view, setView] = useState("visualize");
  const [alerttext, setAlerttext] = useState(false);

  // const zoomToAOI = (aoi) => {
  //   // Use Turf to get the bounding box of the collections of features
  //   let aoiBbox = bbox({
  //     type: "FeatureCollection",
  //     features: aoi.geometry,
  //   });
  //   // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
  //   let viewportBbox = [
  //     [aoiBbox[0], aoiBbox[1]],
  //     [aoiBbox[2], aoiBbox[3]],
  //   ];
  //   // Use WebMercatorViewport to get center longitude/latitude and zoom level
  //   let newViewport = new WebMercatorViewport({
  //     width: 800,
  //     height: 600,
  //   }).fitBounds(viewportBbox, { padding: 100 });
  //   console.log(newViewport);
  //   setViewState({
  //     latitude: newViewport.latitude,
  //     longitude: newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
  //     zoom: newViewport.zoom,
  //   });
  // };

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
            setHabitatLayer={setHabitatLayer}
            setView={setView}
          />
        )}

        {view === "view" && (
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
              hexGrid={hexGrid}
              setHexGrid={setHexGrid}
              setViewState={setViewState}
              hexOpacity={hexOpacity}
              setHexOpacity={setHexOpacity}
              setDualMap={setDualMap}
              setActiveSidebar={setActiveSidebar}
              setView={setView}
            />
          </Container>
        )}

        {view === "act" && (
          <TakeActionView
            aoiSelected={aoiSelected}
            setHexIdInBlue={setHexIdInBlue}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
