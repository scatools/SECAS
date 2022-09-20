import React, { useState } from "react";
import { Accordion, Button, Container } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import ActionLocationSelect from "./ActionLocationSelect";
import ActionSelect from "./ActionSelect";

const TakeActionView = ({ setView }) => {
  const [percentBlue, setPercentBlue] = useState(50);
  const [actionView, setActionView] = useState("actionLocation");
  return (
    <>
      {actionView === "actionLocation" && (
        <ActionLocationSelect
          percentBlue={percentBlue}
          setPercentBlue={setPercentBlue}
          setActionView={setActionView}
        />
      )}

      {actionView === "actionSelect" && <ActionSelect />}
    </>
  );
};

export default TakeActionView;
