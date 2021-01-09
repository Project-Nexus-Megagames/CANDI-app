import axios from 'axios';
import React, { Component } from 'react';
import { Modal, Button, Slider, Alert, InputPicker, FlexboxGrid, InputNumber } from 'rsuite';
import { gameServer } from '../config';
class NewAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
        effort: 1,
				asset1: '',
				asset2: '',
				asset3: '',
				id: '',
        description: '',
				intent: '',	
				loading: false	
		};
	}
	
	handleSubmit = async () => {
		this.setState({ loading: true });
		// 1) make a new action
		const action = {
			effort: this.state.effort,
			asset1: this.state.asset1,
			asset2: this.state.asset2,
			asset3: this.state.asset3,
			description: this.state.description,
			intent: this.state.intent,
			creator: this.props.playerCharacter._id,
			round: this.props.gamestate.round
		}
		try{
			await axios.post(`${gameServer}api/actions`, { data: action });
			Alert.success('Action Successfully Created');
			this.setState({effort: 1, asset1: '', asset2: '', asset3: '', description: '', intent: '', loading: false})
			this.props.closeNew()
		}
		catch (err) {
			Alert.error(`Error: ${err.response.data}`, 5000);
			this.setState({ loading: false });
		}
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
					<form>
						<FlexboxGrid> Description
							<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>							
						</FlexboxGrid>
						<br></br>
						<FlexboxGrid> What you would like to happen
							<textarea rows='6' value={this.state.intent} style={textStyle} onChange={(event)=> this.setState({intent: event.target.value})} ></textarea>							
						</FlexboxGrid>
						<FlexboxGrid>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>Effort
								<Slider graduated
								min={0}
								max={3}
								defaultValue={1}
								progress
								value={this.state.effort}
								onChange={(event)=> this.setState({effort: event})}>
								</Slider>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={2}>
								<InputNumber value={this.state.effort} max={3} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '5px', paddingLeft: '10px', textAlign: 'left'}}  colspan={10}> Assets/Effort
								<InputPicker placeholder="Slot 1" labelKey='name' valueKey='name' data={this.props.assets} style={{ width: '100%' }} onChange={(event)=> this.setState({asset1: event})}/>
								<InputPicker placeholder="Slot 2" labelKey='name' valueKey='name' data={this.props.assets} style={{ width: '100%' }} onChange={(event)=> this.setState({asset2: event})}/>
								<InputPicker placeholder="Slot 3" labelKey='name' valueKey='name' data={this.props.assets} style={{ width: '100%' }} onChange={(event)=> this.setState({asset3: event})}/>
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
          <Button onClick={() => this.handleSubmit()} loading={this.state.loading} disabled={this.isDisabled()} appearance="primary">
            Submit
          </Button>
          <Button onClick={() => this.props.closeNew()} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
			</Modal>
		 );
	}

	isDisabled () {
		 if (this.state.description.length > 10 && this.state.intent.length > 10 && this.state.effort > 0) return false;
		 else return true;
	}

}

const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}

export default NewAction;