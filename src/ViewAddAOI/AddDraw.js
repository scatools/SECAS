import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { calculateArea } from "../helper/aggregateHex";
import { input_aoi, getCurrentData, getDataFromAPI, setLoader } from "../action";
import TimeoutError from "../TimeoutError";

const AddDraw = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  resetButton,
  setHabitatLayer,
  setProgress,
  setShowProgress
}) => {
  const dispatch = useDispatch();
  const [drawData, setDrawData] = useState("");

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };

  const handleSubmit = async () => {
    if (!drawData) {
      setAlerttext("A name for this area of interest is required.");
    } else if (featureList.length === 0) {
      setAlerttext("At least one polygon is required.");
    } else {
      setAlerttext(false);
      setShowProgress(true);
      setProgress(10);
      const newList = featureList;
      const planArea = calculateArea(newList);
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };
      let currentData;
      let futureData;

      try {
        await getCurrentData(data).then((result) => {
          console.log(result);
          currentData = result;
        });
      } catch (error){
        console.log(error);
      };

      dispatch(
        input_aoi({
          name: drawData,
          geometry: newList,
          area: planArea,
          currentHexagons: currentData,
          futureHexagons: currentData,
          id: uuid(),
        })
      );

      setDrawingMode(false);
      setHabitatLayer("none");
      setView("evaluate");
      setProgress(25);
    };
  };

  return (
    <Container className="mt-3">
      <p style={{fontSize: "1em", marginLeft: "20px"}}>
        Please name your area of interest here and start drawing by clicking the polygon tool in the upper right corner of the map.
      </p>
      <InputGroup className="m-auto" style={{ width: "90%" }}>
        <InputGroup.Text id="basic-addon1">Area Name:</InputGroup.Text>
        <FormControl
          name="planName"
          value={drawData}
          onChange={handleNameChange}
          placeholder="Name area of interest here..."
        />
      </InputGroup>
      <br />
      <p style={{fontSize: "1em", marginLeft: "20px"}}>
        Once area name is set and drawing is complete, click Submit Area to proceed. Click Start Over anytime to restart the process.
      </p>
      <Container>
        <Button variant="warning" style={{ float: "left" }} onClick={resetButton}>
          Start Over
        </Button>
        <Button
          variant="primary"
          style={{ float: "right" }}
          disabled={drawData && featureList.length ? false : true}
          onClick={handleSubmit}
        >
          Submit Area
        </Button>
      </Container>
    </Container>
  );
};

export default AddDraw;
