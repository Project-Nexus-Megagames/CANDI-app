import { createSlice } from '@reduxjs/toolkit'; // Import from reactjs toolkit
import { gameServer } from '../../config';
import { apiCallBegan } from '../api'; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
	name: 'gamestate',
	initialState: {
		version: '4.98',
		loading: false,
		loaded: false,
		lastFetch: null,
		round: null,
		endTime: null,
		status: '',
		tag: '',
		hunger: 0,
		happiness: 0,
		discovered: false,
		duck: false,
		gcHappiness: 0,
		gcDiplomacy: 0,
		gcHealth: 0,
		gcPolitics: 0,
		gcSecurity: 0
	},
	// Reducers - Events
	reducers: {
		gamestateRequested: (gamestate, action) => {
			console.log(`${action.type} Dispatched...`);
			gamestate.loading = true;
		},
		gamestateReceived: (gamestate, action) => {
			console.log(`${action.type} Dispatched...`);
			gamestate.round = action.payload.round;
			gamestate.endTime = action.payload.endTime;
			gamestate.status = action.payload.status;
			gamestate.tag = action.payload.tag;

			gamestate.hunger = action.payload.hunger;
			gamestate.happiness = action.payload.happiness;
			gamestate.discovered = action.payload.discovered;

			gamestate.gcHappiness = action.payload.gcHappiness;
			gamestate.gcDiplomacy = action.payload.gcDiplomacy;
			gamestate.gcHealth = action.payload.gcHealth;
			gamestate.gcPolitics = action.payload.gcPolitics;
			gamestate.gcSecurity = action.payload.gcSecurity;

			gamestate.loading = false;
			gamestate.lastFetch = Date.now();
			gamestate.loaded = true;
		},
		gamestateRequestFailed: (gamestate, action) => {
			console.log(`${action.type} Dispatched`);
			gamestate.loading = false;
		},
		gamestateAdded: (gamestate, action) => {
			console.log(`${action.type} Dispatched`);
			gamestate.list.push(action.payload);
		},
		toggleDuck: (gamestate, action) => {
			console.log(`${action.type} Dispatched`);
			gamestate.duck = !gamestate.duck;
		}
	}
});

// Action Export
export const { gamestateAdded, gamestateReceived, gamestateRequested, gamestateRequestFailed, toggleDuck } = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/gamestate`;

// gamestate Loader into state
export const loadGamestate = (payload) => (dispatch) => {
	return dispatch(
		apiCallBegan({
			url,
			method: 'get',
			data: payload,
			onStart: gamestateRequested.type,
			onSuccess: gamestateReceived.type,
			onError: gamestateRequestFailed.type
		})
	);
};
