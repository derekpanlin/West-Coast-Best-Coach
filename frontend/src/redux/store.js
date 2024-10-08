import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import coachReducer from "./coach";
import availabilityReducer from "./availability";
import bookingsReducer from "./booking"
import reviewReducer from "./review";

const rootReducer = combineReducers({
  session: sessionReducer,
  coach: coachReducer,
  availability: availabilityReducer,
  bookings: bookingsReducer,
  reviews: reviewReducer

});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
