import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Switch from "react-switch";
import { HiDocumentReport } from "react-icons/hi";
import FutureWithActionTable from "./FutureWithActionTable";

const ActionSelect = ({ hexData, setActionHexData, actionScores, setActionScores }) => {
  const navigate = useNavigate();

  return (
    <>
      <h3>Which indicators to adjust?</h3>
      <h5>Please click the slider next to each indicator to adjust its value up or down by one level:</h5>
      <FutureWithActionTable
        hexData={hexData}
        setActionHexData={setActionHexData}
        actionScores={actionScores}
        setActionScores={setActionScores}
      />
      <Button
        onClick={() => {navigate("/report")}}
        style={{float: "right", marginTop:"20px"}}
      >
        <HiDocumentReport /> {" "}
        Report
      </Button>
    </>
  );
};

export default ActionSelect;
