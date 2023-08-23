import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import MultiSwitch from "react-multi-switch-toggle";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { GoArrowDown } from "react-icons/go";
import bbox from "@turf/bbox";
import axios from "axios";
import WebMercatorViewport from "viewport-mercator-project";
import RouterContext from "./Router.js";
import { dataLayer } from "./Map/map-style";
import DrawControl from "./Map/DrawControl";
import Legend from "./Map/Legend";
import { calculateScore, getRawValue, normalization } from "./helper/aggregateHex";
import "./App.css";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
//DO NOT REMOVE BELOW COMMENT
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected }) => {
  const [selectedSwitch, setSelectedSwitch] = useState(0);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  const [currentHexData, setCurrentHexData] = useState();
  const [futureHexData, setFutureHexData] = useState();
  const [selectedHexIdList, setSelectedHexIdList] = useState(hexIdInBlue);
  const overlaySources = {
    "secas": "mapbox://chuck0520.dkcwxuvl"
  };
  const {hexIdInBlue, restoreAction, protectAction, maintainAction} = useContext(RouterContext);
  // let aoiList = useSelector((state) => state.aoi);
  // let aoi = Object.values(aoiList).filter((aoi) => aoi.id === aoiSelected);
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const aoi = aoiList[0];
  const aoiColors = ["#00188f"];

  // Use the selected AOI to calculate the bounding box
  var aoiBbox = bbox({
    type: "FeatureCollection",
    features: aoiList[0].geometry,
  });
  // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
  var viewportBbox = [
    [aoiBbox[0], aoiBbox[1]],
    [aoiBbox[2], aoiBbox[3]],
  ];
  // Use WebMercatorViewport to get center longitude/latitude and zoom level
  var newViewport = new WebMercatorViewport({
    width: 800,
    height: 600,
  }).fitBounds(viewportBbox, { padding: 200 });
  console.log(newViewport);

  const [viewport, setViewport] = useState({
    latitude: newViewport.latitude,
    longitude: newViewport.longitude,
    zoom: newViewport.zoom,
  });

  let currentScoreObject = calculateScore(aoiList, "currentHexagons");
  let futureScoreObject = calculateScore(aoiList, "futureHexagons");
  let currentValueObject = getRawValue(aoiList, "currentHexagons");
  let futureValueObject = getRawValue(aoiList, "futureHexagons");
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

  const calcHexValues = (hexGrid, id) => {
    const hexFeatureList = hexGrid.map((hex) => {
      let scoreList = normalization(hex);
      let scoreArray = Object.values(scoreList);
      let averageScore =
        scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length;
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: {
          gid: hex.gid,
          objectid: hex.objectid,
          scoreH1: scoreList.scoreH1,
          scoreH2: scoreList.scoreH2,
          scoreH3: scoreList.scoreH3,
          scoreH4: scoreList.scoreH4,
          scoreF1: scoreList.scoreF1,
          scoreF2: scoreList.scoreF2,
          scoreC1: scoreList.scoreC1,
          scoreC2: scoreList.scoreC2,
          overallScore: averageScore,
        },
      };
    });

    if (id === "current")
      setCurrentHexData({
        type: "FeatureCollection",
        features: hexFeatureList,
      });

    if (id === "future")
      setFutureHexData({
        type: "FeatureCollection",
        features: hexFeatureList,
      });
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

  // const renderSelectedHex = (hexGrid, hexIdList) => {
  //   const hexFeatureList = hexGrid.filter((hex) => 
  //     hexIdList.includes(hex.gid)
  //   ).map((hex) => {
  //     let newHex;
  //     let scoreList = normalization(hex);
  //     if (restoreAction) {
  //       newHex = getRestoreValues(hex);
  //       scoreList = normalization(newHex);
  //     } else if (protectAction) {
  //       newHex = getProtectValues(hex);
  //       scoreList = normalization(newHex);
  //     } else if (maintainAction) {
  //       newHex = getMaintainValues(hex);
  //       scoreList = normalization(newHex);
  //     };
  //     let scoreArray = Object.values(scoreList);
  //     let averageScore =
  //       scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length;
  //     return {
  //       type: "Feature",
  //       geometry: JSON.parse(hex.geometry),
  //       properties: { 
  //         gid: hex.gid,
  //         overallScore: averageScore, 
  //       },
  //     };
  //   });

  //   const hexData = {
  //     type: "FeatureCollection",
  //     features: hexFeatureList,
  //   };

  //   return (
  //     <Source type="geojson" data={hexData}>
  //       <Layer
  //         id="hex-in-blue"
  //         type="fill"
  //         paint={{
  //           "fill-color": (restoreAction || protectAction || maintainAction) ? {
  //             property: "overallScore",
  //             stops: [
  //               [0.1, "#ccf7ff"],
  //               [0.3, "#82d9d7"],
  //               [0.5, "#3cb99f"],
  //               [0.7, "#00975b"],
  //               [0.9, "#057300"],
  //             ],
  //           } : "transparent",
  //           "fill-outline-color": "blue",
  //           "fill-opacity": [
  //             "case",
  //             ["boolean", ["feature-state", "hover"], false],
  //             1,
  //             parseInt(hexOpacity) / 100,
  //           ],
  //         }}
  //       />
  //     </Source>
  //   );
  // };
  
  const onToggle = (value) => {
    setSelectedSwitch(value);
  };

  useEffect(() => {
    if (aoi) {
      calcHexValues(aoi.currentHexagons, "current");
      calcHexValues(aoi.futureHexagons, "future");
    }
  }, [aoi]);

  useEffect(() => {
    setSelectedHexIdList(hexIdInBlue);
  }, [hexIdInBlue]);

  useEffect(() => {
    if (selectedHexIdList.length > 0 && (
      restoreAction || protectAction || maintainAction
    )) {
      // setFilter(["in", "gid", selectedHexIdList]);
      console.log("Filter Applied!");
    }
  }, [restoreAction, protectAction, maintainAction])

  return (
    <div className="AoiTable" style={{ padding: "20px", marginTop: "50px" }}>
      {aoi && (
        <>
          <div>
            <h2>AOI Spatial Footprint</h2>
            <div>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "45%", height: "50%", left: "3%" }}
                mapStyle={"mapbox://styles/mapbox/" + basemapStyle}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapboxAccessToken={MAPBOX_TOKEN}
              > 
                {overlayList.map((overlay) => (
                  <Source
                    type="raster"
                    url={overlaySources[overlay]}
                    maxzoom={22}
                    minzoom={0}
                  >
                    <Layer
                      type="raster"
                      id={overlay}
                      value={overlay}
                      paint={{"raster-opacity": 0.5}}
                    />
                  </Source>
                ))}
                {aoiList.length > 0 &&
                  aoiList.map((aoi) => (
                    <Source
                      type="geojson"
                      data={{
                        type: "FeatureCollection",
                        features: aoi.geometry,
                      }}
                    >
                      <Layer
                        id={aoi.name}
                        type="fill"
                        paint={{
                          "fill-color": aoiColors[aoiList.indexOf(aoi)],
                          "fill-opacity": 0.5,
                        }}
                      />
                    </Source>
                  ))
                }
                {/* {!!selectedHexIdList.length && renderSelectedHex(aoi.currentHexagons, selectedHexIdList)} */}
                {aoiList.length > 0 && (
                  <Legend aoiList={aoiList} aoiColors={aoiColors}></Legend>
                )}
              </Map>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "45%", height: "50%", right: "3%" }}
                mapStyle={"mapbox://styles/mapbox/" + basemapStyle}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapboxAccessToken={MAPBOX_TOKEN}
              > 
                {overlayList.map((overlay) => (
                  <Source
                    type="raster"
                    url={overlaySources[overlay]}
                    maxzoom={22}
                    minzoom={0}
                  >
                    <Layer
                      type="raster"
                      id={overlay}
                      value={overlay}
                      paint={{"raster-opacity": 0.5}}
                    />
                  </Source>
                ))}
                {aoiList.length > 0 &&
                  aoiList.map((aoi) => (
                    <Source
                      type="geojson"
                      data={{
                        type: "FeatureCollection",
                        features: aoi.geometry,
                      }}
                    >
                      <Layer
                        id={aoi.name}
                        type="fill"
                        paint={{
                          "fill-color": aoiColors[aoiList.indexOf(aoi)],
                          "fill-opacity": 0.5,
                        }}
                      />
                    </Source>
                  ))
                }
                {/* {!!selectedHexIdList.length && renderSelectedHex(aoi.currentHexagons, selectedHexIdList)} */}
                {aoiList.length > 0 && (
                  <Legend aoiList={aoiList} aoiColors={aoiColors}></Legend>
                )}
              </Map>
            </div>            
          </div>
          <div style={{position: "absolute", width: "95%", top: "65%"}}>
            <div>
              <h2>AOI Indicator Values & Scores</h2>
              {/* <div className="tableSwitch">
                <MultiSwitch
                  texts={["Scaled Scores", "Raw Values"]}
                  selectedSwitch={selectedSwitch}
                  bgColor={"gray"}
                  onToggleCallback={onToggle}
                  height={"38px"}
                  fontSize={"15px"}
                  fontColor={"white"}
                  selectedFontColor={"#6e599f"}
                  selectedSwitchColor={"white"}
                  borderWidth={0}
                  eachSwitchWidth={100}
                />
              </div> */}
              <br />
              {selectedSwitch === 0 && (
                <Table striped bordered size="sm" variant="light">
                  <thead>
                    <tr>
                      <th>Indicator</th>
                      <th>Current Condition</th>
                      <th>Future (No Action)</th>
                      <th>Change</th>
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
              )}
              {selectedSwitch === 1 && (
                <Table striped bordered size="sm" variant="light">
                  <thead>
                    <tr>
                      <th>Indicator</th>
                      <th>Current</th>
                      <th>Future</th>
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
                      <td>
                        {currentValueObject.valueH1 === 0 ? "Not Open Pine" : 1 ? "Low" : 2 ? "Moderate" : "High"}
                        {" (" + currentValueObject.valueH1 + ")"}
                      </td>
                      <td>
                        {futureValueObject.valueH1 === 0 ? "Not Open Pine" : 1 ? "Low" : 2 ? "Moderate" : "High"}
                        {" (" + futureValueObject.valueH1 + ")"}
                      </td>
                    </tr>
                    <tr>
                      <td>Biodiversity:</td>
                      <td>{currentValueObject.valueH2 + " Open Pine Species"}</td>
                      <td>{futureValueObject.valueH2 + " Open Pine Species"}</td>
                    </tr>
                    <tr>
                      <td>Southeast Fire:</td>
                      <td>{currentValueObject.valueH3 + " Occurrences / 20 Years"}</td>
                      <td>{futureValueObject.valueH3 + " Occurrences / 20 Years"}</td>
                    </tr>
                    <tr>
                      <td>Conservation Management:</td>
                      <td>
                        {currentValueObject.valueH4 === 0 ? "Unprotected" : 1 ? "Biodiversity Protected - GAP Status 1" : 2 ? "Biodiversity Protected - GAP Status 2" : "Multi-Use - GAP Status 3"}
                        {" (" + currentValueObject.valueH4 + ")"}
                      </td>
                      <td>
                        {futureValueObject.valueH4 === 0 ? "Unprotected" : 1 ? "Biodiversity Protected - GAP Status 1" : 2 ? "Biodiversity Protected - GAP Status 2" : "Multi-Use - GAP Status 3"}
                        {" (" + futureValueObject.valueH4 + ")"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <b>Function</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Ecosystem Services:</td>
                      <td>{currentValueObject.valueF1}</td>
                      <td>{futureValueObject.valueF1}</td>
                    </tr>
                    <tr>
                      <td>Working Lands:</td>
                      <td>{currentValueObject.valueF2*100 + "%"}</td>
                      <td>{futureValueObject.valueF2*100 + "%"}</td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <b>Connectivity</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Fragmentation Index: </td>
                      <td>
                        {currentValueObject.valueC1 === 0 ? "Not Open Pine" : 1 ? "Low" : 2 ? "Moderate" : "High"}
                        {" (" + currentValueObject.valueC1 + ")"}
                      </td>
                      <td>
                        {futureValueObject.valueC1 === 0 ? "Not Open Pine" : 1 ? "Low" : 2 ? "Moderate" : "High"}
                        {" (" + futureValueObject.valueC1 + ")"}
                      </td>
                    </tr>
                    <tr>
                      <td>Resilience:</td>
                      <td>{currentValueObject.valueC2*100 + "%"}</td>
                      <td>{futureValueObject.valueC2*100 + "%"}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
            <div>
              <h2>AOI Score Chart by HFC Goal</h2>
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
            </div>
            <hr />
            <div>
              <h2>Summary</h2>
              <p></p>
            </div>
            <hr />
            <div>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Report;
