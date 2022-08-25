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
      const index = assets.list.findIndex(
        (el) => el._id === action.payload._id
      );
      assets.list.splice(index, 1);
    },
    assetUpdated: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      const index = assets.list.findIndex(
        (el) => el._id === action.payload._id
      );
      index > -1 ? assets.list[index] = action.payload : assets.list.push(action.payload);
      assets.loading = false;
    },
    assetLent: (assets, action) => {
      console.log(`${action.type} Dispatched`);
      const index = assets.list.findIndex(
        (el) => el._id === action.payload._id
      );
      console.log(index);
      let asset = assets.list[index];
      asset.status.lent = true;
      assets.list[index] = asset;
    },
  },
});

// Action Export
export const {
  assetAdded,
  assetDeleted,
  assetsReceived,
  assetsRequested,
  assetsRequestFailed,
  assetUpdated,
  assetLent,
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/assets`;

// Selector

//export const getAllAssets = createSelector((state) => state.assets.list);

export const getMyUsedAssets = createSelector(
  (state) => state.assets.list,
  (state) =>
    state.characters.list.find(
      (char) => char.username === state.auth.user.username
    ),
  (assets, char) =>
    assets.filter(
      (asset) =>
        (asset.owner === char.characterName ||
          asset.currentHolder === char.characterName) &&
        asset.status.used &&
        asset.uses <= 0
    )
);

export const getMyAssets = createSelector(
  (state) => state.assets.list,
  (state) =>
    state.characters.list.find(
      (char) => char.username === state.auth.user.username
    ),
  (assets, char) =>
    assets.filter(
      (asset) =>
        asset.ownerCharacter === char._id || asset.currentHolder === char._id
    )
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
