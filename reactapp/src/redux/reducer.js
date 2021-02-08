import { combineReducers } from "redux";
import auth from "./entities/auth";
import assets from "./entities/assets";
import characters from "./entities/characters";
import playerActions from "./entities/playerActions";
import gamestate from "./entities/gamestate";

// Main Store reducer
export default combineReducers({
  // auth/playerCharacter, actions, players(aka characters), 
  auth,
  actions: playerActions,
  assets,
  characters, 
  gamestate
});
