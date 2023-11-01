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
      loadState();
		}
    const interval = setInterval(() => {
      setMessage(Math.floor(Math.random() * corps.length))
    }, 2000);
    return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		console.log('Trigger A');
		console.log(user);
		if (characters.length > 0 && user && user !== undefined) {
			console.log('Finished Loading????');

			const character0 = entities.characters.list.find((el) => el.username.toLowerCase() === user.username.toLowerCase());      
			console.log(character0);

      if (character0) {
        reduxAction(setCharacter(character0));
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
        <img width={"350px"} src={`/images/team/${corps[message]?.name}.png`} alt='Loading...' />
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
    name: "Frog Goblins",
    slogan: "Frog goblins originally hail from the swamps on the surface where they honed their scouting and botanical skills",
  },
  {
    name: "Spider Goblins",
    slogan: 'After generations of underground living around the mines, Spider goblins are easily identified by their trademark Magiuranium piercings and gray colored skin',
  },
  {
    name: "Pig Goblins",
    slogan: 'Hailing from the sewers underneath various surface cities, Sewer goblins known for being highly collaborative, maternally oriented, and strongly loyal to one another. ',
  },
  {
    name: "Rat Goblins",
    slogan: 'As the first generation born in Stockpot City, these goblins adopted the Rat as their newly formed faction’s symbol to reflect their urban upbringings.',
  },
  {
    name: "Raccoon Party",
    slogan: 'Originally a band of sentient raccoon refugees, the Racoon Party has turned into a diverse coalition of races and ideologies.',
  },
  {
    name: "Surface Delegation",
    slogan: 'Recently, a delegation of surface dwellers have come to the city, composed of Humans, Dwarves, and even some Elves.',
  },
  {
    name: "Underworld Faction",
    slogan: 'After the defeat of The Underlord, their vast evil empire shattered into a diaspora of competing factions. Many of those eventually migrated to the city, forming a large conglomerate of loosely aligned monsters with one unifying goal: resist the influence of the surface in the matters of the underground.',
  },
]

export default Loading;
