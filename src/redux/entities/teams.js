import { createSelector, createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call
import socket from '../../socket'


// Create entity slice of the store
const slice = createSlice({
  name: "teams",
	initialState: {
    list: [],
    loading: false,
    loaded: false,
    lastFetch: null,
    newteams: 0
  },
  // Reducers - Events
  reducers: {
    teamsRequested: (teams, action) => {
      console.log(`${action.type} Dispatched...`)
      teams.loading = true;
    },
    teamsReceived: (teams, action) => {
      console.log(`${action.type} Dispatched...`);
      teams.list = action.payload;
      teams.loading = false;
      teams.lastFetch = Date.now();
      teams.loaded = true;
    },
    teamsRequestFailed: (teams, action) => {
      console.log(`${action.type} Dispatched`)
      teams.loading = false;
    },
    teamAdded: (teams, action) => {
      console.log(`${action.type} Dispatched`)
      teams.list.push(action.payload);
    },
    teamUpdated: (teams, action) => {
      console.log(`${action.type} Dispatched`)
      const index = teams.list.findIndex(el => el._id === action.payload._id);
      teams.list[index] = action.payload;
    }
  }
});

// Action Export
export const {
  teamAdded,
  teamsReceived,
  teamsRequested,
  teamsRequestFailed,
  teamUpdated
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/teams`;

// // Selector
export const getThisTeam = createSelector(
  state => state.entities.teams.list,
  state => state.auth.myCharacter,
  (teams, character) => teams.find(
    team => team.characters.some(el => el._id === character._id)
  )
);

// teams Loader into state
export const loadTeams = payload => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:teamsRequested.type,
      onSuccess: teamsReceived.type,
      onError:teamsRequestFailed.type
    })
  );
};