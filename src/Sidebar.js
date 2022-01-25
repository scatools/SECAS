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
          <Container defaultActiveKey="0">
            <p>Select Habitat Type:</p>
            <div>
              <span>
                <em>
                  Please select one habitat type from the list to visualize.{" "}
                </em>
              </span>
              <br></br>
              <br></br>
              <span>Habitat Type:</span>
              <br></br>
              <Select
                id="selectHabitatType"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPortalTarget={document.body}
                options={[
                  // { value: 'hab1', label: 'Open Pine Woodland BDH' },
                  // { value: 'hab2', label: 'Forested Wetland' },
                  { value: "hab3", label: "Upland Hardwoods - Forest" },
                  { value: "hab4", label: "Upland Hardwoods - Woodland" },
                  { value: "hab5", label: "Mixed Forest" },
                  { value: "hab6", label: "Grass" },
                  // { value: 'hab7', label: 'Tidal Marsh' },
                  // { value: 'hab8', label: 'Big Rivers' },
                  // { value: 'hab9', label: 'Streams and Rivers' }
                ]}
                isMulti={false}
                isClearable={false}
                placeholder="Select Habitat..."
                name="selectHabitatType"
                onChange={(selectedOption) => {
                  setHabitatType(selectedOption.value);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          </Container>
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

        {view === "view" && (
          <Container>
            <SidebarViewGroup
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setViewport={setViewport}
            />
            <SidebarViewDetail
              aoiSelected={aoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
            />
          </Container>
        )}

        {view === "assess" && (
          <Accordion defaultActiveKey="0">
            <Card className="my-2">
              <Accordion.Toggle as={Card.Header} eventKey="2">
                Select Attribute:
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <div>
                    <span>
                      <em>
                        Please select one attribute from the list and click
                        next.{" "}
                      </em>
                    </span>
                    <br></br>
                    <br></br>
                    <span>Attribute:</span>
                    <br></br>
                    <Select
                      id="selectAttribute"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                      options={[
                        { value: "health", label: "Health" },
                        { value: "function", label: "Function" },
                        { value: "connectivity", label: "Connectivity" },
                      ]}
                      isClearable={false}
                      placeholder="Select Attribute..."
                      name="colors"
                      onChange={(e) => {
                        setSelectMode(e.value);
                      }}
                    />
                  </div>
                </Card.Body>
              </Accordion.Collapse>

              <Accordion.Toggle as={Card.Header} eventKey="2">
                Select Indicator:
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <div>
                    <span>
                      <em>
                        Please select one indicator from the list and click the
                        blue button to create assessment.{" "}
                      </em>
                    </span>
                    <br></br>
                    <br></br>
                    <span>Indicator:</span>
                    <br></br>
                    {selectMode === "health" && (
                      <Select
                        id="selectIndicator"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        options={[
                          { value: "hea1", label: "Site Intergrity" },
                          { value: "hea2", label: "Biodiversity" },
                          { value: "hea3", label: "Disturbance" },
                        ]}
                        isClearable={false}
                        placeholder="Select Indicator..."
                        name="attribute"
                      />
                    )}

                    {selectMode === "function" && (
                      <Select
                        id="selectIndicator"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        options={[
                          { value: "fun1", label: "Ecosystem Services" },
                        ]}
                        isClearable={false}
                        placeholder="Select Indicator..."
                        name="attribute"
                      />
                    )}

                    {selectMode === "connectivity" && (
                      <Select
                        id="selectIndicator"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        options={[
                          {
                            value: "con1",
                            label: "Connectedness / Fragmentation",
                          },
                          { value: "con2", label: "Permeability of Hubs" },
                        ]}
                        isClearable={false}
                        placeholder="Select Indicator..."
                        name="attribute"
                      />
                    )}
                  </div>
                  <br />
                  <Button id="avmButton">Create Assessment</Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
