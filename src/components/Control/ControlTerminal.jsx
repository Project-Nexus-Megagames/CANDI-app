import React, { Component } from 'react';
import { ButtonGroup, Content, InputNumber, InputPicker, Divider, Panel, Button, Icon, Modal, Form, FormGroup, FormControl, ControlLabel, FlexboxGrid, DatePicker, Loader, Table, Tag, Toggle } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';
import { getBadCharacters, getGods, getMyCharacter, getNonPlayerCharacters, getPlayerCharacters } from '../../redux/entities/characters';
import { draftActions } from '../../redux/entities/playerActions';
import NavigationBar from '../Navigation/NavigationBar';
import { assetsRequested, getGodBonds } from '../../redux/entities/assets';
import NewCharacter from './NewCharacter';
import EditTerritory from './EditTerritory';
import NewProject from './NewProject';
import ModifyResource from './ModifyResource';
import RelationshipTable from './RelationshipTable';

const { Column, HeaderCell, Cell } = Table;
class ControlTerminal extends Component {
	state = { 
		gsModal: false,
		warningModal: false,
		warning2Modal: false,
		scottModal: false,
		assModal: false,
		projectModal: false,
		newCharater: false,
		editTerritory: false,
		formValue: {
			round: null,
			status: '',
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
		godData: true,

	}

	componentDidMount = async () => {
		const formValue = {
			round: this.props.gamestate.round, 
			status: this.props.gamestate.status,
			endTime: this.props.gamestate.endTime
		}

		let drafts = 0;
		let awaiting= 0;
		let ready = 0;
		for (const action of this.props.actions) {
			switch (action.status) {
				case "Draft":
					drafts++;
					break;
				case "Ready":
					ready++;
					break;
				case "Awaiting":
					awaiting++;
					break;
				default:
					break;
			}
		}
		this.setState({ formValue, drafts, awaiting, ready, characters: {...this.props.characters} })
	}

	componentDidUpdate = async (prevProps) => {
		if (this.props.gamestate !== prevProps.gamestate || this.props.actions !== prevProps.actions) {
			const formValue = {
				round: this.props.gamestate.round, 
				status: this.props.gamestate.status
			}
			let drafts = 0;
			let awaiting= 0;
			let ready = 0;
			const copy = this.props.actions.filter(action => action.round === this.props.gamestate.round);
			await this.compileTable(copy);

			for (const action of copy) {
				switch (action.status) {
					case "Draft":
						drafts++;
						break;
					case "Ready":
						ready++;
						break;
					case "Awaiting":
						awaiting++;
						break;
					default:
						break;
				}
			}
			this.setState({ formValue, drafts, awaiting, ready, endTime: this.props.gamestate.endTime })			
		}
	}

	render() { 
		if (!this.props.login) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		return ( 
			<Content style={{style1}}>
				<NavigationBar />
				<div style={{height: '10vh'}} >
					<Divider>Scott's Message of the Day:</Divider>
					Well this is just a hot mess on the back end. Aorry to Control, but I do not have enough love to give to both the Front end and the Control Terminal
					{this.props.badCharacters.length > 0 && <div>
						<h5>There are {this.props.badCharacters.length} characters with bad email/pronouns</h5>
						{this.props.badCharacters.map((bad, index) => (
							<Tag color='red'>{bad.characterName}</Tag>
						))}
					</div>}					
				</div>
				{/* <div style={{height: '15vh'}}>
				<FlexboxGrid>
					<FlexboxGrid.Item colspan={8}>
						<Panel bordered style={{backgroundColor: '#272b34'}} header='Drafts'> {this.state.drafts} </Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={8}>
						<Panel bordered style={{backgroundColor: '#272b34'}} header='Awaiting Resolution'> {this.state.awaiting} </Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={8}>
						<Panel bordered style={{backgroundColor: '#272b34'}} header='Ready for Publishing'> {this.state.ready} </Panel>			
					</FlexboxGrid.Item>					
				</FlexboxGrid>					
				</div> */}
				<div  style={{height: '15vh'}}>
					<Divider>Editing</Divider>
					<Panel>
						<ButtonGroup >
							<Button appearance="ghost" color='red' onClick={() => this.setState({ warningModal: true })}>Close Actions</Button>
							<Button appearance="ghost" color='green' onClick={() => this.setState({ warning2Modal: true })}>Publish Resolutions</Button>
							<Button appearance="ghost" disabled={this.isControl()} onClick={() => this.setState({ gsModal: true })} >Edit Game State</Button>
							<Button appearance="ghost" onClick={() => this.setState({ assModal: true })}>Edit or Delete Resources</Button>
							{/* <Button appearance="ghost" onClick={() => this.setState({ scottModal: true })}>Edit or Delete Resources</Button> */}
							{/* <Button appearance="ghost" onClick={() => this.setState({ editTerritory: true })}>Edit Territory</Button> */}
							{/* <Button color='orange' appearance="ghost" onClick={() => this.setState({ projectModal: true })}>New Project</Button> */}
							<Button color='orange' appearance="ghost" onClick={() => this.setState({ newCharacter: true })}>New Character</Button>
							<Button color='violet' appearance="ghost" onClick={() => this.props.history.push('/registration')}>Registration</Button>
						</ButtonGroup>
					</Panel>			
				</div>
        <Toggle onChange={()=> this.setState({ godData: !this.state.godData })} checkedChildren="Mortal" unCheckedChildren="Gods"/>
				<RelationshipTable godData={this.state.godData} data={this.state.godData ? this.props.godCharacters : this.props.nonPlayerCharacters}  />

				<Modal size='sm' show={this.state.gsModal} onHide={() => this.setState({ gsModal: false })} > 
					<Form formValue={this.state.formValue} layout="vertical" onChange={formValue => {this.setState({ formValue });}}>
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
							<DatePicker value={this.state.endTime} onChange={this.handleDate} format="YYYY-MM-DD HH:mm"></DatePicker>
						</FormGroup>
					</Form>
					<Modal.Footer>
			<Button loading={this.state.loading} onClick={() => this.editGameState()} disabled={(this.state.formValue.status === null)} appearance="primary">
				Submit
			</Button>
			<Button onClick={() => this.setState({ gsModal: false })} appearance="subtle">
				Cancel
			</Button>
		</Modal.Footer>
				</Modal>
		
				<Modal backdrop="static" size='sm' show={this.state.warningModal} onHide={() => this.setState({ warningModal: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
							{'  '}
							Waring! Are you sure you want to close the round? This will lock down all actions.
							<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
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

				{/* <Modal backdrop="static" size='sm' show={this.state.scottModal} onHide={() => this.setState({ scottModal: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
							{'  '}
						HEY! This is Scott. Do NOT edit assets to reduce their usage for purposes of people using them on actions. This will mess up the automation I am working on and players will get confused.
							<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
					</Modal.Body>
					<Modal.Footer>
            <Button onClick={() => this.setState({ assModal: true })} appearance="primary">
							I understand
            </Button>
            <Button onClick={() => this.setState({ scottModal: false })} appearance="subtle">
							This warning Modal Can't stop me if I don't read it!
            </Button>
		</Modal.Footer>
				</Modal> */}			
				<Modal backdrop="static" size='sm' show={this.state.warning2Modal} onHide={() => this.setState({ warning2Modal: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
							{'  '}
							Waring! Are you sure you want to publish all actions? This will:
							<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
							<ul>
								<li>
									Make all actions that are "Ready for Publishing" to "Published"
								</li>
								<li>
									Recall all Lent Assets to their owners
								</li>
								<li>
									Push the round to it's next number
								</li>
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
			
				<ModifyResource show={this.state.assModal} 
					closeModal={() => this.setState({ assModal: false })}/>

				<NewCharacter show={this.state.newCharacter} 
					closeModal={() => this.setState({ newCharacter: false })}/>

				{/* <EditTerritory show={this.state.editTerritory} 
					closeModal={() => this.setState({ editTerritory: false })}/> */}

				<NewProject show={this.state.projectModal} 
					closeModal={() => this.setState({ projectModal: false })}/>
			</Content>
		);
	}

	handleDate = (value) => {
		this.setState({ endTime: value })
	}

	handleDelete = async () => {
		socket.emit('assetRequest', 'delete', { id: this.state.selected }); // new Socket event	
	}

	editGameState = async () => {
		const data = {
			round: this.state.formValue.round,
			status: this.state.formValue.status,
			endTime: this.state.endTime
		}
		socket.emit('gamestateRequest', 'modify',  data ); // new Socket event	
		this.setState({ gsModal: false });
	}

	closeDraft = async () => {
		socket.emit('gamestateRequest', 'closeRound', 'Hello'); // new Socket event
		this.setState({ warningModal: false });
	}

	publishActions = async () => {
		socket.emit('gamestateRequest', 'nextRound', 'Hello'); // new Socket event
		this.setState({ warning2Modal: false });	
	}

	isControl () {
		if (this.props.user.roles.some(el => el === "Control")) return false;
		else return true;
	}

	filterAssets () {
		const filtered = this.props.assets.filter(el => el.modal !== 'Wealth')
	}


	
}

const style1 = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
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
	},
]

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
	draftActions: draftActions(state),
	playerCharacter: state.auth.user ? getMyCharacter(state) : undefined,
	badCharacters: getBadCharacters(state),
	nonPlayerCharacters: getNonPlayerCharacters(state),    
	godCharacters: getGods(state),
});

const mapDispatchToProps = (dispatch) => ({
	assetDispatched: (data) => dispatch(assetsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlTerminal);
