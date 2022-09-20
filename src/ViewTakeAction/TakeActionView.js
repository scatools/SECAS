import React, { useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const TakeActionView = () => {
  const [percentBlue, setPercentBlue] = useState(50);
  return(
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Select hexagons to take actions on
          </Accordion.Header>
          <Accordion.Body>
            <Button variant="secondary">
              Pick Your Own Hexagons
            </Button>
            <hr />
            <Button variant="secondary">
              Auto Generate by Blueprint
            </Button>
            <RangeSlider
              step={1}
              value={percentBlue}
              onChange={(e) => setPercentBlue(e.target.value)}
              variant="secondary"
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            Select actions to take
          </Accordion.Header>
          <Accordion.Body>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
};

export default TakeActionView;
