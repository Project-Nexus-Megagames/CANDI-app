import React, { Component } from 'react';
import { Modal, Form, FormGroup, ControlLabel, FormControl, Button, Slider } from 'rsuite';

class NewAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {
        desc: '',
        intent: '',
        effort: 0,
        textarea: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
	handleSubmit = async (blueprint) => {
		// 1) make a new upgrade from blueprint
		try{
			//await axios.put(`${gameServer}game/upgrades/add`, {upgrade: this.state.selected._id, unit: this.props.unit._id })
			
			//this.props.closeUpgrade()
		}
		catch (err) {
			//Alert.error(`Error: ${err.body} ${err.message}`, 5000)
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
					          min={1}
					          max={3}
					          name="effort"
					          progress
					          style={{   }}
					        />
					      </FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button onClick={() => this.props.closeNew()} appearance="primary">
            Confirm
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