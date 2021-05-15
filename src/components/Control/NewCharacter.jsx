import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button, InputNumber } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

class NewCharacter extends Component {
	state = { 
		formValue: {
			characterName: '',
			email: '',
			controlEmail: '',
			worldAnvil: '',
			tag: '', 
			control: '',
			playerName: '',
			timeZone: '',
			bio: '',
			color: '',
			characterActualName: '',
			pronouns: '',
			popSupport: 0,
			effort: 0,
			uses: 0,
			username: 'temp'
		},
		loading: false
	}
		

	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('characterRequest', 'create', this.state.formValue ); // new Socket event
		this.props.closeModal()
		this.setState({ loading: false });		
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
					<Modal.Title>New Character "{this.state.formValue.characterName}"</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form layout="vertical" formValue={this.state.formValue}  onChange={formValue => {this.setState({ formValue }); }}>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={8}>
								<FormGroup>
									<ControlLabel>Character Name</ControlLabel>
									<FormControl name="characterName" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>email</ControlLabel>
								<FormControl name="email" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>worldAnvil</ControlLabel>
								<FormControl name="worldAnvil" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>Control</ControlLabel>
								<FormControl name="control" />
							</FormGroup>							
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
								<FormGroup>
									<ControlLabel>tag</ControlLabel>
									<FormControl name="tag" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>controlEmail</ControlLabel>
								<FormControl name="controlEmail" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>timeZone</ControlLabel>
								<FormControl name="timeZone" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>playerName</ControlLabel>
								<FormControl name="playerName" />
							</FormGroup>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
							<FormGroup>
									<ControlLabel>pronouns</ControlLabel>
									<FormControl name="pronouns" />
							</FormGroup>
							<FormGroup>
									<ControlLabel>popsupport</ControlLabel>
									<FormControl name="popSupport" accepter={InputNumber} />
							</FormGroup>
							<FormGroup>
									<ControlLabel>effort</ControlLabel>
									<FormControl name="effort" accepter={InputNumber} />
							</FormGroup>
							<FormGroup>
								<ControlLabel>color (no # plz)</ControlLabel>
								<FormControl name="color" />
							</FormGroup>
							</FlexboxGrid.Item>

						</FlexboxGrid>
						<FormGroup>
								<ControlLabel>Bio</ControlLabel>
								<FormControl style={{width: '100%', display: 'block' }} name="bio" rows={5} componentClass="textarea"/>
							</FormGroup>
					</Form>
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

// const pickerData = [
// 	{
// 		label: 'Poor',
// 		value: 'Poor'
// 	},
// 	{
// 		label: 'Laborer',
// 		value: 'Laborer'
// 	},
// 	{
// 		label: 'Comfortable',
// 		value: 'Comfortable'
// 	},
// 	{
// 		label: 'Affluent',
// 		value: 'Affluent'
// 	},
// 	{
// 		label: 'Luxury',
// 		value: 'Luxury'
// 	}
// ]

const mapStateToProps = (state) => ({
	characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NewCharacter);