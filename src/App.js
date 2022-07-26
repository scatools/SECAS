import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Router from "./Router";

function App(props) {
  return (
    <div className="App">
      <NavBar />
      <Router />
    </div>
  );
}

export default App;
