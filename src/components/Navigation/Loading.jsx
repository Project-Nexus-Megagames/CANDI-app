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
	const entities = useSelector((s) => s);

	const [message, setMessage] = React.useState( Math.floor(Math.random() * corps.length));
	const [sections, setSections] = React.useState(Object.keys(entities).sort());

	let done = Object.keys(entities)
		.sort()
		.filter((key) => entities[key].lastFetch !== undefined);

	useEffect(() => {
		if (loadingStart === false) {
			reduxAction(loadingState());
		}
    const interval = setInterval(() => {
      setMessage(Math.floor(Math.random() * corps.length))
    }, 2000);
    return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		console.log('Trigger A');
		console.log(user);
		if (characters.length > 0 && user !== undefined) {
			console.log('Finished Loading????');
			const controlTeam = entities.teams.list.find((el) => el.tags.some((tag) => tag === 'control'));

			const character0 = entities.characters.list.find((el) => el.username.toLowerCase() === user.username.toLowerCase());
      
			console.log(character0);

      if (character0) {
        reduxAction(setCharacter(character0));
		  	if (character0 && controlTeam) reduxAction(setControl(controlTeam.characters.some((el) => el._id === character0._id)));
      }
      else {
        navigate('/no-character');
      }


		}
	}, [characters]);

	useEffect(() => {
		console.log('Trigger B');
		if (teams.length > 0 && !team && myCharacter) {
			console.log('Finished Loading!!!!');
			const myTeam = myCharacter ? entities.teams.list.find((el) => el.characters.some((user) => user._id == myCharacter._id)) : false;
			reduxAction(setTeam(myTeam));

			reduxAction(finishLoading());
		}
	}, [myCharacter]);

  const handleLogOut = async () => {
		reduxAction(signOut())
		navigate('/login');
	}

	return (
		<div  >
      {done.length} {sections.length}
      <Center>
        <Text fontSize={"x-large"} >{corps[message]?.name}</Text> 
      </Center>

      <Center>
        <img width={"350px"} src={`/images/Icons/teams/${corps[message]?.name}.png`} alt='Loading...' />
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
		</div>
	);
};

const corps = [
  {
    name: "Alpha Androids",
    slogan: "Almost human.",
  },
  {
    name: "Crowe Corp",
    slogan: 'Conflict is our business',
  },
  {
    name: "Cybertronics Industries",
    slogan: 'The future is mechanical',
  },
  {
    name: "Falcon Pharma",
    slogan: 'Your health is our world',
  },
  {
    name: "GenTec",
    slogan: 'Faster. Stronger. Better',
  },
  {
    name: "Makoto-Tyson Shipping",
    slogan: 'Seize the stars',
  },
  {
    name: "McMann Corp",
    slogan: 'We put the food on your table',
  },
  {
    name: "WaiFu Corp",
    slogan: 'Building the world of tomorrow',
  },
]

export default Loading;
