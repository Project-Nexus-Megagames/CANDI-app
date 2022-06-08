import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Container,
	Sidebar,
	Input,
	PanelGroup,
	Button,
	Loader,
	Icon,
	InputGroup,
	Tooltip,
	Whisper
} from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import {
	getCurrentExplores,
	getMyActions,
	setFilter
} from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';

import ActionList from './ActionList';
import MobileActions from './Mobile/MobileActions';
import NewAction from './NewAction';
import SelectedAction from './SelectedAction';

const Actions = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showNew, setShowNew] = React.useState(false);

	useEffect(() => {
		if (selected) {
			const newSelected = props.actions.find((el) => el._id === selected._id);
			setSelected(newSelected);
		}
	}, [props.actions, selected]);

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
	};

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
		return <Loader inverse center content="doot..." />;
	}
	if (window.innerWidth < 768) {
		return <MobileActions />;
	}
	return (
		<React.Fragment>
			<NavigationBar />
			<Container style={{ height: 'calc(100vh - 50px)' }}>
				<Sidebar className="side-bar">
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
								{
									<Whisper
										placement="top"
										trigger="hover"
										speaker={
											<Tooltip>
												<b>
													{true
														? 'Create New Explore Action'
														: 'No Explore Left'}
												</b>
											</Tooltip>
										}
									>
										<Button
											disabled={props.explore}
											style={{ color: 'black', borderRadius: '0px' }}
											color="orange"
											onClick={() => setShowNew('explore')}
										>
											<Icon icon="explore" />
										</Button>
									</Whisper>
								}
								{
									<Whisper
										placement="top"
										trigger="hover"
										speaker={
											<Tooltip>
												<b>
													{props.myCharacter.effort > 0
														? `Create New Default Action (${props.myCharacter.effort})`
														: 'No Actions Left'}
												</b>
											</Tooltip>
										}
									>
										<Button
											style={{ borderRadius: '0px' }}
											disabled={props.myCharacter.effort < 1}
											color="green"
											onClick={() => setShowNew('default')}
										>
											<Icon icon="plus" />{' '}
										</Button>
									</Whisper>
								}
							</InputGroup>
						</div>
						<div
							bodyFill
							style={{
								height: 'calc(100vh - 80px)',
								scrollbarWidth: 'none',
								overflow: 'auto',
								borderRadius: '0px',
								borderRight: '1px solid rgba(255, 255, 255, 0.12)'
							}}
						>
							<ActionList selected={selected} handleSelect={handleSelect} />
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
					myCharacter={props.myCharacter}
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
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	setFilter: (data) => dispatch(setFilter(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
