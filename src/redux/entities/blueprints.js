import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { createSelector } from 'reselect'
import { gameServer } from "../../config";

const slice = createSlice({
  name: "blueprints",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    blueprintsRequested: (blueprints, action) => {
      console.log(`${action.type} Dispatched...`)
      blueprints.loading = true;
    },
    blueprintsReceived: (blueprints, action) => {
      console.log(`${action.type} Dispatched...`);
      blueprints.list = action.payload;
      blueprints.loading = false;
      blueprints.lastFetch = Date.now();
    },
    blueprintsRequestFailed: (blueprints, action) => {
      console.log(`${action.type} Dispatched`)
      blueprints.loading = false;
    },
    blueprintAdded: (blueprints, action) => {
      console.log(`${action.type} Dispatched`)
      blueprints.list.push(action.payload);
    },
    blueprintUpdated: (blueprints, action) => {
      console.log(`${action.type} Dispatched...`);
      const index = blueprints.list.findIndex(el => el._id === action.payload._id);
      blueprints.list[index] = action.payload;
      blueprints.lastFetch = Date.now();
    },
    blueprintDeleted: (blueprints, action) => {
      console.log(`${action.type} Dispatched`)
      const index = blueprints.list.findIndex(el => el._id === action.payload._id);
      blueprints.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  blueprintAdded,
  blueprintUpdated,
  blueprintDeleted,
  blueprintsReceived,
  blueprintsRequested,
  blueprintsRequestFailed
} = slice.actions;

export default slice.reducer; // Reducer Export

export const getLabs = createSelector(
  state => state.blueprints.list,
  (blueprints) => blueprints.filter(
    blue => (blue.tags.some(tag => tag === 'lab'))
  )
);

export const getFactories = createSelector(
  state => state.blueprints.list,
  (blueprints) => blueprints.filter(
    blue => (blue.tags.some(tag => tag === 'factory'))
  )
);

export const getTeamResearched = createSelector(
  state => state.blueprints.list,
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (blueprints, account) => blueprints.filter(
    blue => (blue.researched.some(r => r == account._id))
  )
);

export const getIce = createSelector(
  state => state.blueprints.list,
  (blueprints) => blueprints.filter(
    blue => (blue.tags.some(tag => tag === 'ice') || blue.__t === "IceBlueprint")
  )
);

const url = `${gameServer}api/blueprints`;

// blueprints Loader into state
export const loadBlueprints = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      onStart: blueprintsRequested.type,
      onSuccess: blueprintsReceived.type,
      onError: blueprintsRequestFailed.type
    })
  );
};

// Add a blueprint to the list of blueprints
export const addBlueprints = blueprint =>
  apiCallBegan({
    url,
    method: "post",
    data: blueprint,
    onSuccess: blueprintAdded.type
  });