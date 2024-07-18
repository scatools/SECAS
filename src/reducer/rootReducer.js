import { combineReducers } from "redux";
// import dataReducer from './dataReducer';
import aoiReducer from "./aoiReducer";
import weightsReducer from "./weightsReducer";

const rootReducer = combineReducers({
  // data: dataReducer,
  aoi: aoiReducer,
  weights: weightsReducer,
});

export default rootReducer;
