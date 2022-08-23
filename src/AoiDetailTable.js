import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { calculateScore } from "./helper/aggregateHex";

const AoiDetailTable = ({ activeTable, setActiveTable }) => {
  let aoi, chartData, currentScoreObject, futureScoreObject;
  let aoiList = useSelector((state) => state.aoi);

  if (activeTable) {
    aoi = Object.values(aoiList).filter((aoi) => aoi.id === activeTable);
    currentScoreObject = calculateScore(aoi, "currentHexagons");
    futureScoreObject = calculateScore(aoi, "futureHexagons");
    chartData = {
      labels: ["Health", "Function", "Connectivity"],
      datasets: [
        {
          label: "Current",
          backgroundColor: "limegreen",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 1,
          data: [
            (currentScoreObject.scoreH1 +
              currentScoreObject.scoreH2 +
              currentScoreObject.scoreH3 +
              currentScoreObject.scoreH4) /
              4,
            (currentScoreObject.scoreF1 + currentScoreObject.scoreF2) / 2,
            (currentScoreObject.scoreC1 + currentScoreObject.scoreC2) / 2,
          ],
        },
        {
          label: "Future",
          backgroundColor: "coral",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 1,
          data: [
            (futureScoreObject.scoreH1 +
              futureScoreObject.scoreH2 +
              futureScoreObject.scoreH3 +
              futureScoreObject.scoreH4) /
              4,
            (futureScoreObject.scoreF1 + futureScoreObject.scoreF2) / 2,
            (futureScoreObject.scoreC1 + futureScoreObject.scoreC2) / 2,
          ],
        },
      ],
    };
  };

  return (
    <div
      className={activeTable ? "AoiTableContainer active" : "AoiTableContainer"}
    >
      <div
        id="dismiss"
        onClick={() => {
          setActiveTable(false);
        }}
      >
        X
      </div>

      <div className="AoiTable" style={{ padding: "20px", marginTop: "50px" }}>
        <h2>AOI Scores</h2>
        {aoi && (
          <>
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
                  <td colSpan="2">
                    <b>Health</b>
                  </td>
                </tr>
                <tr>
                  <td>Site Integrity:</td>
                  <td>{currentScoreObject.scoreH1}</td>
                  <td>{futureScoreObject.scoreH1}</td>
                </tr>
                <tr>
                  <td>Biodiversity:</td>
                  <td>{currentScoreObject.scoreH2}</td>
                  <td>{futureScoreObject.scoreH2}</td>
                </tr>
                <tr>
                  <td>Southeast Fire:</td>
                  <td>{currentScoreObject.scoreH3}</td>
                  <td>{futureScoreObject.scoreH3}</td>
                </tr>
                <tr>
                  <td>Conservation Management:</td>
                  <td>{currentScoreObject.scoreH4}</td>
                  <td>{futureScoreObject.scoreH4}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <b>Function</b>
                  </td>
                </tr>
                <tr>
                  <td>Ecosystem Services:</td>
                  <td>{currentScoreObject.scoreF1}</td>
                  <td>{futureScoreObject.scoreF1}</td>
                </tr>
                <tr>
                  <td>Working Lands:</td>
                  <td>{currentScoreObject.scoreF2}</td>
                  <td>{futureScoreObject.scoreF2}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <b>Connectivity</b>
                  </td>
                </tr>
                <tr>
                  <td>Fragmentation Index: </td>
                  <td>{currentScoreObject.scoreC1}</td>
                  <td>{futureScoreObject.scoreC1}</td>
                </tr>
                <tr>
                  <td>Resilience:</td>
                  <td>{currentScoreObject.scoreC2}</td>
                  <td>{futureScoreObject.scoreC2}</td>
                </tr>
              </tbody>
            </Table>
            <Bar
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom"
                  },
                  title: {
                    display: true,
                    text: "AOI Scores"
                  },
                },
              }}
            />
            <hr />
          </>
        )}
      </div>
    </div>
  );
};

export default AoiDetailTable;
