import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Routes from "./Routes";

function App(props) {
  return (
    <div className="App">
      <NavBar />
      <Routes />
    </div>
  );
}

export default App;
