import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import { Chart as ChartJS, BarElement, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Chart, Bar, Line } from "react-chartjs-2";
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { GoArrowDown } from "react-icons/go";
import bbox from "@turf/bbox";
import axios from "axios";
import WebMercatorViewport from "viewport-mercator-project";
import RouterContext from "./Router.js";
import { dataLayer } from "./Map/map-style";
import DrawControl from "./Map/DrawControl";
import Legend from "./Map/Legend";
import { getAoiScore } from "./helper/aggregateHex";
import "./App.css";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
//DO NOT REMOVE BELOW COMMENT
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// register controller in chart.js and ensure the defaults are set
ChartJS.register(BarElement, LineElement, PointElement, BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected, hexData, actionScores }) => {
  const [stochasticityChecked, setStochasticityChecked] = useState(true);
  const [aoiScore, setAoiScore] = useState({});
  const [scoreStyle, setScoreStyle] = useState({});
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  // const [selectedHexIdList, setSelectedHexIdList] = useState(hexIdInBlue);
  const overlaySources = {
    "secas": "mapbox://chuck0520.dkcwxuvl"
  };
  // const {hexIdInBlue, restoreAction, protectAction, maintainAction} = useContext(RouterContext);
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
  
  const scores = getAoiScore(hexData.features);

  let chartData_indicators = {
    labels: [
      "Estuarine Coastal Condition",
      "Fire Frequency",
      "Great Plains Perrenial Grass",
      "Imperiled Aquatic Species",
      "Interior Southeast Grasslands",
      "MAV Forest Birds Protection",
      "MAV Forest Birds Restoration",
      "Natural Landcover Floodplains",
      "Permeable Surface",
      "Playas",
      "Resilient Coastal Sites",
      "Resilient Terrestrial Sites",
      "South Atlantic Beach Birds",
      "South Atlantic Forest Birds",
      "West Coastal Plain Ouachitas Forested Wetlands",
      "West Coastal Plain Ouachita Open Pine Bird",
      "West Gulf Coast Mottled Duck Nesting",
      "Greenways Trails",
      "South Atlantic Low-density Urban Historic Sites",
      "Urban Park Size",
      "Gulf Migratory Fish Connectivity",
      "Intact Habitat Cores",
      "Network Complexity",
    ],
    datasets: [
      {
        label: "Current",
        backgroundColor: "rgba(0,0,255,0.5)",
        borderColor: "rgba(0,0,255,1)",
        borderWidth: 1,
        data: [
          scores.estcc,
          scores.firef,
          scores.gmgfc,
          scores.gppgr,
          scores.grntr,
          scores.ihabc,
          scores.impas,
          scores.isegr,
          scores.mavbp,
          scores.mavbr,
          scores.netcx,
          scores.nlcfp,
          scores.persu,
          scores.playa,
          scores.rescs,
          scores.rests,
          scores.safbb,
          scores.saffb,
          scores.saluh,
          scores.urbps,
          scores.wcofw,
          scores.wcopb,
          scores.wgcmd,
        ],
      },
      {
        label: "Future (No Action)",
        backgroundColor: "rgba(255,0,0,0.5)",
        borderColor: "rgba(255,0,0,1)",
        borderWidth: 1,
        data: [
          scores.estcc*scores.futurePenalty,
          scores.firef*scores.futurePenalty,
          scores.gmgfc*scores.futurePenalty,
          scores.gppgr*scores.futurePenalty,
          scores.grntr*scores.futurePenalty,
          scores.ihabc*scores.futurePenalty,
          scores.impas*scores.futurePenalty,
          scores.isegr*scores.futurePenalty,
          scores.mavbp*scores.futurePenalty,
          scores.mavbr*scores.futurePenalty,
          scores.netcx*scores.futurePenalty,
          scores.nlcfp*scores.futurePenalty,
          scores.persu*scores.futurePenalty,
          scores.playa*scores.futurePenalty,
          scores.rescs*scores.futurePenalty,
          scores.rests*scores.futurePenalty,
          scores.safbb*scores.futurePenalty,
          scores.saffb*scores.futurePenalty,
          scores.saluh*scores.futurePenalty,
          scores.urbps*scores.futurePenalty,
          scores.wcofw*scores.futurePenalty,
          scores.wcopb*scores.futurePenalty,
          scores.wgcmd*scores.futurePenalty,
        ],
      },
      {
        label: "Future (With Action)",
        backgroundColor: "rgba(100,0,100,0.5)",
        borderColor: "rgba(100,0,100,1)",
        borderWidth: 1,
        data: [
          scores.estcc,
          scores.firef,
          scores.gmgfc,
          scores.gppgr,
          scores.grntr,
          scores.ihabc,
          scores.impas,
          scores.isegr,
          scores.mavbp,
          scores.mavbr,
          scores.netcx,
          scores.nlcfp,
          scores.persu,
          scores.playa,
          scores.rescs,
          scores.rests,
          scores.safbb,
          scores.saffb,
          scores.saluh,
          scores.urbps,
          scores.wcofw,
          scores.wcopb,
          scores.wgcmd,
        ],
      },
    ],
  }
  
  let chartData = {
    labels: ["Health", "Function", "Connectivity"],
    datasets: [
      {
        label: "Current",
        backgroundColor: "rgba(0,0,255,0.5)",
        borderColor: "rgba(0,0,255,1)",
        borderWidth: 1,
        data: [
          scores.hScore,
          scores.fScore,
          scores.cScore,
        ],
      },
      {
        label: "Future (No Action)",
        backgroundColor: "rgba(255,0,0,0.5)",
        borderColor: "rgba(255,0,0,1)",
        borderWidth: 1,
        data: [
          scores.hScore*scores.futurePenalty,
          scores.fScore*scores.futurePenalty,
          scores.cScore*scores.futurePenalty,
        ],
      },
      {
        label: "Future (With Action)",
        backgroundColor: "rgba(100,0,100,0.5)",
        borderColor: "rgba(100,0,100,1)",
        borderWidth: 1,
        data: [
          scores.hScore*0.7,
          scores.fScore*0.7,
          scores.cScore*0.7,
        ],
      },
    ],
  };
  
  const boxplotData = {
    labels: ['Health', 'Function', 'Connectivity', 'Total'],
    datasets: [
      {
        label: 'Dataset 1',
        borderWidth: 1,
        itemRadius: 2,
        itemStyle: 'circle',
        itemBackgroundColor: '#000',
        outlierBackgroundColor: '#000',
        data: [
          [0.1, 0.2, 0.3, 0.4, 0.5],
          {
            min: 0.1,
            q1: 0.3,
            median: 0.5,
            q3: 0.7,
            max: 0.9,
          },
          {
            min: 0.2,
            q1: 0.4,
            median: 0.6,
            q3: 0.8,
            max: 1,
            // items: [1, 2, 3, 4, 5],
          },
          {
            min: 0.1,
            q1: 0.2,
            median: 0.5,
            q3: 0.8,
            max: 1,
            // outliers: [11],
          },
        ],
      },
    ],
  };

  const boxplotOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Chart.js Box Plot Chart"
    }
  };

  const onStochasticityChange = () => {
    setStochasticityChecked(!stochasticityChecked);
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
  
  useEffect(() => {
    if (aoi && hexData) {
      const scores = getAoiScore(hexData.features);
      setAoiScore(scores);
      console.log(scores);
    };
  }, [hexData]);

  useEffect(() => {
    let styles = {
      currentStyle: aoiScore.currentScore < aoiScore.futureScore ? { color: "coral" } : { color: "limegreen" },
      futureStyle: aoiScore.futureScore < aoiScore.currentScore ? { color: "coral" } : { color: "limegreen" },
    };
    setScoreStyle(styles);
  }, [aoiScore])

  // useEffect(() => {
  //   setSelectedHexIdList(hexIdInBlue);
  // }, [hexIdInBlue]);

  return (
    <div style={{ padding: "20px", marginTop: "50px" }}>
      {aoi && (
        <Col>
          <Row style={{ height: "50vh" }}>
            <Col>
              <h2>{aoi.name} Details:</h2>
              <h4>
                Current HFC Score:{" "}
                <span style={scoreStyle.currentStyle}>{aoiScore.currentScore}</span>
              </h4>
              <h4>
                Future HFC Score:{" "}
                <span style={scoreStyle.futureStyle}>{aoiScore.futureScore}</span>
              </h4>
              <ul>
                <li>
                  This area of interest has an area of{" "}
                  {Math.round(aoi.area * 100) / 100} km<sup>2</sup>
                </li>
                <li>
                  This area of interest contains {aoi.currentHexagons.length}{" "} hexagons
                </li>
                <li>
                  The HFC score of this area will drop{" "}
                  {Math.round(100 - 100*aoiScore.futureScore/aoiScore.currentScore)}
                  % in year 2060 with no conservation actions compared to current condition
                </li>
              </ul>
            </Col>
            <Col>
              <h4>AOI Current Condition</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "40%", height: "40%" }}
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
            </Col>
          </Row>
          <Row style={{ height: "50vh" }}>
            <Col>
              <h4>AOI Future Condition (No Action)</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "40%", height: "40%" }}
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
            </Col>
            <Col>
              <h4>AOI Future Condition (With Action)</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "40%", height: "40%" }}
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
            </Col>            
          </Row>
          <Row>
            <Col>
              <h4>AOI Indicator Scores</h4>
              <Table striped bordered size="sm" variant="light">
                <thead>
                  <tr>
                    <th>Indicators</th>
                    <th>Current Score</th>
                    <th>Future Score</th>
                    <th>Action Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <b>Health </b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>Estuarine Coastal Condition</td>
                    <td>{scores.estcc}</td>
                    <td>{(scores.estcc*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.estcc}</td>
                  </tr>
                  <tr>
                    <td>Fire Frequency</td>
                    <td>{scores.firef}</td>
                    <td>{(scores.firef*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.firef}</td>
                  </tr>
                  <tr>
                    <td>Great Plains Perrenial Grass</td>
                    <td>{scores.gppgr}</td>
                    <td>{(scores.gppgr*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.gppgr}</td>
                  </tr>
                  <tr>
                    <td>Imperiled Aquatic Species</td>
                    <td>{scores.impas}</td>
                    <td>{(scores.impas*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.impas}</td>
                  </tr>
                  <tr>
                    <td>Interior Southeast Grasslands</td>
                    <td>{scores.isegr}</td>
                    <td>{(scores.isegr*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.isegr}</td>
                  </tr>
                  <tr>
                    <td>MAV Forest Birds Protection</td>
                    <td>{scores.mavbp}</td>
                    <td>{(scores.mavbp*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.mavbp}</td>
                  </tr>
                  <tr>
                    <td>MAV Forest Birds Restoration</td>
                    <td>{scores.mavbr}</td>
                    <td>{(scores.mavbr*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.mavbr}</td>
                  </tr>
                  <tr>
                    <td>Natural Landcover Floodplains</td>
                    <td>{scores.nlcfp}</td>
                    <td>{(scores.nlcfp*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.nlcfp}</td>
                  </tr>
                  <tr>
                    <td>Permeable Surface</td>
                    <td>{scores.persu}</td>
                    <td>{(scores.persu*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.persu}</td>
                  </tr>
                  <tr>
                    <td>Playas</td>
                    <td>{scores.playa}</td>
                    <td>{(scores.playa*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.playa}</td>
                  </tr>
                  <tr>
                    <td>Resilient Coastal Sites</td>
                    <td>{scores.rescs}</td>
                    <td>{(scores.rescs*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.rescs}</td>
                  </tr>
                  <tr>
                    <td>Resilient Terrestrial Sites</td>
                    <td>{scores.rests}</td>
                    <td>{(scores.rests*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.rests}</td>
                  </tr>
                  <tr>
                    <td>South Atlantic Beach Birds</td>
                    <td>{scores.safbb}</td>
                    <td>{(scores.safbb*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.safbb}</td>
                  </tr>
                  <tr>
                    <td>South Atlantic Forest Birds</td>
                    <td>{scores.saffb}</td>
                    <td>{(scores.saffb*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.saffb}</td>
                  </tr>
                  <tr>
                    <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                    <td>{scores.wcofw}</td>
                    <td>{(scores.wcofw*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.wcofw}</td>
                  </tr>
                  <tr>
                    <td>West Coastal Plain Ouachita Open Pine Bird</td>
                    <td>{scores.wcopb}</td>
                    <td>{(scores.wcopb*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.wcopb}</td>
                  </tr>
                  <tr>
                    <td>West Gulf Coast Mottled Duck Nesting</td>
                    <td>{scores.wcopb}</td>
                    <td>{(scores.wcopb*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.wgcmd}</td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <b>Function </b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>Greenways Trails</td>
                    <td>{scores.grntr}</td>
                    <td>{(scores.grntr*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.grntr}</td>
                  </tr>
                  <tr>
                    <td>South Atlantic Low-density Urban Historic Sites</td>
                    <td>{scores.saluh}</td>
                    <td>{(scores.saluh*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.saluh}</td>
                  </tr>
                  <tr>
                    <td>Urban Park Size</td>
                    <td>{scores.urbps}</td>
                    <td>{(scores.urbps*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.urbps}</td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <b>Connectivity</b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>Gulf Migratory Fish Connectivity</td>
                    <td>{scores.gmgfc}</td>
                    <td>{(scores.gmgfc*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.gmgfc}</td>
                  </tr>
                  <tr>
                    <td>Intact Habitat Cores</td>
                    <td>{scores.ihabc}</td>
                    <td>{(scores.ihabc*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.ihabc}</td>
                  </tr>
                  <tr>
                    <td>Network Complexity</td>
                    <td>{scores.netcx}</td>
                    <td>{(scores.netcx*scores.futurePenalty).toFixed(2)}</td>
                    <td>{actionScores.netcx}</td>
                  </tr>
                  <tr>
                    <td  colSpan="1">
                      <b style={{ color: "blue" }}>Overall Score</b>{" "}
                    </td>
                    <td>
                      <b style={{ color: "blue" }}>
                        {scores.currentScore.toFixed(2)}
                      </b>
                    </td>
                    <td>
                      <b style={{ color: "blue" }}>
                        {scores.futureScore.toFixed(2)}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h2>AOI Score Chart by Indicator</h2>
              <Chart
                type="line"
                data={chartData_indicators}
                options={{
                  scales: {
                    x: {
                      reverse: true,
                    }
                  },
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
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>AOI Score Chart by HFC Goal</h4>
              <Chart
                type="bar"
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
            </Col>
            <Col>
              <h4>Box Plot by HFC Goal</h4>
              <Chart type="boxplot" options={boxplotOptions} data={boxplotData} />
            </Col>
          </Row>
          <Row>
            <div>
              <h2>Summary</h2>
              <p></p>
            </div>
          </Row>
          <Row>
            <div>
              <h2>Appendix</h2>
            </div>
          </Row>
        </Col>
      )}
    </div>
  );
};

export default Report;
