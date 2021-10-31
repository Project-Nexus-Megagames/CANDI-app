import React, { useEffect, version } from 'react'; // React imports
import { connect } from "react-redux";
import { Alert } from 'rsuite';
import { Route, Switch, Redirect } from 'react-router-dom';

// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import './App.css';
import Actions from './components/Actions/Actions';
import Control from './components/Control/control';
import HomePage from './components/Navigation/HomePage';
import MyCharacter from './components/MyCharacters/myCharacter';
import OtherCharacters from './components/OtherCharacters/OtherCharacters';
import ControlTerminal from './components/Control/ControlTerminal';
// import Registration from './components/Control/Registration';

import Login from './components/Navigation/Login';
import initUpdates from './redux/initUpdate';
import { getMyCharacter, loadCharacters } from './redux/entities/characters';
import { loadAssets } from './redux/entities/assets';
import { loadLocations } from './redux/entities/locations';
import { loadGamestate } from './redux/entities/gamestate';
import socket from './socket';
import NoCharacter from './components/Navigation/NoCharacter';

import { initConnection } from './socket';
import MapContainer from './components/Navigation/Test';
import Registration from './components/Control/Registration';
import NotFound from './components/Navigation/NotFound';
import Bitsy from './components/Navigation/Bitsy';
import myCharacter from './components/MyCharacters/myCharacter';
import Down from './components/Navigation/Down';
import Leaderboard from './components/Control/Leaderboard';
import { signOut, usersRecieved } from './redux/entities/auth';

// React App Component
initUpdates()
const App = (props) => {
  // console.log(`App Version: ${props.version}`);
  // console.log(localStorage)
  const { loadChar, loadAssets, loadGamestate, login, user, loadLocations, myCharacter, version } = props;
  useEffect(() => {
    const theme = 'dark'
    console.log(`Setting Theme: ${theme}`)

    let head = document.head;
    let link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `/${theme}.css`;

    head.appendChild(link);
    return () => { setTimeout(() => head.removeChild(link), 2000) }
  }, [])

  useEffect(() => {
		if (login && myCharacter) {
			initConnection(user, myCharacter, version);
		}
	}, [login, user, myCharacter, version])

	useEffect(() => {
    console.log('App Loaded');
    loadChar();
    loadAssets();
    loadLocations();
    loadGamestate();

    socket.onAny((event, ...args) => {
      props.usersRecieved(...args);
    });


    socket.on('alert', (data) => {
      if (data) {
        switch(data.type) {
          case 'error': 
            // console.log(data.message);
            Alert.error(data.message, 6000);
            break;
          case 'success':
            Alert.success(data.message, 6000);
            break;
          case 'logout':
            window.location.reload(false);
            break;
          default:
            Alert.info(data.message, 6000);
          }        
      }
    })
  }, [loadChar, loadAssets, loadGamestate, loadLocations])

  const quack = () => {
    const audio = new Audio('/skullsound2.mp3');
    audio.loop = false;
    audio.volume = 0.15;
    audio.play();  
  }

  return (
    <div className="App" onClick={props.duck ? () => quack() : undefined} style={ props.duck ? { backgroundImage: `url("https://c.tenor.com/xXMKqzQrpJ0AAAAM/skeleton-trumpet.gif")` } : {}} > {/*style={props.loading ? loading : done} */}
      {/*  props.login && props.myCharacter && !props.loading && <Header>
        <NavigationBar/>
      </Header> */}
      <Switch>
        <Route exact path='/login' render={(props) => (
          <Login {...props} />
        )} />
        <Route exact path='/home' render={(props) => (
          <HomePage {...props} /> 
        )} />
        <Route exact path='/character' render={(props) => (
          <MyCharacter {...props} />
        )}/>
        <Route exact path='/controllers' render={(props) => (
          <Control {...props} />
        )} />
        <Route exact path='/others' render={(props) => (
          <OtherCharacters {...props} />
        )} />
        <Route exact path='/actions' render={(props) => (
          <Actions {...props} />
        )} />
        <Route exact path='/control' render={(props) => (
          <ControlTerminal {...props} />
        )} />
        <Route exact path='/leaderboard' render={(props) => (
          <Leaderboard {...props} />
        )} />
        <Route exact path='/404' render={(props) => (
          <NotFound {...props} />
        )} />
        <Route exact path='/no-character' render={(props) => (
          <NoCharacter {...props} />
        )} />
        <Route exact path='/registration' render={(props) => (
          <Registration {...props} />
        )} />
        <Route exact path='/down' render={(props) => (
          <Down {...props}/>
        )} />
        <Route exact path='/bitsy' render={(props) => (
          <Bitsy {...props} />
        )} />
        <Redirect from="/" exact to="login" />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
  actions: state.actions.list,
	loading: state.auth.loading,
	error: state.auth.error,
  login: state.auth.login,
  version: state.gamestate.version,
  characters: state.characters.list,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
	duck: state.gamestate.duck,
});

const mapDispatchToProps = (dispatch) => ({
  loadChar: (data) => dispatch(loadCharacters()),
	loadAssets: (data) => dispatch(loadAssets()),
  loadLocations: (data) => dispatch(loadLocations()),
	loadGamestate: (data) => dispatch(loadGamestate()),
	usersRecieved: (data) => dispatch(usersRecieved(data)),
	logOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
