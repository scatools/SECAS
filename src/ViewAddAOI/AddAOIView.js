import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import AddDraw from "./AddDraw";
import AddZip from "./AddZip";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  setHabitatLayer,
  setProgress,
  setShowProgress
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

  useEffect(() => {
    if (inputMode === "draw") {
      setDrawingMode(true);
    }
  }, [inputMode]);

  return (
    <>
      <p>Add Area of Interest</p>
      <Container className="d-flex">
        <ButtonGroup name="importSwitch" className="m-auto">
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            id="draw"
            name="draw"
            value="draw"
            checked={inputMode === "draw"}
            onChange={(e) => {
              setInputMode(e.currentTarget.value);
            }}
          >
            by Drawing
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            id="shapefile"
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

      {inputMode === "draw" && (
        <AddDraw
          setDrawingMode={setDrawingMode}
          setAoiSelected={setAoiSelected}
          featureList={featureList}
          setAlerttext={setAlerttext}
          setView={setView}
          resetButton={resetButton}
          setHabitatLayer={setHabitatLayer}
          setProgress={setProgress}
          setShowProgress={setShowProgress}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip
          setAlerttext={setAlerttext}
          setView={setView}
          setHabitatLayer={setHabitatLayer}
          setProgress={setProgress}
          setShowProgress={setShowProgress}
        />
      )}
    </>
  );
};

export default AddAOIView;
