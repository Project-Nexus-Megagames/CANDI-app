import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { createSelector } from 'reselect'
import { gameServer } from "../../config";

// Create entity slice of the store
const slice = createSlice({
  name: "facilities",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    newfacilities: 0
  },
  // Reducers - Events
  reducers: {
    facilitiesRequested: (facilities, action) => {
      console.log(`${action.type} Dispatched...`)
      facilities.loading = true;
    },
    facilitiesReceived: (facilities, action) => {
      console.log(`${action.type} Dispatched...`);
      facilities.list = action.payload;
      facilities.loading = false;
      facilities.lastFetch = Date.now();
    },
    facilitiesRequestFailed: (facilities, action) => {
      console.log(`${action.type} Dispatched`);
      facilities.loading = false;
    },
    facilityAdded: (facilities, action) => {
      console.log(`${action.type} Dispatched`)
      facilities.list.push(action.payload);
    },
    facilityUpdated: (facilities, action) => {
      console.log(`${action.type} Dispatched...`);
      const index = facilities.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? facilities.list[index] = action.payload : facilities.list.push(action.payload);
      facilities.lastFetch = Date.now();
    },
    facilityDeleted: (facilities, action) => {
      console.log(`${action.type} Dispatched`)
      const index = facilities.list.findIndex(el => el._id === action.payload._id);
      facilities.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  facilityAdded,
  facilityDeleted,
  facilitiesReceived,
  facilitiesRequested,
  facilitiesRequestFailed,
  facilityUpdated

} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/facilities`;

export const getTeamFacilities = createSelector(
  state => state.facilities.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (facilities, account) => facilities.filter(
    asset => (asset.account === account._id)
  )
);

export const getTeamLabs = createSelector(
  state => state.facilities.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (facilities, account) => facilities.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'lab'))
  )
);

export const getTeamServers = createSelector(
  state => state.facilities.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (facilities, account) => facilities.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'server'))
  )
);

export const getTeamFactories = createSelector(
  state => state.facilities.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (facilities, account) => facilities.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'factory'))
  )
);

export const getPresentFacilities = createSelector(
  state => state.facilities.list,
  state => state.characters.list.find(el => el._id === state.auth.myCharacter._id),
  (facilities, myCharacter) => facilities.filter(
    fac => fac.location?._id === myCharacter.location?._id
  )
);

// facility Loader into state
export const loadFacilities = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      onStart: facilitiesRequested.type,
      onSuccess: facilitiesReceived.type,
      onError: facilitiesRequestFailed.type
    })
  );
};

// Add a facility to the list of facilities
export const addfacility = facility =>
  apiCallBegan({
    url,
    method: "post",
    data: facility,
    onSuccess: facilityAdded.type
  });

// Selector

export const getFacilites = createSelector(
  state => state.blueprints.list,
  state => state.auth?.team,
  (blueprints, team) => blueprints.filter(
    facility => facility.team._id === team._id
  )
);