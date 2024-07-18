import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Switch from "react-switch";
import FutureWithActionTable from "./FutureWithActionTable";

const ActionSelect = ({ hexData, actionScores, setActionScores }) => {
  const navigate = useNavigate();

  return (
    <>
      <h3>Which Action(s) to Take?</h3>
      <h5>Please Click the arrows next to each indicator to adjust it's value up or down by one level:</h5>
      <FutureWithActionTable hexData={hexData} actionScores={actionScores} setActionScores={setActionScores} />
      <Button onClick={() => {navigate("/report")}}>Report</Button>
    </>
  );
};

export default ActionSelect;
