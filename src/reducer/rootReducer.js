import {combineReducers} from 'redux';
// import dataReducer from './dataReducer';
import weightsReducer from './weightsReducer';

const rootReducer = combineReducers({
    // data: dataReducer, 
    weights: weightsReducer})

export default rootReducer;