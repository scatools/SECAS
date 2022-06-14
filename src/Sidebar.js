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
  hexGrid,
  setHexGrid,
}) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("visualize");
  const [inputMode, setInputMode] = useState("draw");
  const [selectMode, setSelectMode] = useState("health");
  const [drawData, setDrawData] = useState("");
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

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  const handleSubmit = async () => {
    if (!drawData) {
      setAlerttext("A name for this area of interest is required.");
    } else if (featureList.length === 0) {
      setAlerttext("At least one polygon is required.");
    } else {
      setAlerttext(false);
      const newList = featureList;
      // console.log(newList);
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      const res = await axios.post("https://secas-backend.herokuapp.com/data", {
        data,
      });
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: drawData,
          geometry: newList,
          area: planArea,
          hexagons: res.data.data,
          // rawScore: aggregate(res.data.data, planArea),
          // scaleScore: getStatus(aggregate(res.data.data, planArea)),
          id: uuid(),
        })
      );
      setDrawingMode(false);
      setMode("view");
    }
  };

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber
      ) => {
        setAlerttext(false);
        // Coordinates must be a single array for the area to be correctly calculated
        const newList = geometry.coordinates.map((coordinates) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: geometryType,
            coordinates: [coordinates],
          },
        }));
        // console.log(newList);
        const data = geometry;

        // For development on local server
        // const res = await axios.post('http://localhost:5000/data', { data });
        // For production on Heroku
        const res = await axios.post(
          "https://secas-backend.herokuapp.com/data",
          { data }
        );
        const planArea = calculateArea(newList);
        dispatch(
          input_aoi({
            name: "Area of Interest " + aoiNumber,
            geometry: newList,
            area: planArea,
            hexagons: res.data.data,
            // rawScore: aggregate(res.data.data, planArea),
            // scaleScore: getStatus(aggregate(res.data.data, planArea)),
            id: uuid(),
          })
        );
        setMode("view");
      };

      for (let file of acceptedFiles) {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await shp(reader.result);
          if (result) {
            // console.log(result.features);
            // Features are stored as [0:{}, 1:{}, 2:{}, ...]
            for (var num in result.features) {
              var featureGeometry = result.features[num].geometry;
              var featureGeometryType = result.features[num].geometry.type;
              var featureNumber = parseInt(num) + 1;
              var featureName = null;
              // Check if each feature has a name-like property
              for (var property in result.features[num].properties) {
                if (
                  property.indexOf("name") != -1 ||
                  property.indexOf("Name") != -1 ||
                  property.indexOf("NAME") != -1
                ) {
                  featureName = result.features[num].properties[property];
                }
              }
              // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
              handleSubmitShapefile(
                featureGeometry,
                featureGeometryType,
                featureNumber,
                featureName
              );
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [dispatch]
  );

  const dropdownStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      return { ...provided, opacity };
    },
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
        <SidebarMode mode={mode} setMode={setMode} />
        <hr />
        {mode === "visualize" && (
          <Accordion defaultActiveKey="0">
            <Card className="my-2">
              <Accordion.Toggle as={Card.Header} eventKey="2">
                Select Habitat Type:
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <div>
                    <span>
                      <em>
                        Please select one habitat type from the list to
                        visualize.{" "}
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
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )}

        {mode === "add" && (
          <div>
            <Container className="d-flex">
              <ButtonGroup toggle className="m-auto">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="draw"
                  value="draw"
                  checked={inputMode === "draw"}
                  onChange={(e) => setInputMode(e.currentTarget.value)}
                >
                  by Drawing
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="shapefile"
                  value="shapefile"
                  checked={inputMode === "shapefile"}
                  onChange={(e) => setInputMode(e.currentTarget.value)}
                >
                  by Zipped Shapefile
                </ToggleButton>
              </ButtonGroup>
            </Container>
            <hr />

            {inputMode === "draw" && (
              <Container className="m-auto" style={{ width: "80%" }}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      AOI Name:
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="planName"
                    value={drawData}
                    onChange={handleNameChange}
                    placeholder="Name area of interest here..."
                  />
                </InputGroup>
                <hr />
                <Button
                  variant="dark"
                  style={{ float: "left" }}
                  onClick={() => {
                    setDrawingMode(true);
                    setAoiSelected(false);
                  }}
                >
                  Add a New Shape
                </Button>
                <Button
                  variant="dark"
                  style={{ float: "right" }}
                  onClick={handleSubmit}
                >
                  Finalize Input
                </Button>
              </Container>
            )}

            {inputMode === "shapefile" && (
              <Container className="m-auto file-drop">
                <Dropzone onDrop={onDrop} accept=".zip">
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      Click me to upload a file!
                    </div>
                  )}
                </Dropzone>
              </Container>
            )}

            {alerttext && (
              <Alert
                className="mt-4"
                variant="light"
                onClose={() => setAlerttext(false)}
                dismissible
              >
                <p style={{ color: "red" }}>{alerttext}</p>
              </Alert>
            )}
          </div>
        )}

        {mode === "view" && (
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
              hexGrid={hexGrid}
              setHexGrid={setHexGrid}
            />
          </Container>
        )}

        {mode === "assess" && (
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
