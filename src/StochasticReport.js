import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Accordion, Button, Col, Row, Table } from "react-bootstrap";
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
import { getAoiScore, getHexagonScore, getStochasticScore, getStochasticActionScore, sensitivityAnalysis } from "./helper/aggregateHex";
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

const StochasticReport = ({ aoiSelected, setProgress, setShowProgress }) => {
  const [stochasticityChecked, setStochasticityChecked] = useState(true);
  const [aoiScore, setAoiScore] = useState({});
  const [scoreStyle, setScoreStyle] = useState({});
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [overlayList, setOverlayList] = useState([]);
  // const [selectedHexIdList, setSelectedHexIdList] = useState(hexIdInBlue);
  const [hexData, setHexData] = useState(null);
  const [actionHexData, setActionHexData] = useState(null);
  const [scores, setScores] = useState(null);
  const [actionScores, setActionScores] = useState({
    estcc: "No Action",
    firef: "No Action",
    gmgfc: "No Action",
    gppgr: "No Action",
    grntr: "No Action",
    ihabc: "No Action",
    impas: "No Action",
    isegr: "No Action",
    mavbp: "No Action",
    mavbr: "No Action",
    netcx: "No Action",
    nlcfp: "No Action",
    persu: "No Action",
    playa: "No Action",
    rescs: "No Action",
    rests: "No Action",
    safbb: "No Action",
    saffb: "No Action",
    saluh: "No Action",
    urbps: "No Action",
    wcofw: "No Action",
    wcopb: "No Action",
    wgcmd: "No Action",
    hScore: "No Action",
    fScore: "No Action",
    cScore: "No Action",
    futureScore: "No Action"
  });
  const [validScoreLabelList, setValidScoreLabelList] = useState([]);
  const [barChartData, setBarChartData] = useState(null);
  const [stackedBarChartData, setStackedBarChartData] = useState(null);
  const [boxplotData, setBoxplotData] = useState(null);

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

  const scoreLabels = {
    "Estuarine Coastal Condition": "estcc",
    "Fire Frequency": "firef",
    "Great Plains Perennial Grass": "gppgr",
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
    "West Coastal Plain Ouachitas Open Pine Bird": "wcopb",
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
    "Great Plains Perennial Grass",
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
    "West Coastal Plain Ouachitas Open Pine Bird",
    "West Gulf Coast Mottled Duck Nesting",
    "Greenways Trails",
    "South Atlantic Low-density Urban Historic Sites",
    "Urban Park Size",
    "Gulf Migratory Fish Connectivity",
    "Intact Habitat Cores",
    "Network Complexity",
  ];

  const boxplotOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Box Plot by HFC Goal"
    }
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

  useEffect(() => {
    if (aoi && aoi.currentHexagons) {
      setShowProgress(true);
      const hexFeatureList = aoi.currentHexagons.map((hex, index) => {
        setProgress(Math.round(index/aoi.currentHexagons.length*75) + 25);

        // Use stochastic score for stochastic model
        const stochasticScore = getStochasticScore(hex);
        const stochasticHexagonScore = getHexagonScore(stochasticScore);

        return {
          type: "Feature",
          geometry: JSON.parse(hex.geometry),
          properties: {
            ...stochasticScore,
            ...stochasticHexagonScore,
            gid: hex.gid,
            objectid: hex.objectid,
          },
        };
      });

      const actionHexFeatureList = aoi.currentHexagons.map((hex, index) => {
        setProgress(Math.round(index/aoi.currentHexagons.length*75) + 25);

        // Use stochastic score for stochastic model with action
        const stochasticActionScore = getStochasticActionScore(hex);
        const stochasticActionHexagonScore = getHexagonScore(stochasticActionScore);

        return {
          type: "Feature",
          geometry: JSON.parse(hex.geometry),
          properties: {
            ...stochasticActionScore,
            ...stochasticActionHexagonScore,
            gid: hex.gid,
            objectid: hex.objectid,
          },
        };
      });
      
      const hexData = {
        type: "FeatureCollection",
        features: hexFeatureList,
      };
      
      const actionHexData = {
        type: "FeatureCollection",
        features: actionHexFeatureList,
      };

      setHexData(hexData);
      setActionHexData(actionHexData);
      setShowProgress(false);
    }
  }, [aoi]);
  
  useEffect(() => {
    if (hexData) {
      const scores = getAoiScore(hexData.features);
      setScores(scores);

      const validScoreLabelList = scoreLabelsList.filter((label) => scores[scoreLabels[label]] > 0);
      setValidScoreLabelList(validScoreLabelList);
    
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
      
      setStackedBarChartData(stackedBarChartData);
    }

    if (hexData && actionHexData) {
      const scores = getAoiScore(hexData.features);
      const actionScores = getAoiScore(actionHexData.features);
      setActionScores(actionScores);
      
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

      setBarChartData(barChartData);
      
      const hScoreCurrent = hexData.features.map(feature => feature.properties.hScore);
      const fScoreCurrent = hexData.features.map(feature => feature.properties.fScore);
      const cScoreCurrent = hexData.features.map(feature => feature.properties.cScore);
      const scoreCurrent = hexData.features.map(feature => feature.properties.currentScore);

      const hScoreFuture = hexData.features.map(feature => Math.abs(feature.properties.hScore*feature.properties.futurePenalty));
      const fScoreFuture = hexData.features.map(feature => Math.abs(feature.properties.fScore*feature.properties.futurePenalty));
      const cScoreFuture = hexData.features.map(feature => Math.abs(feature.properties.cScore*feature.properties.futurePenalty));
      const scoreFuture = hexData.features.map(feature => Math.abs(feature.properties.currentScore*feature.properties.futurePenalty));
      
      const hScoreAction = actionHexData.features.map(feature => feature.properties.hScore);
      const fScoreAction = actionHexData.features.map(feature => feature.properties.fScore);
      const cScoreAction = actionHexData.features.map(feature => feature.properties.cScore);
      const scoreAction = actionHexData.features.map(feature => feature.properties.currentScore);
  
      const boxplotData = {
        labels: ['Health', 'Function', 'Connectivity', 'Overall'],
        datasets: [
          {
            label: "Current",
            backgroundColor:  'rgba(0,0,255,0.5)',
            borderColor: 'blue',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 10,
            itemRadius: 0,
            data: [
              hScoreCurrent,
              fScoreCurrent,
              cScoreCurrent,
              scoreCurrent
            ],
          },
          {
            label: "Future (No Action)",
            backgroundColor: 'rgba(255,0,0,0.5)',
            borderColor: 'red',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 10,
            itemRadius: 0,
            data: [
              hScoreFuture,
              fScoreFuture,
              cScoreFuture,
              scoreFuture
            ],
          },
          {
            label: "Future (With Action)",
            backgroundColor: 'rgba(0,128,0,0.5)',
            borderColor: 'green',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 10,
            itemRadius: 0,
            data: [
              hScoreAction,
              fScoreAction,
              cScoreAction,
              scoreAction
            ],
          },
        ],
      };

      setBoxplotData(boxplotData);
    }
  }, [hexData, actionHexData]);

  // useEffect(() => {
  //   setSelectedHexIdList(hexIdInBlue);
  // }, [hexIdInBlue]);

  return (
    <div style={{ padding: "50px", margin: "20px 100px" }}>
      {aoi && scores && actionScores && (
        <Col>
          <Row>
            <h2>{aoi.name} Details:</h2>
            <Button
              className="print-button"
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
                  <span style={{ color: "red" }}>{(scores.currentScore*scores.futurePenalty).toFixed(2)}</span>
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
                    <b style={{ color: "red" }}> decrease by {Math.round(100 - 100*scores.currentScore*scores.futurePenalty/scores.currentScore)}% </b>
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
                    <td>Great Plains Perennial Grass</td>
                    <td style={{ color: "blue" }}>{scores.gppgr}</td>
                    <td style={{ color: "red" }}>{(scores.gppgr*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.gppgr}</td>
                    {calculateImpact(scores.gppgr, actionScores.gppgr)}
                  </tr>
                  :
                  <tr>
                    <td>Great Plains Perennial Grass</td>
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
                    <td>West Coastal Plain Ouachitas Open Pine Bird</td>
                    <td style={{ color: "blue" }}>{scores.wcopb}</td>
                    <td style={{ color: "red" }}>{(scores.wcopb*scores.futurePenalty).toFixed(2)}</td>
                    <td style={{ color: "green" }}>{actionScores.wcopb}</td>
                    {calculateImpact(scores.wcopb, actionScores.wcopb)}
                  </tr>
                  :
                  <tr>
                    <td>West Coastal Plain Ouachitas Open Pine Bird</td>
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
                        {(scores.currentScore*scores.futurePenalty).toFixed(2)}
                      </b>
                    </td>
                    <td>
                      <b style={{ color: "green" }}>
                        {actionScores.currentScore}
                      </b>
                    </td>
                    {calculateImpact(scores.currentScore, actionScores.currentScore)}
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h4>HFC Goal Score Box Plot</h4>
              <p>The HFC Goal Score Box Plot demonstrates the stochastic results of 1000 simulations that indicate the current condition, the deterioration of this area of interest when no action is applied, as well as the improvement of this area of interest when selected actions are taken by the goals of health, function and connectivity. </p>
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
                  &nbsp;
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
                  &nbsp;
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
                  &nbsp;
                  <span style={{ color: "green" }}>Future Score (With Action)</span>
                </div>
              </p>
              <Chart type="boxplot" options={boxplotOptions} data={boxplotData} />
              <br/>

              {/* <h4>HFC Goal Score Chart</h4>
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
              {barChartData && (
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
              )} */}
              <br/>

              <h4>Indicator Sensitivity Analysis</h4>
              <p>
                The sensitivity analysis provides an assessment of which indicators are most influential on HFC scores 1) under the current conditions and scores in the area of interest and 2) relative to the other indicators. They are calculated in two separate analyses by 1) increasing each indicator one at time by 25% and 2) decreasing each indicator one at a time by 25%, while holding all other indicators constant. The largest positive and negative bars on the chart indicate that a particular indicator is more influential on HFC scores than the others under current conditions.
              </p>
              {stackedBarChartData && (
                <Chart
                  type="bar"
                  data={stackedBarChartData}
                  options={{
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
                  }}
                />
              )}
            </Col>
          </Row>
          <Row>
            <div>
              <h2>Appendix</h2>
              <h4>Health Indicators</h4>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Atlantic Estuarine Fish Habitat</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of Atlantic estuarine fish habitat condition based on water quality, marsh edges, seagrass and oyster reefs, and more.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.25 = Degraded areas of opportunity</li>
                    <li>0.5 = Restoration opportunity areas</li>
                    <li>1.0 = Excellent Fish Habitat</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Atlantic Migratory Fish Habitat</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of Atlantic migratory fish habitat condition based on water quality, connectivity, flow alteration, and more.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.25 = Degraded areas of opportunity</li>
                    <li>0.5 = Restoration opportunity areas</li>
                    <li>1.0 = Excellent Fish Habitat</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Coastal Shoreline Condition</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index based on presence of hardened structures and ease of development in coastal areas.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Armored</li>
                    <li>0.25 = Partially armored</li>
                    <li>0.5 = Partially armored and harder to develop</li>
                    <li>1.0 = Natural or natural and harder to develop</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>East Gulf Coastal Plain Open Pine Birds</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of areas within the longleaf pine range east of the Mississippi River where open pine habitat management would most benefit six focal bird species.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.2 = Low</li>
                    <li>0.4 = Med-Low</li>
                    <li>0.6 = Medium</li>
                    <li>0.8 = Med-High</li>
                    <li>1.0 = High</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Estuarine Coastal Condition</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of estuarine water quality, sediment quality, contaminants in fish tissue, and benthic community condition.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Poor</li>
                    <li>0.25 = Fair to poor</li>
                    <li>0.5 = Fair</li>
                    <li>0.75 = Good to fair</li>
                    <li>1.0 = Good</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                  <Accordion.Header>Fire Frequency</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Estimates the number of times an area has been burned from 2013-2021.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Not burned or row crop</li>
                    <li>0.5 = Burned 1 time (~burned only once in 8 years)</li>
                    <li>1.0 = Burned 2 or more times (~burned every 4 years or more frequently)</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="6">
                  <Accordion.Header>Great Plains Perennial Grass</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Grassland condition in the Great Plains (OK, TX) using the percent of perennial forbs and perennial grass.
                    <br/>
                    <b>Scale: </b>
                    <li>0.2 = 0-20%,</li>
                    <li>0.4 = 21-40%,</li>
                    <li>0.6 = 41-60%,</li>
                    <li>0.8 = 61-80%,</li>
                    <li>1.0 = 81-100%</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="7">
                  <Accordion.Header>Imperiled Aquatic Species</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Number of aquatic Species of Greatest Conservation Need by watershed.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = no imperiled aquatic species</li>
                    <li>0.5 = 1-2 imperiled aquatic species</li>
                    <li>0.75 = 3 imperiled aquatic species</li>
                    <li>1.0 = 4 or more imperiled aquatic species</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="8">
                  <Accordion.Header>Interior Southeast Grasslands</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of known grasslands, areas with potentially compatible management, and grassland geology in the Interior Southeast.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Grassland geology but grassland less likely</li>
                    <li>0.25 = Potentially compatible management outside of grassland geology (undeveloped powerline right-of-way or perennial forbs and grasses)</li>
                    <li>0.5 = Potentially compatible management within grassland geology (undeveloped powerline right-of-way or perennial forbs and grasses)</li>
                    <li>0.75 = Known grassland buffer</li>
                    <li>1.0 = Known grassland</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="9">
                  <Accordion.Header>Mississippi Alluvial Valley Forest Birds - Protection</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Prioritizes new areas for protection as an index within the MAV based on benefits to forest breeding birds that need large interior cores of bottomland hardwood habitat.
                    <br/>
                    <b>Scale: </b>
                    <li>0 = no data,</li>
                    <li>0.1 = 1-10,</li>
                    <li>0.2 = 11-20,</li>
                    <li>0.3 = 21-30,</li>
                    <li>0.4 = 31-40,</li>
                    <li>0.5 = 41-50,</li>
                    <li>0.6 = 51-60,</li>
                    <li>0.7 = 61-70,</li>
                    <li>0.8 = 71-80,</li>
                    <li>0.9 = 81-90,</li>
                    <li>1.0 = 91-100</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="10">
                  <Accordion.Header>Mississippi Alluvial Valley Forest Birds – Reforestation</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Prioritizes new areas for reforestation as an index within the MAV based on benefits to forest breeding birds that need large interior cores of bottomland hardwood habitat.
                    <br/>
                    <b>Scale: </b>
                    <li>0 = no data,</li>
                    <li>0.1 = 1-10,</li>
                    <li>0.2 = 11-20,</li>
                    <li>0.3 = 21-30,</li>
                    <li>0.4 = 31-40,</li>
                    <li>0.5 = 41-50,</li>
                    <li>0.6 = 51-60,</li>
                    <li>0.7 = 61-70,</li>
                    <li>0.8 = 71-80,</li>
                    <li>0.9 = 81-90,</li>
                    <li>1.0 = 91-100</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="11">
                  <Accordion.Header>Natural Landcover Floodplains</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Percent natural landcover in the estimated floodplain, by catchment.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.25 = 0-60% natural landcover</li>
                    <li>0.5 = 61-70% natural landcover</li>
                    <li>0.75 = 71-80% natural landcover</li>
                    <li>1.0 = 80-100% natural landcover</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="12">
                  <Accordion.Header>Permeable Surface</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Percent non-impervious cover by catchment.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.5 = 0-70% catchment permeable</li>
                    <li>0.7 = 70-90% catchment permeable</li>
                    <li>0.9 = 90-95% catchment permeable</li>
                    <li>1.0 = 95-100% catchment permeable</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="13">
                  <Accordion.Header>Playas</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Identifies healthy playas and clusters of nearby playas in the western Great Plains (OK, TX).
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.5 = Other Playa</li>
                    <li>1.0 = Healthy Playa</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="14">
                  <Accordion.Header>Resilient Coastal Sites</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index depicting the ability of terrestrial sites to continue supporting biodiversity and ecosystem function in the face of climate change.
                    <br/>
                    <b>Scale: </b> 0 = Everything else, includes terrestrial
                    <li>0.1 = Least resilient</li>
                    <li>0.25 = Less resilient</li>
                    <li>0.4 = Slightly less resilient</li>
                    <li>0.55 = Average</li>
                    <li>0.7 = Slightly more resilient</li>
                    <li>0.85 = More resilient</li>
                    <li>1.0 = Most resilient</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="15">
                  <Accordion.Header>Resilient Terrestrial Sites</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index depicting the ability of terrestrial sites to continue supporting biodiversity and ecosystem function in the face of climate change.
                    <br/>
                    <b>Scale: </b> 0 = Developed and least resilient
                    <li>0.25 = Less resilient</li>
                    <li>0.4 = Slightly less resilient</li>
                    <li>0.55 = Average</li>
                    <li>0.7 = Slightly more resilient</li>
                    <li>0.85 = More resilient</li>
                    <li>1.0 = Most resilient</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="16">
                  <Accordion.Header>South Atlantic Amphibian & Reptile Areas</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Priority Amphibian and Reptile Conservation Areas in the South Atlantic.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>1.0 = Good areas</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="17">
                  <Accordion.Header>South Atlantic Beach Birds</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of habitat suitability for four shorebird species in the South Atlantic.
                    <br/>
                    <b>Scale: </b>
                    <li>0.2 = 0-20%,</li>
                    <li>0.4 = 21-40%,</li>
                    <li>0.6 = 41-60%,</li>
                    <li>0.8 = 61-80%,</li>
                    <li>1.0 = 81-100%</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="18">
                  <Accordion.Header>South Atlantic Forest Birds</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of habitat suitability for twelve upland hardwood and forested wetland bird species in the South Atlantic.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Less potential</li>
                    <li>0.5 = Very small patches</li>
                    <li>1.0 = Very large patches</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="19">
                  <Accordion.Header>South Atlantic Maritime Forest</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Current maritime forest in the South Atlantic.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>1.0 = Maritime Forest</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="20">
                  <Accordion.Header>West Coastal Plain Ouachitas Forested Wetlands</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of marsh stability based on the ratio of open water to plants.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>0.5 = Intermediate number of cells in hex are stable coastal wetlands</li>
                    <li>1.0 = Stable coastal wetlands</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="21">
                  <Accordion.Header>West Coastal Plain Ouachitas Open Pine Bird</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of areas with existing pine trees that, if managed for open condition, could support a population of three umbrella bird species in the West Gulf Coastal Plain/Ouachitas Bird Conservation Region.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Pine patch / cluster too small OR not upland pine</li>
                    <li>0.5 = Cluster large enough to support populations of 1 umbrella species</li>
                    <li>0.6 = Cluster large enough to support populations of 2 umbrella species</li>
                    <li>0.7 = Cluster large enough to support populations of 3 umbrella species</li>
                    <li>0.8 = Patch large enough to support populations of 1 umbrella species</li>
                    <li>0.9 = Patch large enough to support populations of 2 umbrella species</li>
                    <li>1.0 = Patch large enough to support populations of 3 umbrella species</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="22">
                  <Accordion.Header>West Gulf Coastal Plain Forested Wetland Birds</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of habitat suitability for five forested wetland bird species in the West Gulf Coastal Plain/ Ouachitas Bird Conservation Region.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.2 = Low (1-20)</li>
                    <li>0.4 = Med-Low (21-40)</li>
                    <li>0.6 = Medium (41-60)</li>
                    <li>0.8 = Med-High (61-80)</li>
                    <li>1.0 = High (80~)</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="23">
                  <Accordion.Header>West Gulf Coast Mottled Duck Nesting</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Depicts marshes and grasslands along the Western Gulf Coast that are important for mottled duck nesting (% suitability).
                    <br/>
                    <b>Scale: </b>
                    <li>0.1 = 1-10%,</li>
                    <li>0.2 = 11-20%,</li>
                    <li>0.3 = 21-30%,</li>
                    <li>0.4 = 31-40%,</li>
                    <li>0.5 = 41-50%,</li>
                    <li>0.6 = 51-60%,</li>
                    <li>0.7 = 61-70%,</li>
                    <li>0.8 = 71-80%,</li>
                    <li>0.9 = 81-90%,</li>
                    <li>1.0 = 91-100%</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="24">
                  <Accordion.Header>West Virginia Imperiled Aquatic Species</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Number of globally imperiled, threatened, or endangered aquatic species by watershed in the state of West Virginia.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = no imperiled aquatic species</li>
                    <li>0.5 = 1-2 imperiled aquatic species</li>
                    <li>0.75 = 3 imperiled aquatic species</li>
                    <li>1.0 = 4 or more imperiled aquatic species</li>
                  </Accordion.Body>
                </Accordion.Item>
                <h4>Function Indicators</h4>
                <Accordion.Item eventKey="25">
                  <Accordion.Header>Equitable Access to Potential Parks</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Prioritizes places to create new parks to fill gaps in access to green space within socially vulnerable communities.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.5 = Moderate</li>
                    <li>0.75 = High</li>
                    <li>1.0 = Very high</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="26">
                  <Accordion.Header>Greenways and Trails</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Prioritizes places to create new parks to fill gaps in access to green space within socially vulnerable communities.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.25 = Sidewalk or other path</li>
                    <li>0.5 = Developed and connected for 0 to 1.9km</li>
                    <li>0.75 = Partly natural and connected for 1.9 to 5km</li>
                    <li>1.0 = Mostly natural and connected, or partly natural and connected ≥5 km, or developed and connected ≥5 km</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="27">
                  <Accordion.Header>South Atlantic Low-Urban Historic Landscapes</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of sites on the National Register of Historic Places surrounded by limited urban development within the South Atlantic (FL, GA, NC, VA, SC).
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Not historic</li>
                    <li>0.5 = Historic, high-urban buffer</li>
                    <li>1.0 = Historic, low-urban buffer</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="28">
                  <Accordion.Header>Urban Park Size</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Measures the size of parks larger than 5 acres in the urban environment.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.25 = 5-10 acres</li>
                    <li>0.5 = 11-30 acres</li>
                    <li>0.75 = 31-50 acres</li>
                    <li>1.0 = ≥50 acres</li>
                  </Accordion.Body>
                </Accordion.Item>
                <h4>Connectivity Indicators</h4>
                <Accordion.Item eventKey="29">
                  <Accordion.Header>Gulf Migratory Fish Connectivity</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index capturing how far upstream migratory fish species in the Gulf of Mexico have been observed.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>1.0 = Presence of Alabama shad, American shad, striped bass, or Gulf sturgeon</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="30">
                  <Accordion.Header>Intact Habitat Cores</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Represents the size of large, unfragmented patches of natural habitat. It identifies minimally disturbed natural areas at least 100 acres in size and greater than 200 meters wide.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Not a core</li>
                    <li>0.75 = Small core (100–1,000 acres)</li>
                    <li>1.0 = Large core (≥1,000 acres)</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="31">
                  <Accordion.Header>Network Complexity</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index depicting the number of stream size classes in a river network not separated by dams or waterfalls.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>0.25 = 1 connected stream class</li>
                    <li>0.5 = 2 connected stream classes</li>
                    <li>0.75 = 3 connected stream classes</li>
                    <li>1.0 = ≥3 connected stream classes</li>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Row>
        </Col>
      )}
    </div>
  );
};

export default StochasticReport;
