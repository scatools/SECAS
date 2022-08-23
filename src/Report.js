import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { GoArrowDown } from "react-icons/go";
import bbox from "@turf/bbox";
import axios from "axios";
import { dataLayer } from "./Map/map-style";
import DrawControl from "./Map/DrawControl";
import Legend from "./Map/Legend";
import { calculateScore, normalization } from "./helper/aggregateHex";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
//DO NOT REMOVE BELOW COMMENT
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected }) => {
  let aoiList = useSelector((state) => state.aoi);
  let aoi = Object.values(aoiList).filter((aoi) => aoi.id === aoiSelected);
  let currentScoreObject = calculateScore(aoi, "currentHexagons");
  let futureScoreObject = calculateScore(aoi, "futureHexagons");
  let chartData = {
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

  let calculateImpact = (beforeScore, afterScore) => {
    let percentage = beforeScore == 0 ? 0 : (beforeScore-afterScore)/beforeScore;
    return (
      <td>
        {afterScore < beforeScore ? <GoArrowDown color="red" /> : " "} &nbsp;
        {(100*percentage).toFixed(0) + "%"}
      </td>
    );
  };

  return (
    <div className="AoiTable" style={{ padding: "20px", marginTop: "50px" }}>
      {aoi && (
        <>
          <h2>HFC Scores</h2>
          <Table striped bordered size="sm" variant="light">
            <thead>
              <tr>
                <th>Measures</th>
                <th>Current</th>
                <th>Future</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4">
                  <b>Health</b>
                </td>
              </tr>
              <tr>
                <td>Site Integrity:</td>
                <td>{currentScoreObject.scoreH1}</td>
                <td>{futureScoreObject.scoreH1}</td>
                {calculateImpact(currentScoreObject.scoreH1, futureScoreObject.scoreH1)}
              </tr>
              <tr>
                <td>Biodiversity:</td>
                <td>{currentScoreObject.scoreH2}</td>
                <td>{futureScoreObject.scoreH2}</td>
                {calculateImpact(currentScoreObject.scoreH2, futureScoreObject.scoreH2)}
              </tr>
              <tr>
                <td>Southeast Fire:</td>
                <td>{currentScoreObject.scoreH3}</td>
                <td>{futureScoreObject.scoreH3}</td>
                {calculateImpact(currentScoreObject.scoreH3, futureScoreObject.scoreH3)}
              </tr>
              <tr>
                <td>Conservation Management:</td>
                <td>{currentScoreObject.scoreH4}</td>
                <td>{futureScoreObject.scoreH4}</td>
                {calculateImpact(currentScoreObject.scoreH4, futureScoreObject.scoreH4)}
              </tr>
              <tr>
                <td colSpan="4">
                  <b>Function</b>
                </td>
              </tr>
              <tr>
                <td>Ecosystem Services:</td>
                <td>{currentScoreObject.scoreF1}</td>
                <td>{futureScoreObject.scoreF1}</td>
                {calculateImpact(currentScoreObject.scoreF1, futureScoreObject.scoreF1)}
              </tr>
              <tr>
                <td>Working Lands:</td>
                <td>{currentScoreObject.scoreF2}</td>
                <td>{futureScoreObject.scoreF2}</td>
                {calculateImpact(currentScoreObject.scoreF2, futureScoreObject.scoreF2)}
              </tr>
              <tr>
                <td colSpan="4">
                  <b>Connectivity</b>
                </td>
              </tr>
              <tr>
                <td>Fragmentation Index: </td>
                <td>{currentScoreObject.scoreC1}</td>
                <td>{futureScoreObject.scoreC1}</td>
                {calculateImpact(currentScoreObject.scoreC1, futureScoreObject.scoreC1)}
              </tr>
              <tr>
                <td>Resilience:</td>
                <td>{currentScoreObject.scoreC2}</td>
                <td>{futureScoreObject.scoreC2}</td>
                {calculateImpact(currentScoreObject.scoreC2, futureScoreObject.scoreC2)}
              </tr>
            </tbody>
          </Table>
          <h2>HFC Score Chart</h2>
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
          <h2>Summary</h2>
          <p></p>
          <hr />
          <h2>Appendix</h2>
          <p>
            <b>1. Site Integrity: </b>
            Site Integrity is categorically binned by site quality scores (1-4) of open pine ranging from classified pixels. These are classified regardless of the degree of fragmentation. Zeros in this dataset indicate that the data is not currently nor was previously pine. 1's in this dataset indicate that there is potential for restoration of pine. For processing into the hexagons take the medoid value - categorical value closest to the mean value.
          </p>
          <p>
            <b>2. Biodiversity: </b>
            Biodiversity represents the cumulative sum of Biodiversity aggregated at the county level within the Middle SE geography. Values range from 1-18 based on presence of open-pine indicator species within the county. Federal trust species catalog (birds, mammals, fish, etc. - all ESA) - any species that service assigned to a pine category; Derived from nature serve dataset and trust species that put together. Only have distribution for species on ESA or mandated (all birds, T&E, petitioned).  Ebird data is incorporated to have coverage of birds. 91% of species are on federal trust list.
          </p>
          <p>
            <b>3. Southeast Fire: </b>
            Southeast Fire suggests the cumulative sum of fire occurrences (number of times the pixel burned wihtin a 20 yr period) within the Middle SE geography. Values range from 0-10 based on count of burns / 20 yrs via remote sensing from Southeast Fire Map. In this case 10 would be burned every other year (10 times in 20 years); 5 would be 5 times in 20 years or every 4 years; 3-5 is less optimal, 5 is optimal. Categories are as follows: 0 = not burned; 1-3 = burned some; 4-6 less optimal; 7-10 = optimal burn regime
          </p>
          <p>
            <b>4. Conservation Management: </b>
            In this measure we assume that protected lands are managing conservation lands via disturbance, thus we are using the protected conservation estate as a proxy for management disturbance. Here we are using the most current version of the GAP Analysis Program Protected Areas Database of the U.S. - PAD-US version 2.1. Each protected area is classified to a GAP status of portectedness, with GAP status 3 indicating multi-use protected area. GAP status 1 would indicate the most stringent of protections on the land. Here, we are categorizing by the following: Unprotected = 0; GAP status 3 (multi-use) = 3; GAP status 1 & 2  (most protected) = 1 & 2, respectively with associated thresholds based off of the medoid value.
          </p>
          <p>
            <b>5. Ecosystem Services: </b>
            Amount of forest carbon estimated per pixel from the U.S. Forest Service Forest Inventory Analysis program. NEED MORE INFO HERE. Here we take the mean pixel value per hexagon.
          </p>
          <p>
            <b>6. Working Lands: </b>
            Data is sourced from the USDA Forest Service, Northern Research Station (NRS), Forest Inventory & Analysis program. This geospatial dataset is an update to Hewes et al. (2017), and much of the methods and metadata come directly from that published work. Data are reclassified so that only values of 1 (family forest), 2 (corporate forest), and 3 (TIMO/REIT) are included (see supporting information below). Reclassified to binary 1 = working forest (formerly class 1-3), 0 = other. Zonal calculating mean percent working forest per hexagon on binary classification. See proposed thresholds below.
          </p>
          <p>
            <b>7. Fragmentation Index: </b>
            Fragmentation Index is categorically binned by landscape fragmentation index scores (1-4)  of open pine ranging from pixels classified as very fragmented to intact habitat (see description in supporting information below). These are classified regardless of degree of site quality. 1's in this dataset indicate that there is potential for restoration of pine connectivity, but that the landscape is currently non-pine. For processing into the hexagons take the medoid value - categorical value closest to the mean value.
          </p>
          <p>
            <b>8. Resilience: </b>
            TNC connectedness - Resilient lands layer; binary - resilient, non-resilient; Oklahoma missing; nothing on coast - separate indicator for coast (don’t have to look at right now for pine; eventually pull together); good with staying binary; think it’s 30 m pixels; need to identify proportion of hex in the binary state; need to define connectedness at the hex level; consider both proportion of hex considered connected and the hex connection to each other
          </p>
        </>
      )}
    </div>
  );
};

export default Report;
