import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Slider, Alert, InputPicker, FlexboxGrid, InputNumber, Loader } from 'rsuite';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { actionAdded } from '../../redux/entities/playerActions';
import socket from '../../socket';
class NewAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
        effort: 0,
				asset1: null,
				asset2: null,
				asset3: null,
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
			creator: this.props.myCharacter._id,
			round: this.props.gamestate.round
		}
		socket.emit('actionRequest', 'create', action); // new Socket event	
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
					{this.state.loading && <Loader backdrop content="loading..." vertical />}
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
								max={this.props.myCharacter.effort}
								defaultValue={0}
								progress
								value={this.state.effort}
								onChange={(event)=> this.setState({effort: event})}>
								</Slider>
								<div style={{ paddingTop: '20px', fontSize: '2em', }} >
									Current Effort Left: {this.props.myCharacter.effort}		
								</div>

							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={2}>
								<InputNumber value={this.state.effort} max={this.props.myCharacter.effort} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '5px', paddingLeft: '10px', textAlign: 'left'}}  colspan={10}> Assets/Traits
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
const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
  myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	actionAdded: (data) => dispatch(actionAdded(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAction);
