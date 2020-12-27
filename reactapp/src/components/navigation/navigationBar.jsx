import React, { Component } from 'react';
import { Navbar, Nav, Icon } from 'rsuite';

class Navigation extends Component {
  state = {
  }

    componentDidMount() {
			this.setState({ active: "home" });
    }

    componentDidUpdate(prevProps) {

    }

    render() {
      return (
				<Navbar >
				<Navbar.Body>
					<Nav onSelect={this.props.onSelect} activeKey={this.props.active}>
						<Nav.Item eventKey="home" to="/gov" icon={<Icon icon="home" />}>Home</Nav.Item>
						<Nav.Item eventKey="character" to="/butts">My Character</Nav.Item>
						<Nav.Item eventKey="actions">Actions</Nav.Item>
						<Nav.Item eventKey="others">Other Characters</Nav.Item>
						<Nav.Item eventKey="control">Control</Nav.Item>
					</Nav>
				</Navbar.Body>
			</Navbar>
      );
		}
		
		handleSelect = (activeKey) => {
			this.setState({ active: activeKey });
		}
}
  
export default (Navigation);