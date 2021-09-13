import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, Row, Col, Loader, Dropdown, IconButton, FlexboxGrid, Panel } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';
import Loading from './loading';

// import aang from '../Images/aang.jpg'
import city from '../Images/city.png'
import action from '../Images/action.jpg'
import feed from '../Images/feed.png'
import control2 from '../Images/Control.jpg'
import other from '../Images/othercharacters.jpg'
import control from '../Images/balls.png'
import nexus from '../Images/nexus.jpg'

// Duck
import actionDuck from '../Duck/action.jpg'
import control2Duck from '../Duck/Control.jpg'
import feedDuck from '../Duck/feed.jpg'
import otherDuck from '../Duck/othercharacters.jpg'
import nexusDuck from '../Duck/nexus.jpg'

import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';
import { Link } from 'react-router-dom';
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
	else if (window.innerHeight < 900) {
		return (<MobileHomePage />)
	}
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
			<Container style={{backgroundColor:'#880015', padding:'15px', width: '670px', position: 'relative', display: 'inline-block', textAlign: 'center', height: '93vh', scrollbarWidth: 'none', scrollMargin: '0px', overflow: 'auto', }}>
			<Row style={{display: 'inherit'}}>
			<Col>
			<ImgPanel width={620} height={250} img={!props.duck ? city : 'https://isteam.wsimg.com/ip/f6ab3626-8e65-11e5-80e5-f04da206c13a/ols/278_original/:/rs=w:600,h:600'} to='map' title='Map'  body='View Dusk City'/>
			</Col>
			<Col>
				<ImgPanel width={300} height={350} img={!props.duck ? action : actionDuck} to='actions' title='Actions/Feeding' body='Creating and editing Actions'/>
				<ImgPanel width={300} height={350} img={!props.duck ? feed : feedDuck} to='character' title='My Character' body='My Assets and Traits'/>
			</Col>
			<Col>
				<ImgPanel width={300} height={350} img={!props.duck ? control2 : control2Duck} to='controllers' title='Control' body='Who is responsible?'/>
				<Panel style={{width: 300, height: 350, position: 'relative', float:'left', display:'inline-block', margin: '10px', cursor: 'pointer'}} onClick={()=> openNexus()} shaded bodyFill>
           <div className="container">
               <img src={!props.duck ? nexus : nexusDuck} className='image' height='auto' alt='Failed to load img' />             
           </div>
           <h6 style={{position: 'absolute', bottom: '25px', left: '15px', color:'white'}}>CANDI Version {props.version}</h6>
       	</Panel>
			</Col>
	</Row>
	<Row style={{display: 'inherit'}}>
		<Col>
			<ImgPanel width={620} height={250} img={!props.duck ? other : otherDuck} to='others' title={'Other Characters'} body='Character Details & Email Addresses'/>
		</Col>
	</Row>
	{props.user.roles.some(el=> el === 'Control') && <React.Fragment>
		<Row>
			<Col>
			<ImgPanel className='image' width={620} height={250} img={control} to='control' title='Control Terminal' body='They Keys to the whole empire'/>	
			</Col>
		</Row>
			</React.Fragment>}
	</Container>
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