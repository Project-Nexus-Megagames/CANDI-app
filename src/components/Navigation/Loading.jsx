import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import loadState from '../../scripts/initState';
import { finishLoading, setControl, setTeam, signOut, setCharacter, loadingState } from '../../redux/entities/auth';
import { Check } from '@rsuite/icons';
import { Box, Button, Center, Flex, Progress, Spinner, Text } from '@chakra-ui/react';

const Loading = (props) => {
	const reduxAction = useDispatch();
	const navigate = useNavigate();

	const { loadingStart, user, myCharacter, team } = useSelector((s) => s.auth);
	const characters = useSelector((s) => s.characters.list);
	const teams = useSelector((s) => s.teams.list);
	const entities = useSelector((s) => s)

	const [message, setMessage] = React.useState( Math.floor(Math.random() * corps.length));
	const [sections, setSections] = React.useState(Object.keys(entities).sort());

	let done = Object.keys(entities)
		.sort()
		.filter((key) => entities[key].lastFetch !== undefined);

	useEffect(() => {
		if (loadingStart === false) {
			reduxAction(loadingState());
      loadState();
		}
    const interval = setInterval(() => {
      setMessage(Math.floor(Math.random() * corps.length))
    }, 2500);
    return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		console.log('Trigger A');
    console.log(entities)
		if (entities.characters.list.length > 0 && user && user !== undefined) {
			console.log('Finished Loading????');

			const character0 = entities.characters.list.find((el) => el.username.toLowerCase() === user.username.toLowerCase());      

      if (character0) {
        reduxAction(setCharacter(character0));
      }
      else {
        navigate('/no-character');
      }
      reduxAction(finishLoading());
		}
	}, [characters, message]);

	useEffect(() => {
		console.log('Trigger B');
		if (teams.length > 0 && !team && myCharacter) {
			console.log('Finished Loading!!!!');
			const myTeam = myCharacter ? entities.teams.list.find((el) => el.characters.some((user) => user._id == myCharacter._id)) : false;
			reduxAction(setTeam(myTeam));

			reduxAction(finishLoading());
		}
	}, [myCharacter, message]);

  const handleLogOut = async () => {
		reduxAction(signOut())
		navigate('/login');
	}

	return (
		<div>
      <Center>
        <Text fontSize={"x-large"} >{corps[message]?.name}</Text> 
      </Center>

      <Center>
        <img width={"350px"} src={`${corps[message]?.gifLink}`} alt='Loading...' />
      </Center>

      <Center>
        <Text fontSize={"lg"} >"{corps[message]?.slogan}"</Text> 
      </Center>
      
      
			
			<Progress
				value={Math.floor(
					(Object.keys(entities)
						.sort()
						.filter((key) => entities[key].lastFetch !== null).length /
						sections.length) *
						100
				)}
				status='active'
			/>
			<hr />

			<Flex justify={'space-between'} >
				{sections.map((section, index) => (
					<Box key={index} index={index}>
						{entities[section].lastFetch ? <Check style={{ color: 'green' }} /> : <Spinner />}
						{section}
					</Box>
				))}
			</Flex>
      <Button onClick={()=> handleLogOut()}>Log Out</Button>

      {myCharacter && <p>{myCharacter.characterName}</p>}
      {team && <p>{team.name}</p>}
		</div>
	);
};

const corps = [
  {
    name: "Space Fact #1",
    slogan: "Space is actually pretty big.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #108",
    slogan: "The Sun is large enough to contain 12 basketballs inside of it!",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #79",
    slogan: "The Universe is at least 29 years old.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #5",
    slogan: "There is no sound in space, because sound cannot afford a rocket to exit the atmosphere.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #221",
    slogan: "Aliens exist! They just don't want to talk to us boring humans. Jerks.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #101",
    slogan: "The rest of the galaxy already has McDonalds, we were the last planet to get it.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #123",
    slogan: "Spacecraft have visited all the known planets in our solar system. Including that one that no one is supposed to know about. Wait, forget you read that.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
  {
    name: "Space Fact #34",
    slogan: "In 1 trillion years, you will be dead. Sorry.",
    gifLink: 'https://media1.tenor.com/m/D5tiGIdJ9-IAAAAC/space-saturn.gif'
  },
]

export default Loading;
