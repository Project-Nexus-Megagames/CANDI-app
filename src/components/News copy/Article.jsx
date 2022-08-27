import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { connect } from 'react-redux';
import { Avatar, Panel, FlexboxGrid, CheckPicker, ButtonGroup, Button, Modal, Divider, Toggle, IconButton, Icon, ButtonToolbar, Loader, Tag, Input, Slider, Progress } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted, playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
import { getFadedColor, getThisEffort } from '../../scripts/frontend';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */

const Submission = (props) => {
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

	// useEffect(() => {
	// 	if (props.submission) {
	// 		setEffort(props.submission.effort)
	// 		setResources(props.submission.assets)
	// 		setDescription(props.submission.description)
	// 		setIntent(props.submission.intent)
	// 		setName(article.name)
	// 		setTags(props.submission.tags)
	// 		setMax(getThisEffort(props.myCharacter.effort, props.submission.effort.effortType))
	// 	}
	// }, [props.submission]);

	const getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (
			<b>
				{day} - {time}
			</b>
		);
	};

	const calculate = (reactions, type) => {
		let temp = reactions.filter((el) => el.emoji === 'thumbs-up');
		temp = temp.length;
		return temp;
	};

	const handleInputConfirm = () => {
		const nextTags = inputValue ? [...article.tags, inputValue] : article.tags;
		setShow(false);
		setInputValue('');

		const data = {
			id: article._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	const handleTagRemove = (tag) => {
		const nextTags = article.tags.filter((item) => item !== tag);
		const data = {
			id: article._id,
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

	const article = props.article;
	return (
		<div>
			<Divider vertical />
			<Panel
				collapsible
				header={
					<span>
						{/* <TeamAvatar size={"sm"} code={article.agency} /> */}
						<FlexboxGrid align="middle" style={{}} justify="center">
							<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
								<Avatar circle size="md" src={`/images/.jpg`} alt="?" style={{ maxHeight: '50vh' }} />
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={15}>
								<h5>{article.headline}</h5>
								{article.publisher.characterName}
								<p className="slim-text">{/* {getTime(props.submission.createdAt)} */}TODO TIME HERE</p>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={4}>
								{(props.myCharacter._id === article.publisher._id || props.myCharacter.tags.some((el) => el === 'Control')) && (
									<ButtonToolbar>
										<ButtonGroup>
											<IconButton
												disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > article.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
												size="sm"
												onClick={() => props.handleEdit(article)}
												color="blue"
												icon={<Icon icon="pencil" />}
											/>
											<IconButton
												disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > article.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
												size="sm"
												onClick={() => setShow('delete')}
												color="red"
												icon={<Icon icon="trash2" />}
											/>
										</ButtonGroup>
									</ButtonToolbar>
								)}
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</span>
				}
				style={{ border: `4px solid ${getFadedColor(article.type)}`, borderRadius: '5px', padding: '15px' }}
			>
				<Panel shaded className="blob">
					<ReactMarkdown children={article.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
				</Panel>
				<IconButton icon={<Icon icon="thumbs-up" />} onClick={() => socket.emit('request', { route: 'article', action: 'react', data: { id: article._id, user: props.user, emoji: 'thumbs-up' } })}>
					{calculate(article.reactions, 'thumbs-up')}
				</IconButton>
			</Panel>

			<Modal size="sm" show={show === 'delete'} onHide={() => setShow(false)}>
				<Modal.Body>
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
					{'  '}
					Warning! Are you sure you want delete your action?
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => props.handleHide()} appearance="primary">
						I am Sure!
					</Button>
					<Button onClick={() => setShow(false)} appearance="subtle">
						Nevermind!
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
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
