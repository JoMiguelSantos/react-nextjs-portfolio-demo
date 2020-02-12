import { composeWithDevTools } from "redux-devtools-extension";
import applicationsReducer from "./reducers/applications";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== "production") {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const initStore = () => {
  return createStore(
    combineReducers({
      applications: applicationsReducer
    }),
    bindMiddleware([thunkMiddleware])
  );
};
