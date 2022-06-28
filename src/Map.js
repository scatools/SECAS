import React, { useRef, useState, useEffect } from "react";
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { Editor, DrawPolygonMode, EditingMode } from "react-map-gl-draw";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import bbox from "@turf/bbox";
import { getFeatureStyle, getEditHandleStyle } from "./draw-style";
import { dataLayer, dataLayerHightLight } from "./map-style";
import { normalization } from "./helper/aggregateHex";
import Legend from "./Legend";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Map = ({
  drawingMode,
  setFeatureList,
  aoiSelected,
  editAOI,
  viewport,
  setViewport,
  mapOverlay,
  hexGrid,
  mode,
  setMode,
  autoDraw,
  interactiveLayerIds,
  hexOpacity,
}) => {
  const map = useRef(null);
  const [filter, setFilter] = useState(["in", "OBJECTID", ""]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [legendInfo, setLegendInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoveredGeometry, setHoveredGeometry] = useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);

  const aoi = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );

  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );

  const renderHexGrid = () => {
    const hexFeatureList = aoiList[0].hexagons.map((hex) => {
      let scoreList = normalization(hex);
      let scoreArray = Object.values(scoreList);
      let averageScore =
        scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length;
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: {
          gid: hex.gid,
          objectid: hex.objectid,
          scoreH1: scoreList.scoreH1,
          scoreH2: scoreList.scoreH2,
          scoreH3: scoreList.scoreH3,
          scoreH4: scoreList.scoreH4,
          scoreF1: scoreList.scoreF1,
          scoreF2: scoreList.scoreF2,
          scoreC1: scoreList.scoreC1,
          scoreC2: scoreList.scoreC2,
          overallScore: averageScore,
        },
      };
    });

    const hexData = {
      type: "FeatureCollection",
      features: hexFeatureList,
    };

    return (
      <Source type="geojson" data={hexData}>
        <Layer
          id="hex"
          type="fill"
          paint={{
            "fill-color": {
              property: "overallScore",
              stops: [
                [0.1, "#95efff"],
                [0.3, "#4bd3d1"],
                [0.5, "#00b597"],
                [0.7, "#009456"],
                [0.9, "#057300"],
              ],
            },
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              parseInt(hexOpacity) / 100,
            ],
          }}
        />
      </Source>
    );
  };

  const renderPopup = () => {
    let aoiBbox = bbox({
      type: "Feature",
      geometry: hoveredGeometry,
    });
    let popupLongitude = (aoiBbox[0] + aoiBbox[2]) / 2;
    let popupLatitude = (aoiBbox[1] + aoiBbox[3]) / 2;

    return (
      <Popup
        longitude={popupLongitude}
        latitude={popupLatitude}
        anchor="bottom"
        // onClose={() => setShowPopup(false)}
      >
        <Table striped bordered size="sm" variant="light">
          <thead>
            <tr>
              <th>Measures</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2">
                <b>Health: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Open Pine Site Condition:</td>
              <td>{hoveredProperty.scoreH1}</td>
            </tr>
            <tr>
              <td>Open Pine Species:</td>
              <td>{hoveredProperty.scoreH2}</td>
            </tr>
            <tr>
              <td>Toby's Fire:</td>
              <td>{hoveredProperty.scoreH3}</td>
            </tr>
            <tr>
              <td>Conservation Management:</td>
              <td>{hoveredProperty.scoreH4}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Function: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Forest Carbon:</td>
              <td>{hoveredProperty.scoreF1}</td>
            </tr>
            <tr>
              <td>Working Lands:</td>
              <td>{hoveredProperty.scoreF2}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Connectivity:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>Open Pine Landscape Condition: </td>
              <td>{hoveredProperty.scoreC1}</td>
            </tr>
            <tr>
              <td>TNC Resilience:</td>
              <td>{hoveredProperty.scoreC2}</td>
            </tr>
            <tr>
              <td>
                <b style={{ color: "blue" }}>Overall Score:</b>{" "}
              </td>
              <td>
                <b style={{ color: "blue" }}>
                  {hoveredProperty.overallScore.toFixed(2)}
                </b>
              </td>
            </tr>
          </tbody>
        </Table>
      </Popup>
    );
  };

  const getCursor = ({ isHovering, isDragging }) => {
    console.log(isDragging);
    return isDragging ? "grabbing" : isHovering ? "crosshair" : "default";
  };

  const onHover = (e) => {
    setHovered(true);
    if (e.features) {
      const featureHovered = e.features[0];
      if (featureHovered) {
        setHoveredProperty(featureHovered.properties);
        setHoveredGeometry(featureHovered.geometry);
      }
    }
  };

  const onSelect = (options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  };

  const makeDraw = async () => {
    setMode(new DrawPolygonMode());
  };

  const editorRef = useRef(null);
  const onDelete = () => {
    const selectedIndex = selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      editorRef.current.deleteFeatures(selectedIndex);
    }
  };

  const onUpdate = ({ editType }) => {
    if (editType === "addFeature") {
      setMode(new EditingMode());
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      setFeatureList(featureList);
    }
  });

  useEffect(() => {
    if (!drawingMode && editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      const featureListIdx = featureList.map((feature, idx) => idx);
      setFeatureList([]);
      if (featureListIdx.length > 0) {
        editorRef.current.deleteFeatures(featureListIdx);
      }
    }
  }, [drawingMode, setFeatureList]);

  useEffect(() => {
    if (
      editAOI &&
      aoiSelected &&
      drawingMode &&
      editorRef.current.getFeatures().length === 0
    ) {
      editorRef.current.addFeatures(aoi[0].geometry);
    }
  }, [editAOI, aoi, drawingMode, aoiSelected]);

  const renderDrawTools = () => {
    // Copy from mapbox
    return (
      <div className="mapboxgl-ctrl-top-right">
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={makeDraw}
          />

          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={onDelete}
          />
        </div>
      </div>
    );
  };

  // const onViewStateChange = (e) => {
  // 	// console.log(e);
  // 	let windowContent = document.getElementById("floatingWindow");
  // 	// let popupWindow = document.getElementsByClassName("map.tooltip");
  // 	windowContent.style.display = 'block';
  // 	// console.log(popupWindow);
  // 	if (e.viewState.zoom >= 10) {
  // 		windowContent.innerHTML = "<p>Click to explore the details of a single hexagonal area.</p>"
  // 								+"<p>Current zoom level :"
  // 								+e.viewState.zoom.toFixed(1)+"</p>"
  // 	}
  // 	else {
  // 		windowContent.innerHTML = "<p>Please zoom in to level 10 to explore the details of a single hexagonal area.</p>"
  // 								+"<p>Current zoom level :"
  // 								+e.viewState.zoom.toFixed(1)+"</p>"
  // 	}
  // }

  return (
    <MapGL
      {...viewport}
      style={{ position: "fixed", top: "5.7vh" }}
      width="100vw"
      height="94.3vh"
      // mapStyle="mapbox://styles/mapbox/dark-v9"
      mapStyle="mapbox://styles/mapbox/light-v9"
      // onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onViewportChange={setViewport}
      // onViewStateChange={onViewStateChange}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      ref={map}
      onHover={onHover}
      getCursor={getCursor}
      interactiveLayerIds={interactiveLayerIds}
    >
      <Editor
        ref={editorRef}
        style={{ cursor: "crosshari", width: "100%", height: "100%" }}
        clickRadius={12}
        mode={mode}
        onSelect={onSelect}
        onUpdate={onUpdate}
        editHandleShape={"circle"}
        featureStyle={getFeatureStyle}
        editHandleStyle={getEditHandleStyle}
      />
      {aoi.length > 0 && !editAOI && (
        <Source
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: aoi[0].geometry,
          }}
        >
          <Layer
            id="data"
            type="fill"
            paint={{
              "fill-color": hexGrid ? "transparent" : "#fee08b",
              "fill-outline-color": "#484896",
              "fill-opacity": 0.5,
            }}
          />
        </Source>
      )}
      {drawingMode && renderDrawTools()}
      {aoiList.length > 0 && hexGrid && renderHexGrid()}
      {aoiList.length > 0 &&
        hexGrid &&
        hoveredProperty.overallScore &&
        renderPopup()}
      {!mapOverlay && (
        <Source
          type="vector"
          url="mapbox://chuck0520.4fzqbp42"
          maxzoom={22}
          minzoom={0}
        >
          <Layer
            {...dataLayer}
            id="SECASlayer"
            value="SECASlayer"
            paint={{
              "fill-outline-color": "#484896",
              "fill-color": "#6E599F",
              "fill-opacity": 0.5,
            }}
          />
        </Source>
      )}
      {mapOverlay && (
        <Source
          type="vector"
          url="mapbox://chuck0520.4fzqbp42"
          maxzoom={22}
          minzoom={0}
        >
          <Layer
            {...dataLayer}
            id="SECASlayer"
            value="SECASlayer"
            paint={{
              "fill-outline-color": "gray",
              "fill-color": "transparent",
              "fill-opacity": 1,
            }}
          />
        </Source>
      )}
      {mapOverlay === "hab2" && (
        <>
          <Source
            type="raster"
            url="mapbox://chuck0520.3dbvy7bi"
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              type="raster"
              id="Forested_Wetland"
              value="Forested_Wetland"
            />
          </Source>
          <Legend legendInfo="FW"></Legend>
        </>
      )}
      {mapOverlay === "hab3" && (
        <>
          <Source
            type="raster"
            url="mapbox://chuck0520.813oo4df"
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              type="raster"
              id="Upland_Hardwoods_Forest"
              value="Upland_Hardwoods_Forest"
            />
          </Source>
          <Legend legendInfo="UHF"></Legend>
        </>
      )}
      {mapOverlay === "hab4" && (
        <>
          <Source
            type="raster"
            url="mapbox://chuck0520.6kkntksf"
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              type="raster"
              id="Upland_Hardwoods_Woodland"
              value="Upland_Hardwoods_Woodland"
            />
          </Source>
          <Legend legendInfo="UHW"></Legend>
        </>
      )}
      {mapOverlay === "hab5" && (
        <>
          <Source
            type="raster"
            url="mapbox://chuck0520.c4pm2rl8"
            maxzoom={22}
            minzoom={0}
          >
            <Layer type="raster" id="Mixed_Forest" value="Mixed_Forest" />
          </Source>
          <Legend legendInfo="MF"></Legend>
        </>
      )}
      {mapOverlay === "hab6" && (
        <>
          <Source
            type="raster"
            url="mapbox://chuck0520.bwuspx5h"
            maxzoom={22}
            minzoom={0}
          >
            <Layer type="raster" id="Grass" value="Grass" />
          </Source>
          <Legend legendInfo="G"></Legend>
        </>
      )}
    </MapGL>
  );
};

export default Map;
