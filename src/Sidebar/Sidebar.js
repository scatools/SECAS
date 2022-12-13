import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { WebMercatorViewport } from "viewport-mercator-project";
import bbox from "@turf/bbox";
import SidebarMode from "./SidebarMode";
import SidebarViewDetail from "./SidebarViewDetail";
import SelectHabitatView from "../ViewHabitatSelect/SelectHabitatView";
import AddAOIView from "../ViewAddAOI/AddAOIView";
import TakeActionView from "../ViewTakeAction/TakeActionView";
import "../main.css";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { setLoader } from "../action";
import { useDispatch, useSelector } from "react-redux";

const arrowIcon = (
  <FontAwesomeIcon
    icon={faRedo}
    color="red"
    size="lg"
    flip="horizontal"
    style={{ paddingLeft: "30px;" }}
  />
);

const alertIcon = (
  <FontAwesomeIcon
    icon={faExclamationCircle}
    color="red"
    style={{ margin: "0 5px;" }}
  />
);
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
  restoreAction,
  setRestoreAction,
  protectAction,
  setProtectAction,
  maintainAction,
  setMaintainAction,
  zoomToAOI,
}) => {
  const [sidebarView, setSidebarView] = useState("visualize");
  const [alerttext, setAlerttext] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  let loading = useSelector((state) => state.loading.isLoading);

  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);
  const resetButton = () => {
    window.location.reload(true);
  };

  const dispatch = useDispatch();
  const history = useNavigate();

  // useEffect(() => {
  //   console.log(view);
  // }, [view]);

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
        <SidebarMode
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          habitatLayer={habitatLayer}
        />
        <br />
        {sidebarView === "visualize" && (
          <SelectHabitatView
            habitatLayer={habitatLayer}
            setHabitatLayer={setHabitatLayer}
            setSidebarView={setSidebarView}
          />
        )}

        {sidebarView === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setHabitatLayer={setHabitatLayer}
            setSidebarView={setSidebarView}
          />
        )}

        {sidebarView === "viewAOI" && (
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
              setSidebarView={setSidebarView}
            />
          </Container>
        )}

        {sidebarView === "act" && (
          <TakeActionView
            aoiSelected={aoiSelected}
            setHexIdInBlue={setHexIdInBlue}
            restoreAction={restoreAction}
            setRestoreAction={setRestoreAction}
            protectAction={protectAction}
            setProtectAction={setProtectAction}
            maintainAction={maintainAction}
            setMaintainAction={setMaintainAction}
          />
        )}
      </div>
      {habitatLayer && (
        <Button
          id="resetButton"
          variant="dark"
          style={{ float: "left" }}
          onClick={showConfirm}
        >
          Start Over {arrowIcon}
        </Button>
      )}
      {/* <button
        onClick={() => dispatch(setLoader(true))}
        className="test"
      ></button> */}

      <Modal show={confirmShow} onHide={confirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>WAIT{alertIcon}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This will delete everything you've done so far.</p>
          <p>Are you sure you'd like to continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={resetButton}>
            Yes, start over.
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
