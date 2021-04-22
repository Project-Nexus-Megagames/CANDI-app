import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, Nav, Row, Col, Loader, Navbar, Dropdown, IconButton } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';
import Loading from './loading';

import aang from '../Images/aang.jpg'
import city from '../Images/city.png'
import action from '../Images/action.png'
import { signOut } from '../../redux/entities/auth';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			days: 0,
			hours: 0,
			minutes: 0
		};
	}

	componentDidMount() {
		this.renderTime(this.props.gamestate.endTime);
		setInterval(() => {
			this.renderTime(this.props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
	}

	openAnvil () {
		const win = window.open('https://www.worldanvil.com/w/afterlife3A-a-postmortem-megagame-afterlife-control', '_blank');
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
		if (this.props.loading || !this.props.actionsLoaded || !this.props.gamestateLoaded || !this.props.charactersLoaded) {
			return (<Loading />)
		}
		else if (this.props.login && !this.props.myCharacter) {
			this.props.history.push('/no-character');
			return (<Loader inverse center content="doot..." />)
		}
		else return ( 
			<React.Fragment>
				<Navbar >
				<Navbar.Body>
					<Nav>
					<Dropdown
						renderTitle={() => {
							return <IconButton appearance="subtle" icon={<Icon icon="bars" size="4x"/>} circle />;
						}}
					>
						<Dropdown.Item onSelect={()=> this.handleLogOut()}>Log Out</Dropdown.Item>
					</Dropdown>						
					</Nav>

				</Navbar.Body>			
				<div style={{  }}>
					<p style={{ }}  >Round: {this.props.gamestate.round} </p>	
					{(this.state.days > 0) && <p>Time Left: {days} Days, {hours} Hours </p>}
					{(this.state.hours > 0 && this.state.days <= 0) && <p>Time Left: {hours} Hours, {minutes} Minutes</p>}	
					{(this.state.days + this.state.hours + this.state.minutes <= 0) && <p>Game Status: {this.props.gamestate.status}</p>}	
				</div>

			</Navbar>
				<Container style={{backgroundColor:'white', padding:'15px', width: '660px', position: 'relative', display: 'inline-block', textAlign: 'center'}}>
				<Row style={{display: 'inherit'}}>
				<Col>
				<ImgPanel width={620} height={250} img={city} to='map' title='Map' body=''/>
				</Col>
				<Col>
				<ImgPanel width={620} height={250} img={aang} to='character' title='My Character' body='My Assets and Traits'/>
				</Col>
		</Row>
		<Row>
			<Col>
				<ImgPanel width={300} height={350} img={aang} to='actions' title='Actions' body='Creating and editing Actions'/>
				<ImgPanel width={300} height={350} img={action} to='coffiehouse' title='Feeding' body='Om nom nom'/>
			</Col>
			<Col>
				<ImgPanel width={620} height={250} img={aang} to='others' title={'Other Characters'} body='Character Details & Email Addresses'/>
			</Col>
		</Row>
		{this.props.user.roles.some(el=> el === 'Control') && <React.Fragment>
			<Row>
				<Col>
				<ImgPanel width={620} height={250} img={aang} to='control' title='Control Terminal' body='They Keys to the whole empire'/>	
				</Col>
			</Row>
			</React.Fragment>}
	</Container>
			</React.Fragment>
		);
	}

	handleLogOut = async () => {
		this.props.logOut();
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
  myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>
