import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, PanelGroup, Button } from 'rsuite';
import ActionList from './ActionList';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';
class Actions extends Component {
	state = { 
		selected: null,
		showNew: false
	 }

	 componentDidMount() {
		this.setState({ selected: null });
	}

	showNew = () => { 
		this.setState({showNew: true}) 
	};

	closeNew = () => { 
		this.setState({showNew: false}) 
	};

	handleSelect = (fuuuck) => {
		this.setState({ selected: fuuuck })
	}

	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black"}}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{borderRadius: '0px'}}>	
						<ActionList actions={this.props.actions} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<Button appearance='primary' block onClick={() => this.showNew()}>New Action</Button>
					</Panel>						
				</PanelGroup>
			</Sidebar>
			{this.state.selected && <SelectedAction handleSelect={this.handleSelect} action={this.state.selected}/>}	
			<NewAction
				show={this.state.showNew}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				// player={this.props.player????}
			/>
		</Container>
		 );
	}
}

 
export default Actions;