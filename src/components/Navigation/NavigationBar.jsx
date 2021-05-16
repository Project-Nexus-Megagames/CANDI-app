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
		<FlexboxGrid justify="start" style={{ backgroundColor: '#746D75', height: '6vh' }} align="middle">
			<FlexboxGrid.Item justify="start" colspan={2}>
					<IconButton style={{ height: '100%'}} icon={<Icon icon="arrow-circle-left"/>} onClick={()=> history.push('/home')} appearance="subtle" size="lg" >Back</IconButton>			
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

