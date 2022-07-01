import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { connect } from 'react-redux';
import { 	Avatar, 	Panel, 	FlexboxGrid, 	CheckPicker, 	ButtonGroup, 	Button, 	Modal, 	Divider, 	Toggle, 	IconButton, 	Icon, 	ButtonToolbar, 	Loader, 	Tag, 	Input, 	Slider, 	Progress } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import {
	actionDeleted,
	playerActionsRequested
} from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Submission extends Component {
	state = {
		edit: false, // used to open edit action popup
		deleteWarning: false, // used to open delete action popup
		loading: false, //used for loading button
		effort: this.props.submission.effort,
		assets: this.props.submission.assets,
		id: this.props.action._id,
		name: this.props.action.name,
		description: this.props.submission.description,
		intent: this.props.submission.intent,
		numberOfInjuries: this.props.action.numberOfInjuries,

		add: false,
		inputValue: '',

		infoModal: false,
		infoAsset: {}
	};

	// componentDidMount = () => {
	// 	// localStorage.removeItem('newActionState');
	// 	const stateReplace = JSON.parse(localStorage.getItem('selectedActionStateGW'));
	// 	if (stateReplace) this.setState(stateReplace);
	// }

	componentDidUpdate = (prevProps, prevState) => {
		// if (this.state !== prevState) {
		// 	localStorage.setItem('selectedActionStateGW', JSON.stringify(this.state));
		// };
		if (this.props.submission !== prevProps.submission) {
			this.setState({
				effort: this.props.submission.effort,
				assets: this.props.submission.assets,
				id: this.props.action._id,
				description: this.props.submission.description,
				intent: this.props.submission.intent,
				name: this.props.action.name,
				tags: this.props.action.tags,
				numberOfInjuries: this.props.action.numberOfInjuries
			});
		}
	};

	componentWillUnmount = () => {
		console.log('yeet');
		this.setState({ edit: false, delete: false });
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

	handleInputConfirm = () => {
		const nextTags = this.state.inputValue
			? [...this.props.action.tags, this.state.inputValue]
			: this.props.action.tags;
		this.setState({
			add: false,
			inputValue: ''
		});
		const data = {
			id: this.props.action._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	handleTagRemove = (tag, type) => {
		const nextTags = this.props.action.tags.filter((item) => item !== tag);
		const data = {
			id: this.props.action._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	renderTagAdd = () => {
		if (this.state.add)
			return (
				<Input
					size="xs"
					style={{ width: 70, display: 'inline-block' }}
					value={this.state.inputValue}
					onChange={(inputValue) => this.setState({ inputValue })}
					onBlur={this.handleInputConfirm}
					onPressEnter={this.handleInputConfirm}
				/>
			);
		else
			return (
				<IconButton
					className="tag-add-btn"
					onClick={() => this.setState({ add: true })}
					icon={<Icon icon="plus" />}
					appearance="ghost"
					size="xs"
				/>
			);
	};

	render() {
		/*TODO Add info about existing injury(ies)*/
		const submission = this.props.submission;
		return (
			<div>
				<Divider vertical />
				<div
					style={{
						border:
							this.props.action.type === 'default'
								? '4px solid #4caf50'
								: '3px solid #ff9800',
						borderRadius: '5px',
						width: '100%',
						normalText
					}}
				>
					<FlexboxGrid align="middle" style={{}} justify="center">
						<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							<Avatar
								circle
								size="md"
								src={`/images/${this.props.creator.characterName}.jpg`}
								alt="?"
								style={{ maxHeight: '50vh' }}
							/>
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={15}>
							<h5>{this.props.action.name}</h5>
							{this.props.action.creator.characterTitle}/
							{this.props.action.creator.characterName}
							<p style={slimText}>
								{this.getTime(this.props.submission.createdAt)}
							</p>
							{this.props.myCharacter.tags.some((el) => el === 'Control') &&
								this.props.action.tags.length === 0 && <b>No Tags</b>}
							{this.props.myCharacter.tags.some((el) => el === 'Control') &&
								this.props.action.tags.map((item, index) => (
									<Tag
										index={index}
										closable
										onClose={() => this.handleTagRemove(item, 'tags')}
									>
										{item}
									</Tag>
								))}
							{this.props.myCharacter.tags.some((el) => el === 'Control') &&
								this.renderTagAdd()}
							<p style={{ fontWeight: 'bold' }}>
								{this.props.action.numberOfInjuries} Injuries at time of action
								submission.
							</p>
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={4}>
							{(this.props.myCharacter._id === this.props.action.creator._id ||
								this.props.myCharacter.tags.some((el) => el === 'Control')) && (
								<ButtonToolbar>
									<ButtonGroup>
										<IconButton
											disabled={
												(this.props.gamestate.status !== 'Active' ||
													this.props.gamestate.round >
														this.props.action.round) &&
												!this.props.myCharacter.tags.some(
													(el) => el === 'Control'
												)
											}
											size="xs"
											onClick={() => this.setState({ edit: true })}
											color="blue"
											icon={<Icon icon="pencil" />}
										/>
										<IconButton
											disabled={
												(this.props.gamestate.status !== 'Active' ||
													this.props.gamestate.round >
														this.props.action.round) &&
												!this.props.myCharacter.tags.some(
													(el) => el === 'Control'
												)
											}
											size="xs"
											onClick={() => this.setState({ deleteWarning: true })}
											color="red"
											icon={<Icon icon="trash2" />}
										/>
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
						<p style={slimText}>Description</p>
						<ReactMarkdown
							children={submission.description}
							remarkPlugins={[remarkGfm]}
						></ReactMarkdown>
						<p style={slimText}>Intent</p>
						<ReactMarkdown
							children={submission.intent}
							remarkPlugins={[remarkGfm]}
						></ReactMarkdown>

						{this.props.action.type === 'default' && <div>
							<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }} >{submission.effort} Effort</p>
							<Progress.Line percent={submission.effort * 33 + 1} showInfo={false}>  </Progress.Line>							
						</div>}


						<Divider>Resources</Divider>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={8}>
								{this.renderAsset(submission.assets[0])}
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
								{this.renderAsset(submission.assets[1])}
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
								{this.renderAsset(submission.assets[2])}
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</Panel>

					<Modal
						overflow
						style={{ width: '90%' }}
						size="md"
						show={this.state.edit}
						onHide={() => this.setState({ edit: false })}
					>
						<Modal.Header>
							<Modal.Title>
								Edit {this.props.action.type} action {this.state.name}
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{this.props.actionLoading && (
								<Loader backdrop content="loading..." vertical />
							)}
							<form>
								Name:
								{10 - this.state.name.length > 0 && (
									<Tag style={{ color: 'black' }} color={'orange'}>
										{10 - this.state.name.length} more characters...
									</Tag>
								)}
								{10 - this.state.name.length <= 0 && (
									<Tag color={'green'}>
										<Icon icon="check" />
									</Tag>
								)}
								<textarea
									rows="1"
									value={this.state.name}
									style={textStyle}
									onChange={(event) =>
										this.setState({ name: event.target.value })
									}
								></textarea>
								Description:
								{10 - this.state.description.length > 0 && (
									<Tag style={{ color: 'black' }} color={'orange'}>
										{10 - this.state.description.length} more characters...
									</Tag>
								)}
								{10 - this.state.description.length <= 0 && (
									<Tag color={'green'}>
										<Icon icon="check" />
									</Tag>
								)}
								<textarea
									rows="6"
									value={this.state.description}
									style={textStyle}
									onChange={(event) =>
										this.setState({ description: event.target.value })
									}
								></textarea>
								<br></br>
								<FlexboxGrid>
									Intent:
									{10 - this.state.intent.length > 0 && (
										<Tag style={{ color: 'black' }} color={'orange'}>
											{10 - this.state.intent.length} more characters...
										</Tag>
									)}
									{10 - this.state.intent.length <= 0 && (
										<Tag color={'green'}>
											<Icon icon="check" />
										</Tag>
									)}
									<textarea
										rows="6"
										value={this.state.intent}
										style={textStyle}
										onChange={(event) =>
											this.setState({ intent: event.target.value })
										}
									></textarea>
								</FlexboxGrid>
								{this.props.action.type === 'default' && (
									<FlexboxGrid>
										<FlexboxGrid.Item
											style={{
												paddingTop: '25px',
												paddingLeft: '10px',
												textAlign: 'left'
											}}
											align="middle"
											colspan={6}
										>
											<h5 style={{ textAlign: 'center' }}>
												Effort {this.state.effort} /{' '}
												{this.props.myCharacter.effort + submission.effort}
												{this.state.effort === 0 && (
													<Tag style={{ color: 'black' }} color={'orange'}>
														Need Effort
													</Tag>
												)}
											</h5>

											<Slider
												graduated
												min={0}
												max={this.props.myCharacter.effort + submission.effort}
												defaultValue={submission.effort}
												progress
												value={this.state.effort}
												onChange={(event) => this.setState({ effort: event })}
											></Slider>
										</FlexboxGrid.Item>
										<FlexboxGrid.Item
											style={{
												paddingTop: '25px',
												paddingLeft: '10px',
												textAlign: 'left'
											}}
											colspan={2}
										>						 
										</FlexboxGrid.Item>
										<FlexboxGrid.Item colspan={4}></FlexboxGrid.Item>
										<FlexboxGrid.Item
											style={{
												paddingTop: '5px',
												paddingLeft: '10px',
												textAlign: 'left'
											}}
											colspan={10}
										>
											{' '}
											Resources
											<CheckPicker
												labelKey="name"
												valueKey="_id"
												data={this.props.getMyAssets}
												style={{ width: '100%' }}
												defaultValue={this.props.submission.assets}
												disabledItemValues={this.formattedUsedAssets(this.props.submission.assets)}
												onChange={(event) => this.setState({ assets: event })}
											/>
										</FlexboxGrid.Item>
									</FlexboxGrid>
								)}
							</form>
						</Modal.Body>
						<Modal.Footer>
							<Button
								loading={this.props.actionLoading}
								onClick={() => this.handleSubmit()}
								disabled={
									(this.props.action.type === 'default' && this.state.effort <= 0) ||
									this.state.description.length < 10 ||
									this.state.intent.length < 10 ||
									this.state.name.length < 10
								}
								color={
									this.state.description.length > 10 &&
									this.state.intent.length > 10
										? 'green'
										: 'red'
								}
								appearance="primary"
							>
								<b>Submit</b>
							</Button>
							<Button
								onClick={() => this.setState({ edit: false })}
								appearance="subtle"
							>
								Cancel
							</Button>
						</Modal.Footer>
					</Modal>
					<AssetInfo
						asset={this.state.infoAsset}
						showInfo={this.state.infoModal}
						closeInfo={() => this.setState({ infoModal: false })}
					/>

					<Modal
						size="sm"
						show={this.state.deleteWarning}
						onHide={() => this.setState({ deleteWarning: false })}
					>
						<Modal.Body>
							<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
							{'  '}
							Warning! Are you sure you want delete your action?
							<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.deleteAction()} appearance="primary">
								I am Sure!
							</Button>
							<Button
								onClick={() => this.setState({ deleteWarning: false })}
								appearance="subtle"
							>
								Nevermind
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>
		);
	}

	handleSubmit = async () => {
		// this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.action._id,
			name: this.state.name,
			tags: this.state.tags,
			submission: {
				effort: this.state.effort,
				assets: this.state.assets, //this.state.asset1._id, this.state.asset2._id, this.state.asset3._id
				description: this.state.description,
				intent: this.state.intent,
				round: this.props.gamestate.round
			}
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	controlRemove = (asset) => {
		const data = {
			asset,
			id: this.props.action._id
		};
		socket.emit('request', { route: 'action', action: 'controlReject', data });
	};

	renderAsset = (assetID) => {
		if (assetID) {
			const asset = this.props.assets.find((el) => el._id === assetID);
			if (asset)
				return (
					<Panel
						style={{
							backgroundColor: '#272b34',
							textAlign: 'center',
							minWidth: '15vw'
						}}
						shaded
						bordered
					>
						<b style={normalText}>{asset.type}</b>
						<ButtonGroup>
							<IconButton
								size="xs"
								appearance={'link'}
								onClick={() => this.openInfo(asset)}
								color="blue"
								icon={<Icon icon="info" />}
							/>
							{this.props.myCharacter.tags.some((el) => el === 'Control') && (
								<IconButton
									size="sm"
									onClick={() => this.controlRemove(asset._id)}
									color="red"
									icon={<Icon icon="exit" />}
								></IconButton>
							)}
						</ButtonGroup>
						<p style={slimText}>{asset.name}</p>
						{asset.status.used && <Tag>Used</Tag>}
					</Panel>
				);
			else return <Panel>Could not render for asset {assetID}</Panel>;
		} else {
			return (
				<Panel
					style={{
						backgroundColor: '#0e1013',
						minWidth: '15vw',
						textAlign: 'center'
					}}
					shaded
					bordered
				>
					<b>Empty Slot</b>
				</Panel>
			);
		}
	};

	openInfo = (asset) => {
		const found = this.props.assets.find((el) => el._id === asset._id);
		this.setState({ infoAsset: found, infoModal: true });
	};

	deleteAction = async () => {
		socket.emit('request', {
			route: 'action',
			action: 'delete',
			data: { id: this.props.action._id }
		});
		this.props.handleSelect(null);
		this.setState({ deleteWarning: false });
	};

	myToggle = () => {
		return (
			<Toggle
				onChange={() =>
					this.setState({ assetBoolean: !this.state.assetBoolean })
				}
				checkedChildren="Asset"
				unCheckedChildren="Trait"
			></Toggle>
		);
	};

	formattedUsedAssets = (submissionAssets) => {
		let temp = [];
		let assets = this.props.getMyAssets;
		assets = assets.filter((el) => el.uses <= 0 || el.status.used);
		assets = assets.filter(el => !submissionAssets.some(sub => sub === el._id) )
		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	};
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	actionLoading: state.actions.loading,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assets: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	deleteAction: (data) => dispatch(actionDeleted(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

const banned = [
	'Condemned',
	'Disfavoured',
	'Loathing',
	'Unfriendly',
	'Neutral',
	'Preferred',
	'Warm'
];

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: ' pre-line;',
	textAlign: 'center'
};

const normalText = {
	fontSize: '.966em',
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

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
