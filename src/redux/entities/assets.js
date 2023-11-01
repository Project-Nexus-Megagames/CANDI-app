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
    },
    assetAdded: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      assets.list.push(action.payload);
    },
    assetUpdated: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = assets.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? assets.list[index] = action.payload : assets.list.push(action.payload);
    },
    assetDeleted: (assets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = assets.list.findIndex(el => el._id === action.payload._id);
      assets.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  assetAdded,
  assetsReceived,
  assetsRequested,
  assetsRequestFailed,
  assetUpdated,
  assetDeleted
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/assets`;

// Selector
export const getMyUsedAssets = createSelector(
  state => state.assets.list,
  state => state.auth.myCharacter,
  (assets, char) => assets.filter(
    asset => (asset.owner === char.characterName || asset.currentHolder === char.characterName) && (asset.status.used && asset.uses <= 0) 
  )
);

export const getMyAssets = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.myCharacter.characterName}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id )
  )
);

export const getTeamDice = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id && asset.dice.length > 0 )
  )
);

export const getTeamAssets = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id)
  )
);

export const getTeamWorkers = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'worker'))
  )
);

export const getTeamAgents = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'agent'))
  )
);

export const getTeamBrokers = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'broker'))
  )
);


export const getTeamContracts = createSelector(
  state => state.assets.list.filter(el => el.account),
  state => state.accounts.list.find(el => el.name === `${state.auth.team.name}'s Account`),
  (assets, account) => assets.filter(
    asset => (asset.account === account._id && asset.tags.some(tag => tag === 'contract'))
  )
);

export const getPublicContracts = createSelector(
  state => state.assets.list.filter(el => el.account),
  (assets) => assets.filter(
    asset => (asset.status.some(tag => tag === 'public') && asset.tags.some(tag => tag === 'contract'))
  )
);

export const getLocationContracts = createSelector(
  state => state.assets.list.filter(el => el.location),
  (assets) => assets.filter(
    asset => (asset.status.some(tag => tag === 'public') && asset.tags.some(tag => tag === 'contract'))
  )
);

export const getWorkers = createSelector(
  state => state.assets.list.filter(el => el.account),
  (assets) => assets.filter(
    asset => (asset.tags.some(tag => tag === 'worker'))
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