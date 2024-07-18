import React, { useEffect, useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RangeSlider from "react-bootstrap-range-slider";
import { MdViewList, MdEdit, MdDelete } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { GiHexes } from "react-icons/gi";
import Draggable from "react-draggable";
import Switch from "react-switch";
import { v4 as uuid } from "uuid";
import area from "@turf/area";
import axios from "axios";
import { delete_aoi, edit_aoi } from "../action";
import { getAoiScore } from "../helper/aggregateHex";
import SidebarViewGroup from "./SidebarViewGroup";

const SidebarViewDetail = ({
  setHabitatLayer,
  aoiSelected,
  setAoiSelected,
  setActiveSidebar,
  setActiveTable,
  setDrawingMode,
  editAOI,
  setEditAOI,
  featureList,
  setAlerttext,
  hexData,
  hexGrid,
  setHexGrid,
  setViewState,
  hexOpacity,
  setHexOpacity,
  setDualMap,
  zoomToAOI,
  setView,
}) => {
  const [aoiName, setAoiName] = useState("");
  const [aoiScore, setAoiScore] = useState({});
  const [scoreStyle, setScoreStyle] = useState({});
  const [conditionChecked, setConditionChecked] = useState(false);
  const [stochasticityChecked, setStochasticityChecked] = useState(true);
  const [overlayChecked, setOverlayChecked] = useState(false);
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const aoi = aoiList[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateArea = (input) => {
    let totalArea = 0;
    if (input.length > 0) {
      totalArea =
        input.reduce((a, b) => {
          return a + area(b);
        }, 0) / 1000000;
    }
    return totalArea;
  };

  const handleEdit = async () => {
    if (!aoiName) {
      setAlerttext("Name is required.");
    } else {
      setEditAOI(false);
      setAlerttext(false);
      const newList = featureList;
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      // const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
      const planArea = calculateArea(newList);
      dispatch(
        edit_aoi(aoi.id, {
          name: aoiName,
          area: planArea,
          // geometry: newList.length ? newList: aoi[0].geometry,
          // hexagons: newList.length ? res.data.data: aoi[0].hexagons ,
          // rawScore: newList.length ? aggregate(res.data.data,planArea): aoi[0].rawScore,
          // scaleScore: newList.length ? getStatus(aggregate(res.data.data,planArea)): aoi[0].scaleScore,
          id: aoi.id,
        })
      );
      setDrawingMode(false);
    }
  };

  const handleReport = () => {
    navigate("/report");
  };

  const handleDownload = () => {
    let pageHTMLObject = document.getElementsByClassName("AoiTable")[0];
    let pageHTML = pageHTMLObject.outerHTML;
    let tempElement = document.createElement("a");

    tempElement.href =
      "data:text/html;charset=UTF-8," + encodeURIComponent(pageHTML);
    tempElement.target = "_blank";
    tempElement.download = "report.html";
    tempElement.click();
  };

  const onConditionChange = () => {
    if (!conditionChecked) {
      setDualMap(true);
      setActiveSidebar(false);
    } else {
      setDualMap(false);
    }
    setConditionChecked(!conditionChecked);
  };

  const onStochasticityChange = () => {
    setStochasticityChecked(!stochasticityChecked);
  };

  const onOverLayChange = () => {
    if (!overlayChecked) {
      setHabitatLayer("blueprint");
    } else {
      setHabitatLayer("none");
    }
    setOverlayChecked(!overlayChecked);
  };

  useEffect(() => {
    if (aoi && hexData) {
      const scores = getAoiScore(hexData.features);
      setAoiScore(scores);
      console.log(scores);
    };
  }, [hexData]);

  useEffect(() => {
    let styles = {
      currentStyle: aoiScore.currentScore < aoiScore.futureScore ? { color: "coral" } : { color: "limegreen" },
      futureStyle: aoiScore.futureScore < aoiScore.currentScore ? { color: "coral" } : { color: "limegreen" },
    };
    setScoreStyle(styles);
  }, [aoiScore])

  useEffect(() => {
    setHexGrid(true);
  }, []);

  return (
    <Container>
      <SidebarViewGroup
        aoiSelected={aoiSelected}
        setAoiSelected={setAoiSelected}
        zoomToAOI={zoomToAOI}
      />
      {aoi && (
        <Container className="aoi-details">
          <h2>{aoi.name} Details:</h2>
          <h4>
            Current HFC Score:{" "}
            <span style={scoreStyle.currentStyle}>{aoiScore.currentScore}</span>
          </h4>
          <h4>
            Future HFC Score:{" "}
            <span style={scoreStyle.futureStyle}>{aoiScore.futureScore}</span>
          </h4>
          <ul>
            <li>
              This area of interest has an area of{" "}
              {Math.round(aoi.area * 100) / 100} km<sup>2</sup>
            </li>
            <li>
              This area of interest contains {aoi.currentHexagons.length}{" "} hexagons
            </li>
            <li>
              The HFC score of this area will drop{" "}
              {Math.round(100 - 100*aoiScore.futureScore/aoiScore.currentScore)}
              % in year 2060 with no conservation actions compared to current condition
            </li>
          </ul>
          <div
            className="d-flex justify-content-between"
            style={{ margin: "10px", width: "100%" }}
          >
            <label>
              Southeast Blueprint Layer
              <Switch
                className="toggle-switch"
                checked={overlayChecked}
                onChange={onOverLayChange}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={15}
                width={36}
              />
            </label>
            <label>
              Future Condition
              <Switch
                className="toggle-switch"
                checked={conditionChecked}
                onChange={onConditionChange}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={15}
                width={36}
              />
            </label>
          </div>
          <Button
            variant="dark"
            className="ml-2 mb-2"
            onClick={() => {
              setActiveTable(aoiSelected);
            }}
          >
            <MdViewList /> &nbsp; View
          </Button>
          <Button
            variant="dark"
            className="ml-2 mb-2"
            onClick={() => {
              setEditAOI(true);
              setDrawingMode(true);
              setAoiName(aoi.name);
            }}
          >
            <MdEdit /> &nbsp; Edit
          </Button>
          <Button
            variant="dark"
            className="ml-2 mb-2"
            onClick={() => {
              setActiveTable(false);
              dispatch(delete_aoi(aoi.id));
            }}
          >
            <MdDelete /> &nbsp; Delete
          </Button>
          <Button variant="dark" className="ml-2 mb-2" onClick={handleReport}>
            <HiDocumentReport /> &nbsp; Report
          </Button>
          <Button
            variant="dark"
            className="ml-2 mb-2"
            onClick={() => {
              setHexGrid(!hexGrid);
            }}
          >
            <GiHexes /> &nbsp;
            {hexGrid ? "Hide Hexagon Grid" : "Show Hexagon Grid"}
          </Button>
          {editAOI && (
            <>
              <hr />
              <InputGroup className="mb-3" style={{ width: "60%" }}>
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">
                    Plan Name:
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  name="planName"
                  value={aoiName}
                  onChange={(e) => {
                    setAoiName(e.target.value);
                  }}
                  placeholder="Name area of interest here..."
                />
              </InputGroup>
              <Button
                variant="dark"
                // onClick={handleEdit}
              >
                Finalize Changes
              </Button>
            </>
          )}
          {hexGrid && (
            <div
              className="d-flex justify-content-between"
              style={{ margin: "10px", width: "80%" }}
            >
              <h6>Opacity: </h6>
              <RangeSlider
                step={1}
                value={hexOpacity}
                onChange={(e) => setHexOpacity(e.target.value)}
                variant="secondary"
              />
            </div>
          )}
          <Button
            variant="primary"
            onClick={() => {
              setView("act");
            }}
          >
            Take Action
          </Button>
        </Container>
      )}
      <Draggable cancel=".dont-drag-me">
        <div id="floating-layer-controls">
          <label>
            Southeast Blueprint Layer
            <Switch
              className="toggle-switch"
              checked={overlayChecked}
              onChange={onOverLayChange}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={15}
              width={36}
            />
          </label>
          <label>
            Future Condition
            <Switch
              className="toggle-switch"
              checked={conditionChecked}
              onChange={onConditionChange}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={15}
              width={36}
            />
          </label>
          <label>
            Deterministic Model
            <Switch
              className="toggle-switch"
              checked={stochasticityChecked}
              onChange={onStochasticityChange}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={15}
              width={36}
            />
            Stochastic Model
          </label>
          <label>
            <GiHexes /> &nbsp;
            {hexGrid ? "Hide Hexagon Grid" : "Show Hexagon Grid"}
            <Switch
              className="toggle-switch"
              checked={hexGrid}
              onChange={() => {
                setHexGrid(!hexGrid);
              }}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={15}
              width={36}
            />
          </label>
          {hexGrid && (
            <div className="range-slider-container">
              <h6>Hex Grid Opacity: </h6>
              <RangeSlider
                className="dont-drag-me"
                step={1}
                value={hexOpacity}
                onChange={(e) => setHexOpacity(e.target.value)}
                variant="primary"
              />
            </div>
          )}
        </div>
      </Draggable>
    </Container>
  );
};

export default SidebarViewDetail;
