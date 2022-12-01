import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Accordion, Button } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const ActionLocationSelect = ({
  aoiSelected,
  setHexIdInBlue,
  setActionView
}) => {
  const [filterBlue, setFilterBlue] = useState(50);
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const aoi = aoiList[0];

  const percentBlueList = aoi["currentHexagons"].map((hex) => {
    return {
      id: hex.gid,
      percentBlue : parseFloat(hex.lightblue) + parseFloat(hex.darkblue)
    };
  });
  
  const onChange = (e) => {
    setFilterBlue(e.target.value);
    setHexIdInBlue([]);
    percentBlueList.map((item) => {
      if (item.percentBlue >= e.target.value/100) {
        setHexIdInBlue(idList => [...idList, item.id]);
      };
    });
  };

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
            <p>{filterBlue}% Blueprint per hex</p>
            <RangeSlider
              step={1}
              value={filterBlue}
              onChange={onChange}
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
