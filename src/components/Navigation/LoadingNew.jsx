import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Progress, Loader, Panel, Icon, IconStack, Row, Col, Button } from 'rsuite';
import { useHistory } from 'react-router-dom';

import {
	finishLoading,
	setControl,
	signOut,
	setCharacter
} from '../../redux/entities/auth';
import { loadCharacters } from '../../redux/entities/characters';
import { loadGamestate } from '../../redux/entities/gamestate';
import { loadGameConfig } from '../../redux/entities/gameConfig';
import { loadLocations } from '../../redux/entities/locations';
import { loadplayerActions, loadAllActions } from '../../redux/entities/playerActions';
import { loadAssets } from '../../redux/entities/assets';

const { Line } = Progress;

const LoadingNew = (props) => {
	const [message] = useState('Scott quip goes here...');
	const [sections] = useState(Object.keys(props.entities).sort());

	let done = Object.keys(props.entities)
		.sort()
		.filter((key) => props.entities[key].lastFetch !== null);
	const history = useHistory();

	const boredClick = () => {
		const random = Math.floor(Math.random() * bored.length);
		const win = window.open(bored[random], '_blank');
		win.focus();
	};

	if (
		sections.length > 0 &&
		Math.floor((done.length / sections.length) * 100) >= 100
	) {
		const character = props.entities.characters.list.find(
			(el) => el.username === props.auth.user.username
		);

		if (props.auth.user.roles.some((el) => el === 'Control')) {
			character ? props.setCharacter(character) : console.log(character);
			props.finishLoading();
			history.push('/home');
		} else if (character) {
			character ? props.setCharacter(character) : console.log(character);
			props.finishLoading();
			history.push('/home');
		} else {
			// Alert.error('You do not have an assigned team!', 1000);
			return (
				<div
					style={{
						justifyContent: 'center',
						textAlign: 'center',
						width: '100%'
					}}
				>
					<img
						src="http://cdn.lowgif.com/full/02b057d73bf288f7-.gif"
						alt={'No Character...'}
					/>
					<h5>Could not find a character for you... </h5>
					<Button
						onClick={() => {
							props.logOut();
							history.push('/login');
						}}
					>
						Log Out
					</Button>
					{/* <img height={500} src='https://live.staticflickr.com/4782/40236389964_fe77df66a3_b.jpg' alt='failed to find team assigned'/> */}
				</div>
			);
		}
	}

	return (
		<div>
			<img
				style={{ maxHeight: '400px', height: '30vh' }}
				src={gamePhotos[rand]}
				alt={'Loading...'}
				onClick={() => boredClick()}
			/>
			{/* src={spook[rand]} */}
			{<h5>{loadingMsg[rand1]}</h5>}
			<Line
				percent={Math.floor((done.length / sections.length) * 100)}
				status="active"
			/>
			<hr />
			<Row>
				{sections.map((section, index) => (
					<Col key={index} md={4} sm={8}>
						<Panel bordered key={index} index={index}>
							<IconStack>
								{props.entities[section].lastFetch ? (
									<Icon icon="check" stack="1x" style={{ color: 'green' }} />
								) : (
									<Icon icon="spinner" stack="1x" pulse />
								)}
							</IconStack>
							{section}
						</Panel>
					</Col>
				))}
			</Row>
			<Loader
				center
				content={`${message} - ${Math.floor(
					(done.length / sections.length) * 100
				)}%`}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	actionsFailed: state.actions.failedAttempts,
	charactersFailed: state.characters.failedAttempts,
	assetsFailed: state.assets.failedAttempts,
	locationsFailed: state.locations.failedAttempts,

	appState: state,
	auth: state.auth,
	entities: state,
	user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
	loadAction: (data) => dispatch(loadplayerActions(data)),
	loadAllActions: (data) => dispatch(loadAllActions(data)),
	loadChar: () => dispatch(loadCharacters()),
	loadAssets: () => dispatch(loadAssets()),
	loadLocations: () => dispatch(loadLocations()),
	loadGamestate: () => dispatch(loadGamestate()),
	loadGameConfig: () => dispatch(loadGameConfig()),
	setCharacter: (payload) => dispatch(setCharacter(payload)),
	finishLoading: () => dispatch(finishLoading()),
	logOut: () => dispatch(signOut()),
	isControl: (payload) => dispatch(setControl(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingNew);

const gamePhotos = ['https://acegif.com/wp-content/gifs/pirate-flag-1.gif'];

const loadingMsg = [
	// 'Thank you all for taking time to make this game happen.',
	"pɐol oʇ pǝʍollɐ ʇou ǝɹɐ noʎ 'sᴉɥʇ pɐǝɹ uɐɔ noʎ ɟI",
	"Help I'm a man stuck inside a loading screen let me out!",
	"C.A.N.D.I stands for the \"Controling Actions 'N Distributing Inputs\"! \nLook I really just wanted to call it CANDI. It's my app and I'll call it whatever I want!"
];
const rand = Math.floor(Math.random() * gamePhotos.length);
const rand1 = Math.floor(Math.random() * loadingMsg.length);

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
	'https://www.youtube.com/watch?v=D6aVzIWT7oM&t=14s&ab_channel=AllyourbasicGerrard', // Global Club Soccer Rankings
	'https://www.youtube.com/watch?v=x0WQOGVLLGw&ab_channel=weyrdmusicman', // Xenophobia
	'https://www.youtube.com/watch?v=9klzZsVw-cQ&ab_channel=KotteAnimation'
]; // https://youtu.be/_17xBPv6-c0?t=4 shut the heeeelll up
