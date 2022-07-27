import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "log",
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
			//gameConfig.name = action.payload.name;
			log.loading = false;
      log.lastFetch = Date.now();
      log.loaded = true;
    },
    logRequestFailed: (log, action) => {
      console.log(`${action.type} Dispatched`)
      log.loading = false;
    }
  }
});

// Action Export
export const {
  logReceived,
  logRequested,
  logRequestFailed,
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/log`;

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