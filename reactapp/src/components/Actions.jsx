import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, PanelGroup, Button, Loader } from 'rsuite';
import { getMyCharacter } from '../redux/entities/characters';
import { setFilter } from '../redux/entities/playerActions';
import ActionList from './ActionList';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';
import SelectedProject from './SelectedProject';
class Actions extends Component {
	state = { 
		selected: null,
		showNew: false,
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

	filter = (fil) => {
		const filtered = this.props.actions.filter(action => action.description.toLowerCase().includes(fil.toLowerCase()) || 
		action.intent.toLowerCase().includes(fil.toLowerCase()) || 
		action.creator.characterName.toLowerCase().includes(fil.toLowerCase())
		);
		this.setState({ filtered });
	}

	render() { 
		if (!this.props.login) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black", }}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.props.setFilter(value)} value={this.props.filter} placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{height: 'calc(90vh - 130px)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
						<ActionList selected={this.state.selected} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<Button appearance='primary' disabled={this.isDisabled()} block onClick={() => this.showNew()}>New Action</Button>
					</Panel>	
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<img src='https://i.kym-cdn.com/entries/icons/original/000/011/121/SKULL_TRUMPET_0-1_screenshot.png' alt='Boo!' ></img>						
					</Panel>				
				</PanelGroup>
			</Sidebar>
			{this.state.selected && this.state.selected.model === 'Action' && <SelectedAction user={this.props.user} handleSelect={this.handleSelect} assets={[...this.props.myCharacter.assets, ...this.props.myCharacter.traits, ...this.props.myCharacter.lentAssets, this.props.myCharacter.wealth]} action={this.state.selected}/>}	
			{this.state.selected && this.state.selected.model === 'Project' && <SelectedProject characters={this.props.characters} user={this.props.user} handleSelect={this.handleSelect} project={this.state.selected}/>}	
			<NewAction
				show={this.state.showNew}
				assets={this.filteredAssets()}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				gamestate={this.props.gamestate}
				myCharacter={this.props.myCharacter}
			/>
		</Container>
		 );
	}

	filteredAssets = () => {
		let assets = [...this.props.myCharacter.assets, ...this.props.myCharacter.traits, ...this.props.myCharacter.lentAssets];
		assets = assets.filter(el => el.status.used === false);
		assets.push(this.props.myCharacter.wealth)

		return assets;
	}

	isDisabled () {
		if (this.props.gamestate.status === 'Active') return false;
		else return true;
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	control: state.auth.control,
	filter: state.actions.filter,
	login: state.auth.login,
	gamestate: state.gamestate,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	setFilter: (data) => dispatch(setFilter(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
 