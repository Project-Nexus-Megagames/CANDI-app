import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { Avatar, Modal, Button, ButtonToolbar, ButtonGroup, FlexboxGrid, IconButton, Icon, Toggle, Panel } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter, characterUpdated } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
class Effect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			effectEdit: false, // used to open edit action popup
			description: this.props.effect.description,
			deleteWarning: false, // used to open delete action popup
			private: true
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.actions !== prevProps.actions) {
			if (this.props.actions.some((el) => el.description === this.state.description)) {
				// checking to see if the new action got added into the action list, so we can move on with our lives
				this.props.closeNew();
				this.setState({
					description: this.props.effect.description
				});
			}
		}
	};

	handleSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			effect: {
				description: this.state.description,
				status: this.state.private ? 'Private' : 'Public',
				effector: this.props.myCharacter._id
			},
			round: this.props.gamestate.round
		};
		socket.emit('request', { route: 'action', action: 'effect', data });
	};

	getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (
			<b>
				{day} - {time}
			</b>
		);
	};

	handleDelete = async () => {
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			effect: this.props.effect._id
		};
		socket.emit('request', {
			route: 'action',
			action: 'deleteSubObject',
			data
		});
		this.setState({ deleteWarning: false });
	};

	handleEditSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			effect: {
				description: this.state.description,
				status: this.state.private ? 'Private' : 'Public',
				id: this.props.effect._id
			}
		};
		socket.emit('request', {
			route: 'action',
			action: 'updateSubObject',
			data
		});
		this.setState({ effectEdit: false });
	};

	render() {
		return (
			<div>
				{(this.props.myCharacter.tags.some((el) => el === 'Control') || this.props.effect.status === 'Public') && (
					<div>
						<div style={{ border: '3px solid #531ba8', borderRadius: '5px' }}>
							<FlexboxGrid style={infoComm} align="middle" justify="start">
								<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
									<Avatar circle size="md" src={this.props.effect.effector.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
								</FlexboxGrid.Item>

								<FlexboxGrid.Item colspan={15}>
									<h5>Action {this.props.effect.status} Effect</h5>
									{this.props.effect.effector.characterName}
									<p style={slimText}>{this.getTime(this.props.effect.createdAt)}</p>
								</FlexboxGrid.Item>

								<FlexboxGrid.Item colspan={4}>
									{this.props.myCharacter.tags.some((el) => el === 'Control') && (
										<ButtonToolbar>
											<ButtonGroup>
												<IconButton size="xs" onClick={() => this.setState({ effectEdit: true })} color="blue" icon={<Icon icon="pencil" />} />
												<IconButton size="xs" onClick={() => this.setState({ deleteWarning: true })} color="red" icon={<Icon icon="trash2" />} />
											</ButtonGroup>
										</ButtonToolbar>
									)}
								</FlexboxGrid.Item>
							</FlexboxGrid>

							<Panel
								shaded
								style={{
									padding: '0px',
									textAlign: 'left',
									backgroundColor: '#15181e',
									whiteSpace: 'pre-line'
								}}
							>
								<ReactMarkdown children={this.props.effect.description} remarkPlugins={[remarkGfm]}></ReactMarkdown>
							</Panel>

							<Modal backdrop="static" size="sm" show={this.state.deleteWarning} onHide={() => this.setState({ deleteWarning: false })}>
								<Modal.Body>
									<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
									{'  '}
									Warning! Are you sure you want delete your Effect?
									<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
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

							<Modal overflow style={{ width: '90%' }} size="md" show={this.state.effectEdit} onHide={() => this.setState({ effectEdit: false })}>
								<Modal.Header>
									<Modal.Title>Edit this effect</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<br></br>
									<form>
										Body
										<br />
										{this.props.myCharacter.tags.some((el) => el === 'Control') && (
											<Toggle defaultChecked={this.state.private} onChange={() => this.setState({ private: !this.state.private })} checkedChildren="Hidden" unCheckedChildren="Revealed" />
										)}
										<textarea
											rows="6"
											defaultValue={this.props.effect.description}
											value={this.state.description}
											style={textStyle}
											onChange={(event) => this.setState({ description: event.target.value })}
										></textarea>
									</form>
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={() => (this.props.effect ? this.handleEditSubmit() : this.handleSubmit())} disabled={this.isDisabled()} appearance="primary">
										{this.state.description.length < 11 ? <b>Description text needs {11 - this.state.description.length} more characters</b> : <b>Submit</b>}
									</Button>
									<Button onClick={() => this.setState({ effectEdit: false })} appearance="subtle">
										Cancel
									</Button>
								</Modal.Footer>
							</Modal>
						</div>
					</div>
				)}
			</div>
		);
	}

	isDisabled() {
		if (this.state.description.length > 10) return false;
		else return true;
	}

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name);
		}
		return assets;
	};
}

//const publicComm = {
//	backgroundColor: '#00a0bd',
//}

//const privateComm = {
//	backgroundColor: '#61342e',
//}

const infoComm = {
	backgroundColor: '#531ba8'
};

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: 'nowrap',
	textAlign: 'center'
};

const textStyle = {
	backgroundColor: '#1a1d24',
	border: '1.5px solid #3c3f43',
	borderRadius: '5px',
	width: '100%',
	padding: '5px',
	overflow: 'auto',
	scrollbarWidth: 'none'
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	actionLoading: state.actions.loading,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Effect);
