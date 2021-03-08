import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Icon, Whisper, Tooltip} from 'rsuite';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
class Navigation extends Component {
  state = {
		days: 0,
		hours: 0,
		minutes: 0
	}
	
	componentDidMount() {
		this.renderTime(this.props.gamestate.endTime);
		const interval = setInterval(() => {
			this.renderTime(this.props.gamestate.endTime);
        //clearInterval(interval);
    }, 60000);
	}

    render() {
			let {days, hours, minutes} = this.state;
      return (
				<Navbar >
				<Navbar.Body>
					<Nav onSelect={this.props.onSelect} activeKey={this.props.active}>
						<Whisper placement="bottom" trigger="hover" speaker={tooltip}><Nav.Item eventKey="login" icon={<Icon icon="sign-out"/>} onClick={()=> this.props.logOut()}></Nav.Item></Whisper> 
						<Nav.Item eventKey="home" to="/home" componentClass={NavLink} icon={<Icon icon="home" />}>Home</Nav.Item>
						<Nav.Item eventKey="character" to="/character" componentClass={NavLink} >My Character</Nav.Item>
						<Nav.Item eventKey="actions" to="/actions" componentClass={NavLink} >Actions</Nav.Item>
						<Nav.Item eventKey="others" to="/others" componentClass={NavLink} >Other Characters</Nav.Item>
						<Nav.Item eventKey="controllers" to="/controllers" componentClass={NavLink} >Control Team</Nav.Item>
						{this.props.user.roles.some(el=> el === 'Control') && <Nav.Item eventKey="control" to="/control" componentClass={NavLink} style={{backgroundColor: "#61342e"}}>Control Terminal</Nav.Item>}
						{/*this.props.user.roles.some(el=> el === 'Control') && <Nav.Item eventKey="reg" to="/reg" componentClass={NavLink} style={{backgroundColor: "#61342e"}}>User Registration</Nav.Item>*/}
					</Nav>			

				</Navbar.Body>			
				<div style={{ position: 'fixed', top: 5, right: 25  }}>
					<p style={{ }}  >Round: {this.props.gamestate.round} </p>	
					{(this.state.days > 0) && <p>Time Left: {days} Days, {hours} Hours </p>}
					{(this.state.hours > 0 && this.state.days <= 0) && <p>Time Left: {hours} Hours, {minutes} Minutes</p>}	
					{(this.state.days + this.state.hours + this.state.minutes <= 0) && <p>Game Status: {this.props.gamestate.status}</p>}	
				</div>

			</Navbar>
      );
		}

		handleLogOut = async () => {
			localStorage.removeItem('token');
			//props.history.push('/login')
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

const tooltip = (
  <Tooltip>
    Log-Out
  </Tooltip>
);

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

