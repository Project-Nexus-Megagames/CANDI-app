import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, IconButton, Drawer, Button, InputNumber, Input, Toggle } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

const diabled = ['_id', '__v', 'model', 'type'];
class DynamicForm extends Component {
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
			typeof this.props.selected[el] !== 'object' ? test.push(el) : console.log(el);
		}
		test.sort((a, b) => { // sort the catagories alphabetically 
			if(a < b) { return -1; }
			if(a > b) { return 1; }
			return 0;
		});
		this.setState({ formValue: this.props.selected, formArray: test });	
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.selected !== prevProps.selected) {
			let test = [];
			for (const el in this.props.selected) {
				typeof this.props.selected[el] !== 'object' ? test.push(el) : console.log(el);
			}
			test.sort((a, b) => { // sort the catagories alphabetically 
				if(a < b) { return -1; }
				if(a > b) { return 1; }
				return 0;
			});
			this.setState({ formValue: this.props.selected, formArray: test });	
		}
	}

	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('assetRequest', 'modify', this.state.formValue ); // new Socket event
		this.props.closeDrawer()
		this.setState({ loading: false });		
	}

  handleInput = (value, id) => {
    if (id === '_id') {
			console.log('id!!!!')
    }
		else if (typeof value === 'boolean') {
			let formValue = { ...this.state.formValue };
			let status = { ...this.state.formValue.status };
			status[id] = value;
			formValue.status = status;
			this.setState({ formValue });		
    }
		else {
			let formValue = { ...this.state.formValue };
			formValue[id] = value;
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
							disabled={diabled.some(dis => dis === el)}
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
							disabled={diabled.some(dis => dis === el)}
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

// onChange={()=> this.setState({ private: !this.state.private })} 
	render() { 
		if (this.props.selected)
		return ( 
			<Drawer
			overflow
			size='sm'  
			show={this.props.show} 
			onHide={() => this.props.closeDrawer()}>
				<Drawer.Header>
				</Drawer.Header>
				<Drawer.Body>
						{this.state.formArray.map((el, index) => (
								this.renderSwitch(el)
							))}			

					{/* This is not Dynamic I stand in a house made of lies */}
					{Object.keys(this.props.selected.status).map((keyName, i) => (
						<div>
   						<li key={i}>
   						    <span>{keyName}</span>
   						</li>
							<Toggle onChange={value => this.handleInput(value, keyName)} defaultChecked={this.props.selected.status[keyName]} checkedChildren="True" unCheckedChildren="False" />
						</div>
					))}			
				</Drawer.Body>
				<Drawer.Footer>
        <Button  onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => {
				this.props.closeDrawer();
				// localStorage.removeItem('DynamicFormState');
			}} appearance="subtle">
            Cancel
        </Button>
        </Drawer.Footer>
			</Drawer>
		);
		else return (
			<div></div>
		)
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

export default connect(mapStateToProps, mapDispatchToProps)(DynamicForm);