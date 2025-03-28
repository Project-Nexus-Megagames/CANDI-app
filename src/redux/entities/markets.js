import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call
import socket from '../../socket'

// Create entity slice of the store
const slice = createSlice({
  name: "markets",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    newmarkets: 0
  },
  // Reducers - Events
  reducers: {
    marketsRequested: (markets, action) => {
      console.log(`${action.type} Dispatched...`)
      markets.loading = true;
    },
    marketsReceived: (markets, action) => {
      console.log(`${action.type} Dispatched...`);
      markets.list = action.payload;
      markets.loading = false;
      markets.lastFetch = Date.now();
      markets.loaded = true;
    },
    marketsRequestFailed: (markets, action) => {
      console.log(`${action.type} Dispatched`)
      markets.loading = false;
    },
    marketAdded: (markets, action) => {
      console.log(`${action.type} Dispatched`)
      markets.list.push(action.payload);
    },
    marketUpdated: (markets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = markets.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? markets.list[index] = action.payload : markets.list.push(action.payload);
    },
    marketDeleted: (markets, action) => {
      console.log(`${action.type} Dispatched`)
      const index = markets.list.findIndex(el => el._id === action.payload._id);
      markets.list.splmarket(index, 1);
    },
  }
});

// Action Export
export const {
  marketAdded,
  marketsReceived,
  marketsRequested,
  marketsRequestFailed,
  marketUpdated,
  marketDeleted
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/markets`;

// Selector
export const getMyMarket = createSelector(
  state => state.markets.list,
  state => state.auth.character,
  (markets, char) => markets.filter(
    market => (market.owner === char._id )
  )
);

export const getTrackers = createSelector(
  state => state.markets.list,
  (markets) => markets.filter(
    market => (market.tags.some(tag => tag === 'tracker') )
  )
);

export const getResourceTrackers = createSelector(
  state => state.markets.list,
  (markets) => markets.filter(
    market => (market.tags.some(tag => tag === 'tracker') && market.tags.some(tag => tag === 'resource'))
  )
);

export const getStockTrackers = createSelector(
  state => state.markets.list,
  (markets) => markets.filter(
    market => (market.tags.some(tag => tag === 'tracker') && market.tags.some(tag => tag === 'stock'))
  )
);

export const getAuctions = createSelector(
  state => state.markets.list,
  (markets) => markets.filter(
    market => (market.tags.some(tag => tag === 'auction') )
  )
);

export const getWorkingAuctions = createSelector(
  state => state.markets.list,
  (markets) => markets.filter(
    market => (market.tags.some(tag => tag === 'auction') && market.status.some(tag => tag === 'working') )
  )
);

// markets Loader into state
export const loadMarkets = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:marketsRequested.type,
      onSuccess: marketsReceived.type,
      onError:marketsRequestFailed.type
    })
  );
};