import React, { useEffect, useRef, useState } from "react";
import { Container, ToggleButton, ButtonGroup } from "react-bootstrap";
import AddDraw from "./AddDraw";
import AddZip from "./AddZip";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  setHabitatLayer,
}) => {
  const [inputMode, setInputMode] = useState("draw");
  const [timeoutError, setTimeoutError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const ref = useRef(countdown);

  function updateState(newState) {
    ref.current = newState;
    setCountdown(newState);
  }

  useEffect(() => {
    if (inputMode === "draw") {
      setDrawingMode(true);
      setAoiSelected(false);
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
              setAoiSelected(false);
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
          setHabitatLayer={setHabitatLayer}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip
          setAlerttext={setAlerttext}
          setView={setView}
          setHabitatLayer={setHabitatLayer}
        />
      )}
    </>
  );
};

export default AddAOIView;
