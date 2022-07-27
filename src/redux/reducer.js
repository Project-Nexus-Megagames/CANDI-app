import { combineReducers } from "redux";
import auth from "./entities/auth";
import assets from "./entities/assets";
import articles from "./entities/articles";
import characters from "./entities/characters";
import playerActions from "./entities/playerActions";
import gamestate from "./entities/gamestate";
import locations from "./entities/locations";
import gameConfig from "./entities/gameConfig";
import log from "./entities/log";


// Main Store reducer
export default combineReducers({
  // auth/playerCharacter, actions, players(aka characters),
  auth,
  actions: playerActions,
  articles,
  assets,
  characters,
  gamestate,
  locations,
	gameConfig,
	log
});
