import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapGL, { Layer, Popup, Source } from "react-map-gl";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import bbox from "@turf/bbox";
import axios from "axios";
import { dataLayer } from "./map-style";
import { normalization } from "../helper/aggregateHex";
import DrawControl from "./DrawControl";
import Legend from "./Legend";

//NECESSARY FOR ANTHONY'S TO COMPILE
import mapboxgl from "mapbox-gl";
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
  interactiveLayerIds,
  hexOpacity,
  dualMap,
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
  const [mode, setMode] = useState("side-by-side");
  const [activeMap, setActiveMap] = useState("left");
  const [futureHexGrid, setFutureHexGrid] = useState(null);
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const aoi = aoiList[0];

  const LeftMapStyle = {
    position: "fixed",
    top: "5.7vh",
    width: dualMap ? "50vw" : "100vw",
    height: "94.3vh",
  };

  const RightMapStyle = {
    position: "fixed",
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

  const renderHexGrid = (hexGrid) => {
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

  const getFutureHexGrid = async () => {
    const newList = aoi.geometry;
    const data = {
      type: "MultiPolygon",
      coordinates: newList.map((feature) => feature.geometry.coordinates),
    };
    const res = await axios.post(
      "https://secas-backend.herokuapp.com/data/future",
      {
        data,
      }
    );
    setFutureHexGrid(res.data.data);
  };

  useEffect(() => {
    if (aoi && dualMap) {
      getFutureHexGrid();
    }
  }, [aoi, dualMap]);

  return (
    <>
      <MapGL
        id="left-map"
        {...viewState}
        padding={leftMapPadding}
        onMoveStart={onLeftMoveStart}
        onMove={activeMap === "left" && onMove}
        style={LeftMapStyle}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={interactiveLayerIds}
      >
        {drawingMode && (
          <DrawControl
            displayControlsDefault={false}
            controls={{
              polygon: true,
              trash: true,
            }}
            defaultMode="simple_select"
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
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
              <Layer type="raster" id="Mixed_Forest" value="Mixed_Forest" />
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
              url="mapbox://chuck0520.dkcwxuvl"
              maxzoom={22}
              minzoom={0}
            >
              <Layer type="raster" id="Blueprint" value="Blueprint" />
            </Source>
          </>
        )}
        {aoi && hexGrid && renderHexGrid(aoi.hexagons)}
        {aoi && hexGrid && hoveredProperty && renderPopup()}
      </MapGL>
      {dualMap && (
        <MapGL
          id="right-map"
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" && onMove}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
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
                <Layer type="raster" id="Mixed_Forest" value="Mixed_Forest" />
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
                url="mapbox://chuck0520.dkcwxuvl"
                maxzoom={22}
                minzoom={0}
              >
                <Layer type="raster" id="Blueprint" value="Blueprint" />
              </Source>
            </>
          )}
          {aoi && hexGrid && futureHexGrid && renderHexGrid(futureHexGrid)}
          {aoi && hexGrid && hoveredProperty && renderPopup()}
        </MapGL>
      )}
    </>
  );
};

export default MapView;
