import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import loadState from '../../scripts/initState';
import { finishLoading, setControl, setTeam, signOut, setCharacter, loadingState } from '../../redux/entities/auth';
import { ArrowLeft, ArrowRight, Check } from '@rsuite/icons';
import { Box, Button, Center, Flex, IconButton, Progress, Spinner, Text } from '@chakra-ui/react';

const Loading = ({controlMode}) => {
	const reduxAction = useDispatch();
	const navigate = useNavigate();

	const { loadingStart, user, myCharacter, team } = useSelector((s) => s.auth);
	const characters = useSelector((s) => s.characters.list);
	const teams = useSelector((s) => s.teams.list);
	const entities = useSelector((s) => s)
  
	const gameConfig = useSelector((s) => s.gameConfig)

	const [message, setMessage] = React.useState( Math.floor(Math.random() * loadingTips.length));
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
      setMessage(Math.floor(Math.random() * loadingTips.length))
    }, 4500);
    return () => clearInterval(interval);
	}, []);

  // useEffect(() => {
  //   console.log("gameConfig", gameConfig)
	// 	if (gameConfig && gameConfig.loadingTips) {
  //     console.log("loadingTips", gameConfig.loadingTips)
	// 		setLoadingTips(gameConfig.loadingTips)
  //     setMessage(Math.floor(Math.random() * gameConfig.loadingTips.length))
	// 	}

	// }, [gameConfig]);

	useEffect(() => {
		// console.log('Trigger A');
		if (entities.characters.list.length > 0 && user && user !== undefined) {
			console.log('Finished Loading????');

			const character0 = entities.characters.list.find((el) => el.username.toLowerCase() === user.username.toLowerCase());      

      if (character0) {
        reduxAction(setCharacter(character0));
        reduxAction(finishLoading());
      }
		}
	}, [characters, message]);


	// useEffect(() => {
	// 	console.log('Trigger B');
	// 	if (teams.length > 0 && !team && myCharacter) {
	// 		console.log('Finished Loading!!!!');
	// 		const myTeam = myCharacter ? entities.teams.list.find((el) => el.characters.some((user) => user._id == myCharacter._id)) : false;
	// 		reduxAction(setTeam(myTeam));

	// 		//reduxAction(finishLoading());
	// 	}
	// }, [myCharacter, message]);

  const handleLogOut = async () => {
		reduxAction(signOut())
		navigate('/login');
	}

  const boredClick = () => {
		const random = Math.floor(Math.random() * bored.length);
		const win = window.open(bored[random], '_blank');
		win.focus();
	};


	return (
		<div>
      <Center>
        <Text fontSize={"x-large"} >{loadingTips[message]?.title}</Text> 
      </Center>

      <Center>
        <IconButton icon={<ArrowLeft/>} isDisabled={message <= 0} onClick={() => {setMessage(message-1); }} />
        <img width={"350px"} src={`${loadingTips[message]?.gifLink}`} alt='Loading...' onClick={() => boredClick()} />
        <IconButton icon={<ArrowRight/>} isDisabled={message >= loadingTips.length-1} onClick={() => {setMessage(message+1); }} />
      </Center>

      <Center>
        <Text fontSize={"lg"} >"{loadingTips[message]?.description}"</Text> 
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

const loadingTips = [
  {
    title: "Subway fact #1",
    description: "All subways are free if you disregard laws",
    gifLink: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3ViNmt4M3praTRrajc5anJwdnI3Yjk0NXowemUyaXRncmlpMG1qdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1AjD7N6KS8KUq7ynjW/giphy.gif'
  },
];


  const bored = [
    'https://www.youtube.com/watch?v=QSS3GTmKWVA', // Freddie Mercury gets Trapped in a Slide and Calls out for Mamma (ASMR)
    'https://www.youtube.com/watch?v=Q6EIUo1q4lc&lc=UgwLB6d6w9RNlqJHQ1t4AaABAg&ab_channel=BobtheNinjaMan', // Dummy Thicc
    'https://youtu.be/Rc-Jh3Oe0Gc', // Racism In Teen Titans
    'https://www.youtube.com/watch?v=BP9uI4rFVHU', // you dare speak to me in that tone of voice?
    'https://www.youtube.com/watch?v=j0HN7bvBODE', // Ding (toto car alarm)
    'https://www.youtube.com/watch?v=fhmeYoJZeOw', // When I Make a Good Pun (Brian David Gilbert)
    'https://www.youtube.com/watch?v=Oct2xKMGOno', // WednesdayOS
    'https://www.youtube.com/watch?v=5tFZof9EDhc', // what's your team's name?
    'https://www.youtube.com/watch?v=Qz7tMKlkPOc&t=1', // The Male Fantasy
    'https://www.youtube.com/watch?v=nWIzwQui-xg', // Awkward moments with... Daniel Radcliffe - Pathé
    'https://www.youtube.com/watch?v=cHoGhisiBg8&feature=youtu.be', // WW2 - Pearl Harbor
    'https://www.youtube.com/watch?v=9xX6QPIQdZs&feature=youtu.be', // Waiting in line for 10 hours for a Supreme crowbar
    'https://www.youtube.com/watch?v=it8vJ03E8c8', // shingle jingle
    'https://www.youtube.com/watch?v=bTS9XaoQ6mg&list=WL&index=130', // chess king sacrifice
    'https://www.youtube.com/watch?v=zo7fgswQPJ8&list=WL&index=37&ab_channel=ThomasSchuler', // Someone Hacked Lime Scooters
    'https://www.youtube.com/watch?v=G_rWl-jaAiU', // buy my bed
    'https://www.youtube.com/watch?v=D5fH5j7ux0U', // Spongebob also knows the rules
    'https://www.youtube.com/watch?v=B62ACxuq8Pw', // Discombobulate
    'https://www.youtube.com/watch?v=dGDH3meSPyk&ab_channel=dakooters', // god is dead OwO
    'https://www.youtube.com/watch?v=WGNuDe3OwFY&feature=youtu.be', // Annihilation Deleted Scene
    'https://www.youtube.com/watch?v=AauAyjBxaIQ', // Siblings
    'https://www.youtube.com/watch?v=ihSaGAVHmvw', // Bikie Wars
    'https://www.youtube.com/watch?v=gp1lCem43lg', // Tactical Reload
    'https://www.youtube.com/watch?v=nHc288IPFzk', // Duck Army
    'https://www.youtube.com/watch?v=Z47xwzYGop8', // that's just a stupid boulder [2]
    'https://www.youtube.com/watch?v=GPUgjy-Pn-4', // a villain who unintentionally always does helpful things
    'https://www.youtube.com/watch?v=St7S3YrxqW0', // Dog concerto in A♭m
    'https://www.youtube.com/watch?v=otIrDM4RBpo', // Modern Romance
    'https://www.youtube.com/watch?v=mnE8A9cfGio', // Send This to a Fellow King
    'https://www.youtube.com/watch?v=0_7WwPkqqvA', // Being Bigoted in the Workplace - 1999 Ep01
    'https://www.youtube.com/watch?v=1fjuaBZQtOI', // fine dining dakooters
    'https://www.youtube.com/watch?v=n3GOL_KHxX4', // you fool dakooters
    'https://www.youtube.com/watch?v=IdoD2147Fik', // Dumbledore asked calmly
    'https://www.youtube.com/watch?v=3NCyD3XoJgM', // Hi, I'm Daisy
    'https://www.youtube.com/watch?v=JFtUHVgw-gQ', // Boston Dynamics: Rise of the Dance of the Machines
    'https://www.youtube.com/watch?v=vYud9sZ91Mc', // Music really makes a difference
    'https://www.youtube.com/watch?v=PPgLTgWa99w', // "WAAfrica" (Five Waluigis sing Africa)
    'https://www.youtube.com/watch?v=kGj_HkKhhSE', // Wire
    'https://www.youtube.com/watch?v=pMN_bvk4KTo', // vacuum sealed tupperware
    'https://www.youtube.com/watch?v=xI39jU24InY', // Vader being a jerk
    'https://www.youtube.com/watch?v=s-09gNDsPzQ', // gamers
    'https://www.youtube.com/watch?v=9fjk8cNiptU', // Hard Ticket to Hawaii (1987) - Skate or Die
    'https://www.youtube.com/watch?v=yUZfkbKFtKA', // He must have taken him back to his village
    'https://www.youtube.com/watch?v=iP897Z5Nerk', // BINARY search with FLAMENCO dance
    'https://www.youtube.com/watch?v=fC7oUOUEEi4', // Get Stick Bugged lol
    'https://www.youtube.com/watch?v=d1rtJ3DbwIw', // Just a Jug of Chocolate Milk being Cut in Half
    'https://www.youtube.com/watch?v=EwAajOtfNT8', // two dudes in a hot tub
    'https://www.youtube.com/watch?v=XKqqqO83yp0', // Guy blow dries his tongue then eats a cracker...
    'https://www.youtube.com/watch?v=GfCqnHgXwBo', // How to troll a parade
    'https://www.youtube.com/watch?v=TLV30GuX-ug', // this is the ideal doggy type
    'https://www.youtube.com/watch?v=nqhLn76kCv0', // Epic Skeletor He Man Money Super Market Commercial
    'https://pointerpointer.com/',
    'https://www.youtube.com/watch?v=Cv42itgRU6o', // Randall is banished to the shadow realm
    'https://www.youtube.com/watch?v=U_ILg-oZK-Q', // Playtime (Dan harmon)
    'https://www.youtube.com/watch?v=B0Td48JLgow', // FELLINLOVEWITHAGIRLLLL
    'https://www.youtube.com/watch?v=5KO2IjWI9fA', // Witches On Tinder
    'https://www.youtube.com/watch?v=ETbMj3cE7YA', // Star Fox 64 Ligma
    'https://www.youtube.com/watch?v=gnXUFXc2Yns', // Socialism is when the government does stuff but I vocoded it
    'https://www.youtube.com/watch?v=R4GlR6X4ljU&t=3s&ab_channel=PopCultureFish', // Oblivion npc conversation
    'https://www.youtube.com/watch?v=gBCKZtpMSNE&ab_channel=JCFosterTakesItToTheMoon', // Maslow Pyramid Any% Speedrun | 8.1 Seconds
    'https://www.youtube.com/watch?v=D4D5fZb-sEM&ab_channel=ProZD', // A Sexy RP with Walter White and Joseph Stalin
    'https://www.youtube.com/watch?v=x0WQOGVLLGw&ab_channel=weyrdmusicman', // Xenophobia
    'https://www.youtube.com/watch?v=9klzZsVw-cQ&ab_channel=KotteAnimation',
    'https://www.youtube.com/watch?v=jFHH3cFzKbo&ab_channel=Evan%27sKazooCovers', // Interstellar Docking Scene but the Orchestra was Fired and Replaced by Kazoos
    'https://www.youtube.com/watch?v=CwaD9tb1P50&ab_channel=Tr0ubleshooter', // release the kitties
    'https://www.youtube.com/watch?v=MGJZfmYMltM&ab_channel=MarcRebillet-Topic' // Girl's Club
  ]; // https://youtu.be/_17xBPv6-c0?t=4 shut the heeeelll up
  
export default Loading;
