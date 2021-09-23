import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Slider, InputPicker, FlexboxGrid, InputNumber, CheckPicker, Loader } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket'; 
class NewComment extends Component {
	constructor(props) {
    super(props);
    this.state = {
			description: '',
			hidden: true,
		};
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('NewComment'));
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('NewComment', JSON.stringify(this.state));
			console.log(localStorage);
		};
		if (this.props.actions !== prevProps.actions) {
			if (this.props.actions.some(el => el.description === this.state.description)) { // checking to see if the new action got added into the action list, so we can move on with our lives
				this.props.closeNew();
				this.setState({
					description: '',
				});
			}
		}
	}
	
	handleSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			comment: {
				body: this.state.description,
				status: 'Public',
				commentor: this.props.myCharacter.characterName
			},
			round: this.props.gamestate.round
		}
		socket.emit('actionRequest', 'comment', data); // new Socket event	
	}
	
	render() { 
		return ( 
			<Modal overflow
			full
			size='lg'  
			show={this.props.show} 
			onHide={() => this.props.closeNew()}>
				<Modal.Header>
					<Modal.Title>Submit a new Comment</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}
					<form>
						<FlexboxGrid>
						<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>

						</FlexboxGrid.Item>
						Description
						<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={18}>
							<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>	
						</FlexboxGrid.Item>
						
						</FlexboxGrid>
						<br></br>

						<FlexboxGrid>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>

							</FlexboxGrid.Item>
						</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()}  disabled={this.isDisabled()} appearance="primary">
            {this.state.description.length < 11 ? <b>Description text needs {11 - this.state.description.length} more characters</b> :
		
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
		if (this.state.description.length > 10) return false;
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
	updateCharacter: (data) => dispatch(characterUpdated(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComment);
