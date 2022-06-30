import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, } from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { characterUpdated } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NewCharacter from '../Control/NewCharacter';
import DynamicForm from './DynamicForm';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import {
	getMyCharacter,
} from './../../redux/entities/characters';
import socket from '../../socket';

const OtherCharacters = (props) => {
	const [selected, setSelected] = useState(null);
	const [asset, setAsset] = useState(false);
	const [filteredCharacters, setFilteredCharacters] = useState([]);
	const [edit, setEdit] = useState(false);
	const [add, setAdd] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const listStyle = (item) => {
		if (item === selected) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};

	const tagStyle = (item) => {
		switch (item) {
			case 'Control':
				return (
					<Tag style={{ color: 'black' }} color="orange">
						{item}
					</Tag>
				);
			case 'God':
				return <Tag color="green">{item}</Tag>;
			case 'NPC':
				return <Tag color="blue">{item}</Tag>;
			case 'PC':
				return <Tag color="cyan">{item}</Tag>;
			default:
				return <Tag>{item}</Tag>;
		}
	};

	const arrg = async () => {
		const data = {
			character: props.myCharacter.characterName,
			email: props.myCharacter.email,
		}
		try{
			socket.emit('request', { route: 'character', action: 'pirate', data });
		}
		catch (err) {
			console.log(err)
			Alert.error(`Error: ${err}`, 5000);
		}
	}

	const copyToClipboard = (character) => {
		if (character.characterName === 'Black Bob') {
			arrg()
		} else {
			let board = `${character.email}`;
			let array = [...character.control];

			for (const controller of props.myCharacter.control) {
				if (!array.some((el) => el === controller)) {
					array.push(controller);
				}
			}

			for (const controller of array) {
				const character = props.characters.find(
					(el) => el.characterName === controller
				);
				if (character) {
					board = board.concat(`; ${character.email}`);
				} else console.log(`${controller} could not be added to clipboard`);
				Alert.error(`${controller} could not be added to clipboard`, 6000);
			}

			navigator.clipboard.writeText(board);
			Alert.success('Email Copied!', 6000);
		}
	};

	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find((el) => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters]);


	const filterThis = (fil) => {
		let filtered = [];
		if (props.myCharacter && props.myCharacter.tags.indexOf('Control') !== -1) {
			filtered = props.characters.filter(
				(char) =>
					char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
					char.email.toLowerCase().includes(fil.toLowerCase()) ||
					char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
					char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
			);
		} else {
			filtered = props.myCharacter.knownContacts.filter(
				(char) =>
					char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
					char.email.toLowerCase().includes(fil.toLowerCase()) ||
					char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
					char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
			);
		}
		setFilteredCharacters(filtered);
	};

	useEffect(() => {
		if (props.characters && props.myCharacter) {
			setFilteredCharacters(props.myCharacter.tags.some((el) => el === 'Control') ? props.characters : props.myCharacter.knownContacts);
		}
	}, [props.characters, props.myCharacter]);

	if (!props.login || !props.myCharacter) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}
	else
		return (
			<React.Fragment>
				<NavigationBar />
				<Container style={{ height: 'calc(100vh - 50px)' }}>
					<Sidebar className="side-bar">
						<PanelGroup>
							<div
								style={{
									height: '40px',
									borderRadius: '0px',
									backgroundColor: '#000101',
									margin: '1px'
								}}
							>
								<InputGroup>
									<Input
										style={{ height: '39px' }}
										onChange={(value) => filterThis(value)}
										placeholder="Search by Name or Email"
									></Input>
									{props.myCharacter.tags.some((el) => el === 'Control') && (
										<Button color="green" onClick={() => setShowNew(true)}>
											<Icon icon="plus" />
										</Button>
									)}
								</InputGroup>
							</div>
							<div
								bodyFill
								style={{
									height: 'calc(100vh - 80px)',
									borderRadius: '0px',
									overflow: 'auto',
									scrollbarWidth: 'none',
									borderRight: '1px solid rgba(255, 255, 255, 0.12)'
								}}
							>
								<List hover size="sm">


									{filteredCharacters
										.filter((el) => el.tags.some((el) => el === 'PC'))
										.map((character, index) => (
											<List.Item
												key={index}
												index={index}
												onClick={() => setSelected(character)}
												style={listStyle(character)}
											>
												<FlexboxGrid>
													<FlexboxGrid.Item colspan={5} style={styleCenter}>
														<Avatar
															src={
																character.tags.some((el) => el === 'Control')
																	? `/images/control.png`
																	: `/images/${character.characterName}.jpg`
															}
															alt="?"
															circle
														/>
													</FlexboxGrid.Item>
													<FlexboxGrid.Item
														colspan={19}
														style={{
															...styleCenter,
															flexDirection: 'column',
															alignItems: 'flex-start',
															overflow: 'hidden'
														}}
													>
														<b style={titleStyle}>
															{character.characterName}
															<Tag color="cyan" style={{ marginLeft: '15px' }}>
																PC
															</Tag>
														</b>
														<b style={slimText}>{character.email}</b>
													</FlexboxGrid.Item>
												</FlexboxGrid>
											</List.Item>
										))}

									{filteredCharacters
										.filter((el) => el.tags.some((el) => el === 'NPC'))
										.map((character, index) => (
											<List.Item
												key={index}
												index={index}
												onClick={() => setSelected(character)}
												style={listStyle(character)}
											>
												<FlexboxGrid>
													<FlexboxGrid.Item colspan={5} style={styleCenter}>
														<Avatar
															src={
																character.tags.some((el) => el === 'Control')
																	? `/images/control.png`
																	: `/images/${character.characterName === '???' ? 'Unknown' : character.characterName}.jpg`
															}
															alt="?"
															circle
														/>
													</FlexboxGrid.Item>
													<FlexboxGrid.Item
														colspan={19}
														style={{
															...styleCenter,
															flexDirection: 'column',
															alignItems: 'flex-start',
															overflow: 'hidden'
														}}
													>
														<b style={titleStyle}>
															{character.characterName}
															<Tag color="blue" style={{ marginLeft: '15px' }}>
																NPC
															</Tag>
														</b>
														<b style={slimText}>{character.email}</b>
													</FlexboxGrid.Item>
												</FlexboxGrid>
											</List.Item>
										))}

									{filteredCharacters
										.filter((el) => el.tags.some((el) => el === 'Control'))
										.map((character, index) => (
											<List.Item
												key={index}
												index={index}
												onClick={() => setSelected(character)}
												style={listStyle(character)}
											>
												<FlexboxGrid>
													<FlexboxGrid.Item colspan={5} style={styleCenter}>
														<Avatar
															src={
																character.tags.some((el) => el === 'Control')
																	? `/images/control.png`
																	: `/images/${character.characterName}.jpg`
															}
															alt="?"
															circle
														/>
													</FlexboxGrid.Item>
													<FlexboxGrid.Item
														colspan={19}
														style={{
															...styleCenter,
															flexDirection: 'column',
															alignItems: 'flex-start',
															overflow: 'hidden'
														}}
													>
														<b style={titleStyle}>
															{character.characterName}
															{character.tags.some(
																(el) => el === 'Control'
															) && (
																<Tag
																	color="orange"
																	style={{ marginLeft: '15px', color: 'black' }}
																>
																	Control
																</Tag>
															)}
														</b>
														<b style={slimText}>{character.email}</b>
													</FlexboxGrid.Item>
												</FlexboxGrid>
											</List.Item>
										))}

								</List>
							</div>
						</PanelGroup>
					</Sidebar>
					{selected && (
						<Content style={{ overflow: 'auto', height: 'auto' }}>
							<FlexboxGrid>
								{/*Control Panel*/}
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<FlexboxGrid.Item colspan={24}>
										<Panel
											style={{
												backgroundColor: '#61342e',
												border: '2px solid rgba(255, 255, 255, 0.12)',
												textAlign: 'center',
												height: 'auto'
											}}
										>
											<h4>Control Panel</h4>
											<h5>Effort Left: {selected.effort} </h5>
											<ButtonGroup style={{ marginTop: '5px' }}>
												<Button
													appearance={'ghost'}
													onClick={() => setEdit(true)}
												>
													Modify
												</Button>
												<Button
													appearance={'ghost'}
													onClick={() => setAdd(true)}
												>
													+ Resources
												</Button>
											</ButtonGroup>

											<Panel
												style={{
													backgroundColor: '#15181e',
													border: '2px solid rgba(255, 255, 255, 0.12)',
													textAlign: 'center'
												}}
											>
												<h5>Resources</h5>
												<Row style={{ display: 'flex', overflow: 'auto' }}>
													{props.assets.filter(
														(el) => el.ownerCharacter === selected._id
													).length === 0 && <h5>No assets assigned</h5>}
													{props.assets
														.filter((el) => el.ownerCharacter === selected._id)
														.map((asset, index) => (
															<Col md={6} sm={12}>
																<Panel
																	onClick={() => setAsset(asset)}
																	index={index}
																	bordered
																>
																	<h5>{asset.name}</h5>
																	<b>{asset.type}</b>
																	{asset.status.hidden && (
																		<Tag color="blue">Hidden</Tag>
																	)}
																	{asset.status.lendable && (
																		<Tag color="blue">lendable</Tag>
																	)}
																	{asset.status.lent && (
																		<Tag color="blue">lent</Tag>
																	)}
																	{asset.status.used && (
																		<Tag color="blue">used</Tag>
																	)}
																	{asset.status.multiUse && (
																		<Tag color="blue">multiUse</Tag>
																	)}
																</Panel>
															</Col>
														))}
												</Row>
											</Panel>
										</Panel>
									</FlexboxGrid.Item>
								)}
								<FlexboxGrid.Item colspan={24}>
									<Panel
										style={{
											padding: '0px',
											textAlign: 'left',
											backgroundColor: '#15181e',
											whiteSpace: 'pre-line'
										}}
									>
										<FlexboxGrid>
											<FlexboxGrid.Item
												colspan={14}
												style={{ textAlign: 'center' }}
											>
												<FlexboxGrid
													align="middle"
													style={{ textAlign: 'center' }}
												>
													<FlexboxGrid.Item colspan={12}>
														<h2>{selected.characterName}</h2>
														{selected.characterTitle !== 'None' && (
															<h5>{selected.characterTitle}</h5>
														)}
													</FlexboxGrid.Item>

													<FlexboxGrid.Item colspan={12}>
														<TagGroup>
															Tags:
															{selected.tags &&
																selected.tags.map((item, index) =>
																	tagStyle(item)
																)}
														</TagGroup>
													</FlexboxGrid.Item>
												</FlexboxGrid>

												<Button
													appearance="ghost"
													block
													onClick={() => copyToClipboard(selected)}
												>
													{selected.email}
												</Button>
												<FlexboxGrid style={{ paddingTop: '5px' }}>
													<FlexboxGrid.Item colspan={12}>
														<p>
															<TagGroup>
																Controllers:
																{selected.control &&
																	selected.control.map((item, index) => (
																		<Tag
																			style={{ color: 'black' }}
																			color="orange"
																			index={index}
																		>
																			{item}
																		</Tag>
																	))}
															</TagGroup>
														</p>
														<p>
															Character Pronouns: <b>{selected.pronouns}</b>
														</p>
													</FlexboxGrid.Item>
													<FlexboxGrid.Item colspan={12}>
														<p>
															Time Zone: <b>{selected.timeZone}</b>
														</p>
													</FlexboxGrid.Item>
												</FlexboxGrid>
												<br></br>
												<p style={{ color: 'rgb(153, 153, 153)' }}>Bio</p>
												<p>{selected.bio}</p>
											</FlexboxGrid.Item>

											<FlexboxGrid.Item colspan={1} />

											{/*Profile Pic*/}
											<FlexboxGrid.Item
												colspan={9}
												// style={{ cursor: 'pointer' }}
												// onClick={() => openAnvil(selected)}
											>
												<img
													src={
														selected.tags.some((el) => el === 'Control')
															? `/images/control.png`
															: `/images/${selected.characterName}.jpg`
													}
													alt="Img could not be displayed"
													width="90%"
													style={{ maxHeight: '50vh' }}
												/>
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</Panel>
								</FlexboxGrid.Item>
							</FlexboxGrid>

							<ModifyCharacter
								show={edit}
								selected={selected}
								closeDrawer={() => setEdit(false)}
							/>
							<AddAsset
								show={add}
								character={selected}
								closeModal={() => setAdd(false)}
							/>
							<DynamicForm
								show={asset !== false}
								selected={asset}
								closeDrawer={() => setAsset(false)}
							/>
						</Content>
					)}
				</Container>
				<NewCharacter show={showNew} closeModal={() => setShowNew(false)} />
			</React.Fragment>
		);
};

const styleCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '60px'
};

const titleStyle = {
	whiteSpace: 'nowrap',
	fontWeight: 500,
	paddingLeft: 2
};

const slimText = {
	fontSize: '0.966em',
	color: '#97969B',
	fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2,
	whiteSpace: 'nowrap'
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	assets: state.assets.list,
	godBonds: getGodBonds(state),
	mortalBonds: getMortalBonds(state),	
  characters: state.characters.list,
	login: state.auth.login,
	control: state.auth.control,
	duck: state.gamestate.duck,
	myCharacter: state.auth.character
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
