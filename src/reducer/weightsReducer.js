import {
  CHANGE_MEASURES,
  CHANGE_MEASURES_WEIGHT,
  CHANGE_GOAL_WEIGHTS,
} from "../actionType";

const Init_State = {
  health: {
    selected: null,
    weight: 0,
  },
  function: {
    selected: null,
    weight: 0,
  },
  connect: {
    selected: null,
    weight: 0,
  },
};

const weightsReducer = (state = Init_State, action) => {
  switch (action.type) {
    case CHANGE_MEASURES:
      return {
        ...state,
        [action.goal]: {
          ...state[action.goal],
          selected: action.data,
        },
      };
    case CHANGE_MEASURES_WEIGHT:
      return {
        ...state,
        [action.goal]: {
          ...state[action.goal],
          selected: state[action.goal].selected.map((measure) => {
            if (measure.value === action.label) {
              measure[action.name] = action.value;
            }
            return measure;
          }),
        },
      };
    case CHANGE_GOAL_WEIGHTS:
      return {
        ...state,
        [action.goal]: {
          ...state[action.goal],
          weight: action.value,
        },
      };
    default:
      return state;
  }
};

export default weightsReducer;
