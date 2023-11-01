import { createSlice, createSelector } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "actionLogs",
	initialState: {
    loading: false,
    loaded: false,
    lastFetch: null
  },
  // Reducers - Events
  reducers: {
    logRequested: (log, action) => {
      console.log(`${action.type} Dispatched...`)
      log.loading = true;
    },
    logReceived: (log, action) => {
			console.log(`${action.type} Dispatched...`);
			log.list = action.payload;
			log.loading = false;
      log.lastFetch = Date.now();
      log.loaded = true;
    },
    logRequestFailed: (log, action) => {
      console.log(`${action.type} Dispatched`)
      log.loading = false;
    },
		logAdded: (log, action) => {
      console.log(`${action.type} Dispatched`);
      log.list.push(action.payload);
    }
  }
});

// Action Export
export const {
  logReceived,
  logRequested,
  logRequestFailed,
  logAdded
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/log`;

export const getGameStateLog = createSelector(
  (state) => state.actionLogs.list,
  (log) =>
    log.filter((el) => el.submodel === "NextRoundLog"));

export const getControlLog = createSelector(
	(state) => state.actionLogs.list,
	(log) =>
		log.filter((el) => el.submodel === "ControlLog"));


// gameConfig Loader into state
export const loadLog = payload => (dispatch) => {
  return dispatch(

    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:logRequested.type,
      onSuccess: logReceived.type,
      onError:logRequestFailed.type
    })

  );
};