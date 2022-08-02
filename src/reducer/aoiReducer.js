import { INPUT_NEW_AOI, DELETE_AOI, EDIT_AOI } from "../actionType";

const initState = {};

const aoiReducer = (state = initState, action) => {
  switch (action.type) {
    case INPUT_NEW_AOI:
      return { ...state, [action.data.id]: action.data };
    case EDIT_AOI: {
      const newState = { ...state };
      newState[action.id] = action.data;
      return newState;
    }
    case DELETE_AOI: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
};

export default aoiReducer;
