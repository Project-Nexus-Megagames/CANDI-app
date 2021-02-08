import { loadCharacters } from './entities/characters';
import { loadGamestate } from './entities/gamestate';
import { loadAssets } from './entities/assets';
import { loadplayerActions } from './entities/playerActions';

//Get all objects from DB collections and store to redux state
export default function loadState(store) {
	store.dispatch(loadCharacters());
	store.dispatch(loadplayerActions());
	store.dispatch(loadAssets());
	store.dispatch(loadGamestate());
}