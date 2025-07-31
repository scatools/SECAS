import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { Accordion, Button, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Switch from "react-switch";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, LinearScale, CategoryScale, RadialLinearScale, Tooltip } from 'chart.js';
import { Chart, Bar, Line } from "react-chartjs-2";
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { BiCheckCircle, BiUpArrow, BiSolidUpArrow } from "react-icons/bi";
import { Progress } from 'rsuite';
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
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale, RadialLinearScale, Tooltip);

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
    aefih: "No Action",
    amfih: "No Action",
    amrpa: "No Action",
    cshcn: "No Action",
    ecopb: "No Action",
    eqapk: "No Action",
    estcc: "No Action",
    firef: "No Action",
    gmgfc: "No Action",
    gppgr: "No Action",
    grntr: "No Action",
    grsav: "No Action",
    ihabc: "No Action",
    impas: "No Action",
    isegr: "No Action",
    lscdn: "No Action",
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
    samfs: "No Action",
    scwet: "No Action",
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
    "Atlantic Estuarine Fish Habitat": "aefih",
    "Atlantic Migratory Fish Habitat": "amfih",
    "Amphibian & Reptile Areas": "amrpa",
    "Coastal Shoreline Condition": "cshcn",
    "East Gulf Coastal Plain Open Pine Birds": "ecopb",
    "Equitable Access to Potential Parks": "eqapk",
    "Estuarine Coastal Condition": "estcc",
    "Fire Frequency": "firef",
    "Great Plains Perennial Grass": "gppgr",
    "Grasslands and Savannas": "grsav",
    "Imperiled Aquatic Species": "impas",
    "Interior Southeast Grasslands": "isegr",
    "Landscape Condition": "lscdn",
    "MAV Forest Birds Protection": "mavbp",
    "MAV Forest Birds Restoration": "mavbr",
    "Natural Landcover Floodplains": "nlcfp",
    "Permeable Surface": "persu",
    "Playas": "playa",
    "Resilient Coastal Sites": "rescs",
    "Resilient Terrestrial Sites": "rests",
    "South Atlantic Beach Birds": "safbb",
    "South Atlantic Forest Birds": "saffb",
    "South Atlantic Maritime Forest": "samfs",
    "Stable Coastal Wetlands": "scwet",
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
    "Atlantic Estuarine Fish Habitat",
    "Atlantic Migratory Fish Habitat",
    "Amphibian & Reptile Areas",
    "Coastal Shoreline Condition",
    "East Gulf Coastal Plain Open Pine Birds",
    "Equitable Access to Potential Parks",
    "Estuarine Coastal Condition",
    "Fire Frequency",
    "Great Plains Perennial Grass",
    "Grasslands and Savannas",
    "Imperiled Aquatic Species",
    "Interior Southeast Grasslands",
    "Landscape Condition",
    "MAV Forest Birds Protection",
    "MAV Forest Birds Restoration",
    "Natural Landcover Floodplains",
    "Permeable Surface",
    "Playas",
    "Resilient Coastal Sites",
    "Resilient Terrestrial Sites",
    "South Atlantic Beach Birds",
    "South Atlantic Forest Birds",
    "South Atlantic Maritime Forest",
    "Stable Coastal Wetlands",
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

  const indicatorBins = {
    aefih: [0, 0.25, 0.5, 1],
    amfih: [0, 0.25, 0.5, 1],
    amrpa: [0, 1],
    cshcn: [0, 0.25, 0.5, 1],
    ecopb: [0, 0.2, 0.4, 0.6, 0.8, 1],
    eqapk: [0, 0.5, 0.75, 1],
    estcc: [0, 0.25, 0.5, 0.75, 1],
    firef: [0, 0.5, 1],
    gmgfc: [0, 1],
    gppgr: [0.2, 0.4, 0.6, 0.8, 1],
    grntr: [0, 0.25, 0.5, 0.75, 1],
    grsav: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
    ihabc: [0, 0.75, 1],
    impas: [0, 0.5, 0.75, 1],
    isegr: [0, 0.25, 0.5, 0.75, 1],
    lscdn: [0.1, 0.2, 0.4, 0.6, 0.8, 1],
    mavbp: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    mavbr: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    netcx: [0, 0.25, 0.5, 0.75, 1],
    nlcfp: [0, 0.25, 0.5, 0.75, 1],
    persu: [0.5, 0.7, 0.9, 1],
    playa: [0, 0.5, 1],
    rescs: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    rests: [0, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    safbb: [0, 0.2, 0.4, 0.6, 0.8, 1],
    saffb: [0, 0.5, 1],
    saluh: [0, 0.5, 1],
    samfs: [0, 1],
    scwet: [0, 0.5, 1],
    urbps: [0, 0.25, 0.5, 0.75, 1],
    wcofw: [0, 0.2, 0.4, 0.6, 0.8, 1],
    wcopb: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    wgcmd: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    overall: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  };

  const indicatorBinLabels = {
    aefih: ["Degraded areas of opportunity", "Restoration opportunity areas", "Excellent Fish Habitat"],
    amfih: ["Degraded areas of opportunity", "Restoration opportunity areas", "Excellent Fish Habitat"],
    amrpa: ["None or below threshold", "Good areas"],
    cshcn: ["Armored", "Partially armored", "Partially armored and harder to develop", "Natural or natural and harder to develop"],
    ecopb: ["Low", "Medium-Low", "Medium", "Medium-High", "High"],
    eqapk: ["Moderate", "High", "Very high"],
    estcc: ["Poor", "Fair to poor", "Fair", "Good to fair", "Good"],
    firef: ["Not burned or row crop", "Burned 1 time (~burned only once in 8 years)", "Burned 2 or more times (~burned every 4 years or more frequently)"],
    gmgfc: ["Everything else, includes terrestrial", "Presence of Alabama shad, American shad, striped bass, or Gulf sturgeon"],
    gppgr: ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
    grntr: ["Everything else, includes terrestrial", "Sidewalk or other path", "Developed and connected for <1.9km", "Partly natural and connected for 1.9 to 5km", "Mostly natural and connected, or partly natural and connected ≥5 km, or developed and connected ≥5 km"],
    grsav: ["Not identified as grassland/savannas", "Historic grassland/savanna", "Potential grassland/savanna in more altered landscape", "Potential grassland/savanna in mostly natural landscape", "Pollinator buffer around known or likely grassland/savanna", "Likely grassland/savanna ≤10 acres", "Likely grassland/savanna ≥10 acres", "Known grassland/savanna"],
    ihabc: ["Not a core", "Small core (>100–1,000 acres)", "Large core (>1,000 acres)"],
    impas: ["No imperiled aquatic species", "1-2 imperiled aquatic species", "3 imperiled aquatic species", "4 or more imperiled aquatic species"],
    isegr: ["Grassland geology but grassland less likely", "Potentially compatible management outside of grassland geology (undeveloped powerline right-of-way or perennial forbs and grasses)", "Potentially compatible management within grassland geology (undeveloped powerline right-of-way or perennial forbs and grasses)", "Known grassland buffer", "Known grassland"],
    lscdn: ["Heavily altered landscape", "Altered landscape", "Partly natural landscape", "Mostly natural landscape", "Natural landscape", "Very natural landscape"],
    mavbp: ["No data", "1-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
    mavbr: ["No data", "1-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
    netcx: ["Everything else, includes terrestrial", "1 connected stream class", "2 connected stream classes", "3 connected stream classes", ">3 connected stream classes"],
    nlcfp: ["No natural landcover", "≤60% natural landcover", "61-70% natural landcover", "71-80% natural landcover", ">80% natural landcover"],
    persu: ["<70% catchment permeable", "70-90% catchment permeable", "90-95% catchment permeable", ">95% catchment permeable"],
    playa: ["Everything else, includes terrestrial", "Other Playa", "Healthy Playa"],
    rescs: ["Least resilient", "Less resilient", "Slightly less resilient", "Average", "Slightly more resilient", "More resilient", "Most resilient"],
    rests: ["Developed and least resilient", "Less resilient", "Slightly less resilient", "Average", "Slightly more resilient", "More resilient", "Most resilient"],
    safbb: ["0%", "0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
    saffb: ["Less potential", "Very small patches", "Very large patches"],
    saluh: ["Not historic", "Historic, high-urban buffer", "Historic, low-urban buffer"],
    samfs: ["None or below threshold", "Maritime Forest"],
    scwet: ["None or below threshold", "Intermediate number of cells in hex are stable coastal wetlands", "Stable coastal wetlands"],
    urbps: ["<5 acres", "5-10 acres", "11-30 acres", "31-50 acres", ">50 acres"],
    wcofw: ["Everything else, includes terrestrial", "Low (1-20)", "Med-Low (21-40)", "Medium (41-60)", "Med-High (61-80)", "High (>80)"],
    wcopb: ["Pine patch / cluster too small OR not upland pine", "Cluster large enough to support populations of 1 umbrella species", "Cluster large enough to support populations of 2 umbrella species", "Cluster large enough to support populations of 3 umbrella species", "Patch large enough to support populations of 1 umbrella species", "Patch large enough to support populations of 2 umbrella species", "Patch large enough to support populations of 3 umbrella species"],
    wgcmd: ["0%", "1-10%", "11-20%", "21-30%", "31-40%", "41-50%", "51-60%", "61-70%", "71-80%", "81-90%", "91-100%"],
    overall: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  };

  const boxplotOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Goal Scores"
        }
      },
      x: {
        title: {
          display: true,
          text: "Conservation Goals"
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      }
    }  
  };

  let getScoreLabel = (score, indicator) => {
    const scoreBin = indicatorBins[indicator].findIndex(bin => bin >= score);
    if (indicator !== "overall") {
      return <span>{indicatorBinLabels[indicator][scoreBin]}</span>;
    }
  };

  let calculateImpact = (beforeScore, afterScore, indicator) => {
    const beforeScoreBin = indicatorBins[indicator].findIndex(bin => bin >= beforeScore);
    const afterScoreBin = indicatorBins[indicator].findIndex(bin => bin >= afterScore);
    const arrowNumber = afterScoreBin - beforeScoreBin;
    return (
      <td>
        {afterScore <= beforeScore ?
          "--" :
          arrowNumber === 0 ? 
            (<BiUpArrow color="green" />) :
            (
              Array.from(
                {length: arrowNumber}).map((index) => <BiSolidUpArrow key={index} color="green" />
              )
            )
        }
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
            aefih: hex.aefih_mi,
            amfih: hex.amfih_mi,
            amrpa: hex.amrpa_mi,
            cshcn: hex.cshcn_mi,
            ecopb: hex.ecopb_mi,
            eqapk: hex.eqapk_mi,
            estcc: hex.estcc_mi,
            firef: hex.firef_mi,
            gmgfc: hex.gmgfc_mi,
            gppgr: hex.gppgr_mi,
            grntr: hex.grntr_mi,
            grsav: hex.grsav_mi,
            ihabc: hex.ihabc_mi,
            impas: hex.impas_mi,
            isegr: hex.isegr_mi,
            lscdn: hex.lscdn_mi,
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
            samfs: hex.samfs_mi,
            scwet: hex.scwet_mi,
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
            aefih: hex.aefih_mi,
            amfih: hex.amfih_mi,
            amrpa: hex.amrpa_mi,
            cshcn: hex.cshcn_mi,
            ecopb: hex.ecopb_mi,
            eqapk: hex.eqapk_mi,
            estcc: hex.estcc_mi,
            firef: hex.firef_mi,
            gmgfc: hex.gmgfc_mi,
            gppgr: hex.gppgr_mi,
            grntr: hex.grntr_mi,
            grsav: hex.grsav_mi,
            ihabc: hex.ihabc_mi,
            impas: hex.impas_mi,
            isegr: hex.isegr_mi,
            lscdn: hex.lscdn_mi,
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
            samfs: hex.samfs_mi,
            scwet: hex.scwet_mi,
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

  window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };

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
          <Row style={{minHeight: "450px"}}>
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
                  <span style={{ color: "green" }}>{actionScores.currentScore}</span>
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
                  <h5>Selected Indicators</h5>
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
                    <b style={{ color: "green" }}> increase by {Math.round(100*actionScores.currentScore/scores.currentScore - 100)}% </b>
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
          <Row style={{minHeight: "450px"}}>
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
              <Table striped bordered size="md" variant="light" style={{textAlign: "center"}}>
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
                  {scores.amrpa > 0  ?
                    <tr>
                      <td>Amphibian & Reptile Areas</td>
                      <td style={{ color: "blue" }}>
                        {scores.amrpa}
                        <br/>
                        {getScoreLabel(scores.amrpa, "amrpa")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.amrpa*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.amrpa*scores.futurePenalty, "amrpa")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.amrpa}
                        <br/>
                        {getScoreLabel(actionScores.amrpa, "amrpa")}
                      </td>
                      {calculateImpact(scores.amrpa, actionScores.amrpa, "amrpa")}
                    </tr>
                    :
                    <tr>
                      <td>Amphibian & Reptile Areas</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.aefih > 0  ?
                    <tr>
                      <td>Atlantic Estuarine Fish Habitat</td>
                      <td style={{ color: "blue" }}>
                        {scores.aefih}
                        <br/>
                        {getScoreLabel(scores.aefih, "aefih")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.aefih*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.aefih*scores.futurePenalty, "aefih")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.aefih}
                        <br/>
                        {getScoreLabel(actionScores.aefih, "aefih")}
                      </td>
                      {calculateImpact(scores.aefih, actionScores.aefih, "aefih")}
                    </tr>
                    :
                    <tr>
                      <td>Atlantic Estuarine Fish Habitat</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.amfih > 0  ?
                    <tr>
                      <td>Atlantic Estuarine Fish Habitat</td>
                      <td style={{ color: "blue" }}>
                        {scores.amfih}
                        <br/>
                        {getScoreLabel(scores.amfih, "amfih")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.amfih*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.amfih*scores.futurePenalty, "amfih")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.amfih}
                        <br/>
                        {getScoreLabel(actionScores.amfih, "amfih")}
                      </td>
                      {calculateImpact(scores.amfih, actionScores.amfih, "amfih")}
                    </tr>
                    :
                    <tr>
                      <td>Atlantic Estuarine Fish Habitat</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.cshcn > 0  ?
                    <tr>
                      <td>Coastal Shoreline Condition</td>
                      <td style={{ color: "blue" }}>
                        {scores.cshcn}
                        <br/>
                        {getScoreLabel(scores.cshcn, "cshcn")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.cshcn*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.cshcn*scores.futurePenalty, "cshcn")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.cshcn}
                        <br/>
                        {getScoreLabel(actionScores.cshcn, "cshcn")}
                      </td>
                      {calculateImpact(scores.cshcn, actionScores.cshcn, "cshcn")}
                    </tr>
                    :
                    <tr>
                      <td>Coastal Shoreline Condition</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.ecopb > 0  ?
                    <tr>
                      <td>East Gulf Coastal Plain Open Pine Birds</td>
                      <td style={{ color: "blue" }}>
                        {scores.ecopb}
                        <br/>
                        {getScoreLabel(scores.ecopb, "ecopb")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.ecopb*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.ecopb*scores.futurePenalty, "ecopb")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.ecopb}
                        <br/>
                        {getScoreLabel(actionScores.ecopb, "ecopb")}
                      </td>
                      {calculateImpact(scores.ecopb, actionScores.ecopb, "ecopb")}
                    </tr>
                    :
                    <tr>
                      <td>East Gulf Coastal Plain Open Pine Birds</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.estcc > 0  ?
                    <tr>
                      <td>Estuarine Coastal Condition</td>
                      <td style={{ color: "blue" }}>
                        {scores.estcc}
                        <br/>
                        {getScoreLabel(scores.estcc, "estcc")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.estcc*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.estcc*scores.futurePenalty, "estcc")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.estcc}
                        <br/>
                        {getScoreLabel(actionScores.estcc, "estcc")}
                      </td>
                      {calculateImpact(scores.estcc, actionScores.estcc, "estcc")}
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
                      <td style={{ color: "blue" }}>
                        {scores.firef}
                        <br/>
                        {getScoreLabel(scores.firef, "firef")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.firef*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.firef*scores.futurePenalty, "firef")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.firef}
                        <br/>
                        {getScoreLabel(actionScores.firef, "firef")}
                      </td>
                      {calculateImpact(scores.firef, actionScores.firef, "firef")}
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
                  {scores.grsav > 0  ?
                    <tr>
                      <td>Grasslands and Savannas</td>
                      <td style={{ color: "blue" }}>
                        {scores.grsav}
                        <br/>
                        {getScoreLabel(scores.grsav, "grsav")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.grsav*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.grsav*scores.futurePenalty, "grsav")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.grsav}
                        <br/>
                        {getScoreLabel(actionScores.grsav, "grsav")}
                      </td>
                      {calculateImpact(scores.grsav, actionScores.grsav, "grsav")}
                    </tr>
                    :
                    <tr>
                      <td>Grasslands and Savannas</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.impas > 0  ?
                    <tr>
                      <td>Imperiled Aquatic Species</td>
                      <td style={{ color: "blue" }}>
                        {scores.impas}
                        <br/>
                        {getScoreLabel(scores.impas, "impas")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.impas*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.impas*scores.futurePenalty, "impas")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.impas}
                        <br/>
                        {getScoreLabel(actionScores.impas, "impas")}
                      </td>
                      {calculateImpact(scores.impas, actionScores.impas, "impas")}
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
                  {scores.lscdn > 0  ?
                    <tr>
                      <td>Landscape Condition</td>
                      <td style={{ color: "blue" }}>
                        {scores.lscdn}
                        <br/>
                        {getScoreLabel(scores.lscdn, "lscdn")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.lscdn*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.lscdn*scores.futurePenalty, "lscdn")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.lscdn}
                        <br/>
                        {getScoreLabel(actionScores.lscdn, "lscdn")}
                      </td>
                      {calculateImpact(scores.lscdn, actionScores.lscdn, "lscdn")}
                    </tr>
                    :
                    <tr>
                      <td>Landscape Condition</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.mavbp > 0  ?
                    <tr>
                      <td>MAV Forest Birds Protection</td>
                      <td style={{ color: "blue" }}>
                        {scores.mavbp}
                        <br/>
                        {getScoreLabel(scores.mavbp, "mavbp")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.mavbp*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.mavbp*scores.futurePenalty, "mavbp")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.mavbp}
                        <br/>
                        {getScoreLabel(actionScores.mavbp, "mavbp")}
                      </td>
                      {calculateImpact(scores.mavbp, actionScores.mavbp, "mavbp")}
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
                      <td style={{ color: "blue" }}>
                        {scores.mavbr}
                        <br/>
                        {getScoreLabel(scores.mavbr, "mavbr")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.mavbr*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.mavbr*scores.futurePenalty, "mavbr")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.mavbr}
                        <br/>
                        {getScoreLabel(actionScores.mavbr, "mavbr")}
                      </td>
                      {calculateImpact(scores.mavbr, actionScores.mavbr, "mavbr")}
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
                      <td style={{ color: "blue" }}>
                        {scores.nlcfp}
                        <br/>
                        {getScoreLabel(scores.nlcfp, "nlcfp")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.nlcfp*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.nlcfp*scores.futurePenalty, "nlcfp")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.nlcfp}
                        <br/>
                        {getScoreLabel(actionScores.nlcfp, "nlcfp")}
                      </td>
                      {calculateImpact(scores.nlcfp, actionScores.nlcfp, "nlcfp")}
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
                      <td style={{ color: "blue" }}>
                        {scores.persu}
                        <br/>
                        {getScoreLabel(scores.persu, "persu")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.persu*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.persu*scores.futurePenalty, "persu")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.persu}
                        <br/>
                        {getScoreLabel(actionScores.persu, "persu")}
                      </td>
                      {calculateImpact(scores.persu, actionScores.persu, "persu")}
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
                      <td style={{ color: "blue" }}>
                        {scores.playa}
                        <br/>
                        {getScoreLabel(scores.playa, "playa")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.playa*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.playa*scores.futurePenalty, "playa")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.playa}
                        <br/>
                        {getScoreLabel(actionScores.playa, "playa")}
                      </td>
                      {calculateImpact(scores.playa, actionScores.playa, "playa")}
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
                      <td style={{ color: "blue" }}>
                        {scores.rescs}
                        <br/>
                        {getScoreLabel(scores.rescs, "rescs")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.rescs*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.rescs*scores.futurePenalty, "rescs")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.rescs}
                        <br/>
                        {getScoreLabel(actionScores.rescs, "rescs")}
                      </td>
                      {calculateImpact(scores.rescs, actionScores.rescs, "rescs")}
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
                      <td style={{ color: "blue" }}>
                        {scores.rests}
                        <br/>
                        {getScoreLabel(scores.rests, "rests")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.rests*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.rests*scores.futurePenalty, "rests")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.rests}
                        <br/>
                        {getScoreLabel(actionScores.rests, "rests")}
                      </td>
                      {calculateImpact(scores.rests, actionScores.rests, "rests")}
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
                      <td style={{ color: "blue" }}>
                        {scores.safbb}
                        <br/>
                        {getScoreLabel(scores.safbb, "safbb")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.safbb*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.safbb*scores.futurePenalty, "safbb")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.safbb}
                        <br/>
                        {getScoreLabel(actionScores.safbb, "safbb")}
                      </td>
                      {calculateImpact(scores.safbb, actionScores.safbb, "safbb")}
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
                      <td style={{ color: "blue" }}>
                        {scores.saffb}
                        <br/>
                        {getScoreLabel(scores.saffb, "saffb")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.saffb*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.saffb*scores.futurePenalty, "saffb")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.saffb}
                        <br/>
                        {getScoreLabel(actionScores.saffb, "saffb")}
                      </td>
                      {calculateImpact(scores.saffb, actionScores.saffb, "saffb")}
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
                  {scores.safbb > 0  ?
                    <tr>
                      <td>South Atlantic Beach Birds</td>
                      <td style={{ color: "blue" }}>
                        {scores.safbb}
                        <br/>
                        {getScoreLabel(scores.safbb, "safbb")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.safbb*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.safbb*scores.futurePenalty, "safbb")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.safbb}
                        <br/>
                        {getScoreLabel(actionScores.safbb, "safbb")}
                      </td>
                      {calculateImpact(scores.safbb, actionScores.safbb, "safbb")}
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
                  {scores.samfs > 0  ?
                    <tr>
                      <td>South Atlantic Maritime Forest</td>
                      <td style={{ color: "blue" }}>
                        {scores.samfs}
                        <br/>
                        {getScoreLabel(scores.samfs, "samfs")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.samfs*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.samfs*scores.futurePenalty, "samfs")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.samfs}
                        <br/>
                        {getScoreLabel(actionScores.samfs, "samfs")}
                      </td>
                      {calculateImpact(scores.samfs, actionScores.samfs, "samfs")}
                    </tr>
                    :
                    <tr>
                      <td>South Atlantic Maritime Forest</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.scwet > 0  ?
                    <tr>
                      <td>Stable Coastal Wetlands</td>
                      <td style={{ color: "blue" }}>
                        {scores.scwet}
                        <br/>
                        {getScoreLabel(scores.scwet, "scwet")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.scwet*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.scwet*scores.futurePenalty, "scwet")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.scwet}
                        <br/>
                        {getScoreLabel(actionScores.scwet, "scwet")}
                      </td>
                      {calculateImpact(scores.scwet, actionScores.scwet, "scwet")}
                    </tr>
                    :
                    <tr>
                      <td>Stable Coastal Wetlands</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.wcofw > 0  ?
                    <tr>
                      <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                      <td style={{ color: "blue" }}>
                        {scores.wcofw}
                        <br/>
                        {getScoreLabel(scores.wcofw, "wcofw")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.wcofw*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.wcofw*scores.futurePenalty, "wcofw")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.wcofw}
                        <br/>
                        {getScoreLabel(actionScores.wcofw, "wcofw")}
                      </td>
                      {calculateImpact(scores.wcofw, actionScores.wcofw, "wcofw")}
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
                      <td style={{ color: "blue" }}>
                        {scores.wcopb}
                        <br/>
                        {getScoreLabel(scores.wcopb, "wcopb")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.wcopb*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.wcopb*scores.futurePenalty, "wcopb")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.wcopb}
                        <br/>
                        {getScoreLabel(actionScores.wcopb, "wcopb")}
                      </td>
                      {calculateImpact(scores.wcopb, actionScores.wcopb, "wcopb")}
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
                      <td style={{ color: "blue" }}>
                        {scores.wgcmd}
                        <br/>
                        {getScoreLabel(scores.wgcmd, "wgcmd")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.wgcmd*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.wgcmd*scores.futurePenalty, "wgcmd")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.wgcmd}
                        <br/>
                        {getScoreLabel(actionScores.wgcmd, "wgcmd")}
                      </td>
                      {calculateImpact(scores.wgcmd, actionScores.wgcmd, "wgcmd")}
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
                  {scores.eqapk > 0  ?
                    <tr>
                      <td>Equitable Access to Potential Parks</td>
                      <td style={{ color: "blue" }}>
                        {scores.eqapk}
                        <br/>
                        {getScoreLabel(scores.eqapk, "eqapk")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.eqapk*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.eqapk*scores.futurePenalty, "eqapk")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.eqapk}
                        <br/>
                        {getScoreLabel(actionScores.eqapk, "eqapk")}
                      </td>
                      {calculateImpact(scores.eqapk, actionScores.eqapk, "eqapk")}
                    </tr>
                    :
                    <tr>
                      <td>Equitable Access to Potential Parks</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  }
                  {scores.grntr > 0  ?
                    <tr>
                      <td>Greenways Trails</td>
                      <td style={{ color: "blue" }}>
                        {scores.grntr}
                        <br/>
                        {getScoreLabel(scores.grntr, "grntr")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.grntr*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.grntr*scores.futurePenalty, "grntr")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.grntr}
                        <br/>
                        {getScoreLabel(actionScores.grntr, "grntr")}
                      </td>
                      {calculateImpact(scores.grntr, actionScores.grntr, "grntr")}
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
                      <td style={{ color: "blue" }}>
                        {scores.saluh}
                        <br/>
                        {getScoreLabel(scores.saluh, "saluh")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.saluh*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.saluh*scores.futurePenalty, "saluh")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.saluh}
                        <br/>
                        {getScoreLabel(actionScores.saluh, "saluh")}
                      </td>
                      {calculateImpact(scores.saluh, actionScores.saluh, "saluh")}
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
                      <td style={{ color: "blue" }}>
                        {scores.urbps}
                        <br/>
                        {getScoreLabel(scores.urbps, "urbps")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.urbps*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.urbps*scores.futurePenalty, "urbps")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.urbps}
                        <br/>
                        {getScoreLabel(actionScores.urbps, "urbps")}
                      </td>
                      {calculateImpact(scores.urbps, actionScores.urbps, "urbps")}
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
                      <td style={{ color: "blue" }}>
                        {scores.gmgfc}
                        <br/>
                        {getScoreLabel(scores.gmgfc, "gmgfc")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.gmgfc*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.gmgfc*scores.futurePenalty, "gmgfc")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.gmgfc}
                        <br/>
                        {getScoreLabel(actionScores.gmgfc, "gmgfc")}
                      </td>
                      {calculateImpact(scores.gmgfc, actionScores.gmgfc, "gmgfc")}
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
                      <td style={{ color: "blue" }}>
                        {scores.ihabc}
                        <br/>
                        {getScoreLabel(scores.ihabc, "ihabc")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.ihabc*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.ihabc*scores.futurePenalty, "ihabc")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.ihabc}
                        <br/>
                        {getScoreLabel(actionScores.ihabc, "ihabc")}
                      </td>
                      {calculateImpact(scores.ihabc, actionScores.ihabc, "ihabc")}
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
                      <td style={{ color: "blue" }}>
                        {scores.netcx}
                        <br/>
                        {getScoreLabel(scores.netcx, "netcx")}
                      </td>
                      <td style={{ color: "red" }}>
                        {(scores.netcx*scores.futurePenalty).toFixed(2)}
                        <br/>
                        {getScoreLabel(scores.netcx*scores.futurePenalty, "netcx")}
                      </td>
                      <td style={{ color: "green" }}>
                        {actionScores.netcx}
                        <br/>
                        {getScoreLabel(actionScores.netcx, "netcx")}
                      </td>
                      {calculateImpact(scores.netcx, actionScores.netcx, "netcx")}
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
                    {calculateImpact(scores.currentScore, actionScores.currentScore, "overall")}
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h4>HFC Goal Score Box Plot</h4>
              <p>The HFC Goal Score Box Plot demonstrates the stochastic results of 1000 simulations that indicate the current condition (Current Score), the deterioration of this area of interest when no action is applied (Future Score (No Action)), as well as the improvement of this area of interest when selected actions are taken (Future Score (With Action)), by the goals of health, function and connectivity. </p>
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
                    },
                    plugins: {
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      }
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
                  <Accordion.Header>Amphibian & Reptile Areas</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Priority Amphibian and Reptile Conservation Areas in the Southeastern U.S.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>1.0 = Good areas</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
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
                <Accordion.Item eventKey="2">
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
                <Accordion.Item eventKey="3">
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
                <Accordion.Item eventKey="4">
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
                <Accordion.Item eventKey="5">
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
                <Accordion.Item eventKey="6">
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
                <Accordion.Item eventKey="7">
                  <Accordion.Header>Grasslands and Savannas</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b>Grasslands and Savannas in the Southeastern U.S., including known locations, likely locations managed for biodiversity, and surrounding pollinator buffers. 
                    <br/>
                    <b>Scale: </b>
                    <li>0 = Not identified as grassland/savannas</li>
                    <li>0.15 = Historic grassland/savanna</li>
                    <li>0.3 = Potential grassland/savanna in more altered landscape</li>
                    <li>0.45 = Potential grassland/savanna in mostly natural landscape</li>
                    <li>0.6 = Pollinator buffer around known or likely grassland/savanna</li>
                    <li>0.75 = Likely grassland/savanna ≤10 acres</li>
                    <li>0.9 = Likely grassland/savanna ≥10 acres</li>
                    <li>1.0 = Known grassland/savanna</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="8">
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
                <Accordion.Item eventKey="9">
                  <Accordion.Header>Landscape Condition</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index of the degree of natural compared to human-altered areas and their surrounding landscape.
                    <br/>
                    <b>Scale: </b> 
                    <li>0.1 = Heavily altered landscape</li>
                    <li>0.2 = Altered landscape</li>
                    <li>0.4 = Partly natural landscape</li>
                    <li>0.6 = Mostly natural landscape</li>
                    <li>0.8 = Natural landscape</li>
                    <li>1.0 = Very natural landscape</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="10">
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
                <Accordion.Item eventKey="11">
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
                <Accordion.Item eventKey="12">
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
                <Accordion.Item eventKey="13">
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
                <Accordion.Item eventKey="14">
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
                <Accordion.Item eventKey="15">
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
                <Accordion.Item eventKey="16">
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
                <Accordion.Item eventKey="17">
                  <Accordion.Header>South Atlantic Amphibian & Reptile Areas</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Priority Amphibian and Reptile Conservation Areas in the South Atlantic.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>1.0 = Good areas</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="18">
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
                <Accordion.Item eventKey="19">
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
                <Accordion.Item eventKey="20">
                  <Accordion.Header>South Atlantic Maritime Forest</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Current maritime forest in the South Atlantic.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = None or below threshold</li>
                    <li>1.0 = Maritime Forest</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="21">
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
                <Accordion.Item eventKey="22">
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
                <Accordion.Item eventKey="23">
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
                <Accordion.Item eventKey="24">
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
                <Accordion.Item eventKey="25">
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
                <Accordion.Item eventKey="26">
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
                <Accordion.Item eventKey="27">
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
                <Accordion.Item eventKey="28">
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
                <Accordion.Item eventKey="29">
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
                <Accordion.Item eventKey="30">
                  <Accordion.Header>Gulf Migratory Fish Connectivity</Accordion.Header>
                  <Accordion.Body>
                    <b>Definition:</b> Index capturing how far upstream migratory fish species in the Gulf of Mexico have been observed.
                    <br/>
                    <b>Scale: </b> 
                    <li>0 = Everything else, includes terrestrial</li>
                    <li>1.0 = Presence of Alabama shad, American shad, striped bass, or Gulf sturgeon</li>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="31">
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
                <Accordion.Item eventKey="32">
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
