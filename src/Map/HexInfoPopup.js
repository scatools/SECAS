import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Draggable from "react-draggable";
import { normalization } from "../helper/aggregateHex";

const HexInfoPopup = ({
  clickedProperty,
  currentHexData,
  futureHexData,
  setHexInfoPopupView,
}) => {
  const hexId = clickedProperty.gid;

  console.log(hexId);
  console.log(
    currentHexData.features.find((hex) => hex.properties.gid === hexId)
  );

  let currentHexScore = currentHexData.features.find(
    (hex) => hex.properties.gid === hexId
  ).properties;

  let futureHexScore = futureHexData.features.find(
    (hex) => hex.properties.gid === hexId
  ).properties;

  return (
    <Draggable>
      <div className="Popup-table-center">
        <div
          id="popup-dismiss"
          onClick={() => {
            setHexInfoPopupView(false);
          }}
        >
          X
        </div>
        <h2 style={{ color: "white" }}>Hexagon Score</h2>
        <Table striped bordered size="sm" variant="dark">
          <thead>
            <tr>
              <th>Measures</th>
              <th>Current</th>
              <th>Future</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3">
                <b>Health: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Open Pine Site Condition:</td>
              <td>{currentHexScore.scoreH1}</td>
              <td>{futureHexScore.scoreH1}</td>
            </tr>
            <tr>
              <td>Open Pine Species:</td>
              <td>{currentHexScore.scoreH2}</td>
              <td>{futureHexScore.scoreH2}</td>
            </tr>
            <tr>
              <td>Toby's Fire:</td>
              <td>{currentHexScore.scoreH3}</td>
              <td>{futureHexScore.scoreH3}</td>
            </tr>
            <tr>
              <td>Conservation Management:</td>
              <td>{currentHexScore.scoreH4}</td>
              <td>{futureHexScore.scoreH4}</td>
            </tr>
            <tr>
              <td colSpan="3">
                <b>Function: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Forest Carbon:</td>
              <td>{currentHexScore.scoreF1}</td>
              <td>{futureHexScore.scoreF1}</td>
            </tr>
            <tr>
              <td>Working Lands:</td>
              <td>{currentHexScore.scoreF2}</td>
              <td>{futureHexScore.scoreF2}</td>
            </tr>
            <tr>
              <td colSpan="3">
                <b>Connectivity:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>Open Pine Landscape Condition: </td>
              <td>{currentHexScore.scoreC1}</td>
              <td>{futureHexScore.scoreC1}</td>
            </tr>
            <tr>
              <td>TNC Resilience:</td>
              <td>{currentHexScore.scoreC2}</td>
              <td>{futureHexScore.scoreC2}</td>
            </tr>
            <tr>
              <td>
                <b style={{ color: "aqua" }}>Overall Score:</b>{" "}
              </td>
              <td>
                <b style={{ color: "aqua" }}>
                  {currentHexScore.overallScore.toFixed(2)}
                </b>
              </td>
              <td>
                <b style={{ color: "aqua" }}>
                  {futureHexScore.overallScore.toFixed(2)}
                </b>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Draggable>
  );
};
export default HexInfoPopup;
