import { createSlice } from '@reduxjs/toolkit'; // Import from reactjs toolkit
import { gameServer } from '../../config';
import { apiCallBegan } from '../api'; // Import Redux API call

// Create entity slice of the store
const slice = createSlice({
	name: 'gameConfig',
	initialState: {
		name: '',
		loading: false,
		loaded: false,
		lastFetch: null,
		actionTypes: [],
		assetTypes: [],
		resourceTypes: [],
		characterStats: [],
		globalStats: [],
		loadingTips: [],
		layout: []
	},
	// Reducers - Events
	reducers: {
		gameConfigRequested: (gameConfig, action) => {
			console.log(`${action.type} Dispatched...`);
			gameConfig.loading = true;
		},
		gameConfigReceived: (gameConfig, action) => {
			console.log(`${action.type} Dispatched...`);
			gameConfig.name = action.payload.name;
			gameConfig.actionTypes = action.payload.actionTypes;
			gameConfig.assetTypes = action.payload.assetTypes;
			gameConfig.resourceTypes = action.payload.resourceTypes;
			gameConfig.characterStats = action.payload.characterStats;
			gameConfig.globalStats = action.payload.globalStats;
			gameConfig.loadingTips = action.payload.loadingTips;
			gameConfig.loading = false;
			gameConfig.lastFetch = Date.now();
			gameConfig.loaded = true;
		},
		gameConfigRequestFailed: (gameConfig, action) => {
			console.log(`${action.type} Dispatched`);
			gameConfig.loading = false;
		},
    layoutAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			state.layout = action.payload.layout;
		},
		actionTypesAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			console.log(action.payload.actionTypes);
			state.actionTypes = action.payload.actionTypes;
		},
		assetTypesAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			state.assetTypes = action.payload.assetTypes;
		},
		resourceTypesAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			state.resourceTypes = action.payload.resourceTypes;
		},
		globalStatsAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			state.globalStats = action.payload.globalStats;
		},
		characterStatsAdded: (state, action) => {
			console.log(`${action.type} Dispatched`);
			state.characterStats = action.payload.characterStats;
		}
	}
});

// Action Export
export const { actionTypesAdded, layoutAdded, assetTypesAdded, resourceTypesAdded, gameConfigReceived, gameConfigRequested, gameConfigRequestFailed, globalStatsAdded, characterStatsAdded } = slice.actions;

export default slice.reducer; // Reducer Export

// Action Creators (Commands)
const url = `${gameServer}api/gameConfig`;

// gameConfig Loader into state
export const loadGameConfig = (payload) => (dispatch) => {
	return dispatch(
		apiCallBegan({
			url,
			method: 'get',
			data: payload,
			onStart: gameConfigRequested.type,
			onSuccess: gameConfigReceived.type,
			onError: gameConfigRequestFailed.type
		})
	);
};
