import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./Main";

const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Main />}></Route>
    </Routes>
  );
};

export default Router;
