import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Modal, Button, ButtonToolbar, ButtonGroup, FlexboxGrid, IconButton, Icon, Toggle, Panel, Divider } from 'rsuite';
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
			body: this.props.comment.body,
			deleteWarning: false, // used to open delete action popup
			private: true,
		};
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('EditCommentGW'));
		if (stateReplace) this.setState(stateReplace); 
		this.setState({
			body: this.props.comment.body,
		});
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('EditCommentGW', JSON.stringify(this.state));
		};
		if (this.props.actions !== prevProps.actions) {
			if (this.props.actions.some(el => el.body === this.state.body)) { // checking to see if the new action got added into the action list, so we can move on with our lives
				this.props.closeNew();
				this.setState({
					body: this.props.comment.body,
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
				body: this.state.body,
				status: this.state.private ? 'Private' : 'Public',
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

	handleEditSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			comment: {
				body: this.state.body,
				status: this.state.private ? 'Private' : 'Public',
				_id: this.props.comment._id
			},
		}
		socket.emit('actionRequest', 'updateSubObject', data); // new Socket event	
		this.setState({ commentEdit: false });
	}
	
	render() { 
		return ( 
			<div>
				{(this.props.myCharacter.tags.some(el => el === 'Control') || this.props.comment.status === 'Public') && <div>
				<Divider vertical/>	
					<div style={{	border: '3px solid #00a0bd', borderRadius: '5px' }}>
						<FlexboxGrid  style={this.props.comment.status === 'Private' ? privateComm : publicComm} align='middle' justify="start">
							<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
									<Avatar circle size="md" src={`/images/${this.props.comment.commentor}.jpg`} alt="?" style={{ maxHeight: '50vh' }} />
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={15}>
								<h5>{this.props.comment.commentor}'s {this.props.comment.status} Comment</h5>
								<p style={slimText}>{this.getTime(this.props.comment.createdAt)}</p>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={4}>
								{this.props.myCharacter.characterName === this.props.comment.commentor && <ButtonToolbar>
									<ButtonGroup>
										<IconButton size='xs' onClick={() => this.setState({ commentEdit: true })} color='blue' icon={<Icon icon="pencil" />} />
										<IconButton size='xs' onClick={() => this.setState({ deleteWarning: true })} color='red' icon={<Icon icon="trash2" />} />
									</ButtonGroup>							
								</ButtonToolbar>}
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

					<Modal overflow
					style={{ width: '90%' }}
					size='md'  
					show={this.state.commentEdit} 
					onHide={() => this.setState({ commentEdit: false })}>
						<Modal.Header>
							<Modal.Title>Edit this comment</Modal.Title>
						</Modal.Header>
						<Modal.Body>
						<br></br>
							<form>
								Body
								<br/>
								{this.props.myCharacter.tags.some(el => el === 'Control') && <Toggle defaultChecked={this.state.private} onChange={()=> this.setState({ private: !this.state.private })} checkedChildren="Hidden" unCheckedChildren="Revealed" />}
								<textarea rows='6' defaultValue={this.props.comment.body} value={this.state.body} style={textStyle} onChange={(event)=> this.setState({body: event.target.value})}></textarea>	
							</form>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.props.comment ? this.handleEditSubmit() : this.handleSubmit()}  disabled={this.isDisabled()} appearance="primary">
								{this.state.body.length < 11 ? <b>Description text needs {11 - this.state.body.length} more characters</b> :
				
								<b>Submit</b>}
							</Button>
							<Button onClick={() => this.setState({ commentEdit: false })} appearance="subtle">
								Cancel
							</Button>
						</Modal.Footer>
					</Modal>					
					</div>

				</div>}		
			</div>
		);
	}

	isDisabled () {
		if (this.state.body.length > 10) return false;
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

const publicComm = {
	backgroundColor: '#00a0bd', 
}

const privateComm = {
	backgroundColor: '#61342e', 
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
