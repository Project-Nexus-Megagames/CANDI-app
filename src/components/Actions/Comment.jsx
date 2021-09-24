import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Modal, Button, ButtonToolbar, ButtonGroup, FlexboxGrid, IconButton, Icon, Loader, Panel } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket'; 
import NewComment from './NewComment';
class Comment extends Component {
	constructor(props) {
    super(props);
    this.state = {
			commentEdit: false, // used to open edit action popup
			description: '',
			deleteWarning: false, // used to open delete action popup
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

	handleDelete = async () => {
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			comment: this.props.comment._id
		}
		socket.emit('actionRequest', 'deleteSubObject', data); // new Socket event	
		this.setState({ deleteWarning: false });
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
								<IconButton onClick={() => this.setState({ commentEdit: true })} color='blue' icon={<Icon icon="pencil" />} />
								<IconButton onClick={() => this.setState({ deleteWarning: true })} color='red' icon={<Icon icon="trash2" />} />
							</ButtonGroup>							
						</ButtonToolbar>
					</FlexboxGrid.Item>
				</FlexboxGrid>
				
				<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
					<p>{this.props.comment.body}</p>
				</Panel>	

			<Modal backdrop="static" size='sm' show={this.state.deleteWarning} onHide={() => this.setState({ deleteWarning: false })}>
				<Modal.Body>
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
						{'  '}
						Warning! Are you sure you want delete your Comment?
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
				</Modal.Body>
				<Modal.Footer>
           <Button onClick={() => this.handleDelete()} appearance="primary">
						I am Sure!
           </Button>
           <Button onClick={() => this.setState({ deleteWarning: false })} appearance="subtle">
						Nevermind
           </Button>
				</Modal.Footer>
			</Modal>	

			<NewComment 
				show={this.state.commentEdit}
				closeNew={() => this.setState({ commentEdit: false })}
				gamestate={this.props.gamestate}
				comment={this.props.comment}
				selected={this.props.selected}/>
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
