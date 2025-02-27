import { combineReducers } from "redux";
import auth from "./entities/auth";
import accounts from "./entities/accounts";
import articles from "./entities/articles";
import alerts from "./entities/alerts";
import assets from "./entities/assets";
import characters from "./entities/characters";
import clock from "./entities/clock";
import gamestate from "./entities/gamestate";
import gameConfig from "./entities/gameConfig";
import locations from './entities/locations';
import trades from './entities/trades';
import blueprints from './entities/blueprints';
import teams from './entities/teams';
import actionLogs from './entities/actionLogs';
import ice from './entities/ice';
import facilities from './entities/facilities';
import actions from './entities/playerActions';
import events from './entities/events';



// Main Store reducer
export default combineReducers({
  // auth/playerCharacter, actions, players(aka characters), 
  actionLogs,
  auth,
  accounts,
  actions,
  articles,
  alerts,
  assets,
  blueprints,
  characters, 
  clock,
  facilities,
  gamestate,
  gameConfig,
  ice,
  locations,
  teams,
  trades,
  events,
});
