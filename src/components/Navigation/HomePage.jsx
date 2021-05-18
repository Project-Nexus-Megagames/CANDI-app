import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, Row, Col, Loader, Dropdown, IconButton, FlexboxGrid } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';
import Loading from './loading';

// import aang from '../Images/aang.jpg'
import city from '../Images/city.png'
import action from '../Images/action.jpg'
import feed from '../Images/feed.png'
import mycharacter from '../Images/MyCharacter.jpg'
import other from '../Images/othercharacters.jpg'
import control from '../Images/balls.png'
import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			days: 0,
			hours: 0,
			minutes: 0,
			loaded: false
		};
	}

	componentDidMount() {
		this.renderTime(this.props.gamestate.endTime);
		if(!this.props.loading && this.props.actionsLoaded && this.props.gamestateLoaded && this.props.charactersLoaded && this.props.locationsLoaded && this.props.assetsLoaded) {
			this.setState({ loaded: true });
		}			
		setInterval(() => {
			this.renderTime(this.props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
	}

	componentDidUpdate = (prevProps) => {
		if (this.props !== prevProps) {
			if(!this.props.loading && this.props.actionsLoaded && this.props.gamestateLoaded && this.props.charactersLoaded && this.props.locationsLoaded && this.props.assetsLoaded) {
				setTimeout(() => this.setState({ loaded: true }), 1000)	
			}			
		}
	}

	openAnvil () {
		const win = window.open('https://www.worldanvil.com/w/dusk-city-by-night-afterlife-control', '_blank');
		win.focus();
	}

	openNexus () {
		const win = window.open('https://www.patreon.com/wcmprojectnexus', '_blank');
		win.focus();
	}
	

	render() { 
		let {days, hours, minutes} = this.state;
		if (!this.props.login && !this.props.loading) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		if (!this.state.loaded) {
			return (<Loading />)
		}
		else if (this.props.login && !this.props.myCharacter) {
			this.props.history.push('/no-character');
			return (<Loader inverse center content="doot..." />)
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
									<Dropdown.Item>Version: 1.01</Dropdown.Item>
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
								{(days + hours + minutes <= 0) && <p>Game Status: {this.props.gamestate.status}</p>}	
							</div>									
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
					</FlexboxGrid>
					</div>
				<Container style={{backgroundColor:'#880015', padding:'15px', width: '670px', position: 'relative', display: 'inline-block', textAlign: 'center', height: '93vh', scrollbarWidth: 'none', scrollMargin: '0px', overflow: 'auto', }}>
				<Row style={{display: 'inherit'}}>
				<Col>
				<ImgPanel width={620} height={250} img={city} to='map' title='Map'  body='View Dusk City'/>
				</Col>
				<Col>
					<ImgPanel disabled width={300} height={350} img={action} to='actions' title='Actions/Feeding' body='Creating and editing Actions'/>
					<ImgPanel width={300} height={350} img={feed} to='character' title='My Character' body='My Assets and Traits'/>
				</Col>
		</Row>
		<Row style={{display: 'inherit'}}>
			<Col>
				<ImgPanel width={620} height={250} img={other} to='others' title={'Other Characters'} body='Character Details & Email Addresses'/>
			</Col>
		</Row>
		{this.props.user.roles.some(el=> el === 'Control') && <React.Fragment>
			<Row>
				<Col>
				<ImgPanel width={620} height={250} img={control} to='control' title='Control Terminal' body='They Keys to the whole empire'/>	
				</Col>
			</Row>
			</React.Fragment>}
	</Container>
			</React.Fragment>
		);
	}

	handleLogOut = async () => {
		this.props.logOut();
		socket.emit('logout');
		this.props.history.push('/login');
	}
	
	renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance =  countDownDate - now;

		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 *60 * 24)) / (1000 * 60 *60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		this.setState({ days, hours, minutes })
	}

	handleSelect = (activeKey) => {
		this.setState({ active: activeKey });
	}
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
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>
