import React, { useEffect } from "react"; // React imports
import { connect } from "react-redux";
import { Route, Routes, Navigate,} from 'react-router-dom';
import { ChakraProvider, Grid, GridItem, useToast } from "@chakra-ui/react";

// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import "./App.css";
import Actions from "./components/Actions/Actions";
import News from "./components/News/News";
import Agendas from "./components/Agendas/Agendas";
import HomePage from "./components/Navigation/HomePage";
import OtherCharacters from "./components/OtherCharacters/OtherCharacters";
import ControlTerminal from "./components/Control/ControlTerminal";
import GameConfigStep1 from "./components/GameConfig/GameConfigStep1";
import GameConfig2 from "./components/GameConfig/GameConfigStep2";
import Log from "./components/Control/Log";

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
import Down from "./components/Navigation/Down";
import { signOut, usersRecieved } from "./redux/entities/auth";
import { loadGameConfig } from "./redux/entities/gameConfig";
import { loadArticles } from "./redux/entities/articles";
import { loadLog } from "./redux/entities/log";
import { ArticleAlert } from "./components/Common/ArticleAlert";
import NavigationBar from "./components/Navigation/NavigationBar";
import { loadAllActions } from "./redux/entities/playerActions";
import { ErrorAlert } from "./components/Common/ErrorAlert";
import { SuccessAlert } from "./components/Common/SuccessAlert";
import Loading from "./components/Navigation/Loading";

// React App Component
initUpdates();
const App = (props) => {
  // console.log(`App Version: ${props.version}`);
  // console.log(localStorage)
  const { loadChar, loadAssets, loadArticles, loadGamestate, login, user, loadLocations, myCharacter, version, loadGameConfig, loadLog, loadAllActions } = props;

  const toast = useToast();
  useEffect(() => {
    const theme = "dark";
    // console.log(`Setting Theme: ${theme}`);

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
    loadAllActions();
    socket.onAny((event, ...args) => {
      // console.log(event);
      if (event === "clients") {
        props.usersRecieved(...args);
      }
    });

    socket.on("alert", (data) => {
      if (data) {
        switch (data.type) {
          case 'error': 
          // Alert.error(data.message, 6000);
            toast({
              position: "top-right",
              isClosable: true,
              duration: 5000,
              render: () => <ErrorAlert error={data.message} />,
            });
            break;
          case 'success':
            toast({
              position: "top-right",
              isClosable: true,
              duration: 5000,
              render: () => <SuccessAlert message={data.message} />,
            });
            break;
          case "article":
            toast({
              position: "top-right",
              isClosable: true,
              duration: 9000,
              render: () => <ArticleAlert data={data.data} />,
            });
            break;
          case "refresh":
            window.location.reload(false);
            break;
          default:
            // Alert.info(data.message, 6000);
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
      className='App'
      onClick={props.duck ? () => quack() : undefined}
      style={
        props.duck
          ? {
              backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")`,
              color: "red",
              fontFamily: "Spook",
            }
          : {}
      }
    >
        <Grid
          templateAreas={`"header header"
                          "main main"`}
          gridTemplateRows={'72px 1fr'}
          h='100vh'
          gap='1'
          color={'#fff'}
        >
          {myCharacter && <GridItem pl='1'  area={'header'} >
            <NavigationBar />
          </GridItem>}

          <GridItem pl='1' area={'main'} overflow='auto' >
            <Routes>
             <Route exact path='/login' element={<Login {...props} />} />
             <Route exact path='/loading' element={<Loading {...props} />} />
              <Route exact path='/home' element={<HomePage {...props} />} />
              <Route path='/home/news' element={<News {...props} />} />
              <Route path='/agendas' element={<Agendas {...props} />} />
              <Route exact path='/home/others' element={<OtherCharacters {...props} />} />
              <Route exact path='/home/character' element={<OtherCharacters selected={myCharacter} {...props} />} />
              <Route exact path='/home/actions' element={<Actions {...props} />} />
              <Route exact path='/gameConfig' element={<GameConfigStep1 {...props} />} />
              <Route exact path='/gameConfig2' element={<GameConfig2 {...props} />} />
              <Route exact path='/home/control' element={<ControlTerminal {...props} />} />
              <Route exact path='/log' element={<Log {...props} />} />
              <Route exact path='/404' element={<NotFound {...props} />} />
              <Route exact path='/no-character' element={<NoCharacter {...props} />} />
              <Route exact path='/registration' element={<Registration {...props} />} />
              <Route exact path='/down' element={<Down {...props} />} />
              <Route path="/" element={<Navigate to="/login" />}/>   
              <Route exact path='/404' element={<NotFound {...props} />} />      
            </Routes>    
          </GridItem>

        </Grid>    
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
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
  loadAllActions: () => dispatch(loadAllActions()),
  loadArticles: () => dispatch(loadArticles()),
  loadLocations: () => dispatch(loadLocations()),
  loadGamestate: () => dispatch(loadGamestate()),
  loadGameConfig: () => dispatch(loadGameConfig()),
  loadLog: () => dispatch(loadLog()),
  usersRecieved: (data) => dispatch(usersRecieved(data)),
  logOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
