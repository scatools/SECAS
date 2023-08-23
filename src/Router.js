import React, { createContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./Main";
import Report from "./Report";

const Router = () => {
  const RouterContext = createContext();
  const [aoiSelected, setAoiSelected] = useState(null);

  return (
    // <RouterContext.Provider value={{hexIdInBlue, restoreAction, protectAction, maintainAction}}>
      <Routes>
        <Route exact path="/" element={<Main aoiSelected={aoiSelected} setAoiSelected={setAoiSelected} />}></Route>
        <Route exact path="/report" element={<Report aoiSelected={aoiSelected} />}></Route>
        <Route element={<Navigate to="/"/>} /> 
      </Routes>
    // </RouterContext.Provider>
  );
};

export default Router;
