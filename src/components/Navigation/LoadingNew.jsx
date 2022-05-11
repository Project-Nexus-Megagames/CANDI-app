import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Progress,	Loader,	Panel,	Icon,	IconStack,	Row,	Col, Button } from 'rsuite';
import { useHistory } from 'react-router-dom';

import { finishLoading,	setControl,	signOut,	setCharacter } from '../../redux/entities/auth';
import { loadCharacters } from '../../redux/entities/characters';
import { loadGamestate } from '../../redux/entities/gamestate';
import { loadLocations } from '../../redux/entities/locations';
import {	loadplayerActions,	loadAllActions } from '../../redux/entities/playerActions';
import { loadAssets } from '../../redux/entities/assets';

const { Line, Circle } = Progress;

const LoadingNew = (props) => {
	const [message, setMessage] = React.useState('Scott quip goes here...');
	const [sections, setSections] = React.useState(Object.keys(props.entities).sort());

	let done = Object.keys(props.entities)
		.sort()
		.filter((key) => props.entities[key].lastFetch !== null);
	const history = useHistory();

	

	if (sections.length > 0 && Math.floor((done.length / sections.length) * 100) >= 100) {
		const character = props.entities.characters.list.find(
			(el) => el.username === props.auth.user.username
		);
		console.log('AAAAAASDAWSDAWDADAD')

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
				onClick={() => this.bored()}
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
						<Panel boardered key={index} index={index}>
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
