import axios from 'axios';
import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, Panel, FormControl, FlexboxGrid, Content, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker } from 'rsuite';
import { gameServer } from '../config';
import NewAction from './NewAction';
class SelectedAction extends Component {
	state = { 
		edit: null,
		resEdit: null,
		formValue: {
			description: '',
			intent: '',
			effort: 0,
			approach: '',
			id: null
		},
		formValue2: {
			result: '',
			status: '',
			dieResult: 0,
			id: null
		}
	 }

	 closeNew = () => { 
		this.setState({edit: false}) 
	};

	closeResult = () => { 
		this.setState({resEdit: false}) 
	};

	openEdit = () => {
		const action = this.props.action;
		const formValue = {
			description: action.description,
			intent: action.intent,
			effort: action.effort,
			approach: action.approach,
			id: action._id
		}
		this.setState({ formValue, edit: true })
	}

	handleChange = (value) => {
    this.setState({ formValue2: value });
	}

	handleSubmit = async () => {
		const data = this.state.formValue2;
		data.id = this.props.action._id;
		this.setState({resEdit: false}) 
		// 1) make a new action
		try{
			await axios.patch(`${gameServer}api/actions/editResult`, {data: data});
			this.closeResult()
		}
		catch (err) {
			Alert.error(`Error: ${err.body} ${err.message}`, 5000)
		}
	}

	deleteAction = async () => {
		let {data} = await axios.delete(`${gameServer}api/actions/${this.props.action._id}`);
		Alert.success(data);		
		this.props.handleSelect(null)
	}


	render() { 
		const action = this.props.action;
		return ( 
			<Content>
			<FlexboxGrid >
				<FlexboxGrid.Item colspan={4} >
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={12} >
					<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e"}}>
						<p style={slimText}>
							Description
						</p>
						<p>
							{action.description}	
						</p>
						<p style={slimText}>
							Intent
						</p>
						<p>
							{action.intent}	
						</p>
					</Panel>
					{action.status.published &&
						<Panel style={{textAlign: "left", backgroundColor: "#61342e"}}>
							<p style={slimText}>Result</p>
							<p>
							{action.result}	
						</p>
						</Panel>
					}
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={1} />
				<FlexboxGrid.Item colspan={5}>
					<Panel style={{backgroundColor: '#15181e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
						<TagGroup >Status:
							{action.status.draft && <Tag color='red'>Draft</Tag>}
							{!action.status.draft && !action.status.ready && !action.status.published && <Tag color='blue'>Awaiting Resolution</Tag>}
							{action.status.ready && <Tag color='violet'>Ready for Publishing</Tag>}
							{action.status.published && <Tag color='green'>Published</Tag>}
						</TagGroup>
							<ButtonGroup style={{marginTop: '5px', }} >
								<Button appearance={"ghost"} disabled={!action.status.draft} onClick={() => this.openEdit()} >Edit</Button>
								<Button appearance={"ghost"} disabled={!action.status.draft} onClick={() => this.deleteAction()}>Delete</Button>
							</ButtonGroup>
					</Panel>
					<Panel header={"Control Panel"} style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
						<ButtonGroup style={{marginTop: '5px', }} >
							<Button appearance={"ghost"} onClick={() => this.setState({ resEdit: true })}>Edit Result</Button>
						</ButtonGroup>
					</Panel>
				</FlexboxGrid.Item>
			</FlexboxGrid>	
			<NewAction
				show={this.state.edit}
				closeNew={this.closeNew}
				formValue={this.state.formValue}
				// player={this.props.player????}
			/>
			<Modal overflow
			full
			size='lg'  
			show={this.state.resEdit} 
			onHide={() => this.closeResult()}>
				<Modal.Header>
					<Modal.Title>Edit Action Result</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form fluid formValue={this.state.formValue2} onChange={this.handleChange} > 
						<FormGroup>
							<ControlLabel>Result:</ControlLabel>
							<FormControl name="result" componentClass="textarea" rows={5}/>
						</FormGroup>
						<FormGroup>
        			<ControlLabel>Status</ControlLabel>
        				<FormControl
        				  name="status"
        				  accepter={InputPicker}
        				  data={pickerData}
        				/>
    				</FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()} appearance="primary">
						Submit
					</Button>
					<Button onClick={() => this.closeResult()} appearance="subtle">
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</Content>		
		 );
	}
}

const slimText = {
  fontSize: '0.866em',
  color: '#97969B',
	fontWeight: 'lighter',
	whiteSpace: 'nowrap',
	textAlign: "center"
};

const pickerData = [
	{
		label: 'Draft',
		value: 'draft'
	},
	{
		label: 'Awaiting Resolution',
		value: 'awaiting'
	},
	{
		label: 'Ready for Publishing',
		value: 'ready'
	},
	{
		label: 'Published',
		value: 'published'
	}
]
 
export default SelectedAction;