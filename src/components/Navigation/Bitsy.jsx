import React, { Component } from 'react';
import { Button, FlexboxGrid, Panel } from 'rsuite';
// import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import socket from '../../socket';
class Bitsy extends Component {
  // const [seconds, setSeconds] = React.useState(25);
  // const [startBool, setStart] = React.useState(false);
	// const history = useHistory()

  // const test = () => {}

  start = async () => {
    const data = {
      hunger: 100, 
      happiness: 100, 
      discovered: true
    };
  
    socket.emit('actionRequest', 'easterEgg', data ); // new Socket event
    socket.emit('actionRequest', 'create', data); // new Socket event
    socket.emit('locationRequest', 'modify', data ); // new Socket event
    console.log(socket)
    console.log('hi');
  }
	render() {
  return ( 
		<React.Fragment>
      <Panel style={{ height: '50vh'}} bordered>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={8}/>
          <FlexboxGrid.Item colspan={8}>
            <img width='400' src="/images/Bitsy.gif" alt="oops"/>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8}/>
        </FlexboxGrid>        
      </Panel>
        <Button onClick={() => this.start()} >Feed</Button>
        <Button>Play</Button>
      <Panel>
      </Panel>
    </React.Fragment>
	)};
}

const mapStateToProps = (state) => ({
	locations: state.locations.list,
});

const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Bitsy);