import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button, InputNumber, Input } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

class ModifyCharacter extends Component {
	constructor(props) {
    super(props)
    this.state = {
		formValue: { ...this.props.selected },
		formArray: [],
    }
	this.handleInput = this.handleInput.bind(this);
	}

	componentDidMount = () => {	
		let test = [];
		for (const el in this.props.selected) {
			// console.log(el)
			test.push(el);
		}
		this.setState({ formValue: this.props.selected, formArray: test });	
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.selected !== prevProps.selected) {
			this.setState({ formValue: this.props.selected });		
		}
	}

	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('characterRequest', 'modify', this.state.formValue ); // new Socket event
		this.props.closeModal()
		this.setState({ loading: false });		
	}

  handleInput = (value, id) => {
    if (id === '_id') {
			console.log('id!!!!')
    }
		else {
			let formValue = { ...this.state.formValue };
			formValue[id] = value;
			// if (id === 'location' && value === null) formValue['location'] =  { _id:'' }
			this.setState({ formValue });			
		}

  };

	renderSwitch = (el) => {
		let formValue = this.state.formValue;
		switch(typeof formValue[el]) {
			case 'string':
				return(
					<div>
						<h5>{el}</h5>
						<Input
							id={el}
							disabled={el === '_id'}
							type="text"
							value={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={value => this.handleInput(value, el)}
						/>						
					</div>
				)
				case 'number':
					return(
					<div>
						<h5>{el}</h5>
						<InputNumber
							id={el}
							value={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={value => this.handleInput(value, el)}
						/>
					</div>
					)
			default:
				return(<b>{formValue[el]}</b>)	
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
						{this.state.formArray.map((el, index) => (
								this.renderSwitch(el)
							))}
						{/* <FormGroup>
							<ControlLabel>Bio</ControlLabel>
							<FormControl style={{width: '100%', display: 'block' }} name="bio" rows={5} componentClass="textarea"/>
						</FormGroup> */}
				</Modal.Body>
				<Modal.Footer>
        <Button loading={this.state.loading} disabled={(this.state.formValue.status === null)} onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => {
				this.props.closeModal();
				// localStorage.removeItem('modifyCharacterState');
			}} appearance="subtle">
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

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCharacter);