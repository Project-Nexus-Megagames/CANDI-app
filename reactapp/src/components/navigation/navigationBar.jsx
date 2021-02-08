import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Icon, Whisper, Tooltip} from 'rsuite';
import { connect } from "react-redux";
import { signOut } from '../../redux/entities/auth';
class Navigation extends Component {
  state = {
		gamestate: {}
	}
	
	componentDidMount() {
		this.setState({ gamestate: this.props.gamestate });
	}

    render() {
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
					{this.renderTime(this.props.gamestate.endTime)}					
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

			console.log(hours);
			if (days + hours > 0) {
				return (<p style={{ }}  >Time Left: {days} Days, {hours} Hours </p>)				
			}
			else if (minutes > 0) {
				return (<p style={{ }}  >Time Left: {minutes} Minutes </p>)	
			}
			else {
				return (<p>Game Status: Resolution</p>)	
			}

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

