import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import axios from "axios";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import { v4 as uuid } from "uuid";
import { input_aoi, setLoader } from "../action";
import { useDispatch } from "react-redux";
import TimeoutError from "../TimeoutError";

const AddDraw = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  autoDraw,
  timeoutError,
  countdown,
  timeoutHandler,
  resetButton,
}) => {
  const dispatch = useDispatch();
  const [drawData, setDrawData] = useState("");

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };
  const handleSubmit = async () => {
    //
    setView("hfc");
  };

  return (
    <Container className="mt-3">
      {/* {timeoutError && <TimeoutError countdown={countdown} />} */}
      <InputGroup className="m-auto" style={{ width: "80%" }}>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          name="planName"
          value={drawData}
          onChange={handleNameChange}
          placeholder="Name area of interest here..."
        />
      </InputGroup>
      <hr />
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
