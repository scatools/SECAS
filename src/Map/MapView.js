import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import { useSelector } from "react-redux";
import { Modal, ProgressBar, Table } from "react-bootstrap";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import axios from "axios";
import { v4 as uuid } from "uuid";
import WebMercatorViewport from "viewport-mercator-project";
import RouterContext from "../Router.js";
import { dataLayer, secasLayer } from "./map-style";
import { input_aoi, getDataFromAPI, setLoader } from "../action";
import { getHexagonScore, getStochasticScore } from "../helper/aggregateHex";
import DrawControl from "./DrawControl";
import Legend from "./Legend";
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
  hexData,
  setHexData,
  actionHexData,
  hexGrid,
  currentInteractiveLayerIds,
  setCurrentInteractiveLayerIds,
  futureInteractiveLayerIds,
  setFutureInteractiveLayerIds,
  hexOpacity,
  dualMap,
  hexIdInBlue,
  actionScores,
  setActiveSidebar,
  progress,
  setProgress,
  showProgress,
  setShowProgress
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
  const [hexInfoPopupView, setHexInfoPopupView] = useState(false);
  const [selectedHexIdList, setSelectedHexIdList] = useState(hexIdInBlue);
  const [boxXY, setBoxXY] = useState([[],[]]);
  const [dragPan, setDragPan] = useState(true);
  const [boxZoom, setBoxZoom] = useState(true);

  const hideProgress = () => {
    setShowProgress(false);
  };

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

  const renderSelectedHex = (hexGrid, hexIdList) => {
    const hexFeatureList = hexGrid.filter((hex) => 
      hexIdList.includes(hex.gid)
    ).map((hex) => {
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: { 
          gid: hex.gid,
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
            "fill-color":"transparent",
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
              <td>Estuarine Coastal Condition:</td>
              <td>{clickedProperty.estcc}</td>
            </tr>
            <tr>
              <td>Fire Frequency:</td>
              <td>{clickedProperty.firef}</td>
            </tr>
            <tr>
              <td>Great Plains Perennial Grass:</td>
              <td>{clickedProperty.gppgr}</td>
            </tr>
            <tr>
              <td>Imperiled Aquatic Species:</td>
              <td>{clickedProperty.impas}</td>
            </tr>
            <tr>
              <td>Interior Southeast Grasslands:</td>
              <td>{clickedProperty.isegr}</td>
            </tr>
            <tr>
              <td>MAV Forest Birds Protection:</td>
              <td>{clickedProperty.mavbp}</td>
            </tr>
            <tr>
              <td>MAV Forest Birds Restoration:</td>
              <td>{clickedProperty.mavbr}</td>
            </tr>
            <tr>
              <td>Natural Landcover Floodplains:</td>
              <td>{clickedProperty.nlcfp}</td>
            </tr>
            <tr>
              <td>Permeable Surface:</td>
              <td>{clickedProperty.persu}</td>
            </tr>
            <tr>
              <td>Playas:</td>
              <td>{clickedProperty.playa}</td>
            </tr>
            <tr>
              <td>Resilient Coastal Sites:</td>
              <td>{clickedProperty.rescs}</td>
            </tr>
            <tr>
              <td>Resilient Terrestrial Sites:</td>
              <td>{clickedProperty.rests}</td>
            </tr>
            <tr>
              <td>South Atlantic Beach Birds:</td>
              <td>{clickedProperty.safbb}</td>
            </tr>
            <tr>
              <td>South Atlantic Forest Birds:</td>
              <td>{clickedProperty.saffb}</td>
            </tr>
            <tr>
              <td>West Coastal Plain Ouachitas Forested Wetlands:</td>
              <td>{clickedProperty.wcofw}</td>
            </tr>
            <tr>
              <td>West Coastal Plain Ouachitas Open Pine Bird:</td>
              <td>{clickedProperty.wcopb}</td>
            </tr>
            <tr>
              <td>West Gulf Coast Mottled Duck Nesting:</td>
              <td>{clickedProperty.wgcmd}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Function: </b>{" "}
              </td>
            </tr>
            <tr>
              <td>Greenways Trails:</td>
              <td>{clickedProperty.grntr}</td>
            </tr>
            <tr>
              <td>South Atlantic Low-density Urban Historic Sites:</td>
              <td>{clickedProperty.saluh}</td>
            </tr>
            <tr>
              <td>Urban Park Size:</td>
              <td>{clickedProperty.urbps}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <b>Connectivity:</b>{" "}
              </td>
            </tr>
            <tr>
              <td>Gulf Migratory Fish Connectivity: </td>
              <td>{clickedProperty.gmgfc}</td>
            </tr>
            <tr>
              <td>Intact Habitat Cores:</td>
              <td>{clickedProperty.ihabc}</td>
            </tr>
            <tr>
              <td>Network Complexity:</td>
              <td>{clickedProperty.netcx}</td>
            </tr>
            <tr>
              <td>
                <b style={{ color: "blue" }}>Overall Current Score:</b>{" "}
              </td>
              <td>
                <b style={{ color: "blue" }}>
                  {clickedProperty.currentScore.toFixed(2)}
                </b>
              </td>
            </tr>
          </tbody>
        </Table>
      </Popup>
    );
  };

  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
  };

  const onHover = (e) => {
    setHovered(true);
    if (e.features) {
      const clickedFeature = e.features[0];
      if (clickedFeature) {
        setClickedProperty(clickedFeature.properties);
        setClickedGeometry(clickedFeature.geometry);
      }
    }
  };

  const onClick = (e) => {
    if (e.features) {
      const clickedFeature = e.features[0];
      if (clickedFeature) {
        setClickedProperty(clickedFeature.properties);
        setClickedGeometry(clickedFeature.geometry);
        setActiveSidebar(false);
        setHexInfoPopupView(true);
      }
    }
  };

  const onUpdate = useCallback((e) => {
    setFeatureList((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return Object.values(newFeatures);
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatureList((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
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
    if (aoi && aoi.currentHexagons) {
      setShowProgress(true);
      const hexFeatureList = aoi.currentHexagons.map((hex, index) => {
        setProgress(Math.round(index/aoi.currentHexagons.length*75) + 25);
        // Use medoid score for deterministic model
        const rawScore = {
          estcc: hex.estcc_mi,
          firef: hex.firef_mi,
          gmgfc: hex.gmgfc_mi,
          gppgr: hex.gppgr_mi,
          grntr: hex.grntr_mi,
          ihabc: hex.ihabc_mi,
          impas: hex.impas_mi,
          isegr: hex.isegr_mi,
          mavbp: hex.mavbp_mi,
          mavbr: hex.mavbr_mi,
          netcx: hex.netcx_mi,
          nlcfp: hex.nlcfp_mi,
          persu: hex.persu_mi,
          playa: hex.playa_mi,
          rescs: hex.rescs_mi,
          rests: hex.rests_mi,
          safbb: hex.safbb_mi,
          saffb: hex.saffb_mi,
          saluh: hex.saluh_mi,
          urbps: hex.urbps_mi,
          wcofw: hex.wcofw_mi,
          wcopb: hex.wcopb_mi,
          wgcmd: hex.wgcmd_mi,
          futurePenalty: hex.futv2_me
        };
        const rawHexagonScore = getHexagonScore(rawScore);

        // Use stochastic score for stochastic model
        // const stochasticScore = getStochasticScore(hex);
        // const stochasticHexagonScore = getHexagonScore(stochasticScore);

        return {
          type: "Feature",
          geometry: JSON.parse(hex.geometry),
          properties: {
            ...rawScore,
            ...rawHexagonScore,
            gid: hex.gid,
            objectid: hex.objectid,
          },
        };
      });

      const hexData = {
        type: "FeatureCollection",
        features: hexFeatureList,
      };

      setHexData(hexData);
      setShowProgress(false);
    }
  }, [aoi]);

  useEffect(() => {
    if (aoi && dualMap) {
      zoomToAOI(aoi);
    }
  }, [aoi, dualMap]);

  useEffect(() => {
    setSelectedHexIdList(hexIdInBlue);
  }, [hexIdInBlue]);

  return (
    <>
      <div>
        <Modal show={showProgress} onHide={hideProgress}>
          <Modal.Header closeButton>
            <Modal.Title>
              {/* {progress < 25 ? "Processing your data..." : "Running stochastic models..."} */}
              Processing your data...
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ProgressBar now={progress} label={progress + "%"} />
            </div>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
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
          {dualMap && (
            <h6 className="current-map-title">
              Current Condition
            </h6>
          )}
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
              url="mapbox://chuck0520.71skk0hu"
              maxzoom={22}
              minzoom={0}
            >
              <Layer
                {...secasLayer}
              />
            </Source>
          )}
          {habitatLayer && (
            <Source
              type="vector"
              url="mapbox://chuck0520.71skk0hu"
              maxzoom={22}
              minzoom={0}
            >
              <Layer
                {...secasLayer}
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
          {habitatLayer === "blueprint" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.094805mm"
                maxzoom={22}
                minzoom={0}
              >
                <Layer
                  type="raster"
                  id="Blueprint"
                  value="Blueprint"
                  beforeId="current-hex"
                  paint={{"raster-opacity": 0.5}}
                />
              </Source>
            </>
          )}
          {aoi && hexGrid && hexData && !actionHexData &&
            <>
              <Source type="geojson" data={hexData}>
                <Layer
                  id="current-hex"
                  type="fill"
                  filter={["!", filter]}
                  paint={{
                    "fill-color": {
                      property: "currentScore",
                      stops: [
                        [0.1, "#aefff0"],
                        [0.3, "#00d8f2"],
                        [0.5, "#00a7e4"],
                        [0.7, "#007ad0"],
                        [0.9, "#5d00d8"],
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
          }
          {aoi && hexGrid && hexData && actionHexData &&
            <>
              {/* Must set unique key for forced rerendering */}
              <Source key={uuid()} type="geojson" data={actionHexData}>
                <Layer
                  id="future-hex-action"
                  type="fill"
                  filter={["!", filter]}
                  paint={{
                    "fill-color": {
                      property: "actionScore",
                      stops: [
                        [0.1, "#aefff0"],
                        [0.3, "#00d8f2"],
                        [0.5, "#00a7e4"],
                        [0.7, "#007ad0"],
                        [0.9, "#5d00d8"],
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
          }
          {aoi && hexGrid && clickedProperty && renderPopup()}
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
          onLoad={getDataFromAPI}
        >
          <h6 className="future-map-title">
            Future Condition
            <br/>
            (No Action)
          </h6>
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
              url="mapbox://chuck0520.71skk0hu"
              maxzoom={22}
              minzoom={0}
            >
              <Layer
                {...secasLayer}
              />
            </Source>
          )}
          {habitatLayer && (
            <Source
              type="vector"
              url="mapbox://chuck0520.71skk0hu"
              maxzoom={22}
              minzoom={0}
            >
              <Layer
                {...secasLayer}
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
          {habitatLayer === "blueprint" && (
            <>
              <Source
                type="raster"
                url="mapbox://chuck0520.094805mm"
                maxzoom={22}
                minzoom={0}
              >
                <Layer
                  type="raster"
                  id="Blueprint"
                  value="Blueprint"
                  beforeId="future-hex"
                  paint={{"raster-opacity": 0.5}}
                />
              </Source>
            </>
          )}
          {aoi && hexGrid && hexData &&
            <>
              <Source type="geojson" data={hexData}>
                <Layer
                  id="future-hex-no-action"
                  type="fill"
                  filter={["!", filter]}
                  paint={{
                    "fill-color": {
                      property: "futureScore",
                      stops: [
                        [0.1, "#aefff0"],
                        [0.3, "#00d8f2"],
                        [0.5, "#00a7e4"],
                        [0.7, "#007ad0"],
                        [0.9, "#5d00d8"],
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
          }
          {/* {aoi && hexGrid && hoveredProperty && renderPopup()} */}
        </Map>
      )}
    </>
  );
};

export default MapView;
