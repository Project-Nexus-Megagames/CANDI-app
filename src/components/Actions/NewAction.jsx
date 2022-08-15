import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Modal, Button, Slider, Tag, FlexboxGrid, Icon, CheckPicker, Loader, Whisper, Tooltip, ButtonGroup, ButtonToolbar, SelectPicker } from 'rsuite';
import { Tabs, TabList, TabPanels, Tab, TabPanel, CloseButton } from '@chakra-ui/react'
import { getFadedColor, getThisEffort } from '../../scripts/frontend';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import { playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
import { AttachmentForm } from './NewAttachment';
const NewAction = (props) => {
	const { gameConfig, gamestate } = useSelector((state) => state);
	const myCharacter = useSelector(getMyCharacter);

	const [activeTab, setTab] = React.useState(0);
	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resource, setResource] = React.useState([]);
	const [attachments, setAttachments] = React.useState([])
	const [actionType, setActionType] = React.useState(false);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [max, setMax] = React.useState(0);


	useEffect(() => {
		if (actionType && actionType.type) {
			setEffort({ effortType: actionType.type, amount: 0})
			setMax(getThisEffort(myCharacter.effort, actionType.type))
		}
	}, [actionType]);
	
	const editState = (incoming, type) => {
		let thing;
		let temp;
		switch (type) {
			case 'effort':
				thing = { ...effort };
				if (typeof(incoming) === 'number') { 
					thing.amount = parseInt(incoming) 
				}
				else {
					thing.effortType = (incoming);
					thing.amount = 0;
					setMax(getThisEffort(myCharacter.effort, incoming))
				} 
				setEffort(thing);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	// componentDidMount = () => {
	// 	// // localStorage.removeItem('newActionState');
	// 	// const stateReplace = JSON.parse(localStorage.getItem('newActionStateGW'));
	// 	// // console.dir(stateReplace);
	// 	// if (stateReplace) setState(stateReplace);
	// };

	const handleSubmit = async () => {
		// 1) make a new action
		const data = {
			submission: {
				effort: effort,
				assets: resource,
				description: description,
				intent: intent,
			},
			name: name,
			controllers: myCharacter.control,
			type: actionType.type,
			creator: myCharacter._id,
			attachments: attachments,
			numberOfInjuries: myCharacter.injuries.length
		};
		setActionType(false)
		setDescription('');
		setIntent('');
		setName('');
		setResource([]);

		socket.emit('request', { route: 'action', action: 'create', data });
		props.closeNew();
	};

	// This Adds an attachment to STATE
	const addAttachment = () => {
		const docs = [...attachments];
		docs.push({
			title: `Placeholder ${docs.length}`,
			body: '',
			status: ['new']
		});
		setAttachments(docs); 
	}

	// This edits an attachment in STATE
	const editAttachment = (data, i = 0) => {
		const docs = [...attachments];
		docs[i] = (data);
		setAttachments(docs);
		console.log('We edited! index:' + i);
	}

	const delAttachment = (i) => {
		const docs = [...attachments];
		docs.splice(i, 1);
		setTab(0);
		setAttachments(docs);
	};

	function isDisabled(effort) {
		if (
			description.length < 10 ||
			intent.length < 10 ||
			name.length < 10
		)
			return true;
		if (effort.amount === 0 || effort <= 0) return true;
		else return false;
	}

	function formattedUsedAssets() {
		let temp = [];
		let assets = props.getMyAssets
		assets = assets.filter((el) => el.uses <= 0 || el.status.used);
		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	}

		return (
			<Modal
				overflow
				style={{ width: '90%' }}
				size="md"
				show={props.show}
				onHide={() => props.closeNew()}
			>
				<Modal.Header>
					<Modal.Title>Submit a new{actionType ? ` ~${actionType.type}~` : ''} Action</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{ border: `4px solid ${getFadedColor(actionType.type)}`, borderRadius: '5px', padding: '15px' }}
				>
					{props.actionLoading && (
						<Loader backdrop content="loading..." vertical />
					)}
					<SelectPicker
						block
						cleanable={false}
						placeholder='Select action type to create'
						onChange={setActionType}
						value={actionType}
						data={gameConfig.actionTypes.map((action) => ({ label: `${action.type} Action`, value: action }))}
						/>
					{ actionType.type && (
						<div>
								<Tabs index={activeTab}>
									<TabList activeTab={activeTab}>
										<Tab onClick={() => setTab(0)}>{`${actionType.type} Action`}</Tab>
										{ attachments.map((doc, i) => (
											<Tab key={doc.title} onClick={() => setTab(i+1)}>{`Attachment ${i+1}`}</Tab>
										))}
									</TabList>
									<TabPanels>
										<TabPanel>
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
												<textarea
													rows="1"
													value={name}
													style={textStyle}
													onChange={(event) => setName(event.target.value)}
												></textarea>
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
												<textarea
													rows="6"
													value={description}
													style={textStyle}
													onChange={(event) => setDescription(event.target.value)}
												></textarea>
												<br></br>
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
													<textarea
														rows="6"
														value={intent}
														style={textStyle}
														onChange={(event) => setIntent(event.target.value)}
													></textarea>
												</FlexboxGrid>
												<FlexboxGrid>
													<FlexboxGrid.Item style={{ paddingTop: '25px', paddingLeft: '10px',	textAlign: 'left' }} align="middle" colspan={6}>
													<h5 style={{ textAlign: 'center' }}>
															Effort {effort.amount} / {max}
															{effort.amount === 0 && (
															<Tag style={{ color: 'black' }} size="sm" color={'orange'}>
																Need Effort
															</Tag>
															)}
													</h5>
													<ButtonToolbar>
														<ButtonGroup justified>
															{actionType && actionType.effortTypes.map((e) => (
																<Button
																	onClick={() => editState(e, 'effort')}
																	color={getFadedColor(`${e}-rs`)}
																	disabled={getThisEffort(myCharacter.effort, e) < 1}
																	appearance={effort.effortType == e ? 'default' : 'ghost'}
																>
																	{e} - ({getThisEffort(myCharacter.effort, e)})
																</Button>
															))}						
														</ButtonGroup>						
													</ButtonToolbar>
													<br/>
															<Slider
																graduated
																min={0}
																max={max}
																defaultValue={0}
																progress
																value={effort.amount}
																onChange={(event)=> editState(parseInt(event), 'effort')}
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
																data={props.getMyAssets}
																style={{ width: '100%' }}
																disabledItemValues={formattedUsedAssets()}
																onChange={(event) => setResource(event)}
															/>
														</FlexboxGrid.Item>
													</FlexboxGrid>
											</form>
											<div
												style={{
													justifyContent: 'space-between',
													display: 'flex',
													marginTop: '15px'
												}}
											>
												<Button color='green' onClick={addAttachment}>Add Attachment</Button>
												<ButtonGroup >
													<Button
														onClick={() => handleSubmit()}
														disabled={isDisabled(effort)}
														color={isDisabled(effort) ? 'red' : 'green'}
														appearance="primary"
													>
														<b>Submit</b>
													</Button>
													<Button onClick={() => props.closeNew()} appearance="subtle">
														Cancel
													</Button>
												</ButtonGroup>
											</div>						
										</TabPanel>
										{ attachments.map((doc, i) => (
											<TabPanel key={doc.title}>
												<AttachmentForm attachment={doc} onEdit={(data) => editAttachment(data, i)} onDelete={() => delAttachment(i)} />
											</TabPanel>
										))}
									</TabPanels>
								</Tabs>
					</div> )}
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
		);
}

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
	actions: state.actions.list,
	actionLoading: state.actions.loading,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NewAction);
