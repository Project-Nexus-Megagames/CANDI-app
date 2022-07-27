import React, { useEffect } from "react"; // React imports
import { connect } from "react-redux";
import { Alert } from "rsuite";
import { Route, Switch, Redirect } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';

// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import "./App.css";
import Actions from "./components/Actions/Actions";
import News from "./components/News/News";
import Control from "./components/Control/control";
import HomePage from "./components/Navigation/HomePage";
import CharacterProfile from "./components/MyCharacters/CharacterProfile";
import OtherCharacters from "./components/OtherCharacters/OtherCharacters";
import ControlTerminal from "./components/Control/ControlTerminal";
import GameConfig from "./components/GameConfig/GameConfigStep1";
import GameConfig2 from "./components/GameConfig/GameConfigStep2";

import Login from "./components/Navigation/Login";
import initUpdates from "./redux/initUpdate";
import { getMyCharacter, loadCharacters } from "./redux/entities/characters";
import { loadAssets } from "./redux/entities/assets";
import { loadLocations } from "./redux/entities/locations";
import { loadGamestate } from "./redux/entities/gamestate";
import socket from "./socket";
import NoCharacter from "./components/Navigation/NoCharacter";

import { initConnection } from "./socket";
import Registration from "./components/Control/Registration";
import NotFound from "./components/Navigation/NotFound";
import Bitsy from "./components/Navigation/Bitsy";
import Down from "./components/Navigation/Down";
import { signOut, usersRecieved } from "./redux/entities/auth";
import Quests from "./components/Control/Quests";
import Map from "./components/Map/Map";
import { loadGameConfig } from './redux/entities/gameConfig';
import { loadArticles } from "./redux/entities/articles";
import { loadLog } from "./redux/entities/log";

// React App Component
initUpdates();
const App = (props) => {
  // console.log(`App Version: ${props.version}`);
  // console.log(localStorage)
  const { loadChar, loadAssets, loadArticles, loadGamestate, login, user, loadLocations, myCharacter, version, loadGameConfig, loadLog } = props;

  useEffect(() => {
    const theme = "dark";
    console.log(`Setting Theme: ${theme}`);

    let head = document.head;
    let link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `/${theme}.css`;

    head.appendChild(link);
    return () => {
      setTimeout(() => head.removeChild(link), 2000);
    };
  }, []);

  useEffect(() => {
    if (login && myCharacter) {
      initConnection(user, myCharacter, version);
    }
  }, [login, user, myCharacter, version]);

  useEffect(() => {
    console.log("App Loaded");
    loadChar();
    loadAssets();
    loadArticles();
    loadLocations();
    loadGamestate();
		loadGameConfig();
		loadLog();
    socket.onAny((event, ...args) => {
      console.log(event);
      if (event === "clients") {
        props.usersRecieved(...args);
      }
    });

    socket.on("alert", (data) => {
      if (data) {
        switch (data.type) {
          case "error":
            // console.log(data.message);
            Alert.error(data.message, 6000);
            break;
          case "success":
            Alert.success(data.message, 6000);
            break;
          case "logout":
            window.location.reload(false);
            break;
          default:
            Alert.info(data.message, 6000);
        }
      }
    });
  }, [loadChar, loadAssets, loadGamestate, loadLocations, loadGameConfig]);

  const quack = () => {
    const audio = new Audio("/skullsound2.mp3");
    audio.loop = false;
    audio.volume = 0.15;
    audio.play();
  };

  return (
    <div
      className="App"
      onClick={props.duck ? () => quack() : undefined}
      style={
        props.duck
          ? {
              backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")`,
            }
          : {}
      }
    >
			<ChakraProvider>
				<Switch>
					<Route exact path="/login" render={(props) => <Login {...props} />} />
					<Route exact path="/home" render={(props) => <HomePage {...props} />} />
					<Route
						exact
						path="/character"
						render={(props) => <CharacterProfile {...props} />}
					/>
          <Route

						path="/news"
						render={(props) => <News {...props} />}
					/>
					<Route
						exact
						path="/controllers"
						render={(props) => <Control {...props} />}
					/>
					<Route
						exact
						path="/others"
						render={(props) => <OtherCharacters {...props} />}
					/>
					<Route
						exact
						path="/actions"
						render={(props) => <Actions {...props} />}
					/>
					<Route
						exact
						path="/gameConfig"
						render={(props) => <GameConfig {...props} />}
					/>
										<Route
						exact
						path="/gameConfig2"
						render={(props) => <GameConfig2 {...props} />}
					/>

					<Route
						exact
						path="/control"
						render={(props) => <ControlTerminal {...props} />}
					/>
					<Route exact path="/quests" render={(props) => <Quests {...props} />} />
					<Route exact path="/map" render={(props) => <Map {...props} />} />
					<Route exact path="/404" render={(props) => <NotFound {...props} />} />
					<Route
						exact
						path="/no-character"
						render={(props) => <NoCharacter {...props} />}
					/>
					<Route
						exact
						path="/registration"
						render={(props) => <Registration {...props} />}
					/>
					<Route exact path="/down" render={(props) => <Down {...props} />} />
					<Route exact path="/bitsy" render={(props) => <Bitsy {...props} />} />
					<Redirect from="/" exact to="login" />
					<Redirect to="/404" />
				</Switch>
			</ChakraProvider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  actions: state.actions.list,
  loading: state.auth.loading,
  error: state.auth.error,
  login: state.auth.login,
	gameConfig: state.gameConfig,
  version: state.gamestate.version,
  characters: state.characters.list,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
  duck: state.gamestate.duck,
});

const mapDispatchToProps = (dispatch) => ({
  loadChar: () => dispatch(loadCharacters()),
  loadAssets: () => dispatch(loadAssets()),
  loadArticles: () => dispatch(loadArticles()),
  loadLocations: () => dispatch(loadLocations()),
  loadGamestate: () => dispatch(loadGamestate()),
	loadGameConfig: () => dispatch(loadGameConfig()),
	loadLog: () => dispatch(loadLog()),
  usersRecieved: (data) => dispatch(usersRecieved(data)),
  logOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
