import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Icon, IconButton, FlexboxGrid } from 'rsuite';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
import socket from '../../socket';
class Navigation extends Component {
  state = {
		days: 0,
		hours: 0,
		minutes: 0
	}
	
	componentDidMount() {
		this.renderTime(this.props.gamestate.endTime);
		setInterval(() => {
			this.renderTime(this.props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
	}

    render() {
			let {days, hours, minutes} = this.state;
      return (
				<div style={{ backgroundColor: '#3287a8', height: '6vh' }}>
					<FlexboxGrid justify="start" align="middle">
						<FlexboxGrid.Item style={{ alignItems: 'center' }} colspan={2}>
							<div>
								<IconButton icon={<Icon icon="arrow-circle-left"/>} size="sm" >Back</IconButton>	
							</div>							
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={20}>
							<div>
								<p>Round: {this.props.gamestate.round} </p>	
								{(this.state.days > 0) && <p>Time Left: {days} Days, {hours} Hours </p>}
								{(this.state.hours > 0 && this.state.days <= 0) && <p>Time Left: {hours} Hours, {minutes} Minutes</p>}	
								{(this.state.days + this.state.hours + this.state.minutes <= 0) && <p>Game Status: {this.props.gamestate.status}</p>}	
							</div>									
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
					</FlexboxGrid>

					
			
				</div>
      );
		}
		/**
		 * 				<Navbar style={{ height: '6vh' }} >
				<Navbar.Body>
					<Nav onSelect={this.props.onSelect} activeKey={this.props.active}>
					<Nav.Item eventKey="home" to="/home" componentClass={NavLink} icon={<Icon icon="arrow-circle-left" />}>Back</Nav.Item>
				</Nav>		
				</Navbar.Body>			


			</Navbar>
		 */

		handleLogOut = async () => {
			this.props.logOut();
			socket.disconnect();
			//localStorage.removeItem('token');
			this.props.history.push('/login')
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
	gamestate: state.gamestate,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

