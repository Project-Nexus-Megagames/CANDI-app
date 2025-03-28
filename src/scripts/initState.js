import store from '../redux/store';

import { loadTeams } from '../redux/entities/teams';
import { loadFacilities } from '../redux/entities/facilities';
import { loadTrades } from '../redux/entities/trades';
import { loadCharacters } from '../redux/entities/characters';
import { loadLocations } from '../redux/entities/locations';
import { loadActionLogs } from '../redux/entities/actionLogs';
import { loadAssets } from '../redux/entities/assets';
import { loadIce } from '../redux/entities/ice';
import { loadAccounts } from '../redux/entities/accounts';
import { loadBlueprints } from '../redux/entities/blueprints';
import { loadClock } from '../redux/entities/clock';
import { loadGamestate } from '../redux/entities/gamestate';
import { loadGameConfig } from '../redux/entities/gameConfig';
import { loadArticles } from '../redux/entities/articles';
import { loadAllActions } from '../redux/entities/playerActions';
import { loadEvents } from '../redux/entities/events';
import { loadMarkets } from '../redux/entities/markets';


let loader = {
	accounts: loadAccounts,
	actions: loadAllActions,
	actionLogs: loadActionLogs,
	articles: loadArticles,
	assets: loadAssets,
	characters: loadCharacters,
	blueprints: loadBlueprints,
	clock: loadClock,
	facilities: loadFacilities,
	ice: loadIce,
	locations: loadLocations,
	teams: loadTeams,
	trades: loadTrades,
	gamestate: loadGamestate,
	gameConfig: loadGameConfig,
	events: loadEvents,
	markets: loadMarkets
}

//Get all objects from DB collections and store to redux state
export default function loadState() {
	let state = store.getState();
	let slices = Object.keys(state).sort();

	let func = undefined;
	for (let section of slices) {
		let slice = state[section];
		func = loader[section];
		if (func) store.dispatch(func());
	}
}
