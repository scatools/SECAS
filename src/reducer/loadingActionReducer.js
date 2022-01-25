import { LOADER } from "../actionType";

const initialState = {
  isLoading: false,
};

const loadingActionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export default loadingActionReducer;
