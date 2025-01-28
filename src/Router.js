import React, { createContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./Main";
import Report from "./Report";
import StochasticReport from "./StochasticReport";

const Router = () => {
  const RouterContext = createContext();
  const [aoiSelected, setAoiSelected] = useState(null);
  const [hexData, setHexData] = useState(null);
  const [actionHexData, setActionHexData] = useState(null);
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
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  return (
    // <RouterContext.Provider value={{hexIdInBlue, restoreAction, protectAction, maintainAction}}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Main
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              hexData={hexData}
              setHexData={setHexData}
              actionHexData={actionHexData}
              setActionHexData={setActionHexData}
              actionScores={actionScores}
              setActionScores={setActionScores}
              progress={progress}
              setProgress={setProgress}
              showProgress={showProgress}
              setShowProgress={setShowProgress}
            />
          }
        ></Route>
        <Route
          exact
          path="/report"
          element={
            <Report
              aoiSelected={aoiSelected}
              hexData={hexData}
              actionHexData={actionHexData}
              actionScores={actionScores}
            />
          }
        ></Route>
        <Route
          exact
          path="/stochastic-report"
          element={
            <StochasticReport
              aoiSelected={aoiSelected}
              setProgress={setProgress}
              setShowProgress={setShowProgress}
            />
          }
        ></Route>
        <Route element={<Navigate to="/"/>} /> 
      </Routes>
    // </RouterContext.Provider>
  );
};

export default Router;
