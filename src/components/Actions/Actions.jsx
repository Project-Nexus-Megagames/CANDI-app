import React, { useEffect } from 'react';
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
const Actions = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showNew, setShowNew] = React.useState(false);
	const [showFeed, setShowFeed] = React.useState(false);

	useEffect(() => {
		if (selected) {
			const newSelected = props.actions.find(el => el._id === selected._id);
			setSelected(newSelected);			
		}
	}, [props.actions]);

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
	}

	// const filter = (fil) => {
	// 	const filtered = props.actions.filter(action => action.description.toLowerCase().includes(fil.toLowerCase()) || 
	// 	action.intent.toLowerCase().includes(fil.toLowerCase()) || 
	// 	action.creator.characterName.toLowerCase().includes(fil.toLowerCase())
	// 	);
	// 	setState({ filtered });
	// }

	// filteredAssets = () => {
	// 	let assets = [ ...this.props.myCharacter.lentAssets];
	// 	assets = assets.filter(el => el.status.used === false && (el.type === 'Asset' || el.type === 'Trait' || el.type === 'Wealth' || el.type === 'Power' || el.type === 'Bond'));
	// 	return assets;
	// }

	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	};
	return ( 
		<React.Fragment>
		<NavigationBar/>
		<Container style={{ height: '93vh'}}>
		<Sidebar className="side-bar">
			<PanelGroup>					
				<Panel style={{ height: 'calc(8vh)', backgroundColor: "#000101"}}>
					<Input onChange={(value)=> props.setFilter(value)} value={props.filter} placeholder="Search"></Input>
				</Panel>
				<Panel bodyFill style={{height: 'calc(78vh)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
					<ActionList selected={selected} handleSelect={handleSelect}/>
				</Panel>
				<Panel style={{ paddingTop: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '0px', backgroundColor: "#000101"}}>
					<ButtonGroup>
						<Button appearance='primary' disabled={!props.gamestate.status === 'Active'} onClick={() => setShowNew(true)}>New Action</Button>
					</ButtonGroup>
				</Panel>			
			</PanelGroup>
		</Sidebar>
		<Content>
			{selected && selected.type === 'Action' && <SelectedAction user={props.user} handleSelect={handleSelect} selected={selected}/>}	
		</Content>
		<NewAction
			show={showNew}
			closeNew={() => setShowNew(false)}
			gamestate={props.gamestate}
			myCharacter={props.myCharacter}
		/>
	</Container>
	</React.Fragment>
	);
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
