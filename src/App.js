import React from "react";
import "./App.css";
import NavBar from "./NavBar";
import Routes from "./Routes";
import LoadingOverlay from "react-loading-overlay";

function App(props) {
  return (
    // <LoadingOverlay
    //   className="myLoading"
    //   active={props.isActive}
    //   styles={{
    //     overlay: (base) => ({
    //       ...base,
    //       position: "fixed",
    //     }),
    //   }}
    //   spinner
    //   text="Loading..."
    // >
      <div className="App">
        <NavBar />
        <Routes />
      </div>
    // </LoadingOverlay>
  );
}

export default App;
