import React, { Component } from 'react';
import {
	ButtonGroup,
	Content,
	InputNumber,
	InputPicker,
	Panel,
	Button,
	Icon,
	Modal,
	Form,
	FormGroup,
	FormControl,
	ControlLabel,
	DatePicker,
	Loader,
	FlexboxGrid
} from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';
import {
	getBadCharacters,
	getGods,
	getMyCharacter,
	getNonPlayerCharacters
} from '../../redux/entities/characters';
import NavigationBar from '../Navigation/NavigationBar';
import { assetsRequested } from '../../redux/entities/assets';
import NewCharacter from './NewCharacter';
import NewProject from './NewProject';
import ModifyResource from './ModifyResource';
import LockMap from './LockMap';
import ManageContacts from './ManageContacts';
import HealInjury from './HealInjury';

class ControlTerminal extends Component {
	state = {
		gsModal: false,
		warningModal: false,
		warning2Modal: false,
		scottModal: false,
		assModal: false,
		mapModal: false,
		charLockModal: false,
		injuryModal: false,
		projectModal: false,
		newCharater: false,
		editTerritory: false,
		formValue: {
			round: null,
			status: ''
		},
		endTime: null,

		drafts: 0,
		awaiting: 0,
		ready: 0,
		assets: [],
		selected: null,
		name: '',
		description: '',
		uses: 0,
		used: false,
		loading: false,
		god: null,
		bonder: null,
		godData: true
	};

	componentDidMount = async () => {
		const formValue = {
			round: this.props.gamestate.round,
			status: this.props.gamestate.status,
			endTime: this.props.gamestate.endTime
		};

		let drafts = 0;
		let awaiting = 0;
		let ready = 0;
		for (const action of this.props.actions.filter(
			(el) => el.round === this.props.gamestate.round
		)) {
			if (action.results.length === 0) drafts++;
			else if (action.results[0].ready) ready++;
			else awaiting++;
		}
		this.setState({
			formValue,
			drafts,
			awaiting,
			ready,
			characters: { ...this.props.characters }
		});
	};

	componentDidUpdate = async (prevProps) => {
		if (
			this.props.gamestate !== prevProps.gamestate ||
			this.props.actions !== prevProps.actions
		) {
			const formValue = {
				round: this.props.gamestate.round,
				status: this.props.gamestate.status
			};
			this.setState({ formValue, endTime: this.props.gamestate.endTime });
		}
	};

	render() {
		const setMapModal = (params) => this.setState({ mapModal: params });
		const setInjuryModal = (params) => this.setState({ injuryModal: params });
		const setCharLockModal = (params) =>
			this.setState({ charLockModal: params });
		if (!this.props.login) {
			this.props.history.push('/');
			return <Loader inverse center content="doot..." />;
		}
		return (
			<Content style={{ style1 }}>
				<NavigationBar />

				<Panel style={{ backgroundColor: '#272b34' }}>
					<FlexboxGrid>
						<FlexboxGrid.Item
							style={{ border: '3px solid #ff66c4' }}
							colspan={4}
						>
							<Panel style={{ height: '11vh' }}>
								<h5>Draft Actions</h5> {this.state.drafts}{' '}
							</Panel>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item
							style={{ border: '3px solid #ff66c4' }}
							colspan={4}
						>
							<Panel style={{ height: '11vh' }}>
								<h5>Draft Resolution</h5> {this.state.awaiting}{' '}
							</Panel>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item
							style={{ border: '3px solid #ff66c4' }}
							colspan={4}
						>
							<Panel style={{ height: '11vh' }}>
								<h5>Resolutions Ready</h5> {this.state.ready}{' '}
							</Panel>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item
							style={{ border: '3px solid #d066ff' }}
							colspan={6}
						>
							<Panel style={{ height: '11vh' }}>
								<h5>Zero Efforts</h5>{' '}
								{this.props.characters.filter((el) => el.effort <= 0).length}{' '}
							</Panel>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item
							style={{ border: '3px solid #d066ff' }}
							colspan={6}
						>
							<Panel style={{ height: '11vh' }}>
								<h5>Hidden Asssets</h5>{' '}
								{
									this.props.assets.filter((el) => el.status.hidden === true)
										.length
								}{' '}
							</Panel>
						</FlexboxGrid.Item>
					</FlexboxGrid>
					<div style={{ marginTop: '10px' }}>
						<ButtonGroup>
							<Button
								appearance="ghost"
								color="red"
								onClick={() => this.setState({ warningModal: true })}
							>
								Close Actions
							</Button>
							<Button
								appearance="ghost"
								color="green"
								onClick={() => this.setState({ warning2Modal: true })}
							>
								Publish Resolutions
							</Button>
							<Button
								appearance="ghost"
								onClick={() => this.setState({ gsModal: true })}
							>
								Edit Game State
							</Button>
							<Button
								appearance="ghost"
								onClick={() => this.setState({ assModal: true })}
							>
								Edit or Delete Resources
							</Button>
							<Button
								appearance="ghost"
								onClick={() => this.setState({ mapModal: true })}
							>
								Lock Map Tile
							</Button>
							<Button
								appearance="ghost"
								onClick={() => this.setState({ charLockModal: true })}
							>
								Manage Character Contacts
							</Button>
							<Button
								appearance="ghost"
								onClick={() => this.setState({ injuryModal: true })}
							>
								Heal Injuries
							</Button>
							{/* <Button appearance="ghost" onClick={() => this.setState({ scottModal: true })}>Edit or Delete Resources</Button> */}
							{/* <Button appearance="ghost" onClick={() => this.setState({ editTerritory: true })}>Edit Territory</Button> */}
							{/* <Button color='orange' appearance="ghost" onClick={() => this.setState({ projectModal: true })}>New Project</Button> */}
							<Button
								color="orange"
								appearance="ghost"
								onClick={() => this.setState({ newCharacter: true })}
							>
								New Character
							</Button>
							<Button
								color="violet"
								onClick={() => this.props.history.push('/registration')}
							>
								Registration
							</Button>
							<Button
								color="violet"
								onClick={() =>
									socket.emit('request', { route: 'action', action: 'unhide' })
								}
							>
								Unhide all Assets
							</Button>
							{/* {<Button color='violet' onClick={() => this.props.history.push('/bitsy')}>Secret</Button>} */}
						</ButtonGroup>
					</div>
				</Panel>

				<Modal
					size="sm"
					show={this.state.gsModal}
					onHide={() => this.setState({ gsModal: false })}
				>
					<Form
						formValue={this.state.formValue}
						layout="vertical"
						onChange={(formValue) => {
							this.setState({ formValue });
						}}
					>
						<FormGroup>
							<ControlLabel>Game State </ControlLabel>
							<FormControl
								name="status"
								data={pickerData}
								accepter={InputPicker}
							/>
						</FormGroup>
						<FormGroup>
							<ControlLabel>Round</ControlLabel>
							<FormControl
								name="round"
								cleanable={false}
								accepter={InputNumber}
							/>
						</FormGroup>
						<FormGroup>
							<ControlLabel>End Time</ControlLabel>
							<DatePicker
								value={this.state.endTime}
								onChange={this.handleDate}
								format="YYYY-MM-DD HH:mm"
							></DatePicker>
						</FormGroup>
					</Form>
					<Modal.Footer>
						<Button
							loading={this.state.loading}
							onClick={() => this.editGameState()}
							disabled={this.state.formValue.status === null}
							appearance="primary"
						>
							Submit
						</Button>
						<Button
							onClick={() => this.setState({ gsModal: false })}
							appearance="subtle"
						>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					backdrop="static"
					size="sm"
					show={this.state.warningModal}
					onHide={() => this.setState({ warningModal: false })}
				>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Waring! Are you sure you want to close the round? This will lock
						down all actions.
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.closeDraft()} appearance="primary">
							I am Sure!
						</Button>
						<Button
							onClick={() => this.setState({ warningModal: false })}
							appearance="subtle"
						>
							Nevermind
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					backdrop="static"
					size="sm"
					show={this.state.warning2Modal}
					onHide={() => this.setState({ warning2Modal: false })}
				>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Waring! Are you sure you want to publish all actions? This will:
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						<ul>
							<li>
								Push all actions that are "Ready for Publishing" to "Published"
							</li>
							<li>Recall all Lent Assets to their owners</li>
							<li>Push the round to it's next number</li>
						</ul>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.publishActions()} appearance="primary">
							I am Sure!
						</Button>
						<Button
							onClick={() => this.setState({ warning2Modal: false })}
							appearance="subtle"
						>
							Nevermind
						</Button>
					</Modal.Footer>
				</Modal>

				<ModifyResource
					show={this.state.assModal}
					closeModal={() => this.setState({ assModal: false })}
				/>

				<NewCharacter
					show={this.state.newCharacter}
					closeModal={() => this.setState({ newCharacter: false })}
				/>

				<LockMap
					open={true}
					show={this.state.mapModal}
					closeModal={() => setMapModal(false)}
				/>

				<ManageContacts
					open={true}
					show={this.state.charLockModal}
					closeModal={() => setCharLockModal(false)}
				/>

				<HealInjury
					open={true}
					show={this.state.injuryModal}
					closeModal={() => setInjuryModal(false)}
				/>

				{/* <EditTerritory show={this.state.editTerritory}
					closeModal={() => this.setState({ editTerritory: false })}/> */}

				<NewProject
					show={this.state.projectModal}
					closeModal={() => this.setState({ projectModal: false })}
				/>
			</Content>
		);
	}

	handleDate = (value) => {
		this.setState({ endTime: value });
	};

	handleDelete = async () => {
		socket.emit('request', {
			route: 'asset',
			action: 'delete',
			data: { id: this.state.selected }
		});
	};

	editGameState = async () => {
		const data = {
			round: this.state.formValue.round,
			status: this.state.formValue.status,
			endTime: this.state.endTime
		};
		socket.emit('request', { route: 'gamestate', action: 'modify', data });
		this.setState({ gsModal: false });
	};

	closeDraft = async () => {
		socket.emit('request', { route: 'gamestate', action: 'closeRound' });
		this.setState({ warningModal: false });
	};

	publishActions = async () => {
		socket.emit('request', { route: 'gamestate', action: 'nextRound' });
		this.setState({ warning2Modal: false });
	};

	isControl() {
		if (this.props.user.roles.some((el) => el === 'Control')) return false;
		else return true;
	}

	filterAssets() {
		this.props.assets.filter((el) => el.modal !== 'Wealth');
	}
}

const style1 = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
};

const pickerData = [
	{
		label: 'Active',
		value: 'Active'
	},
	{
		label: 'Resolution',
		value: 'Resolution'
	},
	{
		label: 'Down',
		value: 'Down'
	}
];

// const textStyle = {
// 	backgroundColor: '#1a1d24',
// 	border: '1.5px solid #3c3f43',
// 	borderRadius: '5px',
// 	width: '100%',
// 	padding: '5px',
// 	overflow: 'auto',
// 	scrollbarWidth: 'none',
// }

const mapStateToProps = (state) => ({
	user: state.auth.user,
	assetLoading: state.assets.loading,
	assets: state.assets.list,
	login: state.auth.login,
	gamestate: state.gamestate,
	characters: state.characters.list,
	actions: state.actions.list,
	playerCharacter: state.auth.user ? getMyCharacter(state) : undefined,
	badCharacters: getBadCharacters(state),
	nonPlayerCharacters: getNonPlayerCharacters(state),
	godCharacters: getGods(state)
});

const mapDispatchToProps = (dispatch) => ({
	assetDispatched: (data) => dispatch(assetsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlTerminal);
