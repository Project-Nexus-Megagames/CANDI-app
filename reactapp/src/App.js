import axios from 'axios';
import React, { Component } from 'react'; // React imports
import { Content, FlexboxGrid, Form, Header, Modal, FormControl, ControlLabel, FormGroup, Button, Alert, Schema } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css'; // Dark theme for rsuite components
import './App.css';
import { gameServer } from './config';
// import openSocket from 'socket.io-client';

import Actions from './components/Actions';
import Control from './components/navigation/control';
import HomePage from './components/navigation/homepage';
import MyCharacter from './components/navigation/myCharacter';
import NavigationBar from './components/navigation/navigationBar';
import OtherCharacters from './components/navigation/OtherCharacters';
const { StringType } = Schema.Types;

// const socket = openSocket(gameServer);

// React App Component
class App extends Component {
  state = {
    active: null,
    actions: [],
    players: [],
    formValue: {
      email: '',
      password: '',
    },
    show: false,
    loading: false,
    playerCharacter: {}
  }

  componentDidMount = async () => {
    this.setState({ show: true });
    //socket.on('connect', ()=> {      console.log('UwU I made it')    });
    await this.loadData();
    // this.setState({ active: "login" });
    // setTimeout(function(){    this.setState({ active: "home" });}.bind(this), 1000); // this is just so you can see my fancy loading screen... we can take it out later
  }

  loadData = async () => {
    const {data} = await axios.get(`${gameServer}api/actions/`);
    const players = await axios.get(`${gameServer}api/characters/`);
    this.setState({ actions: data, players: players.data });
  }

  handleSelect(activeKey) {
    this.setState({ active: activeKey });
  }

  handleChange(value) {
    this.setState({
      formValue: value
    });
  }

  handleLogin = async () => {
    this.setState({ loading: true });
    try {
      const { data } = await axios.post(`${gameServer}auth`, { user: this.state.formValue.email, password: this.state.formValue.password });      
      console.log(data);
      if (!data || data.length < 1) {
        this.setState({ loading: false });
      }
      else {
        this.setState({ show: false, playerCharacter: data });      
      }    
    } 
    catch (err) {
      console.log(err.response)
      Alert.error(`Error: ${err.body} ${err.response.data}`, 5000);
      this.setState({ loading: false });
    }
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
        <Modal backdrop="static" show={this.state.show}>
          <Modal.Header>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form model={model} fluid formValue={this.state.formValue} onChange={this.handleChange.bind(this)}>
            <FormGroup>
                <ControlLabel>Email</ControlLabel>
                <FormControl name="email" type="email" accepter={model.accepter}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl name="password" type="password" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button loading={this.state.loading} onClick={this.handleLogin.bind(this)} appearance="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {(this.state.active !== "loading" || this.state.active !== "login") && 
          <React.Fragment>
            <Header>
              <NavigationBar onSelect={this.handleSelect.bind(this)}>
              </NavigationBar>
            </Header>
            {this.state.active === "home" && <HomePage/>}
            {this.state.active === "character" && <MyCharacter playerCharacter={this.state.playerCharacter}/>}
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

const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.')
});

export default (App);