import React, { useState, useCallback } from "react";
import {
  Accordion,
  Alert,
  Button,
  ButtonGroup,
  Card,
  Container,
  FormControl,
  InputGroup,
  ToggleButton,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import Select from "react-select";
import { v4 as uuid } from "uuid";
import area from "@turf/area";
import axios from "axios";
import shp from "shpjs";
import "./main.css";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
  input_aoi,
} from "./action";
import SidebarMode from "./SidebarMode";
import SidebarViewGroup from "./SidebarViewGroup";
import SidebarViewDetail from "./SidebarViewDetail";
import AddAOIView from "./ViewAddAOI/AddAOIView";
import SelectHabitatView from "./ViewHabitatSelect/SelectHabitatView";
import SelectMeasures from "./SelectMeasures";
import AssessCondition from "./AssessCondition";

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
  setViewport,
  setHabitatType,
  autoDraw,
}) => {
  const [view, setView] = useState("visualize");
  const [selectMode, setSelectMode] = useState("health");
  const [alerttext, setAlerttext] = useState(false);
  // const weights =  useSelector(state => state.weights);
  const dispatch = useDispatch();

  const calculateArea = (input) => {
    let totalArea = 0;
    if (input.length > 0) {
      totalArea =
        input.reduce((a, b) => {
          return a + area(b);
        }, 0) / 1000000;
    }
    return totalArea;
  };

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
        <hr />
        <SidebarMode view={view} setView={setView} />
        <hr />
        {view === "visualize" && (
          <SelectHabitatView
            setHabitatType={setHabitatType}
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
            autoDraw={autoDraw}
          />
        )}

        {view === "hfc" && <SelectMeasures setView={setView} />}

        {view === "assess" && <AssessCondition />}
      </div>
    </div>
  );
};

export default Sidebar;
