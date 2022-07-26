/* global window */
import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import Map from "react-map-gl";

const TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA"; // Set your mapbox token here

const LeftMapStyle = {
  position: "absolute",
  width: "50%",
  height: "100%",
};
const RightMapStyle = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
};

export default function DualMap({ viewport, setViewport }) {
  const [viewState, setViewState] = useState({
    longitude: -122.43,
    latitude: 37.78,
    zoom: 12,
    pitch: 30,
  });

  // Two maps could be firing 'move' events at the same time, if the user interacts with one
  // while the other is in transition.
  // This state specifies which map to use as the source of truth
  // It is set to the map that received user input last ('movestart')
  const [activeMap, setActiveMap] = useState("left");

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  // const width = typeof window === "undefined" ? 100 : window.innerWidth;
  // const leftMapPadding = useMemo(() => {
  //   return {
  //     left: width / 2,
  //     top: 0,
  //     right: 0,
  //     bottom: 0,
  //   };
  // }, [width]);
  // const rightMapPadding = useMemo(() => {
  //   return {
  //     right: width / 2,
  //     top: 0,
  //     left: 0,
  //     bottom: 0,
  //   };
  // }, [width]);

  return (
    <>
      <div style={{ position: "fixed", height: "100vh" }}>
        <Map
          id="left-map"
          {...viewState}
          onViewportChange={setViewport}
          // padding={leftMapPadding}
          // onMoveStart={onLeftMoveStart}
          // onMove={activeMap === "left" && onMove}
          style={{
            position: "fixed",
            width: "50%",
            height: "100%",
          }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxApiAccessToken={TOKEN}
        />
        <Map
          id="right-map"
          {...viewState}
          // padding={rightMapPadding}
          onViewportChange={setViewport}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" && onMove}
          style={{
            position: "fixed",
            left: "50%",
            width: "50%",
            height: "100%",
          }}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={TOKEN}
        />
      </div>
    </>
  );
}
