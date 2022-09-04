import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { Panel, FlexboxGrid, ButtonGroup, Button, Modal, Toggle, IconButton, Icon, Avatar, ButtonToolbar, Loader } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';

/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Result extends Component {
	state = {
		resEdit: false, // used to open edit action popup
		deleteWarning: false, // used to open delete action popup
		id: this.props.result._id,
		description: this.props.result.description ? this.props.result.description : '',
		dice: this.props.result.dice ? this.props.result.dice : '',
		private: true,
		infoModal: false,
		infoAsset: {}
	};

	componentDidMount = () => {
		// // localStorage.removeItem('newActionState');
		// const stateReplace = JSON.parse(localStorage.getItem('EditResultGW'));
		// if (stateReplace) this.setState(stateReplace);
		// console.log(this.props.result)
		this.setState({
			id: this.props.result._id,
			description: this.props.result.description,
			dice: this.props.result.dice
		});
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('EditResultGW', JSON.stringify(this.state));
		}
		if (this.props.result !== prevProps.result) {
			this.setState({
				id: this.props.result._id,
				description: this.props.result.description,
				dice: this.props.result.dice
			});
		}
	};

	renderDice = (asset) => {
		if (asset) {
			let ass = this.props.assets.find((el) => el._id === asset);
			const thing = ass ? <b>{ass.dice} </b> : <b>?????</b>;
			return thing;
		}
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
			result: this.props.result._id
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
			result: {
				status: this.state.private ? 'Private' : 'Public',
				description: this.state.description,
				dice: this.state.dice,
				id: this.props.result._id
			}
		};
		socket.emit('request', {
			route: 'action',
			action: 'updateSubObject',
			data
		});
		// this.setState({ resEdit: false });
	};

	handleReady = async () => {
		const data = {
			id: this.props.selected._id,
			result: {
				ready: !this.props.result.ready,
				id: this.props.result._id
			}
		};
		socket.emit('request', {
			route: 'action',
			action: 'updateSubObject',
			data
		});
	};

	render() {
		return (
			<div style={{ border: '3px solid #00a0bd', borderRadius: '5px' }}>
				<FlexboxGrid style={{ backgroundColor: '#0d73d4' }} align="middle" justify="start">
					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
						<Avatar circle size="md" src={this.props.result.resolver.profilePicture} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>Result ({this.props.result.status})</h5>
						{this.props.result.resolver.characterName}
						<p style={{ ...slimText, textAlign: 'center' }}>{this.getTime(this.props.result.createdAt)}</p>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={4}>
						{this.props.myCharacter.tags.some((el) => el === 'Control') && (
							<ButtonToolbar>
								<ButtonGroup>
									<IconButton
										size="xs"
										onClick={() => this.handleReady()}
										color={this.props.result.ready ? 'green' : 'orange'}
										icon={this.props.result.ready ? <Icon icon="check" /> : <Icon icon="close" />}
									/>
									<IconButton size="xs" onClick={() => this.setState({ resEdit: true })} color="blue" icon={<Icon icon="pencil" />} />
									<IconButton size="xs" onClick={() => this.setState({ deleteWarning: true })} color="red" icon={<Icon icon="trash2" />} />
								</ButtonGroup>
							</ButtonToolbar>
						)}
					</FlexboxGrid.Item>
				</FlexboxGrid>

				{(this.props.myCharacter.tags.some((el) => el === 'Control') || this.props.result.status === 'Public') && (
					<Panel
						shaded
						style={{
							padding: '0px',
							textAlign: 'left',
							backgroundColor: '#15181e',
							whiteSpace: 'pre-line'
						}}
					>
						<ReactMarkdown children={this.props.result.description} remarkPlugins={[remarkGfm]}></ReactMarkdown>
						{/* <p style={slimText}>
							{this.props.result.description}
						</p> */}
						{/* <p style={slimText}>
							{this.props.result.dice}
						</p> */}
					</Panel>
				)}

				<Modal backdrop="static" size="sm" show={this.state.deleteWarning} onHide={() => this.setState({ deleteWarning: false })}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Warning! Are you sure you want delete your Result?
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
			</div>
		);
	}

	isDisabled() {
		if (this.state.description.length < 10 || this.state.dice.length < 1) return true;
		else return false;
	}

	closeResult = () => {
		this.setState({ resEdit: false });
	};

	myToggle = () => {
		return <Toggle onChange={() => this.setState({ hidden: !this.state.hidden })} checkedChildren="Hidden" unCheckedChildren="Revealed"></Toggle>;
	};

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name);
		}
		return assets;
	};
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assets: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	actionDispatched: (data) => dispatch(playerActionsRequested(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: ' pre-line',
	textAlign: 'left'
};

//const pickerData = [
//	{
//		label: 'Draft',
//		value: 'Draft'
//	},
//	{
//		label: 'Awaiting Resolution',
//		value: 'Awaiting'
//	},
//	{
//		label: 'Ready for Publishing',
//		value: 'Ready'
//	},
//	{
//		label: 'Published',
//		value: 'Published'
//	}
//];

const textStyle = {
	backgroundColor: '#1a1d24',
	border: '1.5px solid #3c3f43',
	borderRadius: '5px',
	width: '100%',
	padding: '5px',
	overflow: 'auto',
	scrollbarWidth: 'none'
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
