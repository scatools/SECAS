import React, { useState } from "react";
import { Accordion, Button, Container } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const ActionLocationSelect = ({
  setActionView,
  percentBlue,
  setPercentBlue,
}) => {
  return (
    <>
      <h2>Where to take Action?</h2>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Blueprint Quick Select</Accordion.Header>
          <Accordion.Body>
            <p>
              Use the slider below to decide on the percentage of Blueprint you
              would like in the hexagons.
            </p>
            <p>Those hexagons will be selected for you to apply the actions.</p>
            <p>{percentBlue}% Blueprint per hex</p>
            <RangeSlider
              step={1}
              value={percentBlue}
              onChange={(e) => setPercentBlue(e.target.value)}
              variant="secondary"
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Manual Hexagon Select</Accordion.Header>
          <Accordion.Body>
            <p>
              Click and drag across multiple hexagons to select where you would
              like to take action.
            </p>
            <p>Note: You must click within AOI boundary</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Button
        variant="primary"
        style={{ float: "right", marginTop: "40px" }}
        onClick={() => setActionView("actionSelect")}
      >
        Next
      </Button>
    </>
  );
};

export default ActionLocationSelect;
