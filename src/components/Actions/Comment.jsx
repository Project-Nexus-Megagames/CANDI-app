import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Modal, Button, ButtonToolbar, ButtonGroup, FlexboxGrid, IconButton, Icon, Loader, Panel } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket'; 
class Comment extends Component {
	constructor(props) {
    super(props);
    this.state = {
			description: '',
			hidden: true,
		};
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('EditComment'));
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('EditComment', JSON.stringify(this.state));
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

	getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (<b>{day} - {time}</b>)
	}

	
	render() { 
		return ( 

			<div style={{ 	border: '3px solid #00a0bd', borderRadius: '5px' }} >
				<FlexboxGrid  style={{ backgroundColor: '#0f8095' }} align='middle' justify="start">
					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							<Avatar circle size="md" src={`/images/${this.props.comment.commentor}.jpg`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>{this.props.comment.commentor}'s Comment</h5>
						<p style={slimText}>{this.getTime(this.props.comment.createdAt)}</p>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={4}>
						<ButtonToolbar>
							<ButtonGroup>
								<IconButton color='blue' icon={<Icon icon="pencil" />} />
								<IconButton color='red' icon={<Icon icon="trash2" />} />
							</ButtonGroup>							
						</ButtonToolbar>
					</FlexboxGrid.Item>
				</FlexboxGrid>
				
				<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
					<p>{this.props.comment.body}</p>
				</Panel>	

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
			</div>



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

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: 'nowrap',
	textAlign: "center"
};


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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
