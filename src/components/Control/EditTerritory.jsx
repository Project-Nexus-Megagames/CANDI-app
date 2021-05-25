import React, { Component } from 'react';
import { ControlLabel, Form, FormControl, FormGroup, Modal, Button, SelectPicker } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

class EditTerritory extends Component {
	state = { 
		formValue: {
			name: '',
			description: '',
			borough: '',
			influence: 0,
			id: ''		
		},
		currentOwner: '',
		selected: false,
		loading: false
	}

	componentDidMount = () => {
		const stateReplace = JSON.parse(localStorage.getItem('editTerritoryState'));
		console.dir(stateReplace);
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('editTerritoryState', JSON.stringify(this.state));
			console.log(localStorage);
		};
	};
		
	handleSubmit = async () => {
		// 1) make a new action
		const data = {
			name: this.state.formValue.name,
			description: this.state.formValue.description,
			borough: this.state.formValue.borough,
			influence: this.state.formValue.influence,
			id: this.state.formValue.id,
			currentOwner: this.state.currentOwner
		}
		this.setState({ loading: true });			
		socket.emit('locationRequest', 'modify', data ); // new Socket event
		this.props.closeModal()
		this.setState({ loading: false });		
	}

	handleSelect = (code) => {
		const selected = this.props.locations.find(el => el.code === code);
		const formValue = {
			name: selected.name,
			description: selected.description,
			borough: selected.borough,
			influence: selected.influence,
			id: selected._id
		}
		this.setState({ selected: true, formValue, currentOwner: selected.currentOwner, });
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
					<Modal.Title>Modify Territory "{this.state.formValue.characterName}"</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{!this.state.selected && 
						<SelectPicker placeholder="Select a Territory" onChange={(event) => this.handleSelect(event)} block valueKey='code' labelKey='name' data={this.props.locations}/>					
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
					<SelectPicker defaultValue={this.state.currentOwner} onChange={(event) => this.setState({ currentOwner: event })} block valueKey='characterName' labelKey='characterName' data={this.props.characters}/>

					</Form>}
				</Modal.Body>
				<Modal.Footer>
        <Button loading={this.state.loading} disabled={(this.state.formValue.status === null)} onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => this.setState({ selected: false })} appearance="subtle">
            Select A new Territory
        </Button>
        </Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => ({
	locations: state.locations.list,
	characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditTerritory);