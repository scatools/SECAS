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
    var startTime = (new Date()).getTime();
    let res = await Promise.all([
      axios.get(`https://secas-backend.herokuapp.com/data/1`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/aesfh`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/amifh`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/cshcd`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/egcpb`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/eqapp`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/estcc`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/firef`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/gmgfc`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/gppgr`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/grntr`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/ihabc`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/impas`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/isegr`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/mavbp`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/mavbr`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/netcx`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/nlcfp`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/persu`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/playa`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/rescs`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/rests`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/saamr`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/safbb`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/saffb`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/saluh`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/samaf`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/stcwl`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/urbps`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/wcofw`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/wcopb`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/wgcmd`),
      // axios.get(`https://secas-backend.herokuapp.com/data/current/wvias`)
    ]);
    var endTime = (new Date()).getTime();
    var responseTime = endTime - startTime;
    console.log("Elapsed Time: " + responseTime + "ms");
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

export async function getCurrentData(data) {
    var startTime = (new Date()).getTime();
    let futureResult = await axios.post(`https://secas-backend.herokuapp.com/data/future`, { data });
    let gidList = futureResult.data.data.map((feature) => feature.gid);
    let currentResult = await Promise.all([
      axios.post(`https://secas-backend.herokuapp.com/data/current/estcc`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/firef`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/gmgfc`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/gppgr`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/grntr`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/ihabc`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/impas`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/isegr`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/mavbp`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/mavbr`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/netcx`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/nlcfp`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/persu`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/playa`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/rescs`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/rests`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/safbb`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/saffb`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/saluh`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/urbps`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/wcofw`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/wcopb`, { data: gidList }),
      axios.post(`https://secas-backend.herokuapp.com/data/current/wgcmd`, { data: gidList }),
    ]);

    var endTime = (new Date()).getTime();
    var responseTime = endTime - startTime;
    console.log("Elapsed Time: " + responseTime + "ms");

    const currentDataArray = currentResult.map((item) => item.data.data);
    const futureDataArray = futureResult.data.data;
    console.log(currentDataArray);
    console.log(futureDataArray);
    let mergedDataArray = futureDataArray;
    mergedDataArray.forEach((feature, index) => {
      currentDataArray.forEach((item) => {
        Object.assign(feature, item[index]);
      });
    });
    
    // Parse all the indicator statistics into floating-point numbers
    mergedDataArray = mergedDataArray.map(entry => 
      Object.entries(entry).reduce(
        (obj, [key, value]) => (obj[key] = isNaN(parseFloat(value)) ? value : parseFloat(value), obj), 
        {}
      )
    );

    return mergedDataArray;
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
