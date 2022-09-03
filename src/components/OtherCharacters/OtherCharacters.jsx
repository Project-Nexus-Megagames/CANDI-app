import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { ButtonGroup, Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon } from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { connect } from 'react-redux';
import NewCharacter from '../Control/NewCharacter';
import MobileOtherCharacters from './MobileOtherCharacters';
import DynamicForm from './DynamicForm';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import { getMyCharacter, getPublicCharacters, getPrivateCharacters, characterUpdated } from './../../redux/entities/characters';
import CharacterListItem from './CharacterListItem';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import ViewCharacter from '../Common/ViewCharacter';
import ResourceNugget from '../Common/ResourceNugget';

const OtherCharacters = (props) => {
	const publicCharacters = useSelector(getPublicCharacters);
	const privateCharacters = useSelector(getPrivateCharacters);
	const [selected, setSelected] = useState(null);
	const [filteredCharacters, setFilteredCharacters] = useState([]);
	const [edit, setEdit] = useState(false);
	const [add, setAdd] = useState(false);
	const [asset, setAsset] = useState(false);

	const [showNew, setShowNew] = useState(false);
	const loggedInUser = useSelector((state) => state.auth.user);

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	let characters = [...publicCharacters, ...props.myCharacter.knownContacts];
	const [renderTags] = React.useState(['Frog', 'Pig', 'Spider', 'Drow', 'Myconid', 'Raccoon', 'Drow', 'Dwarves', 'Whitewall', 'The Overlord', 'Control']); // TODO: update with Faction tags

	useEffect(() => {
		filterThis('');
	}, []);

	const copyToClipboard = (character) => {
		if (character.characterName === 'The Box') {
			const audio = new Audio('/candi1.mp3');
			audio.loop = true;
			audio.play();
		} else {
			let board = `${character.email}`;
			let array = [...character.control];

			for (const controller of props.myCharacter.control) {
				if (!array.some((el) => el === controller)) {
					array.push(controller);
				}
			}

			for (const controller of array) {
				const character = props.characters.find((el) => el.characterName === controller);
				if (character) {
					board = board.concat(`; ${character.email}`);
				} else console.log(`${controller} could not be added to clipboard`);
				Alert.error(`${controller} could not be added to clipboard`, 6000);
			}

			navigator.clipboard.writeText(board);
			Alert.success('Email Copied!', 6000);
		}
	};

	const openAnvil = (character) => {
		if (character.characterName === 'The Box') {
			const audio = new Audio('/candi1.mp3');
			audio.loop = true;
			audio.play();
		} else {
			if (character.wiki && character.wiki !== '') {
				let url = character.wiki;
				const win = window.open(url, '_blank');
				win.focus();
			} else if (character.tags.some((el) => el === 'God' || el === 'Gods')) {
				let url = `https://godswars.miraheze.org/wiki/Gods#${character.characterName}`;
				const win = window.open(url, '_blank');
				win.focus();
			} else {
				let url = 'https://godswars.miraheze.org/wiki/';
				let temp = url.concat(character.characterName.split(' ').join('_'));
				const win = window.open(temp, '_blank');
				win.focus();
			}
		}
	};

	const tagStyle = (item, index) => {
		switch (item) {
			case 'Control':
				return (
					<Tag index={index} style={{ color: 'black' }} color="orange">
						{item}
					</Tag>
				);
			case 'God':
				return (
					<Tag index={index} color="green">
						{item}
					</Tag>
				);
			case 'NPC':
				return (
					<Tag index={index} color="blue">
						{item}
					</Tag>
				);
			case 'PC':
				return (
					<Tag index={index} color="cyan">
						{item}
					</Tag>
				);
			case 'Private':
				return (
					<Tag index={index} color="red">
						{item}
					</Tag>
				);
			default:
				return <Tag index={index}>{item}</Tag>;
		}
	};

	const listStyle = (item) => {
		if (selected && item._id === selected._id) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer', height: '100%' };
	};

	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find((el) => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters, selected]);

	const filterThis = (fil) => {
		const filtered = characters.filter(
			(char) =>
				char.characterName.toLowerCase().includes(fil.toLowerCase()) ||
				char.email.toLowerCase().includes(fil.toLowerCase()) ||
				char.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
				char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
		);
		setFilteredCharacters(filtered);
	};

	// if (window.innerWidth < 768) {
	// 	return <MobileOtherCharacters />;
	// } else
	return (
		<React.Fragment>
			<NavigationBar />
			<Container style={{ height: 'calc(100vh - 50px)' }}>
				<Sidebar>
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
								<Input style={{ height: '39px' }} onChange={(value) => filterThis(value)} placeholder="Search by Name or Email"></Input>
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<Button color="green" onClick={() => setShowNew(true)}>
										<Icon icon="plus" />
									</Button>
								)}
							</InputGroup>
						</div>
						<div
							style={{
								height: 'calc(100vh - 80px)',
								borderRadius: '0px',
								overflow: 'auto',
								scrollbarWidth: 'none',
								borderRight: '1px solid rgba(255, 255, 255, 0.12)'
							}}
						>
							<div>
								{renderTags.map((tag, index) => (
									<List key={index} hover>
										{filteredCharacters.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase())).length > 0 && (
											<p style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`) }}>{tag}</p>
										)}
										{filteredCharacters
											.filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase()))
											.map((character, index0) => (
												<List.Item key={`${character._id}-${index}-${index0}`} style={listStyle(character)}>
													<CharacterListItem setSelected={setSelected} character={character} tagStyle={tagStyle} key={character._id} />
												</List.Item>
											))}
									</List>
								))}
								
								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<List hover>
										<p style={{ backgroundColor: getFadedColor('Unknown'), color: getFadedColor(`${'Unknown'}-text`) }}>{'( Hidden )'}</p>
										{privateCharacters
											// .filter()
											.map((character) => (
												<List.Item key={character._id} style={listStyle(character)}>
													<CharacterListItem setSelected={setSelected} character={character} tagStyle={tagStyle} key={character._id} />
												</List.Item>
											))}

										<p style={{ backgroundColor: getFadedColor('All'), color: getFadedColor(`${'Unknown'}-text`) }}>{'( All Characters )'}</p>
										{props.characters
											// .filter()
											.map((character) => (
												<List.Item key={character._id} style={listStyle(character)}>
													<CharacterListItem setSelected={setSelected} character={character} tagStyle={tagStyle} key={character._id} />
												</List.Item>
											))}
									</List>
								)}
							</div>
						</div>
					</PanelGroup>
				</Sidebar>
				{selected && (
					<Content>
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
										<h5>Effort Left: TODO DISPLAY EFFORT HERE </h5>
										<ButtonGroup style={{ marginTop: '5px' }}>
											<Button
												appearance={'ghost'}
												onClick={() => {
													setEdit(true);
												}}
											>
												Modify
											</Button>
											<Button appearance={'ghost'} onClick={() => setAdd(true)}>
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
												{props.assets.filter((el) => el.ownerCharacter === selected._id).length === 0 && <h5>No assets assigned</h5>}
												{props.assets
													.filter((el) => el.ownerCharacter === selected._id)
													.map((asset, index) => (
														<Col index={index} key={index} md={6} sm={12}>
															<Panel onClick={() => setAsset(asset)} bordered>
																<h5>{asset.name}</h5>
																<b>{asset.type}</b>
																{asset.status.hidden && <Tag color="blue">Hidden</Tag>}
																{asset.status.lendable && <Tag color="blue">lendable</Tag>}
																{asset.status.lent && <Tag color="blue">lent</Tag>}
																{asset.status.used && <Tag color="blue">used</Tag>}
																{asset.status.multiUse && <Tag color="blue">multiUse</Tag>}
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
										<FlexboxGrid.Item colspan={14} style={{ textAlign: 'center' }}>
											<FlexboxGrid align="middle" style={{ textAlign: 'center' }}>
												<FlexboxGrid.Item colspan={12}>
													<h2>{selected.characterName}</h2>
													{selected.characterTitle !== 'None' && <h5>{selected.characterTitle}</h5>}
												</FlexboxGrid.Item>

												<FlexboxGrid.Item colspan={12}>
													<TagGroup>
														Tags:
														<TagGroup style={{ display: 'flex', marginLeft: '0px', marginTop: '-1px' }}>
															{selected.tags && selected.tags.map((item, index) => <ResourceNugget index={index} value={item} width={'50px'} height={'30'} />)}
														</TagGroup>
													</TagGroup>
												</FlexboxGrid.Item>
											</FlexboxGrid>

											<Button appearance="ghost" block onClick={() => copyToClipboard(selected)}>
												{selected.email}
											</Button>
											<FlexboxGrid style={{ paddingTop: '5px' }}>
												<FlexboxGrid.Item colspan={12}>
													<p>
														<TagGroup>
															Controllers:
															{selected.control &&
																selected.control.map((item, index) => (
																	<Tag style={{ color: 'black' }} color="orange" key={index} index={index}>
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
										<FlexboxGrid.Item colspan={9}>
											<img src={`${selected.profilePicture}`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</Panel>
							</FlexboxGrid.Item>
						</FlexboxGrid>
						<ModifyCharacter
							show={edit}
							selected={selected}
							closeModal={() => {
								setEdit(false);
							}}
						/>
						<AddAsset show={add} character={selected} loggedInUser={loggedInUser} closeModal={() => setAdd(false)} />
						<DynamicForm show={asset !== false} selected={asset} closeDrawer={() => setAsset(false)} />
					</Content>
				)}
			</Container>
			<NewCharacter show={showNew} closeModal={() => setShowNew(false)} />
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	control: state.auth.control,
	assets: state.assets.list,
	godBonds: getGodBonds(state),
	mortalBonds: getMortalBonds(state),
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
