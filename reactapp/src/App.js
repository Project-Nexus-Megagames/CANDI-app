import React, { useEffect } from 'react'; // React imports
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

import Login from './components/Login';
import NotFound from './components/notFound';
import initUpdates from './redux/initUpdate';
import { loadCharacters } from './redux/entities/characters';
import { loadAssets } from './redux/entities/assets';
import { loadGamestate } from './redux/entities/gamestate';

// React App Component
initUpdates()
const App = (props) => {
  const { loadChar, loadAssets, loadGamestate } = props;
	useEffect(() => {
    console.log('App Loaded');
    loadChar();
    loadAssets();
    loadGamestate();
  }, [loadChar, loadAssets, loadGamestate])

  return (
    <div className="App" style={props.loading ? loading : done}>
      {props.login && props.characters.length > 0 && props.actions.length > 0  && !props.loading && <Header>
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
        <Route exact path='/404' render={(props) => (
          <NotFound {...props} />
        )} />
        <Redirect from="/" exact to="login" />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}


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
  characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({
  loadChar: (data) => dispatch(loadCharacters()),
	loadAssets: (data) => dispatch(loadAssets()),
	loadGamestate: (data) => dispatch(loadGamestate())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
