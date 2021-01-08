import axios from 'axios';
import React, { Component } from 'react';
import { Navbar, Nav, Icon, Panel } from 'rsuite';
import { gameServer } from '../../config';
class Navigation extends Component {
  state = {
		gamestate: {}
  }

    componentDidMount= async () => {
			const {data} = await axios.get(`${gameServer}api/gamestate/`);
			this.setState({ gamestate: data });
    }

    componentDidUpdate(prevProps) {

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
						<Nav.Item eventKey="control" style={{backgroundColor: "#61342e"}}>Control Terminal</Nav.Item>
					</Nav>			

				</Navbar.Body>
				<div style={{ position: 'fixed', top: 5, right: 25  }}>
					<p style={{ }}  >Round: {this.state.gamestate.round} </p>	
					<p style={{ }}  >Game Status: {this.state.gamestate.status} </p>						
				</div>

			</Navbar>
      );
		}
		
		handleSelect = (activeKey) => {
			this.setState({ active: activeKey });
		}
}
  
export default (Navigation);