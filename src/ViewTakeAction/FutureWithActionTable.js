import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Table, Overlay } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAoiScore } from "../helper/aggregateHex";

const FutureWithActionTable = ({ hexData, actionScores, setActionScores }) => {
  const [actionLevels, setActionLevels] = useState({});
  const [currentLevels, setCurrentLevels] = useState({});
  const [showIndicator, setShowIndicator] = useState({});
  const aoiList = Object.values(useSelector((state) => state.aoi));
  const aoi = aoiList[0];
  const scores = getAoiScore(hexData.features);
  const indicators = {
    estcc: [0, 0.25, 0.5, 0.75, 1],
    firef: [0, 0.5, 1],
    gmgfc: [0, 1],
    gppgr: [0.2, 0.4, 0.6, 0.8, 1],
    grntr: [0, 0.25, 0.5, 0.75, 1],
    ihabc: [0, 0.75, 1],
    impas: [0, 0.5, 0.75, 1],
    isegr: [0, 0.25, 0.5, 0.75, 1],
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
    urbps: [0, 0.25, 0.5, 0.75, 1],
    wcofw: [0, 0.2, 0.4, 0.6, 0.8, 1],
    wcopb: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    wgcmd: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    futv2: [0.25, 0.50, 0.75, 1.0]
  };

  const onActionLevelClick = (e, indicator) => {
    console.log(e.target.value);
    actionLevels[indicator] = e.target.value;
    setActionLevels(actionLevels);
  };

  const ActionDropdown = (indicator) => {
    return (
      <Dropdown>
        <Dropdown.Toggle className="table-dropdown" variant="secondary" size="sm">
          {actionLevels[indicator]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {indicators[indicator].map((value, index) =>
            value >= currentLevels[indicator] ?
              <Dropdown.Item
                onClick={(e) => {
                  console.log(e);
                  console.log(e.target.value);
                  onActionLevelClick(e, indicator);
                }}
              >
                {index}
              </Dropdown.Item>
            :
              <></>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };
  
  useEffect(() => {
    if (aoi && aoi.currentHexagons) {
      const currentScoreList = aoi.currentHexagons.map((hex) => {
        const medoidScores = {
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
        };
        return medoidScores;
      });

      console.log(currentScoreList);

      const count = (array) => {
        const occurrences = array.reduce(function (acc, curr) {
          return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        }, {});
        return occurrences;
      };

      // Only show the indicator if the selected area has data for at least one hexagon inside
      const indicatorData = {
        estcc: count(currentScoreList.map(item => item.estcc))["-1"] < currentScoreList.length,
        firef: count(currentScoreList.map(item => item.firef))["-1"] < currentScoreList.length,
        gmgfc: count(currentScoreList.map(item => item.gmgfc))["-1"] < currentScoreList.length,
        gppgr: count(currentScoreList.map(item => item.gppgr))["-1"] < currentScoreList.length,
        grntr: count(currentScoreList.map(item => item.grntr))["-1"] < currentScoreList.length,
        ihabc: count(currentScoreList.map(item => item.ihabc))["-1"] < currentScoreList.length,
        impas: count(currentScoreList.map(item => item.impas))["-1"] < currentScoreList.length,
        isegr: count(currentScoreList.map(item => item.isegr))["-1"] < currentScoreList.length,
        mavbp: count(currentScoreList.map(item => item.mavbp))["-1"] < currentScoreList.length,
        mavbr: count(currentScoreList.map(item => item.mavbr))["-1"] < currentScoreList.length,
        netcx: count(currentScoreList.map(item => item.netcx))["-1"] < currentScoreList.length,
        nlcfp: count(currentScoreList.map(item => item.nlcfp))["-1"] < currentScoreList.length,
        persu: count(currentScoreList.map(item => item.persu))["-1"] < currentScoreList.length,
        playa: count(currentScoreList.map(item => item.playa))["-1"] < currentScoreList.length,
        rescs: count(currentScoreList.map(item => item.rescs))["-1"] < currentScoreList.length,
        rests: count(currentScoreList.map(item => item.rests))["-1"] < currentScoreList.length,
        safbb: count(currentScoreList.map(item => item.safbb))["-1"] < currentScoreList.length,
        saffb: count(currentScoreList.map(item => item.saffb))["-1"] < currentScoreList.length,
        saluh: count(currentScoreList.map(item => item.saluh))["-1"] < currentScoreList.length,
        urbps: count(currentScoreList.map(item => item.urbps))["-1"] < currentScoreList.length,
        wcofw: count(currentScoreList.map(item => item.wcofw))["-1"] < currentScoreList.length,
        wcopb: count(currentScoreList.map(item => item.wcopb))["-1"] < currentScoreList.length,
        wgcmd: count(currentScoreList.map(item => item.wgcmd))["-1"] < currentScoreList.length,
      };
      
      console.log({
        estcc: count(currentScoreList.map(item => item.estcc)),
        firef: count(currentScoreList.map(item => item.firef)),
        gmgfc: count(currentScoreList.map(item => item.gmgfc)),
        gppgr: count(currentScoreList.map(item => item.gppgr)),
        grntr: count(currentScoreList.map(item => item.grntr)),
        ihabc: count(currentScoreList.map(item => item.ihabc)),
        impas: count(currentScoreList.map(item => item.impas)),
        isegr: count(currentScoreList.map(item => item.isegr)),
        mavbp: count(currentScoreList.map(item => item.mavbp)),
        mavbr: count(currentScoreList.map(item => item.mavbr)),
        netcx: count(currentScoreList.map(item => item.netcx)),
        nlcfp: count(currentScoreList.map(item => item.nlcfp)),
        persu: count(currentScoreList.map(item => item.persu)),
        playa: count(currentScoreList.map(item => item.playa)),
        rescs: count(currentScoreList.map(item => item.rescs)),
        rests: count(currentScoreList.map(item => item.rests)),
        safbb: count(currentScoreList.map(item => item.safbb)),
        saffb: count(currentScoreList.map(item => item.saffb)),
        saluh: count(currentScoreList.map(item => item.saluh)),
        urbps: count(currentScoreList.map(item => item.urbps)),
        wcofw: count(currentScoreList.map(item => item.wcofw)),
        wcopb: count(currentScoreList.map(item => item.wcopb)),
        wgcmd: count(currentScoreList.map(item => item.wgcmd)),
      });
      setShowIndicator(indicatorData);

      // Get the minimium value apart from the no-data (-1) values
      const minScores = {
        estcc: Math.min(...currentScoreList.map(item => item.estcc).filter(item => item !== -1)),
        firef: Math.min(...currentScoreList.map(item => item.firef).filter(item => item !== -1)),
        gmgfc: Math.min(...currentScoreList.map(item => item.gmgfc).filter(item => item !== -1)),
        gppgr: Math.min(...currentScoreList.map(item => item.gppgr).filter(item => item !== -1)),
        grntr: Math.min(...currentScoreList.map(item => item.grntr).filter(item => item !== -1)),
        ihabc: Math.min(...currentScoreList.map(item => item.ihabc).filter(item => item !== -1)),
        impas: Math.min(...currentScoreList.map(item => item.impas).filter(item => item !== -1)),
        isegr: Math.min(...currentScoreList.map(item => item.isegr).filter(item => item !== -1)),
        mavbp: Math.min(...currentScoreList.map(item => item.mavbp).filter(item => item !== -1)),
        mavbr: Math.min(...currentScoreList.map(item => item.mavbr).filter(item => item !== -1)),
        netcx: Math.min(...currentScoreList.map(item => item.netcx).filter(item => item !== -1)),
        nlcfp: Math.min(...currentScoreList.map(item => item.nlcfp).filter(item => item !== -1)),
        persu: Math.min(...currentScoreList.map(item => item.persu).filter(item => item !== -1)),
        playa: Math.min(...currentScoreList.map(item => item.playa).filter(item => item !== -1)),
        rescs: Math.min(...currentScoreList.map(item => item.rescs).filter(item => item !== -1)),
        rests: Math.min(...currentScoreList.map(item => item.rests).filter(item => item !== -1)),
        safbb: Math.min(...currentScoreList.map(item => item.safbb).filter(item => item !== -1)),
        saffb: Math.min(...currentScoreList.map(item => item.saffb).filter(item => item !== -1)),
        saluh: Math.min(...currentScoreList.map(item => item.saluh).filter(item => item !== -1)),
        urbps: Math.min(...currentScoreList.map(item => item.urbps).filter(item => item !== -1)),
        wcofw: Math.min(...currentScoreList.map(item => item.wcofw).filter(item => item !== -1)),
        wcopb: Math.min(...currentScoreList.map(item => item.wcopb).filter(item => item !== -1)),
        wgcmd: Math.min(...currentScoreList.map(item => item.wgcmd).filter(item => item !== -1)),
      }

      console.log(minScores);

      const minLevels = {
        estcc:  indicators.estcc.indexOf(minScores.estcc),
        firef:  indicators.estcc.indexOf(minScores.firef),
        gmgfc:  indicators.estcc.indexOf(minScores.gmgfc),
        gppgr:  indicators.estcc.indexOf(minScores.gppgr),
        grntr:  indicators.estcc.indexOf(minScores.grntr),
        ihabc:  indicators.estcc.indexOf(minScores.ihabc),
        impas:  indicators.estcc.indexOf(minScores.impas),
        isegr:  indicators.estcc.indexOf(minScores.isegr),
        mavbp:  indicators.estcc.indexOf(minScores.mavbp),
        mavbr:  indicators.estcc.indexOf(minScores.mavbr),
        netcx:  indicators.estcc.indexOf(minScores.netcx),
        nlcfp:  indicators.estcc.indexOf(minScores.nlcfp),
        persu:  indicators.estcc.indexOf(minScores.persu),
        playa:  indicators.estcc.indexOf(minScores.playa),
        rescs:  indicators.estcc.indexOf(minScores.rescs),
        rests:  indicators.estcc.indexOf(minScores.rests),
        safbb:  indicators.estcc.indexOf(minScores.safbb),
        saffb:  indicators.estcc.indexOf(minScores.saffb),
        saluh:  indicators.estcc.indexOf(minScores.saluh),
        urbps:  indicators.estcc.indexOf(minScores.urbps),
        wcofw:  indicators.estcc.indexOf(minScores.wcofw),
        wcopb:  indicators.estcc.indexOf(minScores.wcopb),
        wgcmd:  indicators.estcc.indexOf(minScores.wgcmd),
      };

      console.log(minLevels);
      setCurrentLevels(minLevels);
    }
  }, [aoi]);
  
  useEffect(() => {
    setActionLevels(currentLevels);
  }, [currentLevels]);

  return (
    <div className="AoiTable" style={{ padding: "10px", marginTop: "10px", height: "60vh", overflowY: "scroll" }}>
      {aoi && (
        <>
          <Table striped bordered size="sm" variant="light">
            <thead>
              <tr>
                <th>Indicators</th>
                <th>Action Level</th>
                <th>Current Score</th>
                <th>Future Score</th>
                <th>Action Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5">
                  <b>Health </b>{" "}
                </td>
              </tr>
              {scores.estcc > 0  && <tr>
                <td>Estuarine Coastal Condition</td>
                <td>{ActionDropdown("estcc")}</td>
                <td>{scores.estcc}</td>
                <td>{(scores.estcc*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.estcc}</td>
              </tr>}
              {scores.firef > 0  && <tr>
                <td>Fire Frequency</td>
                <td>{ActionDropdown("firef")}</td>
                <td>{scores.firef}</td>
                <td>{(scores.firef*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.firef}</td>
              </tr>}
              {scores.gppgr > 0  && <tr>
                <td>Great Plains Perrenial Grass</td>
                <td>{ActionDropdown("gppgr")}</td>
                <td>{scores.gppgr}</td>
                <td>{(scores.gppgr*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.gppgr}</td>
              </tr>}
              {scores.impas > 0  && <tr>
                <td>Imperiled Aquatic Species</td>
                <td>{ActionDropdown("impas")}</td>
                <td>{scores.impas}</td>
                <td>{(scores.impas*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.impas}</td>
              </tr>}
              {scores.isegr > 0  && <tr>
                <td>Interior Southeast Grasslands</td>
                <td>{ActionDropdown("isegr")}</td>
                <td>{scores.isegr}</td>
                <td>{(scores.isegr*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.isegr}</td>
              </tr>}
              {scores.mavbp > 0  && <tr>
                <td>MAV Forest Birds Protection</td>
                <td>{ActionDropdown("mavbp")}</td>
                <td>{scores.mavbp}</td>
                <td>{(scores.mavbp*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.mavbp}</td>
              </tr>}
              {scores.mavbr > 0  && <tr>
                <td>MAV Forest Birds Restoration</td>
                <td>{ActionDropdown("mavbr")}</td>
                <td>{scores.mavbr}</td>
                <td>{(scores.mavbr*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.mavbr}</td>
              </tr>}
              {scores.nlcfp > 0  && <tr>
                <td>Natural Landcover Floodplains</td>
                <td>{ActionDropdown("nlcfp")}</td>
                <td>{scores.nlcfp}</td>
                <td>{(scores.nlcfp*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.nlcfp}</td>
              </tr>}
              {scores.persu > 0  && <tr>
                <td>Permeable Surface</td>
                <td>{ActionDropdown("persu")}</td>
                <td>{scores.persu}</td>
                <td>{(scores.persu*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.persu}</td>
              </tr>}
              {scores.playa > 0  && <tr>
                <td>Playas</td>
                <td>{ActionDropdown("playa")}</td>
                <td>{scores.playa}</td>
                <td>{(scores.playa*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.playa}</td>
              </tr>}
              {scores.rescs > 0  && <tr>
                <td>Resilient Coastal Sites</td>
                <td>{ActionDropdown("rescs")}</td>
                <td>{scores.rescs}</td>
                <td>{(scores.rescs*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.rescs}</td>
              </tr>}
              {scores.rests > 0  && <tr>
                <td>Resilient Terrestrial Sites</td>
                <td>{ActionDropdown("rests")}</td>
                <td>{scores.rests}</td>
                <td>{(scores.rests*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.rests}</td>
              </tr>}
              {scores.safbb > 0  && <tr>
                <td>South Atlantic Beach Birds</td>
                <td>{ActionDropdown("safbb")}</td>
                <td>{scores.safbb}</td>
                <td>{(scores.safbb*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.safbb}</td>
              </tr>}
              {scores.saffb > 0  && <tr>
                <td>South Atlantic Forest Birds</td>
                <td>{ActionDropdown("saffb")}</td>
                <td>{scores.saffb}</td>
                <td>{(scores.saffb*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.saffb}</td>
              </tr>}
              {scores.wcofw > 0  && <tr>
                <td>West Coastal Plain Ouachitas Forested Wetlands</td>
                <td>{ActionDropdown("wcofw")}</td>
                <td>{scores.wcofw}</td>
                <td>{(scores.wcofw*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.wcofw}</td>
              </tr>}
              {scores.wcopb > 0  && <tr>
                <td>West Coastal Plain Ouachita Open Pine Bird</td>
                <td>{ActionDropdown("wcopb")}</td>
                <td>{scores.wcopb}</td>
                <td>{(scores.wcopb*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.wcopb}</td>
              </tr>}
              {scores.wgcmd > 0  && <tr>
                <td>West Gulf Coast Mottled Duck Nesting</td>
                <td>{ActionDropdown("wgcmd")}</td>
                <td>{scores.wgcmd}</td>
                <td>{(scores.wgcmd*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.wgcmd}</td>
              </tr>}
              <tr>
                <td colSpan="5">
                  <b>Function </b>{" "}
                </td>
              </tr>
              {scores.grntr > 0  && <tr>
                <td>Greenways Trails</td>
                <td>{ActionDropdown("grntr")}</td>
                <td>{scores.grntr}</td>
                <td>{(scores.grntr*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.grntr}</td>
              </tr>}
              {scores.saluh > 0  && <tr>
                <td>South Atlantic Low-density Urban Historic Sites</td>
                <td>{ActionDropdown("saluh")}</td>
                <td>{scores.saluh}</td>
                <td>{(scores.saluh*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.saluh}</td>
              </tr>}
              {scores.urbps > 0  && <tr>
                <td>Urban Park Size</td>
                <td>{ActionDropdown("urbps")}</td>
                <td>{scores.urbps}</td>
                <td>{(scores.urbps*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.urbps}</td>
              </tr>}
              <tr>
                <td colSpan="5">
                  <b>Connectivity</b>{" "}
                </td>
              </tr>
              {scores.gmgfc > 0  && <tr>
                <td>Gulf Migratory Fish Connectivity</td>
                <td>{ActionDropdown("gmgfc")}</td>
                <td>{scores.gmgfc}</td>
                <td>{(scores.gmgfc*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.gmgfc}</td>
              </tr>}
              {scores.ihabc > 0  && <tr>
                <td>Intact Habitat Cores</td>
                <td>{ActionDropdown("ihabc")}</td>
                <td>{scores.ihabc}</td>
                <td>{(scores.ihabc*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.ihabc}</td>
              </tr>}
              {scores.netcx > 0  && <tr>
                <td>Network Complexity</td>
                <td>{ActionDropdown("netcx")}</td>
                <td>{scores.netcx}</td>
                <td>{(scores.netcx*scores.futurePenalty).toFixed(2)}</td>
                <td>{actionScores.netcx}</td>
              </tr>}
              <tr>
                <td  colSpan="2">
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
