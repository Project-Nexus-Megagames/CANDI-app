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
		gamestate: {},
		actionTypes: []
  },
  // Reducers - Events
  reducers: {
    gameConfigRequested: (gameConfig, action) => {
      console.log(`${action.type} Dispatched...`)
      gameConfig.loading = true;
    },
    gameConfigReceived: (gameConfig, action) => {
			console.log(`${action.type} Dispatched...`);
			gameConfig.gamestate = action.payload.gamestate;
			gameConfig.name = action.payload.name;
			gameConfig.actionTypes = action.payload.actionTypes;
			gameConfig.actionAndEffortTypes = action.payload.actionAndEffortTypes;
      gameConfig.loading = false;
      gameConfig.lastFetch = Date.now();
      gameConfig.loaded = true;
    },
    gameConfigRequestFailed: (gameConfig, action) => {
      console.log(`${action.type} Dispatched`)
      gameConfig.loading = false;
    },
    gameConfigAdded: (gameConfig, action) => {
      console.log(`${action.type} Dispatched`)
      gameConfig.list.push(action.payload);
    }
  }
});

// Action Export
export const {
  gameConfigAdded,
  gameConfigReceived,
  gameConfigRequested,
  gameConfigRequestFailed,
} = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/gameConfig`;

// gameConfig Loader into state
export const loadGameConfig = payload => (dispatch) => {
	console.log(payload, url)
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