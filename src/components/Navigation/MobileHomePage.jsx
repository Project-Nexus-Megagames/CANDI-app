import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, Row, Col, Loader, Dropdown, IconButton, FlexboxGrid, Panel } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';
import Loading from './loading';

// import aang from '../Images/aang.jpg'
import action from '../Images/actiommobile.png'
import control2 from '../Images/Control.jpg'
import other from '../Images/othercharacters.jpg'
import control from '../Images/balls.png'
import nexus from '../Images/nexus.jpg'
import myCharacter from '../Images/myCharacter.jpg'

import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';
import { Link } from 'react-router-dom';
import { toggleDuck } from '../../redux/entities/gamestate';

const HomePage = (props) => {
	const [show, setShow] = React.useState(false);
	const [loaded, setLoaded] = React.useState(false);
	const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0, });

	useEffect(() => {
		if(!props.loading && props.actionsLoaded && props.gamestateLoaded && props.charactersLoaded && props.locationsLoaded && props.assetsLoaded) {
			setLoaded(true);
		}		
		setInterval(() => {
			renderTime(props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
		console.log(window.innerHeight)
	}, []);

	useEffect(() => {
		if(!props.loading && props.actionsLoaded && props.gamestateLoaded && props.charactersLoaded && props.locationsLoaded && props.assetsLoaded) {
			setTimeout(() => setLoaded(true), 1000)	
		}	
	}, [props]);

	const handleLogOut = () => {
		props.logOut();
		socket.emit('logout');
		props.history.push('/login');
	}
	
	const renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance =  countDownDate - now;

		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 *60 * 24)) / (1000 * 60 *60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		setClock({ hours, minutes, days });
	}


	const openNexus = () => {
		const win = window.open('https://www.patreon.com/wcmprojectnexus', '_blank');
		win.focus();
	}

	return ( 
		<React.Fragment>
				<div style={{ height: '6vh', backgroundColor: '#746D75', width: "100%" }}>
				<FlexboxGrid align="middle">
					<FlexboxGrid.Item style={{ alignItems: 'center' }} colspan={1}>
						<Dropdown
								renderTitle={() => {
									return <IconButton appearance="subtle" icon={<Icon icon="bars" size="4x"/>} size="md" circle />;
								}}
							>
								<Dropdown.Item>Version: {props.version}</Dropdown.Item>
								<Dropdown.Item onSelect={() => window.open('https://github.com/Project-Nexus-Megagames/CANDI-issues/issues')}>Report Issues</Dropdown.Item>
								<Dropdown.Item onSelect={() => window.open('https://www.patreon.com/wcmprojectnexus')}>Support Nexus</Dropdown.Item>
								<Dropdown.Item onSelect={()=> handleLogOut()}>Log Out</Dropdown.Item>
								<Dropdown.Item onSelect={()=> props.toggleDuck()}>Quack</Dropdown.Item>
							</Dropdown>					
						</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={22}>
						<div>
						<p>Round: {props.gamestate.round} </p>	
							{(clock.days > 0) && <p>Time Left: {clock.days} Days, {clock.hours} Hours </p>}
							{(clock.hours > 0 && clock.days <= 0) && <p>Time Left: {clock.hours} Hours, {clock.minutes} Minutes</p>}	
							{(clock.hours <= 0 && clock.minutes > 0 && clock.days <= 0) && <p>Time Left: {clock.minutes} Minutes</p>}	
							{(clock.days + clock.hours + clock.minutes <= 0) && <p>Game Status: {props.gamestate.status}</p>}	
						</div>									
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
				</FlexboxGrid>
				</div>



				<div style={{ height: '94vh', width: "100%", overflow: 'auto' }}>
				<FlexboxGrid  >

					<FlexboxGrid.Item colspan={24}>
						<div style={{ border: "5px solid #ff66c4", borderRadius: '10px', position: 'relative', float:'left', display:'inline-block', margin: '10px', height: '35vh', overflow: 'hidden' }}>

							<div className="container">
									<img src={'https://cdn.discordapp.com/attachments/807365449938763796/885500753853165608/Gods_Wars_Banner.png'} className={props.disabled ? 'image disabled' : 'image'} height='auto' alt='Failed to load img' />             
							</div>

						</div>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={12}>
						<ImgPanel img={action} to='actions' title='Actions' body='Creating and editing Actions'/>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={12}>
						<ImgPanel img={myCharacter} to='character' title='My Character' body='My Assets and Traits'/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={12}>
						<ImgPanel img={control2} to='controllers' title='Control' body='Who is responsible?'/>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={12}>
						<ImgPanel img={other} to='others' title={'Other Characters'} body='Character Details'/>
					</FlexboxGrid.Item>

				</FlexboxGrid>
				</div>

			</React.Fragment>
		);
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	login: state.auth.login,
	loading: state.auth.loading,
	gamestate: state.gamestate,
	gamestateLoaded: state.gamestate.loaded,
	actionsLoaded: state.actions.loaded,
	charactersLoaded: state.characters.loaded,
	assetsLoaded: state.assets.loaded,
	locationsLoaded: state.locations.loaded,
	version: state.gamestate.version,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut()),
	toggleDuck: (data) => dispatch(toggleDuck(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
