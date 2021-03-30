import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button, InputNumber, Alert, InputPicker } from 'rsuite';
import axios from 'axios';
import { gameServer } from '../../config';
import { connect } from 'react-redux';
import socket from '../../socket';

class ModifyCharacter extends Component {
	state = { 
		formValue: {
			characterName: '',
			email: '',
			worldAnvil: '',
			tag: '', 
			control: '',
			playerName: '',
			timeZone: '',
			bio: '',
			wealth: '',
			icon: '',
			popSupport: 0,
			effort: 0,
			uses: 0,
			_id: ''		
		},
		loading: false
	 }
		
	 componentDidMount = () => {
		 const char = this.props.characters.find(el => el._id === this.props.selected._id);
		 console.log(char)
		 if (char !== undefined) {
			const formValue = {
					characterName: char.characterName,
					email: char.email,
					worldAnvil: char.worldAnvil,
					tag: char.tag,
					control: char.control,
					timeZone: char.timeZone,
					playerName: char.playerName,
					bio: char.bio,
					wealth: char.wealth.description,
					uses: char.wealth.uses,
					icon: char.icon,
					popSupport: char.popSupport,
					effort: char.effort,
					id: char._id
			}
			this.setState({ formValue });			 
		 }
	 }

	 componentDidUpdate = (prevProps) => {
		if (this.props.character !== prevProps.character) {
			const char = this.props.character;
			const formValue = {
				characterName: char.characterName,
				email: char.email,
				worldAnvil: char.worldAnvil,
				tag: char.tag,
				timeZone: char.timeZone,
				playerName: char.playerName,
				bio: char.bio,
				uses: this.props.character.wealth.uses,
				wealth: this.props.character.wealth.description,
				icon: char.icon,
				popSupport: char.popSupport,
				id: char._id
		}
		this.setState({ formValue });		
		}
	 }

	 handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('actionRequest', 'modify', { data: this.state.formValue }); // new Socket event
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
					<Modal.Title>Modify Character "{this.state.formValue.characterName}"</Modal.Title>
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
								<ControlLabel>timeZone</ControlLabel>
								<FormControl name="timeZone" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>wealth</ControlLabel>
								<FormControl name="wealth" accepter={InputPicker} data={pickerData} />
							</FormGroup>
							<FormGroup>
								<ControlLabel>wealth uses</ControlLabel>
								<FormControl name="uses" accepter={InputNumber} />
							</FormGroup>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
							<FormGroup>
									<ControlLabel>popsupport</ControlLabel>
									<FormControl name="popSupport" accepter={InputNumber} />
							</FormGroup>
							<FormGroup>
									<ControlLabel>effort</ControlLabel>
									<FormControl name="effort" accepter={InputNumber} />
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
 
const pickerData = [
	{
		label: 'Poor',
		value: 'Poor'
	},
	{
		label: 'Laborer',
		value: 'Laborer'
	},
	{
		label: 'Comfortable',
		value: 'Comfortable'
	},
	{
		label: 'Affluent',
		value: 'Affluent'
	},
	{
		label: 'Luxury',
		value: 'Luxury'
	}
]

const mapStateToProps = (state) => ({
	characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCharacter);