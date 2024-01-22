import React, { useEffect } from "react"; // React imports
import { connect } from "react-redux";
import { Route, Routes, Navigate,} from 'react-router-dom';
import { Alert, ChakraProvider, Grid, GridItem, useToast } from "@chakra-ui/react";

// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import "./App.css";
import Actions from "./components/Actions/Actions";
import News from "./components/News/News";
import Agendas from "./components/Agendas/Agendas";
import HomePage from "./components/Navigation/HomePage";
import OtherCharacters from "./components/OtherCharacters/OtherCharacters";
import ControlTerminal from "./components/Control/ControlTerminal";
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
import loadState from './scripts/initState';
import Loading from "./components/Navigation/Loading";
import CharacterStats from "./components/StatDisplays/CharacterStats";
import LocationDashboard from "./components/Locations/LocationDashboard";
import Trade from "./components/Trade/Trade";
import { alertAdded } from "./redux/entities/alerts";
import store from "./redux/store";
import { CandiAlert } from "./components/Common/CandiAlert";

// React App Component
initUpdates();
const App = (props) => {
  // console.log(`App Version: ${props.version}`);
  const { loadChar, loadAssets, loadArticles, loadGamestate, login, user, loadLocations, myCharacter, version, loadGameConfig, loadLog, loadAllActions } = props;

  const [seconds, setSeconds] = React.useState(60);
  const [flag, setFlag] = React.useState(false);
  const toast = useToast();
  const toastIdRef = React.useRef()

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
    if (flag) {
      const interval = setTimeout(() => {  
        let temp = seconds - 1; 
        quack() 
        if (seconds < 46) error() 
        if (seconds < 31) rise();
        if (seconds < 16) fall();

        if (toastIdRef.current) {
          toast.update(toastIdRef.current, 
            { 
            title: 'MANDATORY UPDATE', 
            description: `CANDI will refresh itself in ${temp} seconds. Please wrap up what you are doing. Or don't, you have all the agency here.`, 
            status: 'error', 
          })
        }

        if (seconds <= 0) {
          clearInterval(interval);
          window.location.reload(false);
        }
        else setSeconds(temp);
      }, 1000);
      return () => clearInterval(interval);   
    }
  }, [flag, seconds]);

  useEffect(() => {
    if (login && myCharacter) {
      initConnection(user, myCharacter, version);
    }
  }, [login, user, myCharacter, version]);

  useEffect(() => {
    console.log("App Loaded");
    
    socket.onAny((event, ...args) => {
      // console.log(event);
      if (event === "clients") {
        props.usersRecieved(...args);
      }
    });

    socket.on("alert", (data) => {
      if (data) {
        switch (data.type) {
          case 'success':
          case 'error': 
          // Alert.error(data.message, 6000);
            if (!toast.isActive(data.type)) toast({
              position: "top-right",
              isClosable: true,
              status: data.type,
              duration: 5000,
              id: data.type,
              title: data.message,
            });
            store.dispatch(alertAdded(data));
            break;
          case "article":
            toast({
              position: "top-right",
              isClosable: true,
              duration: 7000,
              render: () => <ArticleAlert data={data.data} />,
            });
            break;
          case "refresh":
            setSeconds(60);
            setFlag(true)
            toastIdRef.current = toast({
              title: 'MANDATORY UPDATE',              
              position: "top",
              description: `CANDI will refresh itself in 60 seconds`,
              duration: 70000,
              status: 'error',
            });
            break;
          default:
            // Alert.info(data.message, 6000);
        }
      }
    });
  }, [loadChar, loadAssets, loadGamestate, loadLocations, loadGameConfig]);

  const quack = () => {
    const audio = new Audio("/alert.mp3");
    audio.loop = false;
    audio.volume = 0.40;
    audio.playbackRate = (0.8); 
    audio.play();
  };

  const error = () => {
    const audio = new Audio("/error.mp3");
    audio.loop = false;
    audio.volume = 0.40;
    audio.play();
  };

  const fall = () => {
    const audio = new Audio("/fall.mp3");
    audio.loop = false;
    audio.volume = 0.40;
    audio.play();
  };

  const rise = () => {
    const audio = new Audio("/rise.mp3");
    audio.loop = false;
    audio.volume = 0.40;
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
              <Route path='home/agendas' element={<Agendas {...props} />} />
              <Route exact path='/home/others' element={<OtherCharacters {...props} />} />
              <Route exact path='/home/leaderboard' element={<CharacterStats {...props} />} />
              <Route exact path='/home/character' element={<OtherCharacters selected={myCharacter} {...props} />} />
              <Route exact path='/home/actions' element={<Actions {...props} />} />
              <Route exact path='/home/locations' element={<LocationDashboard {...props} />} />

              <Route exact path='/home/control' element={<ControlTerminal {...props} />} />
              <Route exact path='/home/trading' element={<Trade {...props} />} />


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
  myCharacter: state.auth.myCharacter,
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
