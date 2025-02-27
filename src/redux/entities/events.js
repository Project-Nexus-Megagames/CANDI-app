import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call
import socket from '../../socket'


// Create entity slice of the store
const slice = createSlice({
  name: "events",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
  },
  // Reducers - Events
  reducers: {
    eventsRequested: (events, action) => {
      console.log(`${action.type} Dispatched...`)
      events.loading = true;
    },
    eventsReceived: (events, action) => {
      console.log(`${action.type} Dispatched...`);
      events.list = action.payload;
      events.loading = false;
      events.lastFetch = Date.now();
      events.loaded = true;
    },
    eventsRequestFailed: (events, action) => {
      console.log(`${action.type} Dispatched`)
      events.loading = false;
    },
    eventAdded: (events, action) => {
      console.log(`${action.type} Dispatched`)
      events.list.push(action.payload);
    },
    eventUpdated: (events, action) => {
      console.log(`${action.type} Dispatched`)
      const index = events.list.findIndex(el => el._id === action.payload._id);
      events.list[index] = action.payload;
    }
  }
});

// Action Export
export const {
  eventAdded,
  eventsReceived,
  eventsRequested,
  eventsRequestFailed,
  eventUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/events`;

// // Selector
export const getMyMatches = createSelector(
  state => state.entities.events.list.filter(el => el.__t === "Match"),
  state => state.auth.team,
  (events, team) => events.find(
    event => event.homeTeam._id === team._id || event.awayTeam._id === team._id
  )
);

// events Loader into state
export const loadEvents = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:eventsRequested.type,
      onSuccess: eventsReceived.type,
      onError:eventsRequestFailed.type
    })
  );
};