import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call
import socket from '../../socket'

// Create entity slice of the store
const slice = createSlice({
  name: "ice",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    newice: 0
  },
  // Reducers - Events
  reducers: {
    iceRequested: (ice, action) => {
      console.log(`${action.type} Dispatched...`)
      ice.loading = true;
    },
    iceReceived: (ice, action) => {
      console.log(`${action.type} Dispatched...`);
      ice.list = action.payload;
      ice.loading = false;
      ice.lastFetch = Date.now();
      ice.loaded = true;
    },
    iceRequestFailed: (ice, action) => {
      console.log(`${action.type} Dispatched`)
      ice.loading = false;
    },
    iceAdded: (ice, action) => {
      console.log(`${action.type} Dispatched`)
      ice.list.push(action.payload);
    },
    iceUpdated: (ice, action) => {
      console.log(`${action.type} Dispatched`)
      const index = ice.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? ice.list[index] = action.payload : ice.list.push(action.payload);
    },
    iceDeleted: (ice, action) => {
      console.log(`${action.type} Dispatched`)
      const index = ice.list.findIndex(el => el._id === action.payload._id);
      ice.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  iceAdded,
  iceReceived,
  iceRequested,
  iceRequestFailed,
  iceUpdated,
  iceDeleted
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/ice`;

// Selector
export const getMyIce = createSelector(
  state => state.ice.list,
  state => state.auth.myCharacter,
  (ice, char) => ice.filter(
    ice => (ice.owner === char._id )
  )
);

export const getTeamIce = createSelector(
  state => state.ice.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (ice, account) => ice.filter(
    ice => (ice.account === account._id)
  )
);

// ice Loader into state
export const loadIce = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:iceRequested.type,
      onSuccess: iceReceived.type,
      onError:iceRequestFailed.type
    })
  );
};