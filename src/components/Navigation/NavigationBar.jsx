import React, { useEffect } from 'react';
import { Icon, IconButton, FlexboxGrid } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
// import socket from '../../socket';

const Navigation = props => {
	const [days, setDays] = React.useState(0);
	const [minutes, setMinutes] = React.useState(0);
	const [hours, setHours] = React.useState(0);

	const history = useHistory();

	useEffect(() => {
		renderTime(props.gamestate.endTime);
		setInterval(() => {
			renderTime(props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
	}, [props.gamestate.endTime]);
	
	const renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance =  countDownDate - now;
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 *60 * 24)) / (1000 * 60 *60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		setDays(days);
		setHours(hours);
		setMinutes(minutes);
	}

  return (
	<div style={{ height: '50px', backgroundColor: '#746D75', width: "100%", fontSize: '0.966em', borderBottom: '3px solid', borderRadius: 0, borderColor: '#d4af37' }}>
		<FlexboxGrid justify="start" align="middle">
			<FlexboxGrid.Item onClick={()=> history.push('/home')} justify="start" colspan={2}> 
			<IconButton onClick={() => history.push('/home')} icon={<Icon icon="arrow-left" />} appearance="subtle" color='cyan'  style={{ }}></IconButton>	
			</FlexboxGrid.Item>
			<FlexboxGrid.Item colspan={20}>
				<div>
					<p>Round: {props.gamestate.round} </p>	
					{(days > 0) && <p>Time Left: {days} Days, {hours} Hours </p>}
					{(hours > 0 && days <= 0) && <p>Time Left: {hours} Hours, {minutes} Minutes</p>}	
					{(days + hours + minutes <= 0) && <p>Game Status: {props.gamestate.status}</p>}	
				</div>									
			</FlexboxGrid.Item>
			<FlexboxGrid.Item colspan={2}>
			</FlexboxGrid.Item>
		</FlexboxGrid>
		</div>
	);
	/**
	 * 				<Navbar style={{ height: '6vh' }} >
			<Navbar.Body>
				<Nav onSelect={this.props.onSelect} activeKey={this.props.active}>
				<Nav.Item eventKey="home" to="/home" componentClass={NavLink} icon={<Icon icon="arrow-circle-left" />}>Back</Nav.Item>
			</Nav>		
			</Navbar.Body>			
		</Navbar>
	 */
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

