import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { connect, useSelector } from 'react-redux';
import { Avatar, Panel, FlexboxGrid, CheckPicker, ButtonGroup, Button, Modal, Divider, Toggle, IconButton, Icon, ButtonToolbar, Loader, Tag, Input, Slider, Progress } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted, playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
import { getFadedColor, getThisEffort } from '../../scripts/frontend';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */

const Submission = (props) => {
	const { gameConfig } = useSelector((state) => state);
	const [show, setShow] = React.useState(false);
	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resources, setResources] = React.useState([]);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [inputValue, setInputValue] = React.useState('');
	const [tags, setTags] = React.useState([]);
	const [max, setMax] = React.useState(0);
	const [infoAsset, setInfoAsset] = React.useState(false);

	const actionType = gameConfig.actionTypes.find((el) => el.type.toLowerCase() === props.action.type.toLowerCase());

	useEffect(() => {
		if (props.submission) {
			setEffort(props.submission.effort);
			setResources(props.submission.assets);
			setDescription(props.submission.description);
			setIntent(props.submission.intent);
			setName(props.action.name);
			setTags(props.submission.tags);

			setMaxEffort()
		}
	}, [props.submission]);

	const setMaxEffort = () => {
		let charEffort = getThisEffort(props.myCharacter.effort, actionType.type) + props.submission.effort.amount;
		setMax(charEffort < actionType.maxEffort ? charEffort : actionType.maxEffort);
	};


	const getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (
			<b>
				{day} - {time}
			</b>
		);
	};

	const handleInputConfirm = () => {
		const nextTags = inputValue ? [...props.action.tags, inputValue] : props.action.tags;
		setShow(false);
		setInputValue('');

		const data = {
			id: props.action._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	const handleTagRemove = (tag) => {
		const nextTags = props.action.tags.filter((item) => item !== tag);
		const data = {
			id: props.action._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	const renderTagAdd = () => {
		if (show === 'add')
			return (
				<Input
					size="xs"
					style={{ width: 70, display: 'inline-block' }}
					value={inputValue}
					onChange={(inputValue) => setInputValue(inputValue)}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
				/>
			);
		else return <IconButton className="tag-add-btn" onClick={() => setShow('add')} icon={<Icon icon="plus" />} appearance="ghost" size="xs" />;
	};

	const editState = (incoming, type) => {
		let thing;
		let temp;
		switch (type) {
			case 'effort':
				thing = { ...effort };
				if (typeof incoming === 'number') {
					thing.amount = parseInt(incoming);
				} else {
					thing.effortType = incoming;
					thing.amount = 0;
					const actionType = gameConfig.actionTypes.find((el) => el.type.toLowerCase() === props.action.type.toLowerCase());

					let charEffort = getThisEffort(props.myCharacter.effort, props.submission.effort.effortType);
					setMax(charEffort < actionType.maxEffort ? charEffort : actionType.maxEffort);
				}
				setEffort(thing);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!');
		}
	};

	const isDisabled = () => {
		if (description.length < 10 || intent.length < 10 || name.length < 10) return true;
		if (effort.amount === 0 || effort <= 0) return true;
		else return false;
	};

	function formattedUsedAssets(submissionAssets) {
		let temp = [];
		let assets = props.getMyAssets;
		assets = assets.filter((el) => el.uses <= 0 || el.status.used);
		assets = assets.filter((el) => !submissionAssets.some((sub) => sub === el._id));
		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	}

	const openInfo = (asset) => {
		const found = props.assets.find((el) => el._id === asset._id);
		setInfoAsset(found);
		setShow('info');
	};

	const handlePublish = async () => {
		const id = props.action._id;
		socket.emit('request', { route: 'action', action: 'publish', id });
	};

	const handleSubmit = async () => {
		// props.actionDispatched();
		// 1) make a new action
		const data = {
			id: props.action._id,
			name: name,
			tags: tags,
			submission: {
				effort,
				assets: resources,
				description,
				intent
			}
		};
		socket.emit('request', { route: 'action', action: 'update', data });
		setShow(false)
	};

	const controlRemove = (asset) => {
		const data = {
			asset,
			id: props.action._id
		};
		socket.emit('request', { route: 'action', action: 'controlReject', data });
	};

	const renderAsset = (assetID) => {
		if (assetID) {
			const asset = props.assets.find((el) => el._id === assetID);
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
						<b className="normalText">{asset.type}</b>
						<ButtonGroup>
							<IconButton size="xs" appearance={'link'} onClick={() => openInfo(asset)} color="blue" icon={<Icon icon="info" />} />
							{props.myCharacter.tags.some((el) => el === 'Control') && <IconButton size="sm" onClick={() => controlRemove(asset._id)} color="red" icon={<Icon icon="exit" />}></IconButton>}
						</ButtonGroup>
						<p className="slim-text">{asset.name}</p>
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

	const deleteAction = async () => {
		socket.emit('request', {
			route: 'action',
			action: 'delete',
			data: { id: props.action._id }
		});
		props.handleSelect(null);
		setShow(false);
	};

	/*TODO Add info about existing injury(ies)*/
	const submission = props.submission;
	return (
		<div>
			<Divider vertical />
			<div style={{ 								border:
									(props.action.tags.some((tag) => tag !== 'Published') || !props.action.tags.length > 0) && props.action.type === 'Agenda'
										? `4px dotted ${getFadedColor(props.action.type)}`
										: `4px solid ${getFadedColor(props.action.type)}`, borderRadius: '5px', padding: '15px' }}>
				<FlexboxGrid align="middle" style={{}} justify="center">
					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
						<Avatar circle size="md" src={props.creator.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>{props.action.name}</h5>
						{props.action.creator.playerName} - {props.action.creator.characterName}
						<p className="slim-text">{getTime(props.submission.createdAt)}</p>
						{props.myCharacter.tags.some((el) => el === 'Control') && props.action.tags.length === 0 && <b>No Tags</b>}
						{props.myCharacter.tags.some((el) => el === 'Control') &&
							props.action.tags.map((item, index) => (
								<Tag index={index} key={index} closable onClose={() => handleTagRemove(item, 'tags')}>
									{item}
								</Tag>
							))}
						{props.myCharacter.tags.some((el) => el === 'Control') && renderTagAdd()}
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={4}>
						{(props.myCharacter._id === props.action.creator._id || props.myCharacter.tags.some((el) => el === 'Control')) && !props.special && (
							<ButtonToolbar>
								<ButtonGroup>
									{(props.action.tags.some((tag) => tag !== 'Published') || !props.action.tags.length > 0) && props.action.type === 'Agenda' && (
										<Button
											disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > props.action.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
											size="md"
											onClick={() => handlePublish()}
											color="green"
											icon={<Icon icon="pencil" />}
										>
											Publish
										</Button>
									)}
									<IconButton
										disabled={
											(props.gamestate.status !== 'Active' || props.gamestate.round > props.action.round || props.action.tags.some((tag) => tag === 'Published')) &&
											!props.myCharacter.tags.some((el) => el === 'Control')
										}
										size="md"
										onClick={() => setShow('edit')}
										color="blue"
										icon={<Icon icon="pencil" />}
									/>
									<IconButton
										disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > props.action.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
										size="md"
										onClick={() => setShow('delete')}
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
					<ReactMarkdown children={submission.description} remarkPlugins={[remarkGfm]}></ReactMarkdown>
					<p style={slimText}>Intent</p>
					<ReactMarkdown children={submission.intent} remarkPlugins={[remarkGfm]}></ReactMarkdown>
					<p style={slimText}>Effort ({submission.effort.effortType})</p>
					<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }}>{submission.effort.amount}</p>
					<Progress.Line percent={submission.effort.amount * 50} showInfo={false}></Progress.Line>
					<Divider>Resources</Divider>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={8}>{renderAsset(submission.assets[0])}</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>{renderAsset(submission.assets[1])}</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>{renderAsset(submission.assets[2])}</FlexboxGrid.Item>
					</FlexboxGrid>
				</Panel>

				<Modal overflow style={{ width: '90%', }} size="md" show={show === 'edit'} onHide={() => setShow(false)}>
					<Modal.Header>
						<Modal.Title>
							Edit {props.action.type} action {name}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ border: `4px solid ${getFadedColor(props.action.type)}`, borderRadius: '5px', padding: '15px' }}>
						{props.actionLoading && <Loader backdrop content="loading..." vertical />}
						<form>
							Name:
							{10 - name.length > 0 && (
								<Tag style={{ color: 'black' }} color={'orange'}>
									{10 - name.length} more characters...
								</Tag>
							)}
							{10 - name.length <= 0 && (
								<Tag color={'green'}>
									<Icon icon="check" />
								</Tag>
							)}
							<textarea rows="1" value={name} className="textStyle" onChange={(event) => setName(event.target.value)}></textarea>
							Description:
							{10 - description.length > 0 && (
								<Tag style={{ color: 'black' }} color={'orange'}>
									{10 - description.length} more characters...
								</Tag>
							)}
							{10 - description.length <= 0 && (
								<Tag color={'green'}>
									<Icon icon="check" />
								</Tag>
							)}
							<textarea rows="6" value={description} className="textStyle" onChange={(event) => setDescription(event.target.value)} />
							<br />
							<FlexboxGrid>
								Intent:
								{10 - intent.length > 0 && (
									<Tag style={{ color: 'black' }} color={'orange'}>
										{10 - intent.length} more characters...
									</Tag>
								)}
								{10 - intent.length <= 0 && (
									<Tag color={'green'}>
										<Icon icon="check" />
									</Tag>
								)}
								<textarea rows="6" value={intent} className="textStyle" onChange={(event) => setIntent(event.target.value)} />
							</FlexboxGrid>
							{true && (
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
											Effort {effort.amount} / {max}
											{effort === 0 && (
												<Tag style={{ color: 'black' }} color={'orange'}>
													Need Effort
												</Tag>
											)}
										</h5>

										<Slider graduated min={0} max={max} defaultValue={submission.effort.amount} progress value={effort.amount} onChange={(event) => editState(parseInt(event), 'effort')}></Slider>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item
										style={{
											paddingTop: '25px',
											paddingLeft: '10px',
											textAlign: 'left'
										}}
										colspan={2}
									>
										{/* <InputNumber value={effort} max={this.props.myCharacter.effort} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								 */}
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
											data={props.getMyAssets.filter((el) => actionType.assetType.some((ty) => ty === el.type.toLowerCase()))}
											style={{ width: '100%' }}
											defaultValue={props.submission.assets}
											disabledItemValues={formattedUsedAssets(props.submission.assets)}
											onChange={(event) => setResources(event)}
										/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							)}
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button
							loading={props.actionLoading}
							onClick={() => handleSubmit()}
							disabled={effort.amount <= 0 || description.length < 10 || intent.length < 10 || name.length < 10}
							color={description.length > 10 && intent.length > 10 ? 'green' : 'red'}
							appearance="primary"
						>
							<b>Submit</b>
						</Button>
						<Button onClick={() => setShow(false)} appearance="subtle">
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>

				<AssetInfo asset={infoAsset} showInfo={show === 'info'} closeInfo={() => setShow(false)} />

				<Modal style={{ zIndex: 9999 }} size="sm" show={show === 'delete'} onHide={() => setShow(false)}>
					<Modal.Body>
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
						{'  '}
						Warning! Are you sure you want delete your action?
						<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => deleteAction()} appearance="primary">
							I am Sure!
						</Button>
						<Button onClick={() => setShow(false)} appearance="subtle">
							Nevermind!
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: ' pre-line',
	textAlign: 'center'
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
