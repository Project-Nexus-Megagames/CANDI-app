import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "assets",
  initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    failedAttempts: 0,
  },
  // Reducers - Events
  reducers: {
    assetsRequested: (assets, action) => {
      console.log(`${action.type} Dispatched...`);
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
      console.log(`${action.type} Dispatched`);
      assets.failedAttempts++;
      assets.loading = false;
    },
    assetAdded: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      assets.list.push(action.payload);
    },
    assetDeleted: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      const index = assets.list.findIndex((el) => el._id === action.payload._id);
      assets.list.splice(index, 1);
    },
    assetUpdated: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      const index = assets.list.findIndex((el) => el._id === action.payload._id);
      index > -1 ? (assets.list[index] = action.payload) : assets.list.push(action.payload);
      assets.loading = false;
    },
  },
});

// Action Export
export const { assetAdded, assetDeleted, assetsReceived, assetsRequested, assetsRequestFailed, assetUpdated } = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/assets`;

// Selector

//export const getAllAssets = createSelector((state) => state.assets.list);

export const getMyUsedAssets = createSelector(
  (state) => state.assets.list,
  state => state.auth.myCharacter,
  (assets, char) => assets.filter((asset) => (asset.owner === char.characterName || asset.sharedWith.some(char => char._id === char._id)) && asset.some(s => s === 'used') && asset.uses <= 0)
);

export const getMyAssets = createSelector(
  (state) => state.assets.list,
  state => state.auth.myCharacter,
  (assets, char) => assets.filter((asset) => asset.ownerCharacter === char._id || asset.sharedWith.some(c => c._id === char._id))
);

export const getGodBonds = createSelector(
  (state) => state.assets.list,
  (assets) => assets.filter((asset) => asset.type === "GodBond")
);

export const getMortalBonds = createSelector(
  (state) => state.assets.list,
  (assets) => assets.filter((asset) => asset.type === "MortalBond")
);

// assets Loader into state
export const loadAssets = (payload) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "get",
      data: payload,
      onStart: assetsRequested.type,
      onSuccess: assetsReceived.type,
      onError: assetsRequestFailed.type,
    })
  );
};
