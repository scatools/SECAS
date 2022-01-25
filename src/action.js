import axios from "axios";
// import {LOAD_DATA, CHANGE_MEASURES, CHANGE_MEASURES_WEIGHT, CHANGE_GOAL_WEIGHTS, CALCULATE_VALUE} from './actionType';
import {
  LOAD_DATA,
  CHANGE_MEASURES,
  CHANGE_MEASURES_WEIGHT,
  CHANGE_GOAL_WEIGHTS,
  CALCULATE_VALUE,
  INPUT_NEW_AOI,
  DELETE_AOI,
  EDIT_AOI,
  GENERATE_ASSESSMENT,
  LOADER,
} from "./actionType";

export function getDataFromAPI() {
  return async function (dispatch) {
    let res = await Promise.all([
      axios.get(`http://localhost:5000/data/1`),
      axios.get(`http://localhost:5000/data/2`),
      axios.get(`http://localhost:5000/data/3`),
      // axios.get(`http://localhost:5000/data/4`),
      // axios.get(`http://localhost:5000/data/5`),
      // axios.get(`http://localhost:5000/data/6`),
      // axios.get(`http://localhost:5000/data/7`),
      // axios.get(`http://localhost:5000/data/8`),
      // axios.get(`http://localhost:5000/data/9`),
      // axios.get(`http://localhost:5001/data/10`),
      // axios.get(`http://localhost:5001/data/11`),
      // axios.get(`http://localhost:5001/data/12`),
      // axios.get(`http://localhost:5001/data/13`),
      // axios.get(`http://localhost:5001/data/14`),
      // axios.get(`http://localhost:5001/data/15`),
      // axios.get(`http://localhost:5001/data/16`),
      // axios.get(`http://localhost:5001/data/17`),
      // axios.get(`http://localhost:5001/data/18`),
      // axios.get(`http://localhost:5001/data/19`),
      // axios.get(`http://localhost:5002/data/20`),
      // axios.get(`http://localhost:5002/data/21`),
      // axios.get(`http://localhost:5002/data/22`),
      // axios.get(`http://localhost:5002/data/23`),
      // axios.get(`http://localhost:5002/data/24`),
      // axios.get(`http://localhost:5002/data/25`),
      // axios.get(`http://localhost:5002/data/26`),
      // axios.get(`http://localhost:5002/data/27`),
      // axios.get(`http://localhost:5002/data/28`),
      // axios.get(`http://localhost:5002/data/29`),
      // axios.get(`http://localhost:5003/data/30`),
      // axios.get(`http://localhost:5003/data/31`),
      // axios.get(`http://localhost:5003/data/32`),
      // axios.get(`http://localhost:5003/data/33`),
      // axios.get(`http://localhost:5003/data/34`),
      // axios.get(`http://localhost:5003/data/35`),
      // axios.get(`http://localhost:5003/data/36`),
      // axios.get(`http://localhost:5003/data/37`),
      // axios.get(`http://localhost:5003/data/38`),
      // axios.get(`http://localhost:5003/data/39`),
      // axios.get(`http://localhost:5003/data/40`)
    ]);
    const newData = { type: "FeatureCollection", features: [] };
    res.forEach((response) => {
      newData.features = [
        ...newData.features,
        ...response.data.data[0].jsonb_build_object.features,
      ];
    });
    dispatch(gotData(newData));
  };
}

function gotData(data) {
  return { type: LOAD_DATA, data };
}

export function calculateValue(weights) {
  return { type: CALCULATE_VALUE, weights };
}

export function changeMeasures(goal, data) {
  return { type: CHANGE_MEASURES, goal, data };
}

export function changeMeasuresWeight(value, name, label, goal) {
  return {
    type: CHANGE_MEASURES_WEIGHT,
    goal,
    value,
    name,
    label,
  };
}

export function changeGoalWeights(value, goal) {
  return {
    type: CHANGE_GOAL_WEIGHTS,
    value,
    goal,
  };
}

export function input_aoi(data) {
  return {
    type: INPUT_NEW_AOI,
    data,
  };
}

export function delete_aoi(id) {
  return {
    type: DELETE_AOI,
    id,
  };
}

export function edit_aoi(id, data) {
  return {
    type: EDIT_AOI,
    id,
    data,
  };
}

export function generate_assessment(data) {
  return {
    type: GENERATE_ASSESSMENT,
    data,
  };
}

export const setLoader = (loading) => {
  return {
    type: LOADER,
    payload: loading,
  };
};
