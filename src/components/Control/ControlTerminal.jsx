import React, { Component } from 'react';
import { ButtonGroup, Content, InputNumber, InputPicker, Panel, Button, Icon, Modal, Form, FormGroup, FormControl, ControlLabel, DatePicker, Loader, FlexboxGrid } from 'rsuite';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Divider } from '@chakra-ui/react';
import { connect } from 'react-redux';
import socket from '../../socket';
import NavigationBar from '../Navigation/NavigationBar';
import NewCharacter from './NewCharacter';
import ModifyResource from './ModifyResource';
import LockMap from './LockMap';
import ManageContacts from './ManageContacts';
import HealInjury from './HealInjury';
import Aspects from './Aspects';
import ActionTable from './ActionTable';

class ControlTerminal extends Component {
	state = {
		gsModal: false,
		warningModal: false,
		warning2Modal: false,
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

		zAgendas: 0,
		zNormals: 0,

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
		for (const action of this.props.actions.filter((el) => el.round === this.props.gamestate.round)) {
			if (action.results.length === 0) drafts++;
			else if (action.results[0].ready) ready++;
			else awaiting++;
		}

		let zAgendas = this.props.characters.filter((el) => el.effort.some((eff) => eff.amount <= 0 && eff.type === 'Agenda'));
		let zNormals = this.props.characters.filter((el) => el.effort.some((eff) => eff.amount <= 0 && eff.type === 'Normal'));

		this.setState({
			formValue,
			drafts,
			awaiting,
			ready,
			zAgendas,
			zNormals,
			characters: { ...this.props.characters }
		});
	};

	componentDidUpdate = async (prevProps) => {
		if (this.props.gamestate !== prevProps.gamestate || this.props.actions !== prevProps.actions) {
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
		const setAspectModal = (params) => this.setState({ aspectModal: params });
		const setCharLockModal = (params) => this.setState({ charLockModal: params });

		if (!this.props.login) {
			this.props.history.push('/');
			return <Loader inverse center content="doot..." />;
		}
		return (
			<Content>
				<NavigationBar />
				<Tabs variant="unstyled" paddingTop={4} defaultIndex={0}>
					<TabList>
						<Tab _selected={{ color: 'white', bg: 'teal.500', border: 'none' }} as="b" cursor="pointer">
							Control Terminal
						</Tab>
						<Tab _selected={{ color: 'white', bg: 'teal.500', border: 'none' }} as="b" cursor="pointer">
							Action Resolutions
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Panel style={{ backgroundColor: '#272b34' }}>
								<FlexboxGrid>
									<FlexboxGrid.Item style={{ border: '3px solid #ff66c4' }} colspan={4}>
										<div style={{ height: '11vh' }}>
											<h5>Draft Actions</h5> {this.state.drafts}{' '}
										</div>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{ border: '3px solid #ff66c4' }} colspan={4}>
										<div style={{ height: '11vh' }}>
											<h5>Draft Resolution</h5> {this.state.awaiting}{' '}
										</div>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{ border: '3px solid #ff66c4' }} colspan={4}>
										<div style={{ height: '11vh' }}>
											<h5>Resolutions Ready</h5> {this.state.ready}{' '}
										</div>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{ border: '3px solid #d066ff' }} colspan={6}>
										<div style={{ height: '11vh', overflow: 'scroll' }}>
											<h5>Characters w/ Zero Effort</h5> {this.state.zNormals.length} - {this.state.zAgendas.length}
											{this.state.zNormals.length > 0 && (
												<div>
													<p>0 Normal Effort</p>
													{this.state.zNormals.map((el) => (
														<p key={el._id}>{el.characterName}</p>
													))}
												</div>
											)}
											{this.state.zAgendas.length > 0 && (
												<div>
													<p>0 Agenda Effort</p>
													{this.state.zAgendas.map((el) => (
														<p key={el._id}>{el.characterName}</p>
													))}
												</div>
											)}
										</div>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{ border: '3px solid #d066ff' }} colspan={6}>
										<div style={{ height: '11vh', overflow: 'scroll' }}>
											<h5>Hidden Asssets</h5> {this.props.assets.filter((el) => el.status.hidden === true).length}
											{this.props.assets.filter((el) => el.status.hidden === true).length > 0 && (
												<div>
													<Button
														color="violet"
														onClick={() =>
															socket.emit('request', {
																route: 'asset',
																action: 'unhide'
															})
														}
													>
														Unhide all Assets
													</Button>
													{this.props.assets
														.filter((el) => el.status.hidden === true)
														.map((el) => (
															<p key={el._id}>{el.name}</p>
														))}
												</div>
											)}
										</div>
									</FlexboxGrid.Item>
								</FlexboxGrid>
								<div style={{ marginTop: '10px' }}>
									<Button appearance="ghost" onClick={() => this.setState({ assModal: true })}>
										Edit or Delete Resources
									</Button>

									{/* <Button disabled appearance="ghost" onClick={() => this.setState({ mapModal: true })}>
							Lock Map Tile
						</Button> */}

									{/* <Button appearance="ghost" onClick={() => this.setState({ injuryModal: true })}>
							Heal Injuries
						</Button> */}
									{/* <Button appearance="ghost" onClick={() => this.setState({ editTerritory: true })}>Edit Territory</Button> */}

									{/* {<Button color='violet' onClick={() => this.props.history.push('/bitsy')}>Secret</Button>} */}
								</div>
							</Panel>

							<Panel header={'Round Editing'} bordered style={{ border: '5px solid red' }}>
								<ButtonGroup>
									<Button appearance="ghost" color="red" onClick={() => this.setState({ warningModal: true })}>
										Close Actions
									</Button>
									<Button appearance="ghost" color="green" onClick={() => this.setState({ warning2Modal: true })}>
										Publish Resolutions
									</Button>
									<Button appearance="ghost" onClick={() => this.setState({ gsModal: true })}>
										Edit Game State
									</Button>
								</ButtonGroup>
							</Panel>

							<Panel header={'Character'} bordered style={{ border: '5px solid gold' }}>
								<ButtonGroup>
									<Button color="orange" appearance="ghost" onClick={() => this.setState({ newCharacter: true })}>
										New Character
									</Button>
									<Button appearance="ghost" onClick={() => this.setState({ charLockModal: true })}>
										Manage Character Contacts
									</Button>
									<Button color="violet" onClick={() => this.props.history.push('/registration')}>
										Registration
									</Button>
								</ButtonGroup>
							</Panel>

							<Panel header={'Configuration and Logging'} bordered style={{ border: '5px solid purple' }}>
								<ButtonGroup>
									{/*<Button appearance="ghost" onClick={() => setLogModal(true)}>*/}
									<Button appearance="ghost" onClick={() => this.props.history.push('/log')}>
										View Log
									</Button>
									<Button appearance="ghost" color="red" onClick={() => this.props.history.push('/gameConfig')}>
										Edit Game Config
									</Button>
								</ButtonGroup>
							</Panel>

							<Panel header={'Aspects and their Standing'} style={{ border: '5px solid green' }}>
								<ButtonGroup>
									{/*<Button appearance="ghost" onClick={() => setLogModal(true)}>*/}
									<Button appearance="ghost" onClick={() => this.setState({ aspectModal: true })}>
										View Standings
									</Button>
								</ButtonGroup>
							</Panel>
						</TabPanel>
						<TabPanel>
							<ActionTable />
						</TabPanel>
					</TabPanels>
				</Tabs>

				{/* TODO pull these out into individual components */}
				<Modal size="sm" show={this.state.gsModal} onHide={() => this.setState({ gsModal: false })}>
					<Form
						formValue={this.state.formValue}
						layout="vertical"
						onChange={(formValue) => {
							this.setState({ formValue });
						}}
					>
						<FormGroup>
							<ControlLabel>Game State </ControlLabel>
							<FormControl name="status" data={pickerData} accepter={InputPicker} />
						</FormGroup>
						<FormGroup>
							<ControlLabel>Round</ControlLabel>
							<FormControl name="round" cleanable={false} accepter={InputNumber} />
						</FormGroup>
						<FormGroup>
							<ControlLabel>End Time</ControlLabel>
							<DatePicker value={this.state.endTime} onChange={(value) => this.setState({ endTime: value })} format="YYYY-MM-DD HH:mm"></DatePicker>
						</FormGroup>
					</Form>
					<Modal.Footer>
						<Button loading={this.state.loading} onClick={() => this.editGameState()} disabled={this.state.formValue.status === null} appearance="primary">
							Submit
						</Button>
						<Button onClick={() => this.setState({ gsModal: false })} appearance="subtle">
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal backdrop="static" size="sm" show={this.state.warningModal} onHide={() => this.setState({ warningModal: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Waring! Are you sure you want to close the round? This will lock down all actions.
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.closeDraft()} appearance="primary">
							I am Sure!
						</Button>
						<Button onClick={() => this.setState({ warningModal: false })} appearance="subtle">
							Nevermind
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal backdrop="static" size="sm" show={this.state.warning2Modal} onHide={() => this.setState({ warning2Modal: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Waring! Are you sure you want to publish all actions? This will:
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						<ul>
							<li>Push all actions that are "Ready for Publishing" to "Published"</li>
							<li>Recall all Lent Assets to their owners</li>
							<li>Push the round to it's next number</li>
						</ul>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.publishActions()} appearance="primary">
							I am Sure!
						</Button>
						<Button onClick={() => this.setState({ warning2Modal: false })} appearance="subtle">
							Nevermind
						</Button>
					</Modal.Footer>
				</Modal>

				<ModifyResource show={this.state.assModal} closeModal={() => this.setState({ assModal: false })} />

				<NewCharacter show={this.state.newCharacter} closeModal={() => this.setState({ newCharacter: false })} />

				<LockMap open={true} show={this.state.mapModal} closeModal={() => setMapModal(false)} />

				<ManageContacts open={true} show={this.state.charLockModal} closeModal={() => setCharLockModal(false)} />

				<HealInjury open={true} show={this.state.injuryModal} closeModal={() => setInjuryModal(false)} />

				<Aspects open={true} show={this.state.aspectModal} closeModal={() => setAspectModal(false)} />
			</Content>
		);
	}

	handleDate = (value) => {
		this.setState({ endTime: value });
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
		const data = this.props.user.username;
		socket.emit('request', { route: 'gamestate', action: 'closeRound', data });
		this.setState({ warningModal: false });
	};

	publishActions = async () => {
		const data = this.props.user.username;
		socket.emit('request', { route: 'gamestate', action: 'nextRound', data });
		this.setState({ warning2Modal: false });
	};
}

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

const mapStateToProps = (state) => ({
	user: state.auth.user,
	assets: state.assets.list,
	login: state.auth.login,
	gamestate: state.gamestate,
	characters: state.characters.list,
	actions: state.actions.list
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ControlTerminal);
