import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button,  Toggle, InputNumber, InputPicker } from 'rsuite';
import socket from '../../socket';

class AddAsset extends Component {
	state = { 
		formValue: {
			name: '',
			description: '',
			uses: 0,
			level: '',
			dice: 'd6',
			type: this.props.god ? 'GodBond' : ''	
		},
		hidden: true,
		id: '',
		loading: false
	}
		
	componentDidMount = () => {
		const char = this.props.character;
		this.setState({ id: char._id });

		if (this.props.god) {
			console.log('geee wizz')
			let formValue = {...this.state.formValue}
			formValue.type = 'Wealth';
			this.setState({formValue});
			console.log(this.state.formValue)
		}

		const stateReplace = JSON.parse(localStorage.getItem('addAssetState'));
		if (stateReplace) this.setState(stateReplace); 
	}
	
	componentDidUpdate(prevProps, prevState) {
		if (this.state !== prevState) {
			localStorage.setItem('addAssetState', JSON.stringify(this.state));
		};
		// Typical usage (don't forget to compare props):
		if (this.props !== prevProps) {
			this.setState({ id: this.props.character._id });
		}
	}

	handleSubmit = async () => {
		this.setState({ loading: true });
		// 1) make a new asset
		const formValue = {
			asset: {
				name: this.state.formValue.name,
				with: this.props.god ? this.props.god._id : '',
				description: this.state.formValue.description,	
				type: this.state.formValue.type,
				uses: this.state.formValue.uses,
				level: this.state.formValue.level,
				owner: this.props.character.characterName,
				ownerCharacter: this.props.character._id,
				status: {
					hidden: this.state.hidden							
				}
			},
			id: this.props.character._id, 
	 }
	 socket.emit('assetRequest', 'create', formValue); // new Socket event	
	 this.setState({ loading: false, formValue: { name: '', description: '', type: '' }, hidden: true });
	 this.props.closeModal();
	 }

	render() { 
		return ( 
			<Modal
			overflow
			size='md'  
			show={this.props.show} 
			onHide={() => this.props.closeModal()}>
				<Modal.Header>
					<Modal.Title>Create new Asset/Trait</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form layout="center" formValue={this.state.formValue}  onChange={formValue => {this.setState({ formValue }); }}>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={12}>
								<FormGroup>
									<ControlLabel>Asset Name </ControlLabel>
									<FormControl name="name" componentClass="textarea"/>
							</FormGroup>
							<FormGroup>
									<ControlLabel>Dice</ControlLabel>
									<FormControl name="dice" componentClass="textarea"/>
								</FormGroup>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={6}>
								<FormGroup>
									<ControlLabel>Hidden/Revealed</ControlLabel>
									<FormControl accepter={this.myToggle}/>
								</FormGroup>

								{this.state.formValue.type === 'GodBond' && this.props.god && <FormGroup>
									<ControlLabel>Bond Level with {this.props.god.characterName}</ControlLabel>
									<FormControl name="level" data={godPickerData} accepter={InputPicker} />
								</FormGroup>}
								{this.state.formValue.type === 'MortalBond' && this.props.god && <FormGroup>
									<ControlLabel>Bond Level with {this.props.god.characterName}</ControlLabel>
									<FormControl name="level" data={mortalPickerData} accepter={InputPicker} />
								</FormGroup>}
							</FlexboxGrid.Item>
						</FlexboxGrid>
						<FormGroup>
								<ControlLabel>Asset Description</ControlLabel>
								<FormControl style={{width: '100%'}} name="description" rows={5} componentClass="textarea" />
						</FormGroup>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={12}>
								<FormGroup>
									<ControlLabel>Uses </ControlLabel>
									<FormControl name="uses" accepter={InputNumber} />
								</FormGroup>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={12}>
								<FormGroup>
										<ControlLabel>Trait/Asset </ControlLabel>
										<FormControl name='type'  accepter={InputPicker} data={pickerData}/>
								</FormGroup>
							</FlexboxGrid.Item>
						</FlexboxGrid>

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

	myToggle = () => {
		return (
			<Toggle checked={this.state.hidden} onChange={()=> this.setState({ hidden: !this.state.hidden })} checkedChildren="Hidden" unCheckedChildren="Revealed">
				
			</Toggle>			
		)
	}
	
}

const godPickerData = [
	{
		label: 'Neutral',
		value: 'Neutral',
	},
	{
		label: 'Preferred',
		value: 'Preferred'
	},
	{
		label: 'Favoured',
		value: 'Favoured'
	},
  {
		label: 'Blessed',
		value: 'Blessed'
	},
]

const mortalPickerData = [
	{
		label: 'Neutral',
		value: 'Neutral',
	},
	{
		label: 'Warm',
		value: 'Warm'
	},
	{
		label: 'Friendly',
		value: 'Friendly'
	},
  {
		label: 'Bonded',
		value: 'Bonded'
	},
]

const pickerData = [
	{
		label: 'Asset',
		value: 'Asset'
	},
	{
		label: 'Trait',
		value: 'Trait'
	},
	{
		label: 'Wealth',
		value: 'Wealth'
	},
	{
		label: 'GodBond',
		value: 'GodBond'
	},
	{
		label: 'MortalBond',
		value: 'MortalBond'
	},
	{
		label: 'Territory',
		value: 'Territory'
	},
	{
		label: 'Power',
		value: 'Power'
	}
]
 
export default AddAsset;