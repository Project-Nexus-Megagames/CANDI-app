import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button,  Alert, Toggle, InputNumber } from 'rsuite';
import axios from 'axios';
import { gameServer } from '../config';

class AddAsset extends Component {
	state = { 
		formValue: {
			name: '',
			description: '',
			uses: 0,
		},
		assetBoolean: null,
		id: '',
		loading: false
	 }
		
	 componentDidMount = () => {
		 const char = this.props.character;
		 this.setState({ id: char._id, assetBoolean: false });
	 }
	 
	 componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.characters !== prevProps.characters) {
			this.setState({ id: this.props.character._id, assetBoolean: false });
		}
	}

	 handleSubmit = async () => {
		this.setState({ loading: true });
		// 1) make a new asset
		const formValue = {
			asset: {
				name: this.state.formValue.name,
				description: this.state.formValue.description,	
				model: this.state.assetBoolean ? 'Asset' : 'Trait',
				uses: this.state.formValue.uses						
			},
			id: this.props.character._id, 
	 }
		try{
			await axios.patch(`${gameServer}api/characters/newAsset`, { data: formValue });
			Alert.success('Character Modify Submitted');
			this.setState({ loading: false, formValue: { name: '', description: '' }, assetBoolean: false });
			this.props.closeModal()
		}
		catch (err) {
			Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
			this.setState({ loading: false });
		}
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
									<FormControl name="name" />
							</FormGroup>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={6}>
								<FormGroup>
									<ControlLabel>Trait/Asset </ControlLabel>
									<FormControl accepter={this.myToggle} name='asset' />
							</FormGroup>
							</FlexboxGrid.Item>
						</FlexboxGrid>
						<FormGroup>
								<ControlLabel>Asset Description</ControlLabel>
								<FormControl style={{width: '100%'}} name="description" rows={5} componentClass="textarea" />
						</FormGroup>
						<FormGroup>
							<ControlLabel>Uses </ControlLabel>
							<FormControl name="uses" accepter={InputNumber} />
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

	myToggle = () => {
		return (
			<Toggle onChange={()=> this.setState({ assetBoolean: !this.state.assetBoolean })} checkedChildren="Asset" unCheckedChildren="Trait">
				
			</Toggle>			
		)

	}
}
 
export default AddAsset;