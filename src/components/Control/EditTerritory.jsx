import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button, InputNumber, SelectPicker } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

class EditTerritory extends Component {
	state = { 
		formValue: {
			name: '',
			description: '',
			borough: '',
			currentOwner: '',
			influence: 0,
			id: ''		
		},
		selected: false,
		loading: false
	}
		
	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('locationRequest', 'modify', this.state.formValue ); // new Socket event
		this.props.closeModal()
		this.setState({ loading: false });		
	}

	handleSelect = (code) => {
		console.log(code)
		const selected = this.props.locations.find(el => el.code === code);
		console.log(selected)
		const formValue = {
			name: selected.name,
			description: selected.description,
			borough: selected.borough,
			currentOwner: selected.currentOwner,
			influence: selected.influence,
			id: selected._id
		}
		this.setState({ selected: true, formValue });
	}

	render() { 
		return ( 
			<Modal
			overflow
			full
			size='lg'  
			show={this.props.show} 
			onHide={() => this.props.closeModal()}>
				<Modal.Header>
					<Modal.Title>Modify Character "{this.state.formValue.characterName}"</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{!this.state.selected && 
						<SelectPicker placeholder="Select a Territory" onChange={(event) => this.handleSelect(event)} block valueKey='code' labelKey='code' data={this.props.locations}/>					
					}
					{this.state.selected && <Form layout="vertical" formValue={this.state.formValue}  onChange={formValue => {this.setState({ formValue }); }}>

					<FormGroup>
						<ControlLabel>Name</ControlLabel>
						<FormControl name="name" />
					</FormGroup>
					<FormGroup>
						<ControlLabel>description</ControlLabel>
						<FormControl name="description" />
					</FormGroup>
					<FormGroup>
						<ControlLabel>currentOwner</ControlLabel>
						<FormControl name="currentOwner" />
					</FormGroup>

					</Form>}
				</Modal.Body>
				<Modal.Footer>
        <Button loading={this.state.loading} disabled={(this.state.formValue.status === null)} onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => this.props.closeModal()} appearance="subtle">
            Cancel
        </Button>
        </Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => ({
	locations: state.locations.list,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditTerritory);