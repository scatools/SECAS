import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { calculateArea } from "../helper/aggregateHex";
import { input_aoi, setLoader } from "../action";
import TimeoutError from "../TimeoutError";

const AddDraw = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  autoDraw,
  resetButton,
  setMapOverlay,
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
      const newList = featureList;
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      const res = await axios.post("https://secas-backend.herokuapp.com/data/current", {
        data,
      });
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: drawData,
          geometry: newList,
          area: planArea,
          hexagons: res.data.data,
          id: uuid(),
        })
      );
      setDrawingMode(false);
      setMapOverlay("none");
      setView("view");
    }
  };

  return (
    <Container className="mt-3">
      <InputGroup className="m-auto" style={{ width: "80%" }}>
        <InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
        <FormControl
          name="planName"
          value={drawData}
          onChange={handleNameChange}
          placeholder="Name area of interest here..."
        />
      </InputGroup>
      <br />
      <Container>
        <Button
          variant="dark"
          style={{ float: "left" }}
          onClick={() => {
            setDrawingMode(true);
            autoDraw();
            setAoiSelected(false);
          }}
        >
          Add a New Shape
        </Button>
        <Button variant="dark" style={{ float: "left" }} onClick={resetButton}>
          Start Over
        </Button>
        <Button
          variant="dark"
          style={{ float: "right" }}
          onClick={handleSubmit}
        >
          Finalize Input
        </Button>
      </Container>
    </Container>
  );
};

export default AddDraw;
