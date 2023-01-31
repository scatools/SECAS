import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import bbox from "@turf/bbox";
import axios from "axios";
import { dataLayer } from "./map-style";
import { normalization, getRestoreValues, getProtectValues, getMaintainValues } from "../helper/aggregateHex";
import DrawControl from "./DrawControl";
import Legend from "./Legend";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
import WebMercatorViewport from "viewport-mercator-project";
import HexInfoPopup from "./HexInfoPopup";
//DO NOT REMOVE BELOW COMMENT
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const MapView = ({
  drawingMode,
  setFeatureList,
  aoiSelected,
  editAOI,
  viewState,
  setViewState,
  habitatLayer,
  hexGrid,
  currentInteractiveLayerIds,
  futureInteractiveLayerIds,
  hexOpacity,
  dualMap,
  hexIdInBlue,
  restoreAction,
  protectAction,
  maintainAction,
  setActiveSidebar,
}) => {
  const [filter, setFilter] = useState(["in", "gid", ""]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [legendInfo, setLegendInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clickedProperty, setClickedProperty] = useState(null);
  const [clickedGeometry, setClickedGeometry] = useState(null);
  const [mode, setMode] = useState("side-by-side");
  const [activeMap, setActiveMap] = useState("left");
  const [currentHexData, setCurrentHexData] = useState();
  const [futureHexData, setFutureHexData] = useState();
  const [hexInfoPopupView, setHexInfoPopupView] = useState(false);
  const [selectedHexIdList, setSelectedHexIdList] = useState(hexIdInBlue);
  const [boxXY, setBoxXY] = useState([[],[]]);
  const [dragPan, setDragPan] = useState(true);
  const [boxZoom, setBoxZoom] = useState(true);

  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const aoi = aoiList[0];

  const mapRef = useRef();

  const colorRamp = ["#95efff","#4bd3d1", "#00b597", "#009456", "#057300"]
  
  let box, boxX, boxY, showBox;

  const zoomToAOI = (aoi) => {
    // Use Turf to get the bounding box of the collections of features
    let aoiBbox = bbox({
      type: "FeatureCollection",
      features: aoi.geometry,
    });
    // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
    let [minLng, minLat, maxLng, maxLat] = aoiBbox;
    // Use WebMercatorViewport to get center longitude/latitude and zoom level

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 50, duration: 500 }
    );
  };

  const LeftMapStyle = {
    position: "absolute",
    top: "5.7vh",
    width: dualMap ? "50vw" : "100vw",
    height: "94.3vh",
  };

  const RightMapStyle = {
    position: "absolute",
    top: "5.7vh",
    left: dualMap ? "50vw" : "100vw",
    width: "100vw",
    height: "94.3vh",
  };

  const width = typeof window === "undefined" ? 100 : window.innerWidth;
  const leftMapPadding = useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }, [width, mode]);
  const rightMapPadding = useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  const calcHexValues = (hexGrid, id) => {
    const hexFeatureList = hexGrid.map((hex) => {
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

    if (id === "current")
      setCurrentHexData({
        type: "FeatureCollection",
        features: hexFeatureList,
      });

    if (id === "future")
      setFutureHexData({
        type: "FeatureCollection",
        features: hexFeatureList,
      });
  };

  const renderHexGrid = (hexGrid, id) => {
    const hexFeatureList = hexGrid.map((hex) => {
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
      <>
        <Source type="geojson" data={hexData}>
          <Layer
            id={id + "-hex"}
            type="fill"
            filter={["!", filter]}
            paint={{
              "fill-color": {
                property: "overallScore",
                stops: [
                  [0.1, "#ccf7ff"],
                  [0.3, "#82d9d7"],
                  [0.5, "#3cb99f"],
                  [0.7, "#00975b"],
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
        <Legend
          legendInfo={null}
          hexGrid={hexGrid}
          opacity={parseInt(hexOpacity)/100}
        ></Legend>
      </>
    );
  };

  const renderSelectedHex = (hexGrid, hexIdList) => {
    const hexFeatureList = hexGrid.filter((hex) => 
      hexIdList.includes(hex.gid)
    ).map((hex) => {
      let newHex;
      let scoreList = normalization(hex);
      if (restoreAction) {
        newHex = getRestoreValues(hex);
        scoreList = normalization(newHex);
      } else if (protectAction) {
        newHex = getProtectValues(hex);
        scoreList = normalization(newHex);
      } else if (maintainAction) {
        newHex = getMaintainValues(hex);
        scoreList = normalization(newHex);
      };
      let scoreArray = Object.values(scoreList);
      let averageScore =
        scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length;
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: { 
          gid: hex.gid,
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
          id="hex-in-blue"
          type="fill"
          paint={{
            "fill-color": (restoreAction || protectAction || maintainAction) ? {
              property: "overallScore",
              stops: [
                [0.1, "#ccf7ff"],
                [0.3, "#82d9d7"],
                [0.5, "#3cb99f"],
                [0.7, "#00975b"],
                [0.9, "#057300"],
              ],
            } : "transparent",
            "fill-outline-color": "blue",
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
      geometry: clickedGeometry,
    });
    let popupLongitude = (aoiBbox[0] + aoiBbox[2]) / 2;
    let popupLatitude = (aoiBbox[1] + aoiBbox[3]) / 2;

    return (
      <Popup
        longitude={popupLongitude}
        latitude={popupLatitude}
        anchor="bottom"
        show={showPopup}
        onClose={() => setShowPopup(false)}
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
              <td>{clickedProperty.scoreH1}</td>
            </tr>
            <tr>
              <td>Open Pine Species:</td>
              <td>{clickedProperty.scoreH2}</td>
            </tr>
            <tr>
              <td>Toby's Fire:</td>
              <td>{clickedProperty.scoreH3}</td>
            </tr>
            <tr>
              <td>Conservation Management:</td>
              <td>{clickedProperty.scoreH4}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Function: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Forest Carbon:</td>
              <td>{clickedProperty.scoreF1}</td>
            </tr>
            <tr>
              <td>Working Lands:</td>
              <td>{clickedProperty.scoreF2}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Connectivity:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>Open Pine Landscape Condition: </td>
              <td>{clickedProperty.scoreC1}</td>
            </tr>
            <tr>
              <td>TNC Resilience:</td>
              <td>{clickedProperty.scoreC2}</td>
            </tr>
            <tr>
              <td>
                <b style={{ color: "blue" }}>Overall Score:</b>{" "}
              </td>
              <td>
                <b style={{ color: "blue" }}>
                  {clickedProperty.overallScore.toFixed(2)}
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
    return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
  };

  const onHover = (e) => {
    setHovered(true);
    if (e.features) {
      const featureClicked = e.features[0];
      if (featureClicked) {
        setClickedProperty(featureClicked.properties);
        setClickedGeometry(featureClicked.geometry);
      }
    }
  };

  const onClick = (e) => {
    const feature = e.features[0];
    console.log(feature);
    if (feature) {
      console.log(feature.properties);
      setClickedProperty(feature.properties);
      setClickedGeometry(feature.geometry);

      setActiveSidebar(false);
      setHexInfoPopupView(true);
    }
  };

  const onUpdate = useCallback((e) => {
    setFeatureList((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      console.log(newFeatures);
      return Object.values(newFeatures);
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatureList((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      console.log(newFeatures);
      return Object.values(newFeatures);
    });
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.originalEvent.shiftKey) {
      setDragPan(false);
      setBoxZoom(true);
      boxX = e.originalEvent.x;
      boxY = e.originalEvent.y;
      showBox = true;
      setBoxXY([
        [e.originalEvent.x, e.originalEvent.y],
        [e.originalEvent.x, e.originalEvent.y]
      ]);
    }
  }, []);

  const onMouseUp = useCallback((e) => {
    if (e.originalEvent.shiftKey) {
      setDragPan(true);
      setBoxZoom(true);
      showBox = false;
      setBoxXY(box => {
        const bbox = [[...box][0], [e.originalEvent.x, e.originalEvent.y]];
        const features = mapRef.current.queryRenderedFeatures(bbox, {layers: ["current-hex"]});
        setSelectedHexIdList(features.map(item => item.properties.gid));
        return ([[],[]]);
      });
    }
    if (box) {
      box.parentNode.removeChild(box);
      box = null;
    };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (e.originalEvent.shiftKey && showBox) {
      const canvas = mapRef.current.getCanvasContainer();
      if (!box) {
        box = document.createElement('div');
        box.classList.add('boxdraw');
        canvas.appendChild(box);
      }
      
      const minX = Math.min(boxX, e.originalEvent.x),
      maxX = Math.max(boxX, e.originalEvent.x),
      minY = Math.min(boxY, e.originalEvent.y),
      maxY = Math.max(boxY, e.originalEvent.y);
      
      const pos = `translate(${minX}px, ${minY}px)`;
      box.style.transform = pos;
      box.style.width = maxX - minX + 'px';
      box.style.height = maxY - minY + 'px';
    }
  }, []);

  useEffect(() => {
    if (aoi) {
      calcHexValues(aoi.currentHexagons, "current");
      calcHexValues(aoi.futureHexagons, "future");
    }
    if (aoi && dualMap) {
      zoomToAOI(aoi);
    }
  }, [aoi, dualMap]);

  useEffect(() => {
    setSelectedHexIdList(hexIdInBlue);
  }, [hexIdInBlue]);

  useEffect(() => {
    if (selectedHexIdList.length > 0 && (
      restoreAction || protectAction || maintainAction
    )) {
      setFilter(["in", "gid", selectedHexIdList]);
      console.log("Filter Applied!");
    }
  }, [restoreAction, protectAction, maintainAction])

  return (
    <>
      <div>
        {clickedProperty && hexInfoPopupView && (
          <HexInfoPopup
            clickedProperty={clickedProperty}
            currentHexData={currentHexData}
            futureHexData={futureHexData}
            setHexInfoPopupView={setHexInfoPopupView}
          />
        )}

        <Map
          ref={mapRef}
          className="resizeable"
          id="left-map"
          {...viewState}
          padding={leftMapPadding}
          onMoveStart={onLeftMoveStart}
          onMove={activeMap === "left" && onMove}
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          dragPan={dragPan}
          boxZoom={boxZoom}
          getCursor={getCursor}
          style={LeftMapStyle}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={currentInteractiveLayerIds}
        >
          {/* <h2 id="current-title">Current</h2> */}
          {drawingMode && (
            <DrawControl
              displayControlsDefault={false}
              controls={{
                polygon: "true",
                trash: "true",
              }}
              defaultMode="simple_select"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          <div className="resizer resizer-r"></div>
          {aoi && !editAOI && (
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: aoi.geometry,
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
          {!habitatLayer && (
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
          {habitatLayer && (
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
          {habitatLayer === "hab2" && (
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
          {habitatLayer === "hab3" && (
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
          {habitatLayer === "hab4" && (
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
          {habitatLayer === "hab5" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.c4pm2rl8"
                maxzoom={22}
                minzoom={0}
              >
                <Layer
                  type="raster"
                  beforeId="data"
                  id="Mixed_Forest"
                  value="Mixed_Forest"
                  paint={{
                    "raster-opacity": 0.5,
                  }}
                />
              </Source>
              <Legend legendInfo="MF"></Legend>
            </>
          )}
          {habitatLayer === "hab6" && (
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
          {habitatLayer === "blueprint" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.094805mm"
                maxzoom={22}
                minzoom={0}
              >
                <Layer type="raster" id="Blueprint" value="Blueprint" />
              </Source>
            </>
          )}
          {aoi && hexGrid && renderHexGrid(aoi.currentHexagons, "current")}
          {/* {aoi && hexGrid && clickedProperty && renderPopup()} */}
          {!!selectedHexIdList.length && renderSelectedHex(aoi.currentHexagons, selectedHexIdList)}
        </Map>
      </div>
      {dualMap && (
        <Map
          id="right-map"
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" && onMove}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={futureInteractiveLayerIds}
          onClick={onClick}
        >
          {/* <h2 id="future-no-action-title">Future With No Action</h2> */}
          {aoi && !editAOI && (
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: aoi.geometry,
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
          {!habitatLayer && (
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
          {habitatLayer && (
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
          {habitatLayer === "hab2" && (
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
          {habitatLayer === "hab3" && (
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
          {habitatLayer === "hab4" && (
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
          {habitatLayer === "hab5" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.c4pm2rl8"
                maxzoom={22}
                minzoom={0}
              >
                <Layer
                  type="raster"
                  id="Mixed_Forest"
                  value="Mixed_Forest"
                  paint={{
                    "raster-opacity": 0.5,
                  }}
                />
              </Source>
              <Legend legendInfo="MF"></Legend>
            </>
          )}
          {habitatLayer === "hab6" && (
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
          {habitatLayer === "blueprint" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.094805mm"
                maxzoom={22}
                minzoom={0}
              >
                <Layer type="raster" id="Blueprint" value="Blueprint" />
              </Source>
            </>
          )}
          {aoi && hexGrid && renderHexGrid(aoi.futureHexagons, "future")}
          {/* {aoi && hexGrid && hoveredProperty && renderPopup()} */}
          {

          }
        </Map>
      )}
    </>
  );
};

export default MapView;
