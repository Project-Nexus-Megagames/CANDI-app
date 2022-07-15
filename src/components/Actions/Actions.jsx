import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, PanelGroup, Button, Loader, Icon, InputGroup, Tooltip, Whisper } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import {
	filteredActions,
	getCurrentExplores,
	getMyActions,
	setFilter
} from '../../redux/entities/playerActions';
import { useSelector } from 'react-redux';
import { DocPass } from '@rsuite/icons';

import NavigationBar from '../Navigation/NavigationBar';

import ActionList from './ActionList';
import MobileActions from './Mobile/MobileActions';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';

import _ from 'lodash';

const Actions = (props) => {
	const [selected, setSelected] = useState(null);
	const [showNew, setShowNew] = useState(false);
	const gameConfig = useSelector((state) => state.gameConfig);
	const myCharacter = useSelector(getMyCharacter);

	useEffect(() => {
		if (selected) {
			const newSelected = props.actions.find((el) => el._id === selected._id);
			setSelected(newSelected);
		}
	}, [props.actions, selected]);

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
	};

	const getIcon = (type) => {
		switch(type){
			default: 
				return(<Icon icon="plus" />)
		}
	};

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	if (window.innerWidth < 768) {
		return <MobileActions />;
	}

	const myEfforts = myCharacter.effort;
	const actionTypes = [];

	for (const actionType of gameConfig.actionTypes)
	actionTypes.push(actionType.type);

	const showExplore = actionTypes.some((el) => el === 'Explore') === true;
	const showFeed = actionTypes.some((el) => el === 'Feed') === true;
	const showAgenda = actionTypes.some((el) => el === 'Agenda') === true;

	//const exploreEffort = _.find(myEfforts, { type: 'Explore' })?.amount;
	const normalEffort = _.find(myEfforts, { type: 'Normal' })?.amount;
	// const feedEffort = _.find(myEfforts, { type: 'Feed' })?.amount;
	//const agendaEffort = _.find(myEfforts, { type: 'Agenda' })?.amount;

	return (
		<React.Fragment>
			<NavigationBar />
			<Container style={{ height: 'calc(100vh - 50px)' }}>
				<Sidebar >
					<PanelGroup>
						<div
							style={{
								height: '40px',
								borderRadius: '0px',
								backgroundColor: '#000101'
							}}
						>
							<InputGroup>
								<Input
									size="lg"
									style={{ height: '42px' }}
									onChange={(value) => props.setFilter(value)}
									value={props.filter}
									placeholder="Search"
								></Input>

								<Whisper
									placement="top"
									trigger="hover"
									speaker={
										<Tooltip>
											<b>
												{`Create New Action`}
											</b>
										</Tooltip>
									}
								>
									<Button
										style={{ color: 'black', borderRadius: '0px' }}
										color="green"
										onClick={() => setShowNew('actionType')}
									>
										<Icon icon="plus" />
									</Button>
								</Whisper>

							</InputGroup>
						</div>
						<div
							style={{
								height: 'calc(100vh - 80px)',
								scrollbarWidth: 'none',
								overflow: 'auto',
								borderRadius: '0px',
								borderRight: '1px solid rgba(255, 255, 255, 0.12)'
							}}
						>
							<ActionList actions={props.control ? props.filteredActions : props.myActions} actionTypes={actionTypes} selected={selected} handleSelect={handleSelect} />
						</div>{' '}
						ActionList
					</PanelGroup>
				</Sidebar>

				{!selected && <h4 style={{ width: '100%' }}>No Action Selected</h4>}
				{selected && (
					<SelectedAction
						user={props.user}
						handleSelect={handleSelect}
						selected={selected}
					/>
				)}

				<NewAction
					show={showNew}
					closeNew={() => setShowNew(false)}
					gamestate={props.gamestate}
					myCharacter={myCharacter}
					gameConfig={gameConfig}
				/>
			</Container>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	actions: state.actions.list,
	explore: state.auth.user ? getCurrentExplores(state) : 'undefined',
	user: state.auth.user,
	control: state.auth.control,
	filter: state.actions.filter,
	login: state.auth.login,
	gamestate: state.gamestate,
	myActions: getMyActions(state),
	filteredActions: filteredActions(state)
});

const mapDispatchToProps = (dispatch) => ({
	setFilter: (data) => dispatch(setFilter(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
