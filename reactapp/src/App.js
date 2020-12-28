import axios from 'axios';
import React, { Component } from 'react'; // React imports
import { Header, } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css'; // Dark theme for rsuite components
import './App.css';
import { gameServer } from './config';

import Actions from './components/Actions';
import Control from './components/navigation/control';
import HomePage from './components/navigation/homepage';
import MyCharacter from './components/navigation/myCharacter';
import NavigationBar from './components/navigation/navigationBar';
import OtherCharacters from './components/navigation/OtherCharacters';

// React App Component
class App extends Component {
  state = {
    active: null,
    actions: []
  }

  componentDidMount() {
    this.loadData();
    // this.setState({ active: "home" });

  }

  loadData = async () => {
    const {data} = await axios.get('http://localhost:5000/api/actions/');
    this.setState({ actions: data });
  }

  handleSelect(activeKey) {
    this.setState({ active: activeKey });
  }

  render() {
    return(
      <div className="App" style={{ position: 'fixed', top: 0, bottom: 0, width: '100%' }}>
        <Header>
          <NavigationBar onSelect={this.handleSelect.bind(this)}>
          </NavigationBar>
        </Header>
        {this.state.active === "home" && <HomePage/>}
        {this.state.active === "character" && <MyCharacter/>}
        {this.state.active === "control" && <Control/>}
        {this.state.active === "others" && <OtherCharacters/>}
        {this.state.active === "actions" && <Actions/>}
      </div>
    );
  }
}



export default (App);