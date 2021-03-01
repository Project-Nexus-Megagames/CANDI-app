import axios from 'axios';
import React, { Component } from 'react';
import { Alert, ButtonGroup, Content, InputNumber, InputPicker, Divider, Placeholder, Panel, Button, Icon, Modal, Form, FormGroup, FormControl, ControlLabel, FlexboxGrid, SelectPicker, TagPicker, DatePicker, Loader } from 'rsuite';
import { gameServer } from '../../config';
import { connect } from 'react-redux';
import socket from '../../socket';

class ControlTerminal extends Component {
	state = { 
		gsModal: false,
		warningModal: false,
		warning2Modal: false,
		assModal: false,
		projectModal: false,
		formValue: {
			round: null,
			status: '',
		},
		endTime: null,
		projName: '',
		projDescription: '',
		progress: 0,
		players: [],
		image: '',
	
		drafts: 0,
		awaiting: 0,
		ready: 0,
		assets: [],
		selected: null,
		name: '',
		description: '',
		uses: 0, 
		loading: false
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
			if (action.status.draft === true) drafts++;
			else if (action.status.ready === true) ready++;
			else if (action.status.draft === false && action.status.ready === false && action.status.published === false) awaiting++;
		}
		this.setState({ formValue, drafts, awaiting, ready })
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
			for (const action of this.props.actions) {
				if (action.status.draft === true && action.model !== "Project") drafts++;
				else if (action.status.ready === true) ready++;
				else if (action.status.draft === false && action.status.ready === false && action.status.published === false) awaiting++;
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
				<Divider>Actions Status</Divider>
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

				<Divider>Round Editing</Divider>
				<Panel>
					<ButtonGroup >
						<Button appearance="ghost" onClick={() => this.setState({ warningModal: true })}>Close Actions</Button>
						<Button appearance="ghost" onClick={() => this.setState({ warning2Modal: true })}>Publish Resolutions</Button>
						<Button appearance="ghost" disabled={this.isControl()} onClick={() => this.setState({ gsModal: true })} >Edit Game State</Button>
					</ButtonGroup>
				</Panel>
				<Divider>Asset Management</Divider>
				<Panel>
					<ButtonGroup >
						<Button color='red' appearance="ghost" onClick={() => this.setState({ assModal: true })}>Edit or Delete Asset/Trait</Button>
						<Button color='orange' appearance="ghost" onClick={() => this.setState({ projectModal: true })}>New Project</Button>
					</ButtonGroup>
				</Panel>
				<Divider>Scott's Message of the Day:</Divider>
				<div>
					<h5>I'm a lumberjack and I'm ok.</h5>
				</div>
				<Button onClick={()=> socket.emit('test', 'hi')}>test</Button>

				<Modal size='sm' show={this.state.gsModal} onHide={() => this.setState({ gsModal: false })} > 
					<Form formValue={this.state.formValue} layout="center" onChange={formValue => {this.setState({ formValue });}}>
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
							<DatePicker value={this.state.endTime} onChange={this.handleDate} format="YYYY-MM-DD HH"></DatePicker>
						</FormGroup>
					</Form>
					<Modal.Footer>
        	  <Button loading={this.state.loading} onClick={() => this.handleSubmit()} disabled={(this.state.formValue.status === null)} appearance="primary">
        	    Submit
        	  </Button>
        	  <Button onClick={() => this.setState({ gsModal: false })} appearance="subtle">
        	    Cancel
         	 </Button>
        </Modal.Footer>
				</Modal>

				<Modal backdrop='static' size='md' show={this.state.projectModal} onHide={() => this.setState({ projectModal: false })}>
				<p>
					Name		
				</p> 
					<textarea value={this.state.projName} style={textStyle} onChange={(event)=> this.setState({ projName: event.target.value })}></textarea>	
				<p>
					Description		
				</p> 
				<textarea rows='4' value={this.state.projDescription} style={textStyle} onChange={(event)=> this.setState({projDescription: event.target.value})}></textarea>	
				<p>
					Image
				</p>
				<textarea value={this.state.image} style={textStyle} onChange={(event)=> this.setState({ image: event.target.value })}></textarea>	
				<p>
					Progress
				</p>
				<InputNumber value={this.state.progress} onChange={(event)=> this.setState({progress: event})}></InputNumber>
				<p>
					Players
				</p>
					<TagPicker groupBy="tag" data={this.props.characters} labelKey='characterName' valueKey='characterName' block onChange={(event)=> this.setState({ players: event })}></TagPicker>
					<Modal.Footer>
        	  <Button onClick={() => this.newProject()} appearance="primary">
        	    Submit
        	  </Button>
        	  <Button onClick={() => this.setState({ projectModal: false })} appearance="subtle">
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
			
				<Modal size='sm' show={this.state.assModal} onHide={() => this.setState({ assModal: false })}>
					<SelectPicker block placeholder="Edit or Delete Asset/Trait" onChange={(event) => this.handleChage(event)} data={this.props.assets.filter(el => el.model !== 'Wealth')} valueKey='_id' labelKey='name'></SelectPicker>
						{this.renderAss()}
						<Modal.Footer>
							{this.state.selected && 
							<ButtonGroup>
								<Button loading={this.state.loading}  onClick={() => this.assetModify()} color="blue">Edit</Button>
								<Button loading={this.state.loading}  onClick={() => this.handleDelete()} color="red">Delete</Button>								
							</ButtonGroup>}
						</Modal.Footer>
				</Modal>
			</Content>
		 );
	}

	handleDate = (value) => {
		this.setState({ endTime: value })
	}

	handleChage = (event) => {
		if (event) {
			const selected = this.props.assets.find(el => el._id === event);
			this.setState({ selected: event, name: selected.name, description: selected.description, uses: selected.uses })			
		}
		else this.setState({ selected: '', name: '', description: '', uses: 0 })			
	}

	assetModify = async () => {
		this.setState({ loading: true });
		const data = {
			id: this.state.selected,
			name: this.state.name,
			description: this.state.description,
			uses: this.state.uses
		}
		try{
			await axios.patch(`${gameServer}api/assets/modify`, { data });
			Alert.success('Asset Modification Submitted');
			this.setState({ assModal: false, selected: null });
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}	
		this.setState({ loading: false });
	}

	renderAss = () => {
		if (this.state.selected) {
			return (
				<Panel>
					Name:
					<textarea value={this.state.name} style={textStyle} onChange={(event)=> this.setState({ name: event.target.value })}></textarea>	
					Description:
					<textarea rows='4' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>	
					Uses: <InputNumber value={this.state.uses} onChange={(event)=> this.setState({uses: event})}></InputNumber>
				</Panel>			
			)			
		}
		else {
			return (
				<Placeholder.Paragraph rows={5} >Awaiting Selection</Placeholder.Paragraph>
			)
		}
	}

	handleDelete = async () => {
		try{
			await axios.delete(`${gameServer}api/assets/${this.state.selected}`);
			Alert.success('Asset Successfully Deleted');
			this.setState({ assModal: false, selected: null });
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}	
	}

	handleSubmit = async () => {
		try{
			const data = {
				round: this.state.formValue.round,
				status: this.state.formValue.status,
				endTime: this.state.endTime
			}
			await axios.patch(`${gameServer}api/gamestate/modify`, { data });
			Alert.success('Gamestate Modify Submitted');
			this.setState({ gsModal: false });
		}
		catch (err) {
      			Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}	
	}

	closeDraft = async () => {
		try{
			await axios.patch(`${gameServer}api/gamestate/closeRound`);
			Alert.success('The Game is now in Resolution Phase');
			this.setState({ warningModal: false });
		}
		catch (err) {
      			Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}		
	}

	publishActions = async () => {
		try{
			await axios.patch(`${gameServer}api/gamestate/nextRound`);
			Alert.success('Actions Have been Published!');
			this.setState({ warning2Modal: false });
		}
		catch (err) {
      			Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}		
	}

	newProject = async () => {
		const data = {
			description: this.state.projName,
			intent: this.state.projDescription,
			effort: 0,
			progress: this.state.progress,
			model: "Project",
			players: this.state.players,
			creator: this.props.playerCharacter,
			round: this.props.gamestate.round, 
			image: this.state.image
		}
		try{
			await axios.post(`${gameServer}api/actions/project`, { data: data });
			Alert.success('Project Created');
			this.setState({ projectModal: false });
		}
		catch (err) {
      			Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}		
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

const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	assets: state.assets.list,
	login: state.auth.login,
	gamestate: state.gamestate,
	characters: state.characters.list,
	actions: state.actions.list
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ControlTerminal);
