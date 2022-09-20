import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { calculateScore, calculateActionScore } from "../helper/aggregateHex";

const FutureWithActionTable = ({
  restoreAction,
  protectAction,
  maintainAction,
}) => {
  const aoi = Object.values(useSelector((state) => state.aoi));
  const currentScoreObject = calculateScore(aoi, "currentHexagons");
  const futureScoreObject = calculateScore(aoi, "futureHexagons");
  //   const actionScoreObject = calculateActionScore(
  //     aoi,
  //     restoreAction,
  //     protectAction,
  //     maintainAction
  //   );

  const actionScoreObject = JSON.parse(JSON.stringify(currentScoreObject));

  console.log(currentScoreObject);

  return (
    <div className="AoiTable" style={{ padding: "20px", marginTop: "20px" }}>
      <h2>AOI Scores</h2>
      {aoi && (
        <>
          <Table striped bordered size="sm" variant="dark">
            <thead>
              <tr>
                <th>Measures</th>
                <th>Current</th>
                <th>No Action</th>
                <th>With Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3">
                  <b>Health</b>
                </td>
              </tr>
              <tr>
                <td>Site Integrity:</td>
                <td>{currentScoreObject.scoreH1}</td>
                <td>{futureScoreObject.scoreH1}</td>
                <td>{actionScoreObject.scoreH1}</td>
              </tr>
              <tr>
                <td>Biodiversity:</td>
                <td>{currentScoreObject.scoreH2}</td>
                <td>{futureScoreObject.scoreH2}</td>
                <td>{actionScoreObject.scoreH2}</td>
              </tr>
              <tr>
                <td>Southeast Fire:</td>
                <td>{currentScoreObject.scoreH3}</td>
                <td>{futureScoreObject.scoreH3}</td>
                <td>{actionScoreObject.scoreH3}</td>
              </tr>
              <tr>
                <td>Conservation Management:</td>
                <td>{currentScoreObject.scoreH4}</td>
                <td>{futureScoreObject.scoreH4}</td>
                <td>{actionScoreObject.scoreH4}</td>
              </tr>
              <tr>
                <td colSpan="3">
                  <b>Function</b>
                </td>
              </tr>
              <tr>
                <td>Ecosystem Services:</td>
                <td>{currentScoreObject.scoreF1}</td>
                <td>{futureScoreObject.scoreF1}</td>
                <td>{actionScoreObject.scoreF1}</td>
              </tr>
              <tr>
                <td>Working Lands:</td>
                <td>{currentScoreObject.scoreF2}</td>
                <td>{futureScoreObject.scoreF2}</td>
                <td>{actionScoreObject.scoreF2}</td>
              </tr>
              <tr>
                <td colSpan="3">
                  <b>Connectivity</b>
                </td>
              </tr>
              <tr>
                <td>Fragmentation Index: </td>
                <td>{currentScoreObject.scoreC1}</td>
                <td>{futureScoreObject.scoreC1}</td>
                <td>{actionScoreObject.scoreC1}</td>
              </tr>
              <tr>
                <td>Resilience:</td>
                <td>{currentScoreObject.scoreC2}</td>
                <td>{futureScoreObject.scoreC2}</td>
                <td>{actionScoreObject.scoreC2}</td>
              </tr>
            </tbody>
          </Table>
          {/* <Bar
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
            title: {
              display: true,
              text: "AOI Scores",
            },
          },
        }}
      /> */}
          <hr />
        </>
      )}
    </div>
  );
};
export default FutureWithActionTable;
