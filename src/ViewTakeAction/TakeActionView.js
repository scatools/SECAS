import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Accordion, Button } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

const TakeActionView = ({ aoiSelected, setHexIdInBlue }) => {
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
              value={filterBlue}
              onChange={onChange}
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
