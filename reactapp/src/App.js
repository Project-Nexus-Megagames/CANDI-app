import React from 'react'; // React imports
import { connect } from "react-redux";
import { Header } from 'rsuite';
import { Route, Switch, Redirect } from 'react-router-dom';

import 'rsuite/dist/styles/rsuite-dark.css'; // Dark theme for rsuite components
// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import './App.css';

import Actions from './components/Actions';
import Control from './components/navigation/control';
import HomePage from './components/navigation/homepage';
import MyCharacter from './components/navigation/myCharacter';
import NavigationBar from './components/navigation/navigationBar';
import OtherCharacters from './components/navigation/OtherCharacters';
import ControlTerminal from './components/navigation/ControlTerminal';
// import Registration from './components/navigation/Registration';

import { charactersReceived, getMyCharacter } from './redux/entities/characters';
import Login from './components/Login';
import { playerActionsReceived } from './redux/entities/playerActions';
import { gamestateReceived } from './redux/entities/gamestate';
import NotFound from './components/notFound';
import { assetsReceived } from './redux/entities/assets';
import initUpdate from './redux/initUpdate';

// React App Component
initUpdate();
const App = (props) => {


  return ( 
      <div className="App" style={props.loading ? loading : done}>
        <React.Fragment>
          {props.login && props.myCharacter && props.actions.length > 1 && !props.loading && <Header>
            <NavigationBar/>
          </Header> }
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
            <Route exact path='/not-found' render={(props) => (
              <NotFound {...props} />
            )} />
            <Redirect from="/" exact to="login" />
            <Redirect to="/not-found" />
          </Switch>
        </React.Fragment>
      </div>
  )}

const loading = {
  position: 'fixed', backgroundColor: '#000000', top: 0, bottom: 0, width: '100%',
};

const done = {
  position: 'fixed', top: 0, bottom: 0, width: '100%',
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
  actions: state.actions.list,
	loading: state.auth.loading,
	error: state.auth.error,
  login: state.auth.login,
  gamestate: state.gamestate,
  assets: state.assets,
  myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
  // handleLogin: (data) => dispatch(loginUser(data))
  playerActionsReceived: (data) => dispatch(playerActionsReceived(data)),
  charactersReceived: (data) => dispatch(charactersReceived(data)),
  gamestateReceived: (data) => dispatch(gamestateReceived(data)),
  assetsRecieved: (data) => dispatch(assetsReceived(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
