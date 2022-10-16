import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Slider, Tag, FlexboxGrid, Icon, CheckPicker, Loader, Whisper, Tooltip, ButtonGroup, ButtonToolbar, Dropdown, SelectPicker } from 'rsuite';
import { getFadedColor, getIcon, getThisEffort } from '../../scripts/frontend';
import { getMyAssets } from '../../redux/entities/assets';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const NewActionUr = (props) => {
	const { gameConfig } = useSelector((state) => state);
	const locations = useSelector((state) => state.locations.list);
	const myCharacter = useSelector(getMyCharacter);
	const myAssets = useSelector(getMyAssets);

	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resource, setResource] = React.useState([]);
	const [actionType, setActionType] = React.useState(false);
	const [actionSubType, setActionSubType] = React.useState(false);
	const [actionLocation, setactionLocation] = React.useState(false);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');

	const [arg0, setArg0] = React.useState('');
	const [arg1, setArg1] = React.useState('');
	const [arg2, setArg2] = React.useState('');

	const [max, setMax] = React.useState(0);

	const setMaxEffort = () => {
		let charEffort = getThisEffort(myCharacter.effort, actionType.effortTypes[0]);
		setMax(charEffort < actionType.maxEffort ? charEffort : actionType.maxEffort);
        if (charEffort > 0) setEffort({ effortType: effort.effortType, amount: 1 });
	};

	useEffect(() => {
		if (actionType && actionType.effortTypes[0]) {
			setEffort({ effortType: actionType.effortTypes[0], amount: 0 });
			setMaxEffort();
		}
	}, [actionType]);


	const editState = (incoming, type) => {
		let thing;
		switch (type) {
			case 'effort':
				thing = { ...effort };
				if (typeof incoming === 'number') {
					thing.amount = parseInt(incoming);
				} else {
					thing.effortType = incoming;
					thing.amount = 0;
					setMax(getThisEffort(myCharacter.effort, incoming));
				}
				setEffort(thing);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!');
		}
	};

	const handleSubmit = async () => {
		// 1) make a new action
		const data = {
			submission: {
				effort: effort,
				assets: resource,
				description: description,
				intent: intent,
				args: [ arg0, arg1, arg2]
			},
			name: name,
			type: actionType.type,
			subType: actionSubType,
			creator: myCharacter._id,
			numberOfInjuries: myCharacter.injuries.length
		};
		// setActionType(false);
		// setDescription('');
		// setIntent('');
		// setName('');
		// setResource([]);

		socket.emit('request', { route: 'action', action: 'create', data });
		// props.closeNew();
	};

	function isDisabled(effort) {
		if (description.length < 10 || intent.length < 10 || name.length < 10) return true;
		if (!actionLocation || !actionSubType) return true;
		if (effort.amount === 0 || effort <= 0) return true;
		else return false;
	}

	function formattedUsedAssets() {
		let temp = [];
		let assets = myAssets;
		assets = assets.filter((el) => el.uses <= 0 || el.status.used);

		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	}

	return (
		<Modal overflow style={{ width: '90%' }} size="md" show={props.show} onHide={() => props.closeNew()}>
			<Modal.Header>
				<Modal.Title>Submit a new{actionType ? ` ~${actionType.type}~` : ''} Action</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ border: `4px solid ${getFadedColor(actionType.type)}`, borderRadius: '5px', padding: '15px' }}>
				{props.actionLoading && <Loader backdrop content="loading..." vertical />}
				<ButtonToolbar>
					<ButtonGroup justified>
						{gameConfig &&
							gameConfig.actionTypes.filter(el => myCharacter.effort.some(eff => el.effortTypes.some(ty => ty === eff.type) ) ).map((aType) => (
								<Whisper
									key={aType.type}
									placement="top"
									trigger="hover"
									speaker={
										<Tooltip>
											<b>{true ? `Create New "${aType.type}" Action` : `'No ${aType.type} Left'`}</b>
										</Tooltip>
									}
								>
									<Button style={{}} onClick={() => setActionType(aType)} color={getFadedColor(`${aType.type}-rs`)} appearance={actionType.type === aType.type ? 'default' : 'ghost'}>
										{aType.type}
									</Button>
								</Whisper>
							))}
					</ButtonGroup>
				</ButtonToolbar>
				{actionType.type && (
					<div>
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
							<textarea rows="1" value={name} style={textStyle} onChange={(event) => setName(event.target.value)}></textarea>
							{"Description - What are you doing? (1000 character limit) - "}
							{10 - description.length > 0 && (
								<Tag style={{ color: 'black' }} color={'orange'}>
									{10 - description.length} more characters...
								</Tag>
							)}
							{10 - description.length <= 0 && (
								<Tag color={'green'}>
									<Icon icon="check" /> {" "}
									{description.length}
								</Tag>
							)}
							{description.length > 1000 && (
								<Tag color={'red'}>
									<Icon icon="bullhorn"/>
									- Warning - Too Long!
								</Tag>
							)}
							<textarea rows="6" value={description} style={textStyle} onChange={(event) => setDescription(event.target.value)}></textarea>
							<br></br>
							<FlexboxGrid>
								{"Intent - What is your intended outcome? (1000 character limit) - "}
								{10 - intent.length > 0 && (
									<Tag style={{ color: 'black' }} color={'orange'}>
										{10 - intent.length} more characters...
									</Tag>
								)}
								{10 - intent.length <= 0 && (
									<Tag color={'green'}>
										<Icon icon="check" /> {" "}
										{intent.length}
									</Tag>
								)}
								{intent.length > 1000 && (
								<Tag color={'red'}>
									<Icon icon="bullhorn"/>
									- Warning - Too Long!
								</Tag>
								)}
								<textarea rows="6" value={intent} style={textStyle} onChange={(event) => setIntent(event.target.value)}></textarea>
							</FlexboxGrid>
							<FlexboxGrid>
								{false && <FlexboxGrid.Item style={{ paddingTop: '25px', paddingLeft: '10px', textAlign: 'left' }} align="middle" colspan={6}>
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
											{actionType &&
												actionType.effortTypes.map((e) => (
													<Button
														key={e}
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
									<br />
									<Slider graduated min={0} max={max} defaultValue={0} progress value={effort.amount} onChange={(event) => editState(parseInt(event), 'effort')}></Slider>
								</FlexboxGrid.Item>}
								<FlexboxGrid.Item colspan={10}>
									<p>Give up to three reasons why this will succeed? (500 character limit each)</p>
									{"1) "} 
									{arg0.length > 500 && <Tag color={'red'}>
										<Icon icon="bullhorn"/>
										- Warning - Too Long!
									</Tag>}
									<textarea rows="1" value={arg0} style={textStyle} onChange={(event) => setArg0(event.target.value)}></textarea>

									{"2) "}
									{arg1.length > 500 && <Tag color={'red'}>
										<Icon icon="bullhorn"/>
										- Warning - Too Long!
									</Tag>}
									<textarea rows="1" value={arg1} style={textStyle} onChange={(event) => setArg1(event.target.value)}></textarea>

									{"3) "}
									{arg2.length > 500 && <Tag color={'red'}>
										<Icon icon="bullhorn"/>
										- Warning - Too Long!
									</Tag>}
									<textarea rows="1" value={arg2} style={textStyle} onChange={(event) => setArg2(event.target.value)}></textarea>
								</FlexboxGrid.Item>

								<FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>
								<FlexboxGrid.Item
									style={{
										paddingTop: '5px',
										paddingLeft: '10px',
										textAlign: 'left'
									}}
									colspan={10}
								>
									{actionType.subTypes && actionType.subTypes.length >0 && <div>
                      What Kind of action is this? -{' '}
                      {actionType.subTypes.map((type, index) => (
                          <Tag index={index}>{type}</Tag>
                      ))}
                      <SelectPicker 
                          searchable={false}
                          data={actionType.subTypes.map( item => ({label: item, value: item}) )}
                          value={actionSubType}
													cleanable={false}
                          style={{ width: '100%' }}
                          onChange={setActionSubType}
                      />                                        
                  </div>}

									{locations && locations.length >0 && <div>
                      Where is this Action Happening? -{' '}
                      <SelectPicker 
                          data={locations.map( item => ({label: item.name, value: item._id}) )}
                          value={actionLocation}
													cleanable={false}
                          style={{ width: '100%' }}
                          onChange={setactionLocation}
                      />                                        
                  </div>}

								</FlexboxGrid.Item>
							</FlexboxGrid>
						</form>
						<div
							style={{
								justifyContent: 'end',
								display: 'flex',
								marginTop: '15px'
							}}
						>
							<Button onClick={() => handleSubmit()} disabled={isDisabled(effort)} color={isDisabled(effort) ? 'red' : 'green'} appearance="primary">
								<b>Submit</b>
							</Button>
							<Button onClick={() => props.closeNew()} appearance="subtle">
								Cancel
							</Button>
						</div>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
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

export default NewActionUr;
