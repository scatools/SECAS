import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducer/rootReducer";
import { thunk } from "redux-thunk";

//Store
export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
