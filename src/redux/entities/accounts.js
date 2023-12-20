import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { apiCallBegan } from "../api"; // Import Redux API call
import { createSelector } from 'reselect'
import { gameServer } from "../../config";

// Create entity slice of the store
const slice = createSlice({
  name: "accounts",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    newaccounts: 0
  },
  // Reducers - Events
  reducers: {
    accountsRequested: (accounts, action) => {
      console.log(`${action.type} Dispatched...`);
      accounts.loading = true;
    },
    accountsReceived: (accounts, action) => {
      console.log(`${action.type} Dispatched...`);
      accounts.list = action.payload;
      accounts.loading = false;
      accounts.lastFetch = Date.now();
      accounts.loading = true;
    },
    accountsRequestFailed: (accounts, action) => {
      console.log(`${action.type} Dispatched`)
      accounts.loading = false;
    },
    accountAdded: (accounts, action) => {
      console.log(`${action.type} Dispatched`)
      accounts.list.push(action.payload);
    },
    accountUpdated: (accounts, action) => {
      console.log(`${action.type} Dispatched`)
      const index = accounts.list.findIndex(el => el._id === action.payload._id);
			accounts.list[index] = action.payload;
      accounts.lastFetch = Date.now();
    },
		accountDeleted: (accounts, action) => {
      console.log(`${action.type} Dispatched`)
      const index = accounts.list.findIndex(el => el._id === action.payload._id);
      accounts.list.splice(index, 1);
    },
  }
});

// Action Export
export const {
  accountAdded,
  accountUpdated,
	accountDeleted,
  accountsReceived,
  accountsRequested,
  accountsRequestFailed
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/accounts`;

// account Loader into state
export const loadAccounts = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      onStart:accountsRequested.type,
      onSuccess:accountsReceived.type,
      onError:accountsRequestFailed.type
    })
  );
};

// Selector
export const getTeamAccount = createSelector(
    state => state.accounts.list.filter(el => el.team),
    state => state.auth.team,
    (accounts, team) => accounts.find(account => account.team?._id === team?._id) || undefined
);

export const getCharAccount = createSelector(
  state => state.accounts.list.filter(el => el.type === 'individual'),
  state => state.auth.myCharacter,
  (accounts, char) => accounts.find(account => account.manager === char?._id)
);
