import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button, InputNumber, Alert, SelectPicker } from 'rsuite';
import axios from 'axios';
import { gameServer } from '../config';

class ModifyCharacter extends Component {
	state = { 
		formValue: {
			characterName: '',
			email: '',
			worldAnvil: '',
			tag: '',
			playerName: '',
			timeZone: '',
			bio: '',
			wealth: {},
			icon: '',
			popSupport: 0,
			_id: ''		
		}

	 }
		
	 componentDidMount = () => {
		 const char = this.props.character;
		 // console.log(this.props.character)
		 const formValue = {
				characterName: char.characterName,
				email: char.email,
				worldAnvil: char.worldAnvil,
				tag: char.tag,
				timeZone: char.timeZone,
				playerName: char.playerName,
				bio: char.bio,
				// wealth: this.props.character.wealth.level,
				icon: char.icon,
				popSupport: char.popSupport,
				id: char._id
		 }
		 this.setState({ formValue });
	 }

	 handleSubmit = async () => {
		// 1) make a new action
		try{
			await axios.patch(`${gameServer}api/characters/modify`, { data: this.state.formValue });
			Alert.success('Character Successfully Modify');
			this.props.closeModal()
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}
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
								<FormControl name="wealth" accepter={SelectPicker} data={pickerData} />
							</FormGroup>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
								<FormGroup>
									<ControlLabel>icon</ControlLabel>
									<FormControl name="icon" />
							</FormGroup>
							<FormGroup>
									<ControlLabel>popsupport</ControlLabel>
									<FormControl name="popSupport" accepter={InputNumber} />
							</FormGroup>
							</FlexboxGrid.Item>

						</FlexboxGrid>
						<FormGroup>
								<ControlLabel>Bio</ControlLabel>
								<FormControl style={{width: '100%'}} name="bio" rows={5} componentClass="textarea"/>
							</FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button onClick={() => this.handleSubmit()} appearance="primary">
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

export default ModifyCharacter;