import React, { useState, useRef } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import AddZip from "./AddZip";
import AddDraw from "./AddDraw";
import shp from "shpjs";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  autoDraw,
}) => {
  const [inputMode, setInputMode] = useState("draw");
  const [timeoutError, setTimeoutError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const ref = useRef(countdown);

  function updateState(newState) {
    ref.current = newState;
    setCountdown(newState);
  }

  const timeoutHandler = () => {
    setTimeoutError(true);
    setInterval(() => {
      updateState(ref.current - 1);
    }, 1000);
    window.setTimeout(resetButton, 5000);
  };

  const resetButton = () => {
    setCountdown(5);
    console.log(countdown);
    window.location.reload(true);
  };

  return (
    <>
      <p>Add Area of Interest</p>
      <Container className="d-flex">
        <ButtonGroup toggle className="m-auto">
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="draw"
            value="draw"
            checked={inputMode === "draw"}
            onChange={(e) => {
              setAoiSelected(false);
              setInputMode(e.currentTarget.value);
            }}
          >
            by Drawing
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="shapefile"
            value="shapefile"
            checked={inputMode === "shapefile"}
            onChange={(e) => {
              setDrawingMode(false);
              setInputMode(e.currentTarget.value);
            }}
          >
            by Zipped Shapefile
          </ToggleButton>
        </ButtonGroup>
      </Container>
      <hr />

      {inputMode === "draw" && (
        <AddDraw
          setDrawingMode={setDrawingMode}
          setAoiSelected={setAoiSelected}
          featureList={featureList}
          setAlerttext={setAlerttext}
          setView={setView}
          autoDraw={autoDraw}
          timeoutError={timeoutError}
          setTimeoutError={setTimeoutError}
          countdown={countdown}
          timeoutHandler={timeoutHandler}
          resetButton={resetButton}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip
          setAlerttext={setAlerttext}
          setView={setView}
          timeoutError={timeoutError}
          setTimeoutError={setTimeoutError}
          countdown={countdown}
          timeoutHandler={timeoutHandler}
          resetButton={resetButton}
        />
      )}
    </>
  );
};

export default AddAOIView;
