import React, { useEffect } from 'react';
import axios from 'axios';
import { Grid, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Table, Divider, Modal, ButtonGroup, ButtonToolbar} from 'rsuite';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NavigationBar from '../Navigation/NavigationBar';
import SelectedAction from '../Actions/SelectedAction';
import { gameServer } from '../../config';

const  Quests = (props) => {
  const [startBool, setStart] = React.useState(false);
  const [finalBool, setFinal] = React.useState(false);
  const [vicotryBool, setVicotry] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
	const [number, setNumber] = React.useState(1);
	const [selected, setSelected] = React.useState(null);

	useEffect(() => {		
		const fetchData = async () => {
			const {data} = await axios.get(`${gameServer}api/actions/special/62bb9f4eaffe7852fcf4b5fe`);
			setSelected(data)
		}
		fetchData()
    // make sure to catch any error
    .catch(console.error);
	}, []);

	useEffect(() => {		
		setSelected(props.actions.find(el => el._id === '62bb9f4eaffe7852fcf4b5fe'))
	}, [props.actions]);

	useEffect(() => {
		if (seconds === 1) {
			setStart(startBool => startBool = true);
			const audio = new Audio('/rick.mp3');
			audio.loop = false;
			audio.play();  
		}
		if (seconds >= taunting.length) {
			setStart(false);
			setFinal(true);
		}
	}, [seconds]);

	const handleInput = (num) => {
		if (num === number) setNumber(number + 1);
		else setNumber(1)
	}

	const check = (input) => {
		if (input.toLowerCase() === 'friendship') {
			setVicotry(true)
			const audio = new Audio('/celebrate.mp3');
			audio.loop = false;
			audio.play(); 
		}
	}

	const start = () => {
		setSeconds(1)
    const interval = setInterval(() => {
      if (seconds >= 45) {
        clearInterval(interval);
				setStart(false)
				setFinal(true)
      }
      else 
        setSeconds(seconds => seconds + 1);
    }, 6000);
    return () => clearInterval(interval);
  }
	
	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	}
	else return ( 
		
		<React.Fragment>
			<NavigationBar/>
				<h3>Black Bob's Secret Lagoon</h3>

					{number !== 6 && <FlexboxGrid align='middle' justify="space-around"> 
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(1)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>

						<Divider/>

						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(5)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(2)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>

						<Divider/>

						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(3)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>

						<Divider/>

						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(0)} color='blue'></Button>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={6} >
							<Button size='lg' onClick={() => handleInput(4)} color='blue'></Button>
						</FlexboxGrid.Item>

						<Divider/>
					</FlexboxGrid>}

					{number === 6 && !startBool && !finalBool && <div>
						<Button color='green' appearance={'ghost'} onClick={()=> start()}>Click Me</Button>
					</div>}

					{startBool && <div>
						<img src='https://c.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif' />
						<h5>{taunting[seconds]}</h5>
					</div>}

					{finalBool && !vicotryBool &&<div>
						<h5>The real treasure is:</h5>
						<Input onChange={(value)=> check(value)}></Input>	
					</div>}
					
					{vicotryBool && <div>
						<FlexboxGrid align='middle' justify="space-around"> 
						<FlexboxGrid.Item colspan={12} >
							<img src='https://c.tenor.com/pASg5wmq7nAAAAAd/pirate-dance.gif'/>
							<h5>You did it! The real treasure was the friends we made along the way!</h5>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={12} >
							{selected && <SelectedAction user={props.user} selected={selected}/>}	
						</FlexboxGrid.Item>
					</FlexboxGrid>
					</div>}

		</React.Fragment>
	);
}

const mapStateToProps = (state) => ({
	login: state.auth.login,
	user: state.auth.user,
	actions: state.actions.list,
});

const mapDispatchToProps = (dispatch) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(Quests);

const taunting = [
	"",
	'You fool! Did you think there would be treasure?',
	'Black Bob would never share his treasure with a weakling pirate like you!',
	'Weep! yes weep for you will never see the glory that is Black Bob\'s trasure!',
	'I can\'t believe you fell for it!',
	"All that time wasted!",
	"All those songs you had to listen to!",
	"and it was all for nothing!",
	"Rick Roll wins every time!",
	"Rick Roll always wins!!!",
	"Hahahahaahah!",
	"MUHAHAHAHAHAHA",
	"HHHAHAAAHAHAHAHAHAHAHAHAAHH",
	"...",
	".....",
	"Why are you still here? You lost!",
	"Wait, you think there is more?",
	"You think I spent all this effort to make these messages to entertain you?",
	"No!",
	"I did it cause it amused me to see you suffer for nothing!",
	"It was hilarious!",
	"One for the record books",
	"*Ring Ring* oh hang on my phone is ringing",
	"Hello, this Black Bob speaking!",
	"..... uh huh...",
	"*garbled voice coming over phone*",
	"Yeah..... you don't say!",
	"Ok ok I'll tell them",
	"Yeah, ok. yes. alright goodbye *hang up phone*",
	"Sorry about that, it was just the Guiness book of records!",
	"You just got awarded the record for biggest sucker!!! HAHAHAHAHA",
	"MUAHAHAHAHAHAHAHH",
	"HAAAAA hahaha they weren't even on the phone!",
	"I'm a silly text box under a gif! I can't even answer the phone!",
	"You are just so gullible!!!!",
	"Anyway, seeya later! Have fun woth your boat game or whatever is actually going on here",
	"Bye!!!",
	" ",
	" ",
	" ",
	" ",
	" ",	
	"You are a patient one aren't you?",
	" ",
	"Very well. You seem wise and patient enough to see through this test.",
	"Behold the final trial of Black Bob's treasure:"
]