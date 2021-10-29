import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, PanelGroup, Button, Loader, Icon, InputGroup, Tooltip, Whisper } from 'rsuite';
import { getMyAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { setFilter } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';

import ActionList from './ActionList';
import MobileActions from './Mobile/MobileActions';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';
import SelectedProject from './SelectedProject';
const Actions = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showNew, setShowNew] = React.useState(false);

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

	const tooltip = () => {
		return(
		<Tooltip>
		  Log-Out
		</Tooltip>			
		)
	}

	  

	if (!props.login) {
		props.history.push('/');
		return (<Loader inverse center content="doot..." />)
	};
		if (window.innerWidth < 768) { 
		return (<MobileActions />)
	}
	return ( 
		<React.Fragment>
		<NavigationBar/>
		<Container style={{ height: 'calc(100vh - 50px)',}}>
		<Sidebar className="side-bar">
			<PanelGroup> 					
				<div style={{ height: '40px', borderRadius: '0px', backgroundColor: "#000101"}}>
					<InputGroup>
						<Input size="sm" style={{ height: '39px' }} onChange={(value)=> props.setFilter(value)} value={props.filter} placeholder="Search"></Input>
							<Button appearance='primary' color='green' disabled={props.gamestate.status !== 'Active' || props.myCharacter.effort < 1} onClick={() => setShowNew(true)}>
							<Icon  icon="plus" />	
							</Button>							
					</InputGroup>
				</div>
				<div bodyFill style={{height: 'calc(100vh - 80px)', scrollbarWidth: 'none', overflow: 'auto', borderRadius: '0px', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>	
					<ActionList selected={selected} handleSelect={handleSelect}/>
				</div>	ActionList		
			</PanelGroup>
		</Sidebar>

		{!selected && <h4 style={{ width: '100%' }}>No Action Selected</h4>}
		{selected && selected.type === 'Action' && <SelectedAction user={props.user} handleSelect={handleSelect} selected={selected}/>}	


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
