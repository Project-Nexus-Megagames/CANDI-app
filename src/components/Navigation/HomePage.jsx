import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, Row, Col, Loader, Dropdown, IconButton, FlexboxGrid, Panel } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';
import Loading from './loading';

// import aang from '../Images/aang.jpg'
import control2 from '../Images/Control.jpg'
import other from '../Images/othercharacters.jpg'
import control from '../Images/balls.png'

import test from '../Images/test.png'
import banner from '../Images/banner.jpg'
import myCharacter from '../Images/MyCharacter.jpg'
import LeaderBoard from '../Images/LeaderBoard.jpg'

import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';
import MobileHomePage from './MobileHomePage';

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
	
	if (!props.login && !props.loading) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	};
	if (!loaded) {
		return (<Loading />)
	}
	else if (props.login && !props.myCharacter) {
		props.history.push('/no-character');
		return (<Loader inverse center content="doot..." />)
	}
	else if (props.gamestate.status === 'Down') {
		props.history.push('/down');
		return (<Loader inverse center content="doot..." />)
	}
	if (window.innerHeight < 900) {
		return (<MobileHomePage />)
	}
	return ( 
		<React.Fragment>
				<FlexboxGrid justify="start" style={{ height: '50px', backgroundColor: '#746D75',  color: '', borderBottom: '3px solid', borderRadius: 0, borderColor: '#d4af37'  }} align="middle">
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

				<div style={{  height: 'calc(100vh - 50px)', width: "100%",  }}>
				<FlexboxGrid >

					<FlexboxGrid.Item colspan={14}>
						<div style={{ border: "5px solid #ff66c4", borderRadius: '10px', margin: '10px', height: '45vh', overflow: 'hidden' }}>

									<img src={banner} className={'image'} style={{ maxWidth: '100%', objectFit: 'scale-down'}} alt='Failed to load img' />             
									<p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white', fontSize: '0.966em',}}>Version: {props.version}</p>
						</div>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={10}>
						<ImgPanel height={'45vh'} img={test} to='actions' title='Actions' body='Creating and editing Actions'/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						<ImgPanel img={myCharacter} to='character' title='My Character' body='My Assets and Traits'/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						<ImgPanel disabled={true} img={control2} to='leaderboard' title='Leaderboard' body='How are things standing?'/>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
						{props.myCharacter.tags.some(el=> el === 'Control') && <ImgPanel  img={control} to='control' title={'Control Terminal'} body='"Now he gets it!"'/>}
						{!props.myCharacter.tags.some(el=> el === 'Control') && <ImgPanel  img={''} to='' title={''} body=''/>}
						{/* <ImgPanel height={'20.5vh'} img={LeaderBoard} to='controllers' title='Control' body='Who is responsible?'/> */}
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={6}>
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

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>
/*

		else return ( 
			<React.Fragment>
				<div style={{ height: '6vh', width: "100%" }}>
					<FlexboxGrid justify="start" style={{ backgroundColor: '#746D75',  color: '' }} align="middle">
						<FlexboxGrid.Item style={{ alignItems: 'center' }} colspan={1}>
							<Dropdown
									renderTitle={() => {
										return <IconButton appearance="subtle" icon={<Icon icon="bars" size="4x"/>} size="md" circle />;
									}}
								>
									<Dropdown.Item>Version: {this.props.version}</Dropdown.Item>
									<Dropdown.Item onSelect={() => window.open('https://github.com/Project-Nexus-Megagames/CANDI-issues/issues')}>Report Issues</Dropdown.Item>
									<Dropdown.Item onSelect={() => window.open('https://www.patreon.com/wcmprojectnexus')}>Support Nexus</Dropdown.Item>
									<Dropdown.Item onSelect={()=> this.handleLogOut()}>Log Out</Dropdown.Item>
								</Dropdown>					
							</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={22}>
							<div>
								<p>Round: {this.props.gamestate.round} </p>	
								{(days > 0) && <p>Time Left: {days} Days, {hours} Hours </p>}
								{(hours > 0 && days <= 0) && <p>Time Left: {hours} Hours, {minutes} Minutes</p>}	
								{(hours <= 0 && minutes > 0 && days <= 0) && <p>Time Left: {minutes} Minutes</p>}	
								{(days + hours + minutes <= 0) && <p>Game Status: {this.props.gamestate.status}</p>}	
							</div>									
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
					</FlexboxGrid>
					</div>
				<Container style={{backgroundColor:'#880015', position: 'relative', textAlign: 'center', scrollbarWidth: 'none', scrollMargin: '0px', overflow: 'auto', }}>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={10}>
									<Panel bordered style={{ height: '31.3vh' }}>
										<Link to='actions'>

												<img src={action} height='auto' alt='Failed to load img' style={{ objectFit: 'contain' }} />             

										</Link>
										<h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>Actions/Feeding</h6>
										<p style={{position: 'absolute', bottom: '10px', left: '15px', color:'white'}}>Creating and editing Actions</p>
									</Panel>
									<Panel bordered style={{ height: '31.3vh' }}></Panel>
									<Panel bordered style={{ height: '31.3vh' }}></Panel>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={14}>
									<Panel bordered style={{ height: '45vh' }}></Panel>
									<FlexboxGrid style={{ height: '49vh' }}>
										<FlexboxGrid.Item  colspan={8}>
											<Panel bordered style={{ height: '49vh' }}></Panel>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item  colspan={8}>
											<Panel bordered style={{ height: '49vh' }}></Panel>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item  colspan={8}>
											<Panel bordered style={{ height: '49vh' }}></Panel>
										</FlexboxGrid.Item>
									</FlexboxGrid>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Container>
			</React.Fragment>
		);
*/