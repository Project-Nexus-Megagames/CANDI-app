import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Slider, InputPicker, FlexboxGrid, InputNumber, CheckPicker, Loader } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
class NewAction extends Component {
	constructor(props) {
    super(props);
    this.state = {
        effort: 0,
				assets: [],
				id: '',
        description: '',
				intent: '',	
		};
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('newActionState'));
		// console.dir(stateReplace);
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('newActionState', JSON.stringify(this.state));
			// console.log(localStorage);
		};
		if (this.props.actions !== prevProps.actions) {
			if (this.props.actions.some(el => el.description === this.state.description)) { // checking to see if the new action got added into the action list, so we can move on with our lives
				this.props.closeNew();
				this.setState({
					effort: 0,
					assets: [],
					id: '',
					description: '',
					intent: '',	
				});
			}
		}

	}
	
	handleSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const action = {
			submission: {
				effort: 1,
				assets: this.state.assets, //this.state.asset1._id, this.state.asset2._id, this.state.asset3._id
				description: this.state.description,
				intent: this.state.intent,			
				round: this.props.gamestate.round	
			},
			controllers: ['Test2'],
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
					{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}
					<form>
						<FlexboxGrid> Description
							<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>							
						</FlexboxGrid>
						<br></br>
						<FlexboxGrid> What you would like to happen
							<textarea rows='6' value={this.state.intent} style={textStyle} onChange={(event)=> this.setState({intent: event.target.value})} ></textarea>							
						</FlexboxGrid>
						<FlexboxGrid>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>
								{/* <Slider graduated
								min={0}
								max={this.props.myCharacter.effort}
								defaultValue={0}
								progress
								value={this.state.effort}
								onChange={(event)=> this.setState({effort: event})}>
								</Slider> */}
								<div style={{ paddingTop: '20px', fontSize: '2em', }} >
									Current Actions Left: {this.props.myCharacter.effort}		
								</div>

							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={2}>
								{/* <InputNumber value={this.state.effort} max={this.props.myCharacter.effort} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								 */}
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '5px', paddingLeft: '10px', textAlign: 'left'}}  colspan={10}> Resources	
								<CheckPicker labelKey='name' valueKey='_id' data={this.props.getMyAssets} style={{ width: '100%' }} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({ assets: event })}/>
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()}  disabled={this.isDisabled()} color={this.isDisabled() ? 'red' : 'green'} appearance="primary">
            {this.state.description.length < 11 ? <b>Description text needs {11 - this.state.description.length} more characters</b> :
						this.state.intent.length < 11 ? <b>Intent text need {11 - this.state.intent.length} more characters</b> :
						this.props.myCharacter.effort <= 0 ? <b>No more Actions left</b> :
						<b>Submit</b>}
    	    </Button>
					<Button onClick={() => this.props.closeNew()} appearance="subtle">
            Cancel
       		</Button>
        </Modal.Footer>
			</Modal>
		);
	}

	isDisabled () {
		if (this.state.description.length > 10 && this.state.intent.length > 10) return false;
		else return true;
	}

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name)
		}
		return assets;
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
	actionLoading: state.actions.loading,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAction);
