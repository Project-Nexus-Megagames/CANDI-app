import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, PanelGroup, Button } from 'rsuite';
import ActionList from './ActionList';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';
class Actions extends Component {
	state = { 
		selected: null,
		showNew: false,
		filtered: []
	 }

	 componentDidMount() {
		this.setState({ selected: null, filtered: this.props.actions });
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.actions !== prevProps.actions) {
			this.setState({ filtered: this.props.actions });
		}
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

	filter = (fil) => {
		const filtered = this.props.actions.filter(action => action.description.toLowerCase().includes(fil.toLowerCase()) || 
		action.intent.toLowerCase().includes(fil.toLowerCase()));
		this.setState({ filtered });
	}

	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black"}}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.filter(value)} placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{borderRadius: '0px'}}>	
						<ActionList actions={this.state.filtered} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<Button appearance='primary' disabled={this.isDisabled()} block onClick={() => this.showNew()}>New Action</Button>
					</Panel>						
				</PanelGroup>
			</Sidebar>
			{this.state.selected && <SelectedAction handleSelect={this.handleSelect} assets={[...this.props.playerCharacter.assets, ...this.props.playerCharacter.traits]} action={this.state.selected}/>}	
			<NewAction
				show={this.state.showNew}
				assets={[...this.props.playerCharacter.assets, ...this.props.playerCharacter.traits, ...this.props.playerCharacter.lentAssets]}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				gamestate={this.props.gamestate}
				playerCharacter={this.props.playerCharacter}
			/>
		</Container>
		 );
	}

	isDisabled () {
		if (this.props.gamestate.status === 'Active') return false;
		else return true;
	}
}

 
export default Actions;