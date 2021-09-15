import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, PanelGroup, Button, Loader, Content, ButtonGroup } from 'rsuite';
import { getMyAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';

import ActionList from './ActionList';
import NewAction from './NewAction';
import NewFeed from './NewFeed';
import SelectedAction from './SelectedAction';
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
			<Sidebar className="side-bar">
				<PanelGroup>					
					<Panel style={{ height: 'calc(8vh)', backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.props.setFilter(value)} value={this.props.filter} placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{height: 'calc(78vh)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
						<ActionList selected={this.state.selected} handleSelect={this.handleSelect}/>
					</Panel>
					<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
						<ButtonGroup>
							<Button appearance='primary' disabled={!this.props.gamestate.status === 'Active'} onClick={() => this.setState({showNew: true})}>New Action</Button>
						</ButtonGroup>
					</Panel>			
				</PanelGroup>
			</Sidebar>
			<Content>
				{this.state.selected && this.state.selected.type === 'Action' && <SelectedAction user={this.props.user} handleSelect={this.handleSelect} assets={this.filteredAssets()} action={this.state.selected}/>}	
				{this.state.selected && this.state.selected.type === 'Project' && <SelectedProject characters={this.props.characters} user={this.props.user} handleSelect={this.handleSelect} project={this.state.selected}/>}	
			</Content>

			<NewAction
				show={this.state.showNew}
				assets={this.filteredAssets()}
				closeNew={() => this.setState({showNew: false})}
				gamestate={this.props.gamestate}
				myCharacter={this.props.myCharacter}
			/>

		</Container>
		</React.Fragment>
		);
	}

	filteredAssets = () => {
		let assets = [ ...this.props.myCharacter.lentAssets];
		assets = assets.filter(el => el.status.used === false && (el.type === 'Asset' || el.type === 'Trait' || el.type === 'Wealth' || el.type === 'Power' || el.type === 'Bond'));
		return assets;
	}
}

const mapStateToProps = (state) => ({
	actions: state.actions.list,
	user: state.auth.user,
	control: state.auth.control,
	filter: state.actions.filter,
	login: state.auth.login,
	gamestate: state.gamestate,
	myCharacter: state.auth.user ? getMyCharacter(state): undefined,
	myAssets: state.auth.user ? getMyAssets(state): undefined,

});

const mapDispatchToProps = (dispatch) => ({
	setFilter: (data) => dispatch(setFilter(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
