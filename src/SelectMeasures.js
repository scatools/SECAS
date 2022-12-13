import React, { useState } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { GoInfo, GoQuestion } from "react-icons/go";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
} from "./action";

const SelectMeasures = ({ setSidebarView }) => {
  const [show, setShow] = useState(false);
  const [restoreGoal, setRestoreGoal] = useState("");
  const [inputType, setInputType] = useState("scaled");
  const [inputMeasureName, setInputMeasureName] = useState("");
  const [inputMeasureValueList, setInputMeasureValueList] = useState([]);
  const weights = useSelector((state) => state.weights);
  const [habitatSelect, setHabitatSelect] = useState(false);
  const [waterSelect, setWaterSelect] = useState(false);
  const [resourceSelect, setResourceSelect] = useState(false);
  const [resilienceSelect, setResilienceSelect] = useState(false);
  const [economySelect, setEconomySelect] = useState(false);
  const dispatch = useDispatch();
  const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

  // For predefined data measures

  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  let dataMeasList = ["health", "function", "connect"];
  const [dataI, setDataI] = useState(0);

  const handleNext = () => {
    if (dataI === dataMeasList.length - 1) {
      setSidebarView("assess");
    } else {
      setDataI(dataI + 1);
    }
  };

  const handleBack = () => {
    if (dataI === 0) {
      setSidebarView("add");
    } else {
      let newI = dataI - 1;
      setDataI(newI);
    }
  };

  return (
    <Container>
      <h3>Data Measures </h3>
      <p className="smaller-text">
        Select each relevant data measure and set your prioritization level
        (Low, Medium, High)
      </p>
      {dataMeasList[dataI] === "health" && (
        <div>
          <span>Health:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              {
                value: "health1",
                label: "Connectivity to Existing Protected Area",
              },
              { value: "health2", label: "Connectivity of Natural Lands" },
              { value: "health3", label: "Threat of Urbanization" },
              {
                value: "health4",
                label: "Composition of Priority Natural Lands",
              },
            ]}
            isMulti
            isClearable={false}
            placeholder="Select Health measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.health.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                state = null;
              }
              dispatch(changeMeasures("health", state));
            }}
          />

          {weights.health.selected &&
            weights.health.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip
                    delayHide={500}
                    delayUpdate={500}
                    id={measure.value}
                    clickable="true"
                    type="dark"
                  >
                    <span>
                      {measure.label ===
                      "Connectivity to Existing Protected Area" ? (
                        <>
                          Connectivity to existing protected area indicates if
                          the proposed conservation area is close to an area
                          classified as protected by PAD-US 2.0 data.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-to-existing-protected-area"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Connectivity of Natural Lands" ? (
                        <>
                          A percent attribute that stands for the proportion of
                          area classified as a hub or corridor.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-of-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Threat of Urbanization" ? (
                        <>
                          Threat of urbanization (ToU) indicates the likelihood
                          of the given project area or area of interest (AoI)
                          being urbanized by the year 2060.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#threat-of-urbanization"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label ===
                        "Composition of Priority Natural Lands" ? (
                        <>
                          This attribute prioritizes rare habitat types and
                          those that have been identified as conservation
                          priorities in state and regional plans.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#composition-of-priority-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="d-flex justify-content-between utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Is more or less connected better for your project?"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Is more or less connectivity better for your project?"
                          : measure.label === "Threat of Urbanization"
                          ? "Is higher or lower threat of urbanization better for your project?"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Are more or less natural lands better for your project?"
                          : ""}
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"positive-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="1"
                        checked={measure.utility === "1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More"
                          : measure.label === "Threat of Urbanization"
                          ? "Lower"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="positive-hab" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Lower threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More natural lands is better."
                          : ""}
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"negative-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="-1"
                        checked={measure.utility === "-1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less"
                          : measure.label === "Threat of Urbanization"
                          ? "Higher"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="less" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Higher threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less natural lands is better."
                          : ""}
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                      <br />
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="low"
                        checked={measure.weight === "low"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Low
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="medium"
                        checked={measure.weight === "medium"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Medium
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="high"
                        checked={measure.weight === "high"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        High
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            ))}

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={handleBack}>
              {arrowIcon} Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </Container>
        </div>
      )}

      {dataMeasList[dataI] === "function" && (
        <div>
          <span>Function:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              {
                value: "function1",
                label: "Connectivity to Existing Protected Area",
              },
              { value: "function2", label: "Connectivity of Natural Lands" },
              { value: "function3", label: "Threat of Urbanization" },
              {
                value: "function4",
                label: "Composition of Priority Natural Lands",
              },
            ]}
            isMulti
            isClearable={false}
            placeholder="Select Function measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.function.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                state = null;
              }
              dispatch(changeMeasures("function", state));
            }}
          />

          {weights.function.selected &&
            weights.function.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip
                    delayHide={500}
                    delayUpdate={500}
                    id={measure.value}
                    clickable="true"
                    type="dark"
                  >
                    <span>
                      {measure.label ===
                      "Connectivity to Existing Protected Area" ? (
                        <>
                          Connectivity to existing protected area indicates if
                          the proposed conservation area is close to an area
                          classified as protected by PAD-US 2.0 data.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-to-existing-protected-area"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Connectivity of Natural Lands" ? (
                        <>
                          A percent attribute that stands for the proportion of
                          area classified as a hub or corridor.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-of-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Threat of Urbanization" ? (
                        <>
                          Threat of urbanization (ToU) indicates the likelihood
                          of the given project area or area of interest (AoI)
                          being urbanized by the year 2060.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#threat-of-urbanization"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label ===
                        "Composition of Priority Natural Lands" ? (
                        <>
                          This attribute prioritizes rare habitat types and
                          those that have been identified as conservation
                          priorities in state and regional plans.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#composition-of-priority-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="d-flex justify-content-between utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Is more or less connected better for your project?"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Is more or less connectivity better for your project?"
                          : measure.label === "Threat of Urbanization"
                          ? "Is higher or lower threat of urbanization better for your project?"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Are more or less natural lands better for your project?"
                          : ""}
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"positive-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="1"
                        checked={measure.utility === "1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More"
                          : measure.label === "Threat of Urbanization"
                          ? "Lower"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="positive-hab" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Lower threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More natural lands is better."
                          : ""}
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"negative-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="-1"
                        checked={measure.utility === "-1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less"
                          : measure.label === "Threat of Urbanization"
                          ? "Higher"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="less" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Higher threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less natural lands is better."
                          : ""}
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                      <br />
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="low"
                        checked={measure.weight === "low"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Low
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="medium"
                        checked={measure.weight === "medium"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Medium
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="high"
                        checked={measure.weight === "high"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        High
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            ))}

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={handleBack}>
              {arrowIcon} Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </Container>
        </div>
      )}

      {dataMeasList[dataI] === "connect" && (
        <div>
          <span>Connectivity:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              {
                value: "connect1",
                label: "Connectivity to Existing Protected Area",
              },
              { value: "connect2", label: "Connectivity of Natural Lands" },
              { value: "connect3", label: "Threat of Urbanization" },
              {
                value: "connect4",
                label: "Composition of Priority Natural Lands",
              },
            ]}
            isMulti
            isClearable={false}
            placeholder="Select Connectivity measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.connect.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                state = null;
              }
              dispatch(changeMeasures("connect", state));
            }}
          />

          {weights.connect.selected &&
            weights.connect.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip
                    delayHide={500}
                    delayUpdate={500}
                    id={measure.value}
                    clickable="true"
                    type="dark"
                  >
                    <span>
                      {measure.label ===
                      "Connectivity to Existing Protected Area" ? (
                        <>
                          Connectivity to existing protected area indicates if
                          the proposed conservation area is close to an area
                          classified as protected by PAD-US 2.0 data.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-to-existing-protected-area"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Connectivity of Natural Lands" ? (
                        <>
                          A percent attribute that stands for the proportion of
                          area classified as a hub or corridor.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#connectivity-of-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label === "Threat of Urbanization" ? (
                        <>
                          Threat of urbanization (ToU) indicates the likelihood
                          of the given project area or area of interest (AoI)
                          being urbanized by the year 2060.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#threat-of-urbanization"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : measure.label ===
                        "Composition of Priority Natural Lands" ? (
                        <>
                          This attribute prioritizes rare habitat types and
                          those that have been identified as conservation
                          priorities in state and regional plans.
                          <br />
                          <a
                            href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat#composition-of-priority-natural-lands"
                            target="_blank"
                            rel="noreferrer"
                            className="tool-link"
                          >
                            Click for more
                          </a>
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="d-flex justify-content-between utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Is more or less connected better for your project?"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Is more or less connectivity better for your project?"
                          : measure.label === "Threat of Urbanization"
                          ? "Is higher or lower threat of urbanization better for your project?"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Are more or less natural lands better for your project?"
                          : ""}
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"positive-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="1"
                        checked={measure.utility === "1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More"
                          : measure.label === "Threat of Urbanization"
                          ? "Lower"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="positive-hab" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "More connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "More connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Lower threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "More natural lands is better."
                          : ""}
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for={"negative-" + measure.value}
                        variant="outline-secondary"
                        name="utility"
                        value="-1"
                        checked={measure.utility === "-1"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less"
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less"
                          : measure.label === "Threat of Urbanization"
                          ? "Higher"
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less"
                          : ""}
                      </ToggleButton>
                      <ReactTooltip id="less" place="top">
                        {measure.label ===
                        "Connectivity to Existing Protected Area"
                          ? "Less connectivity is better."
                          : measure.label === "Connectivity of Natural Lands"
                          ? "Less connectivity is better."
                          : measure.label === "Threat of Urbanization"
                          ? "Higher threat of urbanization is better."
                          : measure.label ===
                            "Composition of Priority Natural Lands"
                          ? "Less natural lands is better."
                          : ""}
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                      <br />
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="low"
                        checked={measure.weight === "low"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Low
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="medium"
                        checked={measure.weight === "medium"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        Medium
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="weight"
                        value="high"
                        checked={measure.weight === "high"}
                        onChange={(e) =>
                          handleChange(
                            e.currentTarget.value,
                            e.currentTarget.name,
                            measure.value,
                            "hab"
                          )
                        }
                      >
                        High
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            ))}

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={handleBack}>
              {arrowIcon} Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </Container>
        </div>
      )}
    </Container>
  );
};

export default SelectMeasures;
