import axios from 'axios';
import React, { Component } from 'react';
import { Alert, ButtonGroup, Content, InputNumber, InputPicker, Divider, Panel, Button, Icon, Modal, Form, FormGroup, FormControl, ControlLabel, FlexboxGrid } from 'rsuite';
import { gameServer } from '../../config';

class ControlTerminal extends Component {
	state = { 
		gsModal: false,
		warningModal: false,
		warning2Modal: false,
		formValue: {
			round: null,
			status: '',
			endTime: null
		},
		drafts: 0,
		awaiting: 0,
		ready: 0, 
	 }

	componentDidMount = () => {
		const formValue = {
			round: this.props.gamestate.round, 
			status: this.props.gamestate.status
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

	componentDidUpdate = (prevProps) => {
		if (this.props.gamestate !== prevProps.gamestate || this.props.actions !== prevProps.actions) {
			const formValue = {
				round: this.props.gamestate.round, 
				status: this.props.gamestate.status
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

	}

	
	render() { 
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

				<Divider>Scott's Message of the Day:</Divider>
				<div>
					<h5>Do not touch these buttons unless you are certain of what you are doing.</h5>
				</div>

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
					</Form>
					<Modal.Footer>
        	  <Button onClick={() => this.handleSubmit()} disabled={(this.state.formValue.status === null)} appearance="primary">
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
			
			</Content>
		 );
	}

	handleSubmit = async () => {
		try{
			await axios.patch(`${gameServer}api/gamestate/modify`, { data: this.state.formValue });
			Alert.success('Character Successfully Modify');
			this.setState({ gsModal: false });
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}	
	}

	closeDraft = async () => {
		try{
			await axios.patch(`${gameServer}api/gamestate/closeRound`);
			Alert.success('The Game is now in Resolution Phase');
			this.setState({ warningModal: false });
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}		
	}

	publishActions = async () => {
		try{
			await axios.patch(`${gameServer}api/gamestate/nextRound`);
			Alert.success('Actions Have been Published!');
			this.setState({ warning2Modal: false });
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}		
	}

	isControl () {
		if (this.props.user.roles.some(el => el === "Control")) return false;
		else return true;
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

export default ControlTerminal;