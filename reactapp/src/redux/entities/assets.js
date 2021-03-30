import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call
import socket from '../../socket'

// Create entity slice of the store
const slice = createSlice({
  name: "assets",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    newassets: 0
  },
  // Reducers - Events
  reducers: {
    assetsRequested: (assets, action) => {
      console.log(`${action.type} Dispatched...`)
      assets.loading = true;
    },
    assetsReceived: (assets, action) => {
      console.log(`${action.type} Dispatched...`);
      assets.list = action.payload;
      assets.loading = false;
      assets.lastFetch = Date.now();
      assets.loaded = true;
    },
    assetsRequestFailed: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      assets.loading = false;
      socket.emit('trigger', 'updateAssets');
    },
    assetAdded: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      assets.list.push(action.payload);
    },
    assetDeleted: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = assets.list.findIndex(el => el._id === action.payload._id);
      assets.list.splice(index, 1);
    },
    assetUpdated: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = assets.list.findIndex(el => el._id === action.payload._id);
      assets.list[index] = action.payload;
    },
    assetLent: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      const index = assets.list.findIndex(el => el._id === action.payload._id);
      console.log(index);
      let asset = assets.list[index]
      asset.status.lent = true;
      assets.list[index] = asset;
    }
  }
});

// Action Export
export const {
  assetAdded,
  assetDeleted,
  assetsReceived,
  assetsRequested,
  assetsRequestFailed,
  assetUpdated,
  assetLent
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/assets`;

// Selector
export const getMyAssets = createSelector(
  state => state.assets.list,
  state => state.auth.user,
  (assets, user) => assets.find(
    char => char.username === user.username
  )
);

// assets Loader into state
export const loadAssets = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:assetsRequested.type,
      onSuccess: assetsReceived.type,
      onError:assetsRequestFailed.type
    })
  );
};