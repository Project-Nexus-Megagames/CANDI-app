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
    actionTypesAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.actionTypes = action.payload.actionTypes;
    },
		effortTypesAdded: (state, action) => {
      console.log(`${action.type} Dispatched`)
      state.effortTypes = action.payload.effortTypes;
    }
  }
});

// Action Export
export const {
  actionTypesAdded,
	effortTypesAdded,
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