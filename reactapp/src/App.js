import axios from 'axios';
import React, { Component } from 'react'; // React imports
import { Content, FlexboxGrid, Header, } from 'rsuite';
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
    actions: [],
    players: []
  }

  componentDidMount = async () => {
    this.setState({ active: "loading" });
    await this.loadData();
    setTimeout(function(){    this.setState({ active: "home" });}.bind(this), 1000); // this is just so you can see my fancy loading screen... we can take it out later
  }

  loadData = async () => {
    const {data} = await axios.get(`${gameServer}api/actions/`);
    const players = await axios.get(`${gameServer}api/players/`);
    this.setState({ actions: data, players: players.data });
  }

  handleSelect(activeKey) {
    this.setState({ active: activeKey });
  }

  render() {
    return(
      <div className="App" style={this.state.active === "loading" ? loading : done}>
        {this.state.active === "loading" && 
        <React.Fragment>
          <Header>

          </Header>
          <Content>
            <FlexboxGrid justify="center">
              <FlexboxGrid.Item colspan={12} style={{marginTop: '80px'}}>
                <img src={'https://media4.giphy.com/media/tJMVqwkdUIuL0Eiam3/source.gif'} alt={'Loading...'} />  
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Content> <b>Loading...</b>
        </React.Fragment>
        }
        {this.state.active !== "loading" && 
          <React.Fragment>
            <Header>
              <NavigationBar onSelect={this.handleSelect.bind(this)}>
              </NavigationBar>
            </Header>
            {this.state.active === "home" && <HomePage/>}
            {this.state.active === "character" && <MyCharacter/>}
            {this.state.active === "controllers" && <Control/>}
            {this.state.active === "others" && <OtherCharacters characters={this.state.players}/>}
            {this.state.active === "actions" && <Actions actions={this.state.actions}/>}
          </React.Fragment>
        }   
      </div>
    );
  }
}

const loading = {
  position: 'fixed', backgroundColor: '#000000', top: 0, bottom: 0, width: '100%',
};
 
const done = {
  position: 'fixed', top: 0, bottom: 0, width: '100%',
}

export default (App);