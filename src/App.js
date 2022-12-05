import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Router from "./Router";
import { useSelector } from "react-redux";

function App(props) {
  let loading = useSelector((state) => state.loading.isLoading);

  return (
    <div className="App">
      {loading && (
        <div className="Overlay">
          <div className="spinner-4"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )}
      <NavBar />
      <Router />
    </div>
  );
}

export default App;
