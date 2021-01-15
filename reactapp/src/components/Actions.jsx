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
		 let filtered = [];
		if (this.props.user.roles.some(el => el === "Control")) {
			filtered = this.props.actions;
		}
		else {
			filtered = this.props.actions.filter(el => el.creator._id === this.props.playerCharacter._id);	
		}
		this.setState({ selected: null, filtered });
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.actions !== prevProps.actions) {
			let filtered = [];
			if (this.props.user.roles.some(el => el === "Control")) {
				filtered = this.props.actions;
			}
			else {
				filtered = this.props.actions.filter(el => el.creator._id === this.props.playerCharacter._id);	
			}
			this.setState({ filtered });
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
		action.intent.toLowerCase().includes(fil.toLowerCase()) || 
		action.creator.characterName.toLowerCase().includes(fil.toLowerCase())
		);
		this.setState({ filtered });
	}

	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black", }}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.filter(value)} placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{height: 'calc(90vh - 130px)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
						<ActionList user={this.props.user} playerCharacter={this.props.playerCharacter} actions={this.state.filtered} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<Button appearance='primary' disabled={this.isDisabled()} block onClick={() => this.showNew()}>New Action</Button>
					</Panel>	
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<img src='https://i.kym-cdn.com/entries/icons/original/000/011/121/SKULL_TRUMPET_0-1_screenshot.png' alt='Boo!' ></img>						
					</Panel>				
				</PanelGroup>
			</Sidebar>
			{this.state.selected && <SelectedAction user={this.props.user} handleSelect={this.handleSelect} assets={[...this.props.playerCharacter.assets, ...this.props.playerCharacter.traits, ...this.props.playerCharacter.lentAssets, this.props.playerCharacter.wealth]} action={this.state.selected}/>}	
			<NewAction
				show={this.state.showNew}
				assets={this.filteredAssets()}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				gamestate={this.props.gamestate}
				playerCharacter={this.props.playerCharacter}
			/>
		</Container>
		 );
	}

	filteredAssets = () => {
		let assets = [...this.props.playerCharacter.assets, ...this.props.playerCharacter.traits, ...this.props.playerCharacter.lentAssets];
		assets = assets.filter(el => el.status.used === false);
		assets.push(this.props.playerCharacter.wealth)

		return assets;
	}

	isDisabled () {
		if (this.props.gamestate.status === 'Active') return false;
		else return true;
	}
}

 
export default Actions;