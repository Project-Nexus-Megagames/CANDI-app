import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Icon, Loader, Dropdown, IconButton, FlexboxGrid } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

// import aang from '../Images/aang.jpg'
import control2 from '../Images/test.jpg';
import other from '../Images/other.jpg';
import nexus from '../Images/test.jpg';
import banner from '../Images/banner1.jpg';
import actions from '../Images/actions.jpg';
import myCharacter from '../Images/test.jpg';
import Map from '../Images/map.jpg';

import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';
import { Link } from 'react-router-dom';
import UserList from './UserList';
import LoadingNew from './LoadingNew';

const HomePage = (props) => {
	const [loaded, setLoaded] = React.useState(false);
	const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0 });

	useEffect(() => {
		if (
			!props.loading &&
			props.actionsLoaded &&
			props.gamestateLoaded &&
			props.charactersLoaded &&
			props.locationsLoaded &&
			//props.gameConfigLoaded &&
			props.assetsLoaded
		) {
			setLoaded(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		renderTime(props.gamestate.endTime);
		setInterval(() => {
			renderTime(props.gamestate.endTime);
			//clearInterval(interval);
		}, 60000);
	}, [props.gamestate.endTime]);

	useEffect(() => {
		if (
			!props.loading &&
			props.actionsLoaded &&
			props.gamestateLoaded &&
			props.charactersLoaded &&
			props.locationsLoaded &&
			// props.gameConfigLoaded &&
			props.assetsLoaded
		) {
			setTimeout(() => setLoaded(true), 2000);
		}
	}, [props]);

	const handleLogOut = () => {
		props.logOut();
		socket.emit('logout');
		props.history.push('/login');
	};

	const renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance = countDownDate - now;

		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		setClock({ hours, minutes, days });
	};

	const openNexus = () => {
		const win = window.open(
			'https://www.patreon.com/wcmprojectnexus',
			'_blank'
		);
		win.focus();
	};

	if (!props.login && !props.loading) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	if (!loaded) {
		return <LoadingNew />;
	} else if (props.login && !props.myCharacter) {
		props.history.push('/no-character');
		return <Loader inverse center content="doot..." />;
	} else if (props.gamestate.status === 'Down') {
		props.history.push('/down');
		return <Loader inverse center content="doot..." />;
	}
	// 	if (window.innerWidth < 768) {
	// 	return (<MobileHomePage />)
	// }
	return (
		<React.Fragment>
			<FlexboxGrid
				justify="start"
				style={{
					height: '50px',
					backgroundColor: '#746D75',
					color: '',
					borderBottom: '3px solid',
					borderRadius: 0,
					borderColor: '#d4af37'
				}}
				align="middle"
			>
				<FlexboxGrid.Item style={{ alignItems: 'center' }} colspan={1}>
					<Dropdown
						renderTitle={() => {
							return (
								<IconButton
									appearance="subtle"
									icon={<Icon icon="bars" size="4x" />}
									size="md"
									circle
								/>
							);
						}}
					>
						<Dropdown.Item>Version: {props.version}</Dropdown.Item>
						<Dropdown.Item
							onSelect={() =>
								window.open(
									'https://github.com/Project-Nexus-Megagames/CANDI-issues/issues'
								)
							}
						>
							Report Issues
						</Dropdown.Item>
						<Dropdown.Item
							onSelect={() =>
								window.open('https://www.patreon.com/wcmprojectnexus')
							}
						>
							Support Nexus
						</Dropdown.Item>
						<Dropdown.Item onSelect={() => handleLogOut()}>
							Log Out
						</Dropdown.Item>
						<Dropdown.Item onSelect={() => props.toggleDuck()}>
							Spook
						</Dropdown.Item>
					</Dropdown>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={22}>
					<div>
						<p>Round: {props.gamestate.round} </p>
						{clock.days > 0 && (
							<p>
								Time Left: {clock.days} Days, {clock.hours} Hours{' '}
							</p>
						)}
						{clock.hours > 0 && clock.days <= 0 && (
							<p>
								Time Left: {clock.hours} Hours, {clock.minutes} Minutes
							</p>
						)}
						{clock.hours <= 0 && clock.minutes > 0 && clock.days <= 0 && (
							<p>Time Left: {clock.minutes} Minutes</p>
						)}
						{clock.days + clock.hours + clock.minutes <= 0 && (
							<p>Game Status: {props.gamestate.status}</p>
						)}
					</div>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={1}>
					{props.myCharacter.tags.some((el) => el === 'Control') && (
						<UserList />
					)}
				</FlexboxGrid.Item>
			</FlexboxGrid>

			<div style={{ height: 'calc(100vh - 50px)' }}>
				<FlexboxGrid justify="center">
					<FlexboxGrid.Item colspan={14}>
						<div
							style={{
								border: '5px solid #d4af37',
								borderRadius: '10px',
								margin: '10px',
								height: '45vh',
								overflow: 'hidden'
							}}
						>
							<img
								src={banner}
								className={'image'}
								style={{ maxWidth: '100%', height: '100%' }}
								alt="Failed to load img"
							/>
							<p
								style={{
									position: 'absolute',
									bottom: '10px',
									left: '15px',
									color: 'white',
									fontSize: '0.966em'
								}}
							>
								Version: {props.version}
							</p>
						</div>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={10}>
						<Link to={'actions'}>
							<div
								style={{
									border: '5px solid #d4af37',
									width: '94%',
									borderRadius: '10px',
									position: 'relative',
									margin: '10px',
									height: props.height ? props.height : '45vh',
									overflow: 'hidden'
								}}
							>
								<div className="container">
									<img
										src={actions}
										className={props.disabled ? 'image disabled' : 'image'}
										height="auto"
										alt="Failed to load img"
									/>
								</div>
								<h6
									style={{
										position: 'absolute',
										bottom: '25px',
										left: '15px',
										color: 'white',
										background: '#663300'
									}}
								>
									{' '}
									~ Actions ~{' '}
								</h6>
								<p
									style={{
										position: 'absolute',
										bottom: '10px',
										left: '15px',
										color: 'white',
										background: '#663300',
										fontSize: '0.966em'
									}}
								>
									{''} Creating and editing Actions{' '}
								</p>
							</div>
						</Link>
						{/* <ImgPanel height={'45vh'} img={test} to='actions' title='Actions' body='Creating and editing Actions'/> */}
					</FlexboxGrid.Item>
				</FlexboxGrid>

				<FlexboxGrid>
					<FlexboxGrid.Item colspan={6}>
						<ImgPanel
							img={myCharacter}
							to="character"
							title="~ My Character ~"
							body="My Assets and Traits"
						/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						<ImgPanel
							img={Map}
							to="Map"
							title="~ Map ~"
							body="Here be Dragons..."
						/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						{props.myCharacter.tags.some((el) => el === 'Control') && (
							<ImgPanel
								img={control2}
								to="control"
								title={'~ Control Terminal ~'}
								body='"Now he gets it!"'
							/>
						)}
						{!props.myCharacter.tags.some((el) => el === 'Control') && (
							<div
								onClick={() => openNexus()}
								style={{
									border: '5px solid #d4af37',
									width: '90%',
									borderRadius: '10px',
									position: 'relative',
									margin: '10px',
									height: '44vh',
									overflow: 'hidden'
								}}
							>
								<div className="container">
									<img
										src={nexus}
										className={props.disabled ? 'image disabled' : 'image'}
										height="auto"
										alt="Failed to load img"
									/>
								</div>
								<h6
									style={{
										position: 'absolute',
										bottom: '25px',
										left: '15px',
										color: 'white',
										background: '#800080'
									}}
								>
									~ Project Nexus ~
								</h6>
								<p
									style={{
										position: 'absolute',
										bottom: '10px',
										left: '15px',
										color: 'white',
										background: '#800080',
										fontSize: '0.966em'
									}}
								>
									Support the Programmers
								</p>
							</div>
						)}
						{/* <ImgPanel height={'20.5vh'} img={Map} to='controllers' title='Control' body='Who is responsible?'/> */}
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						<ImgPanel
							img={other}
							to="others"
							title={'~ Other Characters ~'}
							body="Character Details"
						/>
					</FlexboxGrid.Item>
				</FlexboxGrid>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	login: state.auth.login,
	loading: state.auth.loading,
	gamestate: state.gamestate,
	gamestateLoaded: state.gamestate.loaded,
	//gameConfigLoaded: state.gameConfig.loaded,
	actionsLoaded: state.actions.loaded,
	charactersLoaded: state.characters.loaded,
	assetsLoaded: state.assets.loaded,
	locationsLoaded: state.locations.loaded,
	version: state.gamestate.version,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut()),
	toggleDuck: (data) => dispatch(toggleDuck(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>
