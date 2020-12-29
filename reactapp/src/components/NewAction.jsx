import axios from 'axios';
import React, { Component } from 'react';
import { Modal, Form, FormGroup, ControlLabel, FormControl, Button, Slider, Alert } from 'rsuite';
import { gameServer } from '../config';

class NewAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {
        desc: '',
        intent: '',
        effort: 0,
        approach: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
	handleSubmit = async () => {
		// 1) make a new action
		try{

			await axios.post(`${gameServer}api/actions`, {description: this.state.formValue.desc, intent: this.state.formValue.intent, effort: this.state.formValue.effort, approach: this.state.formValue.approach })
			
			this.props.closeNew()
		}
		catch (err) {
			Alert.error(`Error: ${err.body} ${err.message}`, 5000)
		}
	}

	handleChange(value) {
    this.setState({
      formValue: value
    });
	}
	
	render() { 
		return ( 
			<Modal overflow
			full
			size='lg'  
			show={this.props.show} 
			onHide={() => this.props.closeNew()}>
				<Modal.Header>
					<Modal.Title>Submit a new action</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form fluid formValue={this.state.formValue} onChange={this.handleChange} > 
						<FormGroup>
							<ControlLabel>Action Description</ControlLabel>
							<FormControl name="desc" componentClass="textarea" rows={5}/>
						</FormGroup>
						<FormGroup>
							<ControlLabel>What you want to happen...</ControlLabel>
							<FormControl name="intent" componentClass="textarea" rows={5}/>
						</FormGroup>
						<FormGroup>
					    <ControlLabel>Effort</ControlLabel>
					    <FormControl
					      accepter={Slider}
					      min={0}
								max={3}
								defaultValue={1}
					      name="effort"
					      progress
								style={{ width: 200, margin: '10px ' }}
					    />
					  </FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button onClick={() => this.handleSubmit()} appearance="primary">
            Submit
          </Button>
          <Button onClick={() => this.props.closeNew()} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
			</Modal>
		 );
	}
}
 
export default NewAction;