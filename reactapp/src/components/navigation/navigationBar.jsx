import React, { Component } from 'react';
import { Navbar, Nav, Icon, } from 'rsuite';
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
						<Nav.Item eventKey="home" to="/gov" icon={<Icon icon="home" />}>Home</Nav.Item>
						<Nav.Item eventKey="character" >My Character</Nav.Item>
						{/*<Nav.Item eventKey="memory" >Memories</Nav.Item>*/}
						<Nav.Item eventKey="actions">Actions</Nav.Item>
						<Nav.Item eventKey="others">Other Characters</Nav.Item>
						<Nav.Item eventKey="controllers">Control Team</Nav.Item>
						{this.props.user.roles.some(el=> el === 'Control') && <Nav.Item eventKey="control" style={{backgroundColor: "#61342e"}}>Control Terminal</Nav.Item>}
					</Nav>			

				</Navbar.Body>
				<div style={{ position: 'fixed', top: 5, right: 25  }}>
					<p style={{ }}  >Round: {this.props.gamestate.round} </p>	
					<p style={{ }}  >Game Status: {this.props.gamestate.status} </p>						
				</div>

			</Navbar>
      );
		}
		
		handleSelect = (activeKey) => {
			this.setState({ active: activeKey });
		}
}
  
export default (Navigation);