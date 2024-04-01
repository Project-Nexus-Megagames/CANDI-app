import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "trades",
  initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    newtrades: 0
  },
  // Reducers - Events
  reducers: {
    tradesRequested: (trades, action) => {
      console.log(`${action.type} Dispatched...`)
      trades.loading = true;
    },
    tradesReceived: (trades, action) => {
      console.log(`${action.type} Dispatched...`);
      trades.list = action.payload;
      trades.loading = false;
      trades.lastFetch = Date.now();
      trades.loaded = true;
    },
    tradesRequestFailed: (trades, action) => {
      console.log(`${action.type} Dispatched`)
      trades.loading = false;
    },
    tradeAdded: (trades, action) => {
      console.log(`${action.type} Dispatched`);
      const index = trades.list.findIndex(el => el._id === action.payload._id);
      if (index === -1) trades.list.push(action.payload);
    },
    tradeDeleted: (trades, action) => {
      console.log(`${action.type} Dispatched`)
      const index = trades.list.findIndex(el => el._id === action.payload._id);
      trades.list.splice(index, 1);
    },
    tradeUpdated: (trades, action) => {
      console.log(`${action.type} Dispatched`)
      const index = trades.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? trades.list[index] = action.payload : trades.list.push(action.payload);
    }
  }
});

// Action Export
export const {
  tradeAdded,
  tradesReceived,
  tradesRequested,
  tradesRequestFailed,
  tradeDeleted,
  tradeUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/trades`;

// Selector

export const getMyTrades = createSelector(
  state => state.trades.list,
  state => state.accounts.list.find(el => el._id === state.auth.myCharacter.account),
  (trades, account) => trades.filter(
    trade => (trade.initiator.account === account._id || trade.tradePartner.account === account._id)
  )
);

export const getTeamTrades = createSelector(
  state => state.trades.list,
  state => state.accounts.list.find(el => el.name === `${state.auth?.team.name}'s Account`),
  (trades, account) => trades.filter(
    trade => (trade.initiator.account === account._id || trade.tradePartner.account === account._id)
  )
);

// trades Loader into state
export const loadTrades = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart: tradesRequested.type,
      onSuccess: tradesReceived.type,
      onError: tradesRequestFailed.type
    })
  );
};