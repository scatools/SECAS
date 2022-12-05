import { combineReducers } from "redux";
// import dataReducer from './dataReducer';
import aoiReducer from "./aoiReducer";
import weightsReducer from "./weightsReducer";
import loadingActionReducer from "./loadingActionReducer";

const rootReducer = combineReducers({
  // data: dataReducer,
  aoi: aoiReducer,
  weights: weightsReducer,
  loading: loadingActionReducer,
});

export default rootReducer;
