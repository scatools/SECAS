import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, LinearScale, CategoryScale, RadialLinearScale } from 'chart.js';
import { Chart, Bar, Line } from "react-chartjs-2";
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { BiCheckCircle, BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import bbox from "@turf/bbox";
import axios from "axios";
import WebMercatorViewport from "viewport-mercator-project";
import RouterContext from "./Router.js";
import { dataLayer } from "./Map/map-style";
import DrawControl from "./Map/DrawControl";
import Legend from "./Map/Legend";
import { getAoiScore, sensitivityAnalysis } from "./helper/aggregateHex";
import "./App.css";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
//DO NOT REMOVE BELOW COMMENT
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// register controller in chart.js and ensure the defaults are set
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale, RadialLinearScale);

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Report = ({ aoiSelected, hexData, actionHexData, actionScores }) => {
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

  const [viewport, setViewport] = useState({
    latitude: newViewport.latitude,
    longitude: newViewport.longitude,
    zoom: newViewport.zoom,
  });
  
  const scores = getAoiScore(hexData.features);

  const scoreList = Object.values(scores);

  const scoreLabels = {
    "Estuarine Coastal Condition": "estcc",
    "Fire Frequency": "firef",
    "Great Plains Perrenial Grass": "gppgr",
    "Imperiled Aquatic Species": "impas",
    "Interior Southeast Grasslands": "isegr",
    "MAV Forest Birds Protection": "mavbp",
    "MAV Forest Birds Restoration": "mavbr",
    "Natural Landcover Floodplains": "nlcfp",
    "Permeable Surface": "persu",
    "Playas": "playa",
    "Resilient Coastal Sites": "rescs",
    "Resilient Terrestrial Sites": "rests",
    "South Atlantic Beach Birds": "safbb",
    "South Atlantic Forest Birds": "saffb",
    "West Coastal Plain Ouachitas Forested Wetlands": "wcofw",
    "West Coastal Plain Ouachita Open Pine Bird": "wcopb",
    "West Gulf Coast Mottled Duck Nesting": "wgcmd",
    "Greenways Trails": "grntr",
    "South Atlantic Low-density Urban Historic Sites": "saluh",
    "Urban Park Size": "urbps",
    "Gulf Migratory Fish Connectivity": "gmgfc",
    "Intact Habitat Cores": "ihabc",
    "Network Complexity": "netcx",
  };

  const scoreLabelsList = [
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
  ];

  const validScoreLabelList = scoreLabelsList.filter((label) => scores[scoreLabels[label]] > 0);

  const sensitivityResults = validScoreLabelList.map((label) => {
    const increasedHexFeatureList = aoi.currentHexagons.map((hex, index) => {
      // Use medoid score for deterministic model
      const rawScore = {
        estcc: hex.estcc_mi,
        firef: hex.firef_mi,
        gmgfc: hex.gmgfc_mi,
        gppgr: hex.gppgr_mi,
        grntr: hex.grntr_mi,
        ihabc: hex.ihabc_mi,
        impas: hex.impas_mi,
        isegr: hex.isegr_mi,
        mavbp: hex.mavbp_mi,
        mavbr: hex.mavbr_mi,
        netcx: hex.netcx_mi,
        nlcfp: hex.nlcfp_mi,
        persu: hex.persu_mi,
        playa: hex.playa_mi,
        rescs: hex.rescs_mi,
        rests: hex.rests_mi,
        safbb: hex.safbb_mi,
        saffb: hex.saffb_mi,
        saluh: hex.saluh_mi,
        urbps: hex.urbps_mi,
        wcofw: hex.wcofw_mi,
        wcopb: hex.wcopb_mi,
        wgcmd: hex.wgcmd_mi,
        futurePenalty: hex.futv2_me
      };
      const increasedHexagonScore = sensitivityAnalysis(rawScore, scoreLabels[label], 0.25);

      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: {
          ...increasedHexagonScore,
          gid: hex.gid,
          objectid: hex.objectid,
        },
      };
    });

    const decreasedHexFeatureList = aoi.currentHexagons.map((hex, index) => {
      // Use medoid score for deterministic model
      const rawScore = {
        estcc: hex.estcc_mi,
        firef: hex.firef_mi,
        gmgfc: hex.gmgfc_mi,
        gppgr: hex.gppgr_mi,
        grntr: hex.grntr_mi,
        ihabc: hex.ihabc_mi,
        impas: hex.impas_mi,
        isegr: hex.isegr_mi,
        mavbp: hex.mavbp_mi,
        mavbr: hex.mavbr_mi,
        netcx: hex.netcx_mi,
        nlcfp: hex.nlcfp_mi,
        persu: hex.persu_mi,
        playa: hex.playa_mi,
        rescs: hex.rescs_mi,
        rests: hex.rests_mi,
        safbb: hex.safbb_mi,
        saffb: hex.saffb_mi,
        saluh: hex.saluh_mi,
        urbps: hex.urbps_mi,
        wcofw: hex.wcofw_mi,
        wcopb: hex.wcopb_mi,
        wgcmd: hex.wgcmd_mi,
        futurePenalty: hex.futv2_me
      };
      const decreasedHexagonScore = sensitivityAnalysis(rawScore, scoreLabels[label], -0.25);

      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: {
          ...decreasedHexagonScore,
          gid: hex.gid,
          objectid: hex.objectid,
        },
      };
    });

    const increasedAoiScore = getAoiScore(increasedHexFeatureList).currentScore;
    const decreasedAoiScore = getAoiScore(decreasedHexFeatureList).currentScore;

    return {
      increasedAoiScore: increasedAoiScore,
      decreasedAoiScore: decreasedAoiScore
    };
  });
  
  let barChartData = {
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
        backgroundColor: "rgba(0,128,0,0.5)",
        borderColor: "rgba(0,128,0,1)",
        borderWidth: 1,
        data: [
          actionScores.hScore,
          actionScores.fScore,
          actionScores.cScore,
        ],
      },
    ],
  };

  let lineChartData = {
    labels: scoreLabelsList.filter((scoreLabel, index) => scoreList[index] !== 0),
    datasets: [
      {
        label: "Current",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: "rgba(0,0,0,1)",
        data: scoreList.filter((score) => score !== 0),
      },
      {
        label: "Future (No Action)",
        backgroundColor: "rgba(0,0,255,0.5)",
        borderColor: "rgba(0,0,255,1)",
        data: scoreList.filter((score) => score !== 0).map((score) => score*scores.futurePenalty),
      },
      {
        label: "Future (With Action)",
        backgroundColor: "rgba(0,128,0,0.5)",
        borderColor: "rgba(0,128,0,1)",
        data: Object.values(actionScores).filter((score) => score !== -1),
      },
    ],
  }
  
  // const boxplotData = {
  //   labels: ['Health', 'Function', 'Connectivity', 'Total'],
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       borderWidth: 1,
  //       itemRadius: 2,
  //       itemStyle: 'circle',
  //       itemBackgroundColor: '#000',
  //       outlierBackgroundColor: '#000',
  //       data: [
  //         [0.1, 0.2, 0.3, 0.4, 0.5],
  //         {
  //           min: 0.1,
  //           q1: 0.3,
  //           median: 0.5,
  //           q3: 0.7,
  //           max: 0.9,
  //         },
  //         {
  //           min: 0.2,
  //           q1: 0.4,
  //           median: 0.6,
  //           q3: 0.8,
  //           max: 1,
  //           // items: [1, 2, 3, 4, 5],
  //         },
  //         {
  //           min: 0.1,
  //           q1: 0.2,
  //           median: 0.5,
  //           q3: 0.8,
  //           max: 1,
  //           // outliers: [11],
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const boxplotOptions = {
  //   responsive: true,
  //   legend: {
  //     position: "top"
  //   },
  //   title: {
  //     display: true,
  //     text: "Chart.js Box Plot Chart"
  //   }
  // };

  const stackedBarChartData = {
    labels: validScoreLabelList,
    datasets: [
      {
        label: "+25%",
        backgroundColor: "rgba(93,0,216,1)",
        data: sensitivityResults.map((item, index) => Math.abs(item.increasedAoiScore - scores[scoreLabels[validScoreLabelList[index]]]))
      },
      {
        label: "-25%",
        backgroundColor: "rgba(174,255,240,1)",
        data: sensitivityResults.map((item, index) => 0 - Math.abs(item.decreasedAoiScore - scores[scoreLabels[validScoreLabelList[index]]]))
      }
    ]
  };

  const StackedAxisChart = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        new ChartJS(ctx, {
          type: "bar",
          data: stackedBarChartData,
          options: {
            responsive: true,
            indexAxis: "y",
            legend: {
              position: "bottom"
            },
            scales: {
              xAxes: [
                {
                  stacked: false,
                  ticks: {
                    beginAtZero: true,
                    fontSize: 13,
                    callback: (v) => {
                      return v < 0 ? -v + "%" : v + "%";
                    }
                  }
                }
              ],
              yAxes: [
                {
                  stacked: true,
                  ticks: {
                    beginAtZero: true,
                    fontSize: 13
                  },
                  position: "right"
                }
              ]
            }
          }
        });
      }
    }, []);
  
    return (
      <canvas id="sensitivity" ref={canvasRef} />
    );
  };

  const onStochasticityChange = () => {
    setStochasticityChecked(!stochasticityChecked);
  };

  let calculateImpact = (beforeScore, afterScore) => {
    let percentage = beforeScore == 0 ? 0 : (afterScore-beforeScore)/beforeScore;
    return (
      <td>
        {afterScore < beforeScore ? <BiSolidDownArrow color="red" /> : <BiSolidUpArrow color="green" />} &nbsp;
        {(100*percentage).toFixed(0) + "%"}
      </td>
    );
  };

  // useEffect(() => {
  //   setSelectedHexIdList(hexIdInBlue);
  // }, [hexIdInBlue]);

  return (
    <div style={{ padding: "20px", marginTop: "50px" }}>
      {aoi && (
        <Col>
          <Row>
            <h2>{aoi.name} Details:</h2>
            <Button
              style={{ position: "absolute", width: "40px", right: "20px" }}
              onClick={() => {window.print()}}
            >
              Print
            </Button>
          </Row>
          <Row style={{ height: "50vh" }}>
            <Col>
              <Row>
                <h5>
                  Current HFC Score:{" "}
                  <span style={{ color: "blue" }}>{scores.currentScore.toFixed(2)}</span>
                </h5>
                <h5>
                  Future HFC Score (No Action):{" "}
                  <span style={{ color: "red" }}>{scores.futureScore.toFixed(2)}</span>
                </h5>
                <h5>
                  Future HFC Score (With Action):{" "}
                  <span style={{ color: "green" }}>{actionScores.futureScore}</span>
                </h5>
              </Row>
              <Row>
                <Col style={{border: "1px black solid", borderRadius: "10px", margin: "10px", padding: "10px"}}>
                  <h5>AOI Basics</h5>
                  <ul>
                    <li>
                      This area of interest contains an area of{" "}
                      {Math.round(aoi.area * 100) / 100} km<sup>2</sup>
                    </li>
                    <li>
                      This area of interest contains {aoi.currentHexagons.length}{" "} hexagons
                    </li>
                  </ul>
                  <h5>Selected Actions</h5>
                  <ul style={{listStyle: "none"}}>
                    {validScoreLabelList.map((label) => {
                      if (actionScores[scoreLabels[label]] > scores[scoreLabels[label]]) {
                        return <li><BiCheckCircle color="green"/>{"Improve "}{label}</li>
                      }
                    })}
                  </ul>
                </Col>
                <Col style={{border: "1px black solid", borderRadius: "10px", margin: "10px", padding: "10px"}}>
                  <h5>Action Impact</h5>
                  <li>
                    The HFC score of this area will
                    <b style={{ color: "red" }}> decrease by {Math.round(100 - 100*scores.futureScore/scores.currentScore)}% </b>
                    in year 2060 with no conservation action compared to current condition
                  </li>
                  <li>
                    The HFC score of this area will
                    <b style={{ color: "green" }}> increase by {Math.round(100*actionScores.futureScore/scores.currentScore - 100)}% </b>
                    in year 2060 with selected conservation actions compared to current condition
                  </li>
                </Col>
              </Row>
            </Col>
            <Col>
              <h4>AOI Current Condition</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "45%", height: "40%" }}
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
                {aoi &&
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
                        "fill-color": "transparent",
                        "fill-outline-color": "purple",
                      }}
                    />
                  </Source>
                }
                <Source type="geojson" data={hexData}>
                  <Layer
                    id="current-hex"
                    type="fill"
                    paint={{
                      "fill-color": {
                        property: "currentScore",
                        stops: [
                          [0.1, "#aefff0"],
                          [0.3, "#00d8f2"],
                          [0.5, "#00a7e4"],
                          [0.7, "#007ad0"],
                          [0.9, "#5d00d8"],
                        ],
                      },
                      "fill-opacity": 0.5,
                    }}
                  />
                </Source>
              </Map>
            </Col>
          </Row>
          <Row style={{ height: "50vh" }}>
            <Col>
              <h4>AOI Future Condition (No Action)</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "45%", height: "40%" }}
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
                {aoi &&
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
                        "fill-color": "transparent",
                        "fill-outline-color": "purple",
                      }}
                    />
                  </Source>
                }
                <Source type="geojson" data={hexData}>
                  <Layer
                    id="future-hex-no-action"
                    type="fill"
                    paint={{
                      "fill-color": {
                        property: "futureScore",
                        stops: [
                          [0.1, "#aefff0"],
                          [0.3, "#00d8f2"],
                          [0.5, "#00a7e4"],
                          [0.7, "#007ad0"],
                          [0.9, "#5d00d8"],
                        ],
                      },
                      "fill-opacity": 0.5,
                    }}
                  />
                </Source>
              </Map>
            </Col>
            <Col>
              <h4>AOI Future Condition (With Action)</h4>
              <Map
                {...viewport}
                style={{ position: "absolute", width: "45%", height: "40%" }}
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
                {aoi &&
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
                        "fill-color": "transparent",
                        "fill-outline-color": "purple",
                      }}
                    />
                  </Source>
                }
                <Source type="geojson" data={actionHexData}>
                  <Layer
                    id="future-hex-action"
                    type="fill"
                    paint={{
                      "fill-color": {
                        property: "actionScore",
                        stops: [
                          [0.1, "#aefff0"],
                          [0.3, "#00d8f2"],
                          [0.5, "#00a7e4"],
                          [0.7, "#007ad0"],
                          [0.9, "#5d00d8"],
                        ],
                      },
                      "fill-opacity": 0.5,
                    }}
                  />
                </Source>
              </Map>
            </Col>            
          </Row>
          <Row>
            <Col>
              <h4>AOI Indicator Scores</h4>
              <Table striped bordered size="md" variant="light">
                <thead>
                  <tr>
                    <th>Indicators</th>
                    <th style={{ color: "blue" }}>Current Score</th>
                    <th style={{ color: "red" }}>Future Score (No Action)</th>
                    <th style={{ color: "green" }}>Future Score (With Action)</th>
                    <th>Action Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5">
                      <b>Health </b>{" "}
                    </td>
                  </tr>
                  {scores.estcc > 0  ?
                  <tr>
                    <td>Estuarine Coastal Condition</td>
                    <td style={{ color: "blue" }}>{scores.estcc}</td>
                    <td style={{ color: "red" }}>{(scores.estcc*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.estcc}</td>
                    {calculateImpact(scores.estcc, actionScores.estcc)}
                  </tr>
                  :
                  <tr>
                    <td>Estuarine Coastal Condition</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.firef > 0  ?
                  <tr>
                    <td>Fire Frequency</td>
                    <td style={{ color: "blue" }}>{scores.firef}</td>
                    <td style={{ color: "red" }}>{(scores.firef*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.firef}</td>
                    {calculateImpact(scores.firef, actionScores.firef)}
                  </tr>
                  :
                  <tr>
                    <td>Fire Frequency</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.gppgr > 0  ?
                  <tr>
                    <td>Great Plains Perrenial Grass</td>
                    <td style={{ color: "blue" }}>{scores.gppgr}</td>
                    <td style={{ color: "red" }}>{(scores.gppgr*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.gppgr}</td>
                    {calculateImpact(scores.gppgr, actionScores.gppgr)}
                  </tr>
                  :
                  <tr>
                    <td>Great Plains Perrenial Grass</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.impas > 0  ?
                  <tr>
                    <td>Imperiled Aquatic Species</td>
                    <td style={{ color: "blue" }}>{scores.impas}</td>
                    <td style={{ color: "red" }}>{(scores.impas*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.impas}</td>
                    {calculateImpact(scores.impas, actionScores.impas)}
                  </tr>
                  :
                  <tr>
                    <td>Imperiled Aquatic Species</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.isegr > 0  ?
                  <tr>
                    <td>Interior Southeast Grasslands</td>
                    <td style={{ color: "blue" }}>{scores.isegr}</td>
                    <td style={{ color: "red" }}>{(scores.isegr*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.isegr}</td>
                    {calculateImpact(scores.isegr, actionScores.isegr)}
                  </tr>
                  :
                  <tr>
                    <td>Interior Southeast Grasslands</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.mavbp > 0  ?
                  <tr>
                    <td>MAV Forest Birds Protection</td>
                    <td style={{ color: "blue" }}>{scores.mavbp}</td>
                    <td style={{ color: "red" }}>{(scores.mavbp*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.mavbp}</td>
                    {calculateImpact(scores.mavbp, actionScores.mavbp)}
                  </tr>
                  :
                  <tr>
                    <td>MAV Forest Birds Protection</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.mavbr > 0  ?
                  <tr>
                    <td>MAV Forest Birds Restoration</td>
                    <td style={{ color: "blue" }}>{scores.mavbr}</td>
                    <td style={{ color: "red" }}>{(scores.mavbr*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.mavbr}</td>
                    {calculateImpact(scores.mavbr, actionScores.mavbr)}
                  </tr>
                  :
                  <tr>
                    <td>MAV Forest Birds Restoration</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.nlcfp > 0  ?
                  <tr>
                    <td>Natural Landcover Floodplains</td>
                    <td style={{ color: "blue" }}>{scores.nlcfp}</td>
                    <td style={{ color: "red" }}>{(scores.nlcfp*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.nlcfp}</td>
                    {calculateImpact(scores.nlcfp, actionScores.nlcfp)}
                  </tr>
                  :
                  <tr>
                    <td>Natural Landcover Floodplains</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.persu > 0  ?
                  <tr>
                    <td>Permeable Surface</td>
                    <td style={{ color: "blue" }}>{scores.persu}</td>
                    <td style={{ color: "red" }}>{(scores.persu*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.persu}</td>
                    {calculateImpact(scores.persu, actionScores.persu)}
                  </tr>
                  :
                  <tr>
                    <td>Permeable Surface</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.playa > 0  ?
                  <tr>
                    <td>Playas</td>
                    <td style={{ color: "blue" }}>{scores.playa}</td>
                    <td style={{ color: "red" }}>{(scores.playa*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.playa}</td>
                    {calculateImpact(scores.playa, actionScores.playa)}
                  </tr>
                  :
                  <tr>
                    <td>Playas</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.rescs > 0  ?
                  <tr>
                    <td>Resilient Coastal Sites</td>
                    <td style={{ color: "blue" }}>{scores.rescs}</td>
                    <td style={{ color: "red" }}>{(scores.rescs*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.rescs}</td>
                    {calculateImpact(scores.rescs, actionScores.rescs)}
                  </tr>
                  :
                  <tr>
                    <td>Resilient Coastal Sites</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.rests > 0  ?
                  <tr>
                    <td>Resilient Terrestrial Sites</td>
                    <td style={{ color: "blue" }}>{scores.rests}</td>
                    <td style={{ color: "red" }}>{(scores.rests*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.rests}</td>
                    {calculateImpact(scores.rests, actionScores.rests)}
                  </tr>
                  :
                  <tr>
                    <td>Resilient Terrestrial Sites</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.safbb > 0  ?
                  <tr>
                    <td>South Atlantic Beach Birds</td>
                    <td style={{ color: "blue" }}>{scores.safbb}</td>
                    <td style={{ color: "red" }}>{(scores.safbb*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.safbb}</td>
                    {calculateImpact(scores.safbb, actionScores.safbb)}
                  </tr>
                  :
                  <tr>
                    <td>South Atlantic Beach Birds</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.saffb > 0  ?
                  <tr>
                    <td>South Atlantic Forest Birds</td>
                    <td style={{ color: "blue" }}>{scores.saffb}</td>
                    <td style={{ color: "red" }}>{(scores.saffb*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.saffb}</td>
                    {calculateImpact(scores.saffb, actionScores.saffb)}
                  </tr>
                  :
                  <tr>
                    <td>South Atlantic Forest Birds</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.wcofw > 0  ?
                  <tr>
                    <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                    <td style={{ color: "blue" }}>{scores.wcofw}</td>
                    <td style={{ color: "red" }}>{(scores.wcofw*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.wcofw}</td>
                    {calculateImpact(scores.wcofw, actionScores.wcofw)}
                  </tr>
                  :
                  <tr>
                    <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.wcopb > 0  ?
                  <tr>
                    <td>West Coastal Plain Ouachita Open Pine Bird</td>
                    <td style={{ color: "blue" }}>{scores.wcopb}</td>
                    <td style={{ color: "red" }}>{(scores.wcopb*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.wcopb}</td>
                    {calculateImpact(scores.wcopb, actionScores.wcopb)}
                  </tr>
                  :
                  <tr>
                    <td>West Coastal Plain Ouachita Open Pine Bird</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.wgcmd > 0  ?
                  <tr>
                    <td>West Gulf Coast Mottled Duck Nesting</td>
                    <td style={{ color: "blue" }}>{scores.wgcmd}</td>
                    <td style={{ color: "red" }}>{(scores.wgcmd*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.wgcmd}</td>
                    {calculateImpact(scores.wgcmd, actionScores.wgcmd)}
                  </tr>
                  :
                  <tr>
                    <td>West Gulf Coast Mottled Duck Nesting</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  <tr>
                    <td colSpan="5">
                      <b>Function </b>{" "}
                    </td>
                  </tr>
                  {scores.grntr > 0  ?
                  <tr>
                    <td>Greenways Trails</td>
                    <td style={{ color: "blue" }}>{scores.grntr}</td>
                    <td style={{ color: "red" }}>{(scores.grntr*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.grntr}</td>
                    {calculateImpact(scores.grntr, actionScores.grntr)}
                  </tr>
                  :
                  <tr>
                    <td>Greenways Trails</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.saluh > 0  ?
                  <tr>
                    <td>South Atlantic Low-density Urban Historic Sites</td>
                    <td style={{ color: "blue" }}>{scores.saluh}</td>
                    <td style={{ color: "red" }}>{(scores.saluh*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.saluh}</td>
                    {calculateImpact(scores.saluh, actionScores.saluh)}
                  </tr>
                  :
                  <tr>
                    <td>South Atlantic Low-density Urban Historic Sites</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.urbps > 0  ?
                  <tr>
                    <td>Urban Park Size</td>
                    <td style={{ color: "blue" }}>{scores.urbps}</td>
                    <td style={{ color: "red" }}>{(scores.urbps*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.urbps}</td>
                    {calculateImpact(scores.urbps, actionScores.urbps)}
                  </tr>
                  :
                  <tr>
                    <td>Urban Park Size</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  <tr>
                    <td colSpan="5">
                      <b>Connectivity</b>{" "}
                    </td>
                  </tr>
                  {scores.gmgfc > 0  ?
                  <tr>
                    <td>Gulf Migratory Fish Connectivity</td>
                    <td style={{ color: "blue" }}>{scores.gmgfc}</td>
                    <td style={{ color: "red" }}>{(scores.gmgfc*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.gmgfc}</td>
                    {calculateImpact(scores.gmgfc, actionScores.gmgfc)}
                  </tr>
                  :
                  <tr>
                    <td>Gulf Migratory Fish Connectivity</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.ihabc > 0  ?
                  <tr>
                    <td>Intact Habitat Cores</td>
                    <td style={{ color: "blue" }}>{scores.ihabc}</td>
                    <td style={{ color: "red" }}>{(scores.ihabc*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.ihabc}</td>
                    {calculateImpact(scores.ihabc, actionScores.ihabc)}
                  </tr>
                  :
                  <tr>
                    <td>Intact Habitat Cores</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  {scores.netcx > 0  ?
                  <tr>
                    <td>Network Complexity</td>
                    <td style={{ color: "blue" }}>{scores.netcx}</td>
                    <td style={{ color: "red" }}>{(scores.netcx*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.netcx}</td>
                    {calculateImpact(scores.netcx, actionScores.netcx)}
                  </tr>
                  :
                  <tr>
                    <td>Network Complexity</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                  }        
                  <tr>
                    <td colSpan="1">
                      <b>Overall Score</b>{" "}
                    </td>
                    <td>
                      <b style={{ color: "blue" }}>
                        {scores.currentScore.toFixed(2)}
                      </b>
                    </td>
                    <td>
                      <b style={{ color: "red" }}>
                        {scores.futureScore.toFixed(2)}
                      </b>
                    </td>
                    <td>
                      <b style={{ color: "green" }}>
                        {actionScores.futureScore}
                      </b>
                    </td>
                    {calculateImpact(scores.currentScore, actionScores.futureScore)}
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h4>HFC Goal Score Chart</h4>
              <p>The HFC Goal Score Chart demonstrates the deterioration of this area of interest when no action is applied as well as the improvement of this area of interest when selected actions are taken by the goals of health, function and connectivity. </p>
              <p style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span
                    style={{
                      display: "block",
                      height: "20px",
                      width: "30px",
                      background: "blue",
                      border: "1px blue solid",
                      opacity: 0.5
                    }}
                  />
                  <span style={{ color: "blue" }}>Current Score</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span
                    style={{
                      display: "block",
                      height: "20px",
                      width: "30px",
                      background: "red",
                      border: "1px red solid",
                      opacity: 0.5
                    }}
                  />
                  <span style={{ color: "red" }}>Future Score (No Action)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span
                    style={{
                      display: "block",
                      height: "20px",
                      width: "30px",
                      background: "green",
                      border: "1px green solid",
                      opacity: 0.5
                    }}
                  />
                  <span style={{ color: "green" }}>Future Score (With Action)</span>
                </div>
              </p>
              <Chart
                type="bar"
                data={barChartData}
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
              {/* <h4>AOI Score Chart by Indicator</h4>
              <Chart
                type="bar"
                data={lineChartData}
                options={{
                  indexAxis: "y",
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
              /> */}
              <h4>Indicator Sensitivity Analysis</h4>
              <p>
                The sensitivity analysis provides an assessment of which indicators are most influential on HFC scores 1) under the current conditions and scores in the area of interest and 2) relative to the other indicators. They are calculated in two separate analyses by 1) increasing each indicator one at time by 25% and 2) decreasing each indicator one at a time by 25%, while holding all other indicators constant. The largest positive and negative bars on the chart indicate that a particular indicator is more influential on HFC scores than the others under current conditions.
              </p>
              {StackedAxisChart()}
            </Col>
          </Row>
          <Row>
            {/* <Col>
              <h4>Box Plot by HFC Goal</h4>
              <Chart type="boxplot" options={boxplotOptions} data={boxplotData} />
            </Col> */}
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
