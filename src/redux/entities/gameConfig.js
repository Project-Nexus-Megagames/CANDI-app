import { createSlice } from "@reduxjs/toolkit"; // Import from reactjs toolkit
import { gameServer } from "../../config";
import { apiCallBegan } from "../api"; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
  name: "gameConfig",
	initialState: {
    name: '',
    loading: false,
    loaded: false,
    lastFetch: null,
		actionTypes: [],
		effortTypes: [],
		globalStats: [],
		characterStats: [],
  },
  // Reducers - Events
  reducers: {
    gameConfigRequested: (gameConfig, action) => {
      console.log(`${action.type} Dispatched...`)
      gameConfig.loading = true;
    },
    gameConfigReceived: (gameConfig, action) => {
			console.log(`${action.type} Dispatched...`);
			gameConfig.name = action.payload.name;
			gameConfig.actionTypes = action.payload.actionTypes;
			gameConfig.effortTypes = action.payload.effortTypes;
			gameConfig.globalStats = action.payload.globalStats;
			gameConfig.characterStats = action.payload.characterStats;
      gameConfig.loading = false;
      gameConfig.lastFetch = Date.now();
      gameConfig.loaded = true;
    },
    gameConfigRequestFailed: (gameConfig, action) => {
      console.log(`${action.type} Dispatched`)
      gameConfig.loading = false;
    },
    actionTypesAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.actionTypes = action.payload.actionTypes;
    },
		effortTypesAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.effortTypes = action.payload.effortTypes;
    },
    globalStatsAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.globalStats = action.payload.globalStats;
    },
    characterStatsAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.characterStats = action.payload.characterStats;
    },
  }
});

// Action Export
export const {
  actionTypesAdded,
	effortTypesAdded,
  globalStatsAdded,
  characterStatsAdded,
  gameConfigReceived,
  gameConfigRequested,
  gameConfigRequestFailed,
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/gameConfig`;

// gameConfig Loader into state
export const loadGameConfig = payload => (dispatch) => {
  return dispatch(

    apiCallBegan({
      url,
      method: 'get',
      data: payload,
      onStart:gameConfigRequested.type,
      onSuccess: gameConfigReceived.type,
      onError:gameConfigRequestFailed.type
    })

  );
};