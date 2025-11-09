import { createSlice } from '@reduxjs/toolkit'; // Import from reactjs toolkit
import { gameServer } from '../../config';
import { apiCallBegan } from '../api'; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
	name: 'gamestate',
	initialState: {
		version: '5.8.1 End of Game',
		loading: false,
		loaded: false,
		lastFetch: null,
		round: null,
		endTime: null,
		status: '',
		tag: '',
		discovered: false,
		play: false,
		duck: false,

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
		},
    toggleAuido: (gamestate, action) => {
			console.log(`${action.type} Dispatched`);
			gamestate.play = !gamestate.play;
		}
	}
});

// Action Export
export const { gamestateAdded, gamestateReceived, gamestateRequested, gamestateRequestFailed, toggleDuck, toggleAuido } = slice.actions;

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
