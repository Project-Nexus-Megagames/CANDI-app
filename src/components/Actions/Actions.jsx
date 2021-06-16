import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, PanelGroup, Button, Loader, Content, ButtonGroup } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';

import ActionList from './ActionList';
import NewAction from './NewAction';
import NewFeed from './NewFeed';
import SelectedAction from './SelectedAction';
import SelectedFeed from './SelectedFeed';
import SelectedProject from './SelectedProject';
class Actions extends Component {
	state = { 
		selected: null,
		showNew: false,
		showFeed: false,
	}

	componentDidMount() {
		this.setState({ selected: null });
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.actions !== prevProps.actions) {
			if (this.state.selected) {
				const selected = this.props.actions.find(el => el._id === this.state.selected._id)
				this.setState({ selected })				
			}
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
		if (!this.props.login) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		return ( 
			<React.Fragment>
			<NavigationBar/>
			<Container style={{ height: '93vh'}}>
			<Sidebar style={{backgroundColor: "black", }}>
				<PanelGroup>					
					<Panel style={{ height: 'calc(8vh)', backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.props.setFilter(value)} value={this.props.filter} placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{height: 'calc(78vh)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
						<ActionList selected={this.state.selected} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<ButtonGroup>
							<Button appearance='primary' disabled={this.isDisabled()} onClick={() => this.showNew()}>New Action</Button>
							<Button color='red' appearance='primary' disabled={this.props.myCharacter.feed || this.isDisabled()} onClick={() => this.setState({showFeed: true}) }>New Feed</Button>
						</ButtonGroup>
					</Panel>			
				</PanelGroup>
			</Sidebar>
			<Content>
				{this.state.selected && this.state.selected.type === 'Action' && <SelectedAction user={this.props.user} handleSelect={this.handleSelect} assets={this.filteredAssets()} action={this.state.selected}/>}	
				{this.state.selected && this.state.selected.type === 'Project' && <SelectedProject characters={this.props.characters} user={this.props.user} handleSelect={this.handleSelect} project={this.state.selected}/>}	
				{this.state.selected && this.state.selected.type === 'Feed' && <SelectedFeed user={this.props.user} handleSelect={this.handleSelect} assets={this.filtereFeeddAssets()} action={this.state.selected}/>}	
			</Content>
			<NewAction
				show={this.state.showNew}
				assets={this.filteredAssets()}
				showNew={this.showNew} 
				closeNew={this.closeNew}
				gamestate={this.props.gamestate}
				myCharacter={this.props.myCharacter}
			/>
			<NewFeed 
				show={this.state.showFeed}
				assets={this.filtereFeeddAssets()}
				closeFeed={() => this.setState({showFeed: false})}
			/>
		</Container>
		</React.Fragment>
		);
	}

	filteredAssets = () => {
		let assets = [...this.props.myCharacter.assets, ...this.props.myCharacter.lentAssets];
		assets = assets.filter(el => el.status.used === false && (el.type === 'Asset' || el.type === 'Trait' || el.type === 'Wealth' || el.type === 'Power' || el.type === 'Bond'));
		return assets;
	}

	filtereFeeddAssets = () => {
		let assets = [...this.props.myCharacter.assets, ...this.props.myCharacter.lentAssets];
		assets = assets.filter(el => el.status.used === false && (el.type === 'Bond' || el.type === 'Territory'));
		return assets;
	}

	isDisabled () {
		if (this.props.gamestate.status === 'Active') return false;
		else return true;
	}
}

const mapStateToProps = (state) => ({
	actions: state.actions.list,
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
