import React, { useEffect } from 'react';
import { Button, ButtonGroup, ButtonToolbar, FlexboxGrid, Loader, Panel } from 'rsuite';
// import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import socket from '../../socket';
import { getMyCharacter } from '../../redux/entities/characters';
import ProgressLine from 'rsuite/lib/Progress/ProgressLine';
import { toggleDuck } from '../../redux/entities/gamestate';
import NavigationBar from './NavigationBar';
const Bitsy = (props) => {
  const [animation, setAnimation] = React.useState("/images/Bitsy.gif");
	const [seconds, setSeconds] = React.useState(0);
	const [minutes, setMinutes] = React.useState(0);
	const [hours, setHours] = React.useState(0);

  useEffect(() => {
    if (props.duck) props.toggleDuck()
    if (props.happiness < 30 ) setAnimation('/images/Bitsy Sad.gif')
    else if (props.hunger < 30 ) setAnimation('/images/Hungry Bitsy.gif')

    socket.on('bitsy', (data) => {
      console.log(data)
      if (data) {
        switch(data.action) {
          case 'feed': 
            setAnimation('/images/Eating Bitsy.gif')
            break;
          case 'play': 
          // console.log(data.message);
          setAnimation('/images/Bitsy Play.gif')
          break;
          default:
            break;
          }        
      }
    })
  }, [])

  useEffect(() => {
    if(props.myCharacter)	{
        let countDownDate = new Date(props.myCharacter.bitsy).getTime();
        const now = new Date().getTime();
        let distance =  countDownDate - now;
      
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);	

        setMinutes(minutes);
        setSeconds(seconds);
        setHours(hours);
  
        const interval = setInterval(() => {
          console.log('bitsy')
          let countDownDate = new Date(props.myCharacter.bitsy).getTime();
          const now = new Date().getTime();
          let distance =  countDownDate - now;
  
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);		
          
          if (distance <= 0) {
            setMinutes(0);
            setSeconds(0);
            clearInterval(interval);
          }
          else {
            setMinutes(minutes);
            setSeconds(seconds);
            setHours(hours);
          }
      }, 1000);
    }
    else {
      console.log('HELLO')
    }
  }, [props.myCharacter, props.myCharacter.bitsy]);

  const handleAction = async (type) => {
    const data = {
      charcater: props.myCharacter._id,
      action: type
    };
  
    socket.emit('gamestateRequest', 'easterEgg', data ); // new Socket event
  }
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}	
  return ( 
		<React.Fragment>
      <NavigationBar/>
      <Panel bordered>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={8}/>
          <FlexboxGrid.Item colspan={8}>
            <img width='400' src={animation} alt="oops"/>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8}/>
        </FlexboxGrid> 
        Hunger
        <ProgressLine percent={props.hunger} strokeColor="#32a844" showInfo={false}>Hunger</ProgressLine>    
        Happy
        <ProgressLine percent={props.happiness < 0 ? 0 : props.happiness} strokeColor="#32a844" showInfo={false}>Hunger</ProgressLine>    
      </Panel>
      {hours} {minutes} {seconds}
      <ButtonToolbar>
        <ButtonGroup>
          <Button disabled={hours + minutes + seconds > 0} onClick={() => handleAction('feed')} >Feed</Button>
          <Button disabled={hours + minutes + seconds > 0} onClick={() => handleAction('play')}>Play</Button>          
        </ButtonGroup>
      </ButtonToolbar>
    </React.Fragment>
	)};

const mapStateToProps = (state) => ({
	locations: state.locations.list,
  login: state.auth.login,
  hunger: state.gamestate.hunger,
  happiness: state.gamestate.happiness,
	duck: state.gamestate.duck,
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
});

const mapDispatchToProps = (dispatch) => ({
	toggleDuck: (data) => dispatch(toggleDuck(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Bitsy);