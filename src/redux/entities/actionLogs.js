import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "actionLogs",
  initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    failedAttempts: 0,
    filter: ''
  },
  // Reducers - actionLogs
  reducers: {
    actionLogsRequested: (actionLogs, action) => {
      console.log(`${action.type} Dispatched...`)
      actionLogs.loading = true;
    },
    actionLogsReceived: (actionLogs, action) => {
      console.log(`${action.type} Dispatched...`);

      if (action.payload.length > 50) {
        actionLogs.list = action.payload.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 50);
      }
      else {
        actionLogs.list = action.payload;
      }

      actionLogs.loading = false;
      actionLogs.lastFetch = Date.now();
      actionLogs.loaded = true;
    },
    actionLogsRequestFailed: (actionLogs, action) => {
      console.log(`${action.type} Dispatched`)
      actionLogs.loading = false;
      actionLogs.failedAttempts++;
    },
    actionAdded: (actionLogs, action) => {
      console.log(`${action.type} Dispatched`)
      actionLogs.list.push(action.payload);
      actionLogs.loading = false;
    },
    actionDeleted: (actionLogs, action) => {
      console.log(`${action.type} Dispatched`)
      const index = actionLogs.list.findIndex(el => el._id === action.payload._id);
      actionLogs.list.splice(index, 1);
    },
    setFilter: (actionLogs, action) => {
      console.log(`${action.type} Dispatched`);
      actionLogs.filter = action.payload;
    },
    actionLogUpdated: (actionLogs, action) => {
      console.log(`${action.type} Dispatched`)
      const index = actionLogs.list.findIndex(el => el._id === action.payload._id);
      index > -1 ? actionLogs.list[index] = action.payload : actionLogs.list.push(action.payload);
    }
  }
});

// Action Export
export const {
  actionAdded,
  actionLogsReceived,
  actionLogsRequested,
  actionLogsRequestFailed,
  actionDeleted,
  setFilter,
  actionLogUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Selector
export const getMyTeamLogs = createSelector(
  state => state.accounts.list.find(el => el.team && el.team._id === state.auth?.team._id),
  state => state.actionLogs.list,
  (teamAccount, actionLogs) => actionLogs.filter(
    log => (log.account === teamAccount._id)
  )
);

export const getGamestateLogs = createSelector(
  state => state.actionLogs.list,
  (actionLogs) => actionLogs.filter(
    log => (log.submodel === 'GameState')
  )
);

export const filteredActions = createSelector(
  state => state.actionLogs.filter,
  state => state.actionLogs.list,
  (filter, actionLogs) => actionLogs.filter(action => action.description.toLowerCase().includes(filter.toLowerCase()) ||
    action.intent.toLowerCase().includes(filter.toLowerCase()) ||
    action.creator.characterName.toLowerCase().includes(filter.toLowerCase())
  )
);

// get all actions Loader into state for "emergencies"
export const loadActionLogs = payload => (dispatch, getState) => {
  const url = `${gameServer}api/logs`;
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart: actionLogsRequested.type,
      onSuccess: actionLogsReceived.type,
      onError: actionLogsRequestFailed.type
    })
  );
};