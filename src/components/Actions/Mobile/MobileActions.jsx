import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import {
	Container,
	Input,
	PanelGroup,
	Button,
	Loader,
	Icon,
	InputGroup,
	Tooltip,
	Whisper,
	Drawer
} from 'rsuite';
import { getMyAssets } from '../../../redux/entities/assets';
import { getMyCharacter } from '../../../redux/entities/characters';

import NavigationBar from '../../Navigation/NavigationBar';
import ActionList from '../ActionList';
import NewAction from '../NewAction';

import MobileSelectedActions from './MobileSelectedActions';

const MobileActions = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showNew, setShowNew] = React.useState(false);
	const [showDrawer, setShowDrawer] = React.useState(true);
	const history = useHistory();
	useEffect(() => {
		if (selected) {
			const newSelected = props.actions.find((el) => el._id === selected._id);
			setSelected(newSelected);
		}
	}, [props.actions, selected]);

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
		setShowDrawer(false);
	};

	const tooltip = () => {
		return <Tooltip>Log-Out</Tooltip>;
	};

	if (!props.login) {
		history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	return (
		<React.Fragment>
			<NavigationBar />
			<Container>
				<Drawer
					size="xs"
					placement={'left'}
					backdrop={false}
					style={{ width: '200px', marginTop: '51px' }}
					show={showDrawer}
					onClose={() => console.log(!showDrawer)}
				>
					<PanelGroup>
						<div style={{ height: '40px' }}>
							<button
								onClick={() => setShowDrawer(!showDrawer)}
								className="toggle-menu"
								style={{
									transform: `translate(${200}px, 100px)`
								}}
							></button>
							<InputGroup>
								<Input
									size="sm"
									style={{ width: '40%' }}
									onChange={(value) => props.setFilter(value)}
									value={props.filter}
									placeholder="Search"
								></Input>
								<Whisper placement="top" trigger="hover" speaker={tooltip}>
									<Button
										appearance="primary"
										color="green"
										disabled={
											!props.gamestate.status === 'Active' ||
											props.myCharacter.effort < 1
										}
										onClick={() => setShowNew(true)}
									>
										<Icon icon="plus" />
									</Button>
								</Whisper>
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
						</div>
					</PanelGroup>
				</Drawer>
				{!showDrawer && (
					<button
						onClick={() => setShowDrawer(!showDrawer)}
						className="toggle-menu"
						style={{
							transform: `translate(${0}px, 100px)`,
							transition: '0.8s ease'
						}}
					/>
				)}
				{selected && selected.type === 'Action' && (
					<MobileSelectedActions
						user={props.user}
						handleSelect={handleSelect}
						selected={selected}
					/>
				)}
				{!selected && <h5 style={{ marginTop: '40vh' }}>No Action selected</h5>}

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
	user: state.auth.user,
	control: state.auth.control,
	filter: state.actions.filter,
	login: state.auth.login,
	gamestate: state.gamestate,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined,
	myAssets: state.auth.user ? getMyAssets(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MobileActions);
