import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Table, Overlay, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { GaugeComponent } from "react-gauge-component";
import Slider from 'rsuite/Slider';
import { getAoiScore } from "../helper/aggregateHex";
import 'rsuite/Slider/styles/index.css';

const FutureWithActionTable = ({ hexData, setActionHexData, actionScores, setActionScores }) => {
  const [actionLevels, setActionLevels] = useState({});
  const [currentLevels, setCurrentLevels] = useState({});
  const [currentScoreList, setCurrentScoreList] = useState([]);
  const [futureScoreList, setFutureScoreList] = useState([]);
  const [showIndicator, setShowIndicator] = useState({});
  const aoiList = Object.values(useSelector((state) => state.aoi));
  const aoi = aoiList[0];
  const scores = getAoiScore(hexData.features);
  const indicators = {
    aefih: [0.25, 0.5, 1],
    amfih: [0.25, 0.5, 1],
    amrpa: [0, 1],
    cshcn: [0, 0.25, 0.5, 1],
    ecopb: [0.2, 0.4, 0.6, 0.8, 1],
    eqapk: [0.5, 0.75, 1],
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
    futv2: [0.25, 0.50, 0.75, 1.0]
  };
  const sliderLabels = {
    aefih: "Better Habitat Condition",
    amfih: "Better Habitat Condition",
    amrpa: "Larger Area",
    cshcn: "Better Condition",
    ecopb: "Higher Diversity",
    eqapk: "Better Access",
    estcc: "Better Condition",
    firef: "More Frequently Burned",
    gmgfc: "Higher Connectivity",
    gppgr: "More Perennial Grass",
    grntr: "More Greenways Trails",
    grsav: "More Grassland",
    ihabc: "Larger Core",
    impas: "More Species",
    isegr: "More Known Grassland",
    lscdn: "Better Condition",
    mavbp: "More Protection Area",
    mavbr: "More Reforestation Area",
    netcx: "More Connected Stream Classes",
    nlcfp: "More Natural Landcover",
    persu: "More Catchment Permeable",
    playa: "More Healthy Playas",
    rescs: "More Resilient",
    rests: "More Resilient",
    safbb: "Higher Habitat Suitability",
    saffb: "Higher Habitat Suitability",
    saluh: "More Urban Historic Sites",
    samfs: "Higher Forest Cover",
    scwet: "More Wetland",
    urbps: "Larger Park Size",
    wcofw: "More Stable Coastal Wetlands",
    wcopb: "Larger Patch Supporting Birds",
    wgcmd: "Higher Habitat Suitability"
  };

  const onActionLevelChange = (e, indicator) => {
    // Must use spread syntax (...) to create a new copy
    let newActionLevels = {...actionLevels};
    newActionLevels[indicator] = e;
    setActionLevels(newActionLevels);
  };
  
  const ActionSlider = (indicator) => {
    return (
      indicator === "persu" || indicator === "saluh" ? 
        <div>Not Adjustable</div>
      :
        <div style={{display: "flex", width: "400px", padding: "20px"}}>
          <div style={{width: "200px"}}>
            <GaugeComponent
              type="semicircle"
              arc={{
                gradient: true,
                width: 0.5,
                padding: 0,
                subArcs: [
                  {limit: 33, color: '#aefff0'},
                  {limit: 66, color: '#00a7e4'},
                  {limit: 100, color: '#5d00d8'}
                ]
              }}
              labels={{
                valueLabel: {
                  fontSize: 30,
                  formatTextValue: (value) => value/100
                },
                tickLabels : {
                  defaultTickValueConfig: {
                    formatTextValue: (value) => value/100,
                    style: {
                      fontSize: 15
                    }
                  },
                  ticks: [
                    {
                      value: Math.round(scores[indicator]*100),
                      valueConfig: {
                        formatTextValue: (value) => '\u25BC',
                        style: {
                          fontSize: 15,
                          fill: "blue",
                          rotate: (scores[indicator]-0.5)*180+"deg",
                          transformOrigin: "0px -10px"
                        }
                      },
                    },
                    {
                      value: Math.round(scores[indicator]*scores.futurePenalty*100),
                      valueConfig: {
                        formatTextValue: (value) => '\u25BC',
                        style: {
                          fontSize: 15,
                          fill: "red",
                          rotate: (scores[indicator]*scores.futurePenalty-0.5)*180+"deg",
                          transformOrigin: "0px -10px"
                        }
                      }
                    }
                  ]
                }
              }}
              value={actionScores[indicator]*100}
              pointer={{type: "arrow", elastic: true, color: "green"}}
            />
          </div>
          <div style={{width: "200px", height: "100px", marginTop: "50px"}}>
            <Slider
              defaultValue={currentLevels[indicator]}
              value={actionLevels[indicator]}
              min={currentLevels[indicator]}
              max={indicators[indicator].length-1}
              step={1}
              graduated
              progress
              renderMark={mark => {
                if (mark === 0) {
                  return "";
                } else if (mark === indicators[indicator].length-1) {
                  return "Max";
                }
              }}
              renderTooltip={tooltip => "+" + tooltip}
              onChange={(e) => {
                onActionLevelChange(e, indicator)
              }}
            />
            <Row>
              <svg height="30px">
                <defs>
                  <marker
                    id="head"
                    orient="auto"
                    markerWidth="3"
                    markerHeight="4"
                    refX="0.1"
                    refY="2"
                  >
                    <path d="M0,1 V3 L2,2 Z" fill="indigo" />
                  </marker>
                  <linearGradient id="gradient" x1="40" y1="210" x2="460" y2="210" gradientUnits="userSpaceOnUse">
                      <stop stop-color="aqua" offset="0%" />
                      <stop stop-color="indigo" offset="20%" />
                  </linearGradient>
                </defs>
                <path
                  id="arrow-line"
                  marker-end="url(#head)"
                  stroke-width="6"
                  fill="none"
                  stroke="url(#gradient)"
                  d="M 0,10,150 10,200"
                />
              </svg>
            </Row>
            <Row>
              <p style={{color: "black", fontSize: "0.7rem", marginTop: "-20px"}}>{sliderLabels[indicator]}</p>
            </Row>
          </div>
        </div>
    );
  };
  
  useEffect(() => {
    if (aoi && aoi.currentHexagons) {
      const medoidScoreList = aoi.currentHexagons.map((hex) => {
        const medoidScores = {
          gid: hex.gid,
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
        };
        return medoidScores;
      });

      setCurrentScoreList(medoidScoreList);
      
      const futureMedoidScoreList = aoi.currentHexagons.map((hex) => {
        const medoidScores = {
          aefih: hex.aefih_mi*hex.futv2_me,
          amfih: hex.amfih_mi*hex.futv2_me,
          amrpa: hex.amrpa_mi*hex.futv2_me,
          cshcn: hex.cshcn_mi*hex.futv2_me,
          ecopb: hex.ecopb_mi*hex.futv2_me,
          eqapk: hex.eqapk_mi*hex.futv2_me,
          estcc: hex.estcc_mi*hex.futv2_me,
          firef: hex.firef_mi*hex.futv2_me,
          gmgfc: hex.gmgfc_mi*hex.futv2_me,
          gppgr: hex.gppgr_mi*hex.futv2_me,
          grntr: hex.grntr_mi*hex.futv2_me,
          grsav: hex.grsav_mi*hex.futv2_me,
          ihabc: hex.ihabc_mi*hex.futv2_me,
          impas: hex.impas_mi*hex.futv2_me,
          isegr: hex.isegr_mi*hex.futv2_me,
          lscdn: hex.lscdn_mi*hex.futv2_me,
          mavbp: hex.mavbp_mi*hex.futv2_me,
          mavbr: hex.mavbr_mi*hex.futv2_me,
          netcx: hex.netcx_mi*hex.futv2_me,
          nlcfp: hex.nlcfp_mi*hex.futv2_me,
          persu: hex.persu_mi*hex.futv2_me,
          playa: hex.playa_mi*hex.futv2_me,
          rescs: hex.rescs_mi*hex.futv2_me,
          rests: hex.rests_mi*hex.futv2_me,
          safbb: hex.safbb_mi*hex.futv2_me,
          saffb: hex.saffb_mi*hex.futv2_me,
          saluh: hex.saluh_mi*hex.futv2_me,
          samfs: hex.samfs_mi*hex.futv2_me,
          scwet: hex.scwet_mi*hex.futv2_me,
          urbps: hex.urbps_mi*hex.futv2_me,
          wcofw: hex.wcofw_mi*hex.futv2_me,
          wcopb: hex.wcopb_mi*hex.futv2_me,
          wgcmd: hex.wgcmd_mi*hex.futv2_me,
        };
        return medoidScores;
      });

      setFutureScoreList(futureMedoidScoreList);

      const count = (array) => {
        const occurrences = array.reduce(function (acc, curr) {
          return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        }, {});
        return occurrences;
      };

      // Only show the indicator if the selected area has data for at least one hexagon inside
      const indicatorData = {
        aefih: count(medoidScoreList.map(item => item.aefih))["-1"] < medoidScoreList.length,
        amfih: count(medoidScoreList.map(item => item.amfih))["-1"] < medoidScoreList.length,
        amrpa: count(medoidScoreList.map(item => item.amrpa))["-1"] < medoidScoreList.length,
        cshcn: count(medoidScoreList.map(item => item.cshcn))["-1"] < medoidScoreList.length,
        ecopb: count(medoidScoreList.map(item => item.ecopb))["-1"] < medoidScoreList.length,
        eqapk: count(medoidScoreList.map(item => item.eqapk))["-1"] < medoidScoreList.length,
        estcc: count(medoidScoreList.map(item => item.estcc))["-1"] < medoidScoreList.length,
        firef: count(medoidScoreList.map(item => item.firef))["-1"] < medoidScoreList.length,
        gmgfc: count(medoidScoreList.map(item => item.gmgfc))["-1"] < medoidScoreList.length,
        gppgr: count(medoidScoreList.map(item => item.gppgr))["-1"] < medoidScoreList.length,
        grntr: count(medoidScoreList.map(item => item.grntr))["-1"] < medoidScoreList.length,
        grsav: count(medoidScoreList.map(item => item.grsav))["-1"] < medoidScoreList.length,
        ihabc: count(medoidScoreList.map(item => item.ihabc))["-1"] < medoidScoreList.length,
        impas: count(medoidScoreList.map(item => item.impas))["-1"] < medoidScoreList.length,
        isegr: count(medoidScoreList.map(item => item.isegr))["-1"] < medoidScoreList.length,
        lscdn: count(medoidScoreList.map(item => item.lscdn))["-1"] < medoidScoreList.length,
        mavbp: count(medoidScoreList.map(item => item.mavbp))["-1"] < medoidScoreList.length,
        mavbr: count(medoidScoreList.map(item => item.mavbr))["-1"] < medoidScoreList.length,
        netcx: count(medoidScoreList.map(item => item.netcx))["-1"] < medoidScoreList.length,
        nlcfp: count(medoidScoreList.map(item => item.nlcfp))["-1"] < medoidScoreList.length,
        persu: count(medoidScoreList.map(item => item.persu))["-1"] < medoidScoreList.length,
        playa: count(medoidScoreList.map(item => item.playa))["-1"] < medoidScoreList.length,
        rescs: count(medoidScoreList.map(item => item.rescs))["-1"] < medoidScoreList.length,
        rests: count(medoidScoreList.map(item => item.rests))["-1"] < medoidScoreList.length,
        safbb: count(medoidScoreList.map(item => item.safbb))["-1"] < medoidScoreList.length,
        saffb: count(medoidScoreList.map(item => item.saffb))["-1"] < medoidScoreList.length,
        saluh: count(medoidScoreList.map(item => item.saluh))["-1"] < medoidScoreList.length,
        samfs: count(medoidScoreList.map(item => item.samfs))["-1"] < medoidScoreList.length,
        scwet: count(medoidScoreList.map(item => item.scwet))["-1"] < medoidScoreList.length,
        urbps: count(medoidScoreList.map(item => item.urbps))["-1"] < medoidScoreList.length,
        wcofw: count(medoidScoreList.map(item => item.wcofw))["-1"] < medoidScoreList.length,
        wcopb: count(medoidScoreList.map(item => item.wcopb))["-1"] < medoidScoreList.length,
        wgcmd: count(medoidScoreList.map(item => item.wgcmd))["-1"] < medoidScoreList.length,
      };

      setShowIndicator(indicatorData);

      // Get the minimium value apart from the no-data (-1) values
      const minScores = {
        aefih: Math.min(...medoidScoreList.map(item => item.aefih).filter(item => item !== -1)),
        amfih: Math.min(...medoidScoreList.map(item => item.amfih).filter(item => item !== -1)),
        amrpa: Math.min(...medoidScoreList.map(item => item.amrpa).filter(item => item !== -1)),
        cshcn: Math.min(...medoidScoreList.map(item => item.cshcn).filter(item => item !== -1)),
        ecopb: Math.min(...medoidScoreList.map(item => item.ecopb).filter(item => item !== -1)),
        eqapk: Math.min(...medoidScoreList.map(item => item.eqapk).filter(item => item !== -1)),
        estcc: Math.min(...medoidScoreList.map(item => item.estcc).filter(item => item !== -1)),
        firef: Math.min(...medoidScoreList.map(item => item.firef).filter(item => item !== -1)),
        gmgfc: Math.min(...medoidScoreList.map(item => item.gmgfc).filter(item => item !== -1)),
        gppgr: Math.min(...medoidScoreList.map(item => item.gppgr).filter(item => item !== -1)),
        grntr: Math.min(...medoidScoreList.map(item => item.grntr).filter(item => item !== -1)),
        grsav: Math.min(...medoidScoreList.map(item => item.grsav).filter(item => item !== -1)),
        ihabc: Math.min(...medoidScoreList.map(item => item.ihabc).filter(item => item !== -1)),
        impas: Math.min(...medoidScoreList.map(item => item.impas).filter(item => item !== -1)),
        isegr: Math.min(...medoidScoreList.map(item => item.isegr).filter(item => item !== -1)),
        lscdn: Math.min(...medoidScoreList.map(item => item.lscdn).filter(item => item !== -1)),
        mavbp: Math.min(...medoidScoreList.map(item => item.mavbp).filter(item => item !== -1)),
        mavbr: Math.min(...medoidScoreList.map(item => item.mavbr).filter(item => item !== -1)),
        netcx: Math.min(...medoidScoreList.map(item => item.netcx).filter(item => item !== -1)),
        nlcfp: Math.min(...medoidScoreList.map(item => item.nlcfp).filter(item => item !== -1)),
        persu: Math.min(...medoidScoreList.map(item => item.persu).filter(item => item !== -1)),
        playa: Math.min(...medoidScoreList.map(item => item.playa).filter(item => item !== -1)),
        rescs: Math.min(...medoidScoreList.map(item => item.rescs).filter(item => item !== -1)),
        rests: Math.min(...medoidScoreList.map(item => item.rests).filter(item => item !== -1)),
        safbb: Math.min(...medoidScoreList.map(item => item.safbb).filter(item => item !== -1)),
        saffb: Math.min(...medoidScoreList.map(item => item.saffb).filter(item => item !== -1)),
        saluh: Math.min(...medoidScoreList.map(item => item.saluh).filter(item => item !== -1)),
        samfs: Math.min(...medoidScoreList.map(item => item.samfs).filter(item => item !== -1)),
        scwet: Math.min(...medoidScoreList.map(item => item.scwet).filter(item => item !== -1)),
        urbps: Math.min(...medoidScoreList.map(item => item.urbps).filter(item => item !== -1)),
        wcofw: Math.min(...medoidScoreList.map(item => item.wcofw).filter(item => item !== -1)),
        wcopb: Math.min(...medoidScoreList.map(item => item.wcopb).filter(item => item !== -1)),
        wgcmd: Math.min(...medoidScoreList.map(item => item.wgcmd).filter(item => item !== -1)),
      }

      const minLevels = {
        aefih: indicators.aefih.indexOf(minScores.aefih),
        amfih: indicators.amfih.indexOf(minScores.amfih),
        amrpa: indicators.amrpa.indexOf(minScores.amrpa),
        cshcn: indicators.cshcn.indexOf(minScores.cshcn),
        ecopb: indicators.ecopb.indexOf(minScores.ecopb),
        eqapk: indicators.eqapk.indexOf(minScores.eqapk),
        estcc: indicators.estcc.indexOf(minScores.estcc),
        firef: indicators.firef.indexOf(minScores.firef),
        gmgfc: indicators.gmgfc.indexOf(minScores.gmgfc),
        gppgr: indicators.gppgr.indexOf(minScores.gppgr),
        grntr: indicators.grntr.indexOf(minScores.grntr),
        grsav: indicators.grsav.indexOf(minScores.grsav),
        ihabc: indicators.ihabc.indexOf(minScores.ihabc),
        impas: indicators.impas.indexOf(minScores.impas),
        isegr: indicators.isegr.indexOf(minScores.isegr),
        lscdn: indicators.lscdn.indexOf(minScores.lscdn),
        mavbp: indicators.mavbp.indexOf(minScores.mavbp),
        mavbr: indicators.mavbr.indexOf(minScores.mavbr),
        netcx: indicators.netcx.indexOf(minScores.netcx),
        nlcfp: indicators.nlcfp.indexOf(minScores.nlcfp),
        persu: indicators.persu.indexOf(minScores.persu),
        playa: indicators.playa.indexOf(minScores.playa),
        rescs: indicators.rescs.indexOf(minScores.rescs),
        rests: indicators.rests.indexOf(minScores.rests),
        safbb: indicators.safbb.indexOf(minScores.safbb),
        saffb: indicators.saffb.indexOf(minScores.saffb),
        saluh: indicators.saluh.indexOf(minScores.saluh),
        samfs: indicators.samfs.indexOf(minScores.samfs),
        scwet: indicators.scwet.indexOf(minScores.scwet),
        urbps: indicators.urbps.indexOf(minScores.urbps),
        wcofw: indicators.wcofw.indexOf(minScores.wcofw),
        wcopb: indicators.wcopb.indexOf(minScores.wcopb),
        wgcmd: indicators.wgcmd.indexOf(minScores.wgcmd),
      };

      setCurrentLevels(minLevels);
      setActionLevels(minLevels);
      // setActionLevels({
      //   estcc: 0,
      //   firef: 0,
      //   gmgfc: 0,
      //   gppgr: 0,
      //   grntr: 0,
      //   ihabc: 0,
      //   impas: 0,
      //   isegr: 0,
      //   mavbp: 0,
      //   mavbr: 0,
      //   netcx: 0,
      //   nlcfp: 0,
      //   persu: 0,
      //   playa: 0,
      //   rescs: 0,
      //   rests: 0,
      //   safbb: 0,
      //   saffb: 0,
      //   saluh: 0,
      //   urbps: 0,
      //   wcofw: 0,
      //   wcopb: 0,
      //   wgcmd: 0,
      // });
    }
  }, [aoi]);
  
  useEffect(() => {
    let newActionScores = {...actionScores};
    const indicatorList = Object.keys(newActionScores);
    indicatorList.forEach((indicator) => {
      newActionScores[indicator] = Math.round(scores[indicator]*scores.futurePenalty*100)/100;
    });
    setActionScores(newActionScores);
  }, [hexData]);

  useEffect(() => {
    if (actionLevels.estcc !== undefined) {
      
      const increaseLevel = (level, value, increments) => {
        return level === 0 ? value : (value === -1 ? -1 : (value + increments > 1 ? 1 : value + increments));
      };
      
      const actionScoreList = currentScoreList.map((feature) => {
        const actionMedoidScores = {
          gid: feature.gid,
          aefih: increaseLevel(actionLevels.aefih, feature.aefih, actionLevels.aefih === 0 ? actionLevels.aefih*0.25 : actionLevels.aefih*0.5),
          amfih: increaseLevel(actionLevels.amfih, feature.amfih, actionLevels.amfih === 0 ? actionLevels.amfih*0.25 : actionLevels.amfih*0.5),
          amrpa: increaseLevel(actionLevels.amrpa, feature.amrpa, actionLevels.amrpa*1),
          cshcn: increaseLevel(actionLevels.cshcn, feature.cshcn, actionLevels.cshcn === 2 ? actionLevels.cshcn*0.25 + 0.25 : actionLevels.cshcn*0.25),
          ecopb: increaseLevel(actionLevels.ecopb, feature.ecopb, actionLevels.ecopb*0.2),
          eqapk: increaseLevel(actionLevels.eqapk, feature.eqapk, actionLevels.eqapk*0.25),
          estcc: increaseLevel(actionLevels.estcc, feature.estcc, actionLevels.estcc*0.25),
          firef: increaseLevel(actionLevels.firef, feature.firef, actionLevels.firef*0.5),
          gmgfc: increaseLevel(actionLevels.gmgfc, feature.gmgfc, actionLevels.gmgfc*1),
          gppgr: increaseLevel(actionLevels.gppgr, feature.gppgr, actionLevels.gppgr*0.2),
          grntr: increaseLevel(actionLevels.grntr, feature.grntr, actionLevels.grntr*0.25),
          grsav: increaseLevel(actionLevels.grsav, feature.grsav, actionLevels.grsav*0.15),
          ihabc: increaseLevel(actionLevels.ihabc, feature.ihabc, actionLevels.ihabc === 0 ? actionLevels.ihabc*0.25 + 0.5 : actionLevels.ihabc*0.25),
          impas: increaseLevel(actionLevels.impas, feature.impas, actionLevels.impas === 0 ? actionLevels.impas*0.25 + 0.25 : actionLevels.impas*0.25),
          isegr: increaseLevel(actionLevels.isegr, feature.isegr, actionLevels.isegr*0.25),
          lscdn: increaseLevel(actionLevels.lscdn, feature.lscdn, actionLevels.lscdn === 0 ? actionLevels.lscdn*0.2 - 0.1 : actionLevels.lscdn*0.2),
          mavbp: increaseLevel(actionLevels.mavbp, feature.mavbp, actionLevels.mavbp*0.1),
          mavbr: increaseLevel(actionLevels.mavbr, feature.mavbr, actionLevels.mavbr*0.1),
          netcx: increaseLevel(actionLevels.netcx, feature.netcx, actionLevels.netcx*0.25),
          nlcfp: increaseLevel(actionLevels.nlcfp, feature.nlcfp, actionLevels.nlcfp*0.25),
          persu: increaseLevel(actionLevels.persu, feature.persu, 0), // Not Adjustable
          playa: increaseLevel(actionLevels.playa, feature.playa, actionLevels.playa*0.5),
          rescs: increaseLevel(actionLevels.rescs, feature.rescs, actionLevels.rescs*0.15 + 0.1),
          rests: increaseLevel(actionLevels.rests, feature.rests, actionLevels.rests === 0 ? actionLevels.rests*0.15 + 0.1 : actionLevels.rests*0.15),
          safbb: increaseLevel(actionLevels.safbb, feature.safbb, actionLevels.safbb*0.2),
          saffb: increaseLevel(actionLevels.saffb, feature.saffb, actionLevels.saffb*0.5),
          saluh: increaseLevel(actionLevels.saluh, feature.saluh, 0), // Not Adjustable
          samfs: increaseLevel(actionLevels.samfs, feature.samfs, actionLevels.samfs*1),
          scwet: increaseLevel(actionLevels.scwet, feature.scwet, actionLevels.scwet*0.5),
          urbps: increaseLevel(actionLevels.urbps, feature.urbps, actionLevels.urbps*0.25),
          wcofw: increaseLevel(actionLevels.wcofw, feature.wcofw, actionLevels.wcofw*0.2),
          wcopb: increaseLevel(actionLevels.wcopb, feature.wcopb, actionLevels.wcopb === 0 ? actionLevels.wcopb*0.1 + 0.4 : actionLevels.wcopb*0.1),
          wgcmd: increaseLevel(actionLevels.wgcmd, feature.wgcmd, actionLevels.wgcmd*0.1),
        };

        const hList = ["aefih", "amfih", "amrpa", "cshcn", "ecopb", "estcc", "firef", "grsav", "impas", "lscdn", "mavbp", "mavbr", "nlcfp", "persu", "playa", "rescs", "rests", "safbb", "saffb", "samfs", "scwet", "wcofw", "wcopb", "wgcmd"];
        const fList = ["eqapk", "grntr", "saluh", "urbps"];
        const cList = ["gmgfc", "ihabc", "netcx"];

        const hTotal = hList.reduce((total, current) => total + (actionMedoidScores[current] !== -1 ? actionMedoidScores[current] : 0), 0);
        const hLength = hList.filter((item) => actionMedoidScores[item] !== -1).length;
        const hScore = hLength !== 0 ? hTotal/hLength : 0;
        
        const fTotal = fList.reduce((total, current) => total + (actionMedoidScores[current] !== -1 ? actionMedoidScores[current] : 0), 0);
        const fLength = fList.filter((item) => actionMedoidScores[item] !== -1).length;
        const fScore = fLength !== 0 ? fTotal/fLength : 0;

        const cTotal = cList.reduce((total, current) => total + (actionMedoidScores[current] !== -1 ? actionMedoidScores[current] : 0), 0);
        const cLength = cList.filter((item) => actionMedoidScores[item] !== -1).length;
        const cScore = cLength !== 0 ? cTotal/cLength : 0;

        const futureScore = (hScore + fScore + cScore)/3;
        
        let hexagonActionScores = {
          ...actionMedoidScores,
          hScore: hScore,
          fScore: fScore,
          cScore: cScore,
          futureScore: futureScore,
        };

        return hexagonActionScores;
      });

      const getAverageScore = (features, property) => {
        const scoreList = features.map((feature) => feature[property]).filter((score) => score !== -1);
        const aoiScore = scoreList.length ? Math.round(100*scoreList.reduce((a, b) => a + b, 0)/scoreList.length)/100 : -1;
        return aoiScore;
      };

      let newActionScores = {
        aefih: getAverageScore(actionScoreList, "aefih"),
        amfih: getAverageScore(actionScoreList, "amfih"),
        amrpa: getAverageScore(actionScoreList, "amrpa"),
        cshcn: getAverageScore(actionScoreList, "cshcn"),
        ecopb: getAverageScore(actionScoreList, "ecopb"),
        eqapk: getAverageScore(actionScoreList, "eqapk"),
        estcc: getAverageScore(actionScoreList, "estcc"),
        firef: getAverageScore(actionScoreList, "firef"),
        gmgfc: getAverageScore(actionScoreList, "gmgfc"),
        gppgr: getAverageScore(actionScoreList, "gppgr"),
        grntr: getAverageScore(actionScoreList, "grntr"),
        grsav: getAverageScore(actionScoreList, "grsav"),
        ihabc: getAverageScore(actionScoreList, "ihabc"),
        impas: getAverageScore(actionScoreList, "impas"),
        isegr: getAverageScore(actionScoreList, "isegr"),
        lscdn: getAverageScore(actionScoreList, "lscdn"),
        mavbp: getAverageScore(actionScoreList, "mavbp"),
        mavbr: getAverageScore(actionScoreList, "mavbr"),
        netcx: getAverageScore(actionScoreList, "netcx"),
        nlcfp: getAverageScore(actionScoreList, "nlcfp"),
        persu: getAverageScore(actionScoreList, "persu"),
        playa: getAverageScore(actionScoreList, "playa"),
        rescs: getAverageScore(actionScoreList, "rescs"),
        rests: getAverageScore(actionScoreList, "rests"),
        safbb: getAverageScore(actionScoreList, "safbb"),
        saffb: getAverageScore(actionScoreList, "saffb"),
        saluh: getAverageScore(actionScoreList, "saluh"),
        samfs: getAverageScore(actionScoreList, "samfs"),
        scwet: getAverageScore(actionScoreList, "scwet"),
        urbps: getAverageScore(actionScoreList, "urbps"),
        wcofw: getAverageScore(actionScoreList, "wcofw"),
        wcopb: getAverageScore(actionScoreList, "wcopb"),
        wgcmd: getAverageScore(actionScoreList, "wgcmd"),
        hScore: getAverageScore(actionScoreList, "hScore"),
        fScore: getAverageScore(actionScoreList, "fScore"),
        cScore: getAverageScore(actionScoreList, "cScore"),
        futureScore: getAverageScore(actionScoreList, "futureScore"),
      };

      setActionScores(newActionScores);

      const actionFeatureList = hexData.features.map((feature) => {
        let actionFeature = feature;
        actionFeature.properties.actionScore = actionScoreList.filter((hex) => hex.gid === feature.properties.gid)[0].futureScore;
        return actionFeature;
      });

      setActionHexData({
        type: "FeatureCollection",
        features: actionFeatureList
      });
      
    }
  }, [actionLevels]);

  return (
    <div className="AoiTable" style={{ marginTop: "10px", height: "60%", overflowY: "scroll" }}>
      {aoi && (
        <>
          <Table striped bordered size="sm" variant="light" style={{textAlign: "center", verticalAlign: "middle"}}>
            <thead style={{textAlign: "center", verticalAlign: "middle"}}>
              <tr>
                <th rowSpan="2">Indicators</th>
                <th rowSpan="1" colSpan="4">Indicator Scores & Action Levels</th>
              </tr>
              <tr>
                <th rowSpan="1" colSpan="4">
                  <BiSolidDownArrow color="blue"/> Current <br/>
                  <BiSolidDownArrow color="red"/> Future (No Action) <br/>
                  <BiSolidUpArrow color="green"/> Future (With Action)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5">
                  <b>Health </b>{" "}
                </td>
              </tr>
              {scores.amrpa > 0  && <tr>
                <td>Amphibian & Reptile Areas</td>
                <td colSpan="4">{ActionSlider("amrpa")}</td>
              </tr>}
              {scores.aefih > 0  && <tr>
                <td>Atlantic Estuarine Fish Habitat</td>
                <td colSpan="4">{ActionSlider("aefih")}</td>
              </tr>}
              {scores.amfih > 0  && <tr>
                <td>Atlantic Estuarine Fish Habitat</td>
                <td colSpan="4">{ActionSlider("amfih")}</td>
              </tr>}
              {scores.cshcn > 0  && <tr>
                <td>Coastal Shoreline Condition</td>
                <td colSpan="4">{ActionSlider("cshcn")}</td>
              </tr>}
              {scores.ecopb > 0  && <tr>
                <td>East Gulf Coastal Plain Open Pine Birds</td>
                <td colSpan="4">{ActionSlider("ecopb")}</td>
              </tr>}
              {scores.estcc > 0  && <tr>
                <td>Estuarine Coastal Condition</td>
                <td colSpan="4">{ActionSlider("estcc")}</td>
              </tr>}
              {scores.firef > 0  && <tr>
                <td>Fire Frequency</td>
                <td colSpan="4">{ActionSlider("firef")}</td>
              </tr>}
              {scores.grsav > 0  && <tr>
                <td>Grasslands and Savannas</td>
                <td colSpan="4">{ActionSlider("grsav")}</td>
              </tr>}
              {scores.impas > 0  && <tr>
                <td>Imperiled Aquatic Species</td>
                <td colSpan="4">{ActionSlider("impas")}</td>
              </tr>}
              {scores.lscdn > 0  && <tr>
                <td>Landscape Condition</td>
                <td colSpan="4">{ActionSlider("lscdn")}</td>
              </tr>}
              {scores.mavbp > 0  && <tr>
                <td>MAV Forest Birds Protection</td>
                <td colSpan="4">{ActionSlider("mavbp")}</td>
              </tr>}
              {scores.mavbr > 0  && <tr>
                <td>MAV Forest Birds Restoration</td>
                <td colSpan="4">{ActionSlider("mavbr")}</td>
              </tr>}
              {scores.nlcfp > 0  && <tr>
                <td>Natural Landcover Floodplains</td>
                <td colSpan="4">{ActionSlider("nlcfp")}</td>
              </tr>}
              {scores.persu > 0  && <tr>
                <td>Permeable Surface</td>
                <td colSpan="4">{ActionSlider("persu")}</td>
              </tr>}
              {scores.playa > 0  && <tr>
                <td>Playas</td>
                <td colSpan="4">{ActionSlider("playa")}</td>
              </tr>}
              {scores.rescs > 0  && <tr>
                <td>Resilient Coastal Sites</td>
                <td colSpan="4">{ActionSlider("rescs")}</td>
              </tr>}
              {scores.rests > 0  && <tr>
                <td>Resilient Terrestrial Sites</td>
                <td colSpan="4">{ActionSlider("rests")}</td>
              </tr>}
              {scores.safbb > 0  && <tr>
                <td>South Atlantic Beach Birds</td>
                <td colSpan="4">{ActionSlider("safbb")}</td>
              </tr>}
              {scores.saffb > 0  && <tr>
                <td>South Atlantic Forest Birds</td>
                <td colSpan="4">{ActionSlider("saffb")}</td>
              </tr>}
              {scores.samfs > 0  && <tr>
                <td>South Atlantic Maritime Forest</td>
                <td colSpan="4">{ActionSlider("samfs")}</td>
              </tr>}
              {scores.scwet > 0  && <tr>
                <td>Stable Coastal Wetlands</td>
                <td colSpan="4">{ActionSlider("scwet")}</td>
              </tr>}
              {scores.wcofw > 0  && <tr>
                <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                <td colSpan="4">{ActionSlider("wcofw")}</td>
              </tr>}
              {scores.wcopb > 0  && <tr>
                <td>West Coastal Plain Ouachitas Open Pine Bird</td>
                <td colSpan="4">{ActionSlider("wcopb")}</td>
              </tr>}
              {scores.wgcmd > 0  && <tr>
                <td>West Gulf Coast Mottled Duck Nesting</td>
                <td colSpan="4">{ActionSlider("wgcmd")}</td>
              </tr>}
              <tr>
                <td colSpan="5">
                  <b>Function </b>{" "}
                </td>
              </tr>
              {scores.eqapk > 0  && <tr>
                <td>Equitable Access to Potential Parks</td>
                <td colSpan="4">{ActionSlider("eqapk")}</td>
              </tr>}
              {scores.grntr > 0  && <tr>
                <td>Greenways Trails</td>
                <td colSpan="4">{ActionSlider("grntr")}</td>
              </tr>}
              {scores.saluh > 0  && <tr>
                <td>South Atlantic Low-density Urban Historic Sites</td>
                <td colSpan="4">{ActionSlider("saluh")}</td>
              </tr>}
              {scores.urbps > 0  && <tr>
                <td>Urban Park Size</td>
                <td colSpan="4">{ActionSlider("urbps")}</td>
              </tr>}
              <tr>
                <td colSpan="5">
                  <b>Connectivity</b>{" "}
                </td>
              </tr>
              {scores.gmgfc > 0  && <tr>
                <td>Gulf Migratory Fish Connectivity</td>
                <td colSpan="4">{ActionSlider("gmgfc")}</td>
              </tr>}
              {scores.ihabc > 0  && <tr>
                <td>Intact Habitat Cores</td>
                <td colSpan="4">{ActionSlider("ihabc")}</td>
              </tr>}
              {scores.netcx > 0  && <tr>
                <td>Network Complexity</td>
                <td colSpan="4">{ActionSlider("netcx")}</td>
              </tr>}
              <tr>
                <td>
                  <b>Overall Score</b>{" "}
                </td>
                <td colSpan="3">
                  <div style={{width: "400px"}}>
                    <GaugeComponent
                      type="semicircle"
                      arc={{
                        gradient: true,
                        width: 0.5,
                        padding: 0,
                        subArcs: [
                          {limit: 33, color: '#aefff0'},
                          {limit: 66, color: '#00a7e4'},
                          {limit: 100, color: '#5d00d8'}
                        ]
                      }}
                      labels={{
                        valueLabel: {
                          fontSize: 30,
                          formatTextValue: (value) => value/100
                        },
                        tickLabels: {
                          type: "outer",
                          defaultTickValueConfig: {
                            formatTextValue: (value) => value/100,
                            style: {
                              fontSize: 15
                            }
                          },
                          ticks: [
                            {
                              value: Math.round(scores.currentScore*100),
                              valueConfig: {
                                formatTextValue: (value) => '\u25BC',
                                style: {
                                  fontSize: 15,
                                  fill: "blue",
                                  rotate: (scores.currentScore-0.5)*180+"deg",
                                  transformOrigin: "0px -10px"
                                }
                              }
                            },
                            {
                              value: Math.round(scores.currentScore*scores.futurePenalty*100),
                              valueConfig: {
                                formatTextValue: (value) => '\u25BC',
                                style: {
                                  fontSize: 15,
                                  fill: "red",
                                  rotate: (scores.currentScore*scores.futurePenalty-0.5)*180+"deg",
                                  transformOrigin: "0px -10px"
                                }
                              }
                            }
                          ]
                        }
                      }}
                      value={actionScores.futureScore*100}
                      pointer={{type: "arrow", elastic: true, color: "green"}}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          <hr />
        </>
      )}
    </div>
  );
};
export default FutureWithActionTable;
