import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Content, Container, Input, Grid, List, PanelGroup, FlexboxGrid, Avatar, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon, Divider, Drawer, Panel } from 'rsuite';
import AddAsset from './AddAsset';
import ModifyCharacter from './ModifyCharacter';
import NavigationBar from '../Navigation/NavigationBar';
import { characterUpdated, getMyCharacter, getPublicCharacters } from '../../redux/entities/characters';
import { connect } from 'react-redux';
import NewCharacter from '../Control/NewCharacter';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';

const OtherCharacters = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [showDrawer, setShowDrawer] = React.useState(true);
	const [filteredCharacters, setFilteredCharacters] = React.useState(props.characters);
	const [edit, setEdit] = React.useState(false);
	const [add, setAdd] = React.useState(false);
	const [showNew, setShowNew] = React.useState(false);
	const publicCharacters = useSelector(getPublicCharacters);

	useEffect(() => {
		if (props.myCharacter.tags.indexOf('Control') !== -1) {
			setFilteredCharacters(props.characters);
		} else {
			let displayedCharacters = publicCharacters;
			if (props.myCharacter.knownContacts.length > 0) {
				for (const contact of props.myCharacter.knownContacts) {
					if (contact.tags.some((tag) => tag.toLowerCase() !== 'public')) displayedCharacters.push(contact);
				}
			}
			setFilteredCharacters(displayedCharacters);
		}
	});

	const listStyle = (item) => {
		if (item === selected) {
			return { cursor: 'pointer', backgroundColor: '#212429' };
		} else return { cursor: 'pointer' };
	};

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

	const handleSelect = (fuuuck) => {
		setSelected(fuuuck);
		setShowDrawer(false);
	};

	useEffect(() => {
		if (props.characters && selected) {
			const updated = props.characters.find((el) => el._id === selected._id);
			setSelected(updated);
			filterThis('');
		}
	}, [props.characters, selected]);

	const filterThis = (fil) => {
		const filtered = props.characters.filter(
			(char) =>
				char.characterName.toLowerCase().includes(fil.toLowerCase()) || char.email.toLowerCase().includes(fil.toLowerCase()) || char.tags.some((el) => el.toLowerCase().includes(fil.toLowerCase()))
		);
		setFilteredCharacters(filtered);
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
			case 'Private':
				return <Tag color="red">{item}</Tag>;
			default:
				return <Tag>{item}</Tag>;
		}
	};

	if (!props.login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	} else
		return (
			<React.Fragment>
				<NavigationBar />
				<Drawer show={showDrawer} placement={'left'} backdrop={false} style={{ width: '200px', marginTop: '51px' }} onClose={() => setShowDrawer(!showDrawer)}>
					<PanelGroup>
						<button
							onClick={() => setShowDrawer(!showDrawer)}
							className="toggle-menu"
							style={{
								transform: `translate(${200}px, 100px)`
							}}
						></button>
						<div
							style={{
								height: '40px',
								borderRadius: '0px',
								backgroundColor: '#000101',
								margin: '1px'
							}}
						>
							<InputGroup>
								<Input size="xs" onChange={(value) => filterThis(value)} placeholder="Search by Name or Email"></Input>
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
							<List hover size="sm">
								{filteredCharacters
									.filter((el) => el.tags.some((el) => el === 'God'))
									.map((character, index) => (
										<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
											<FlexboxGrid>
												<FlexboxGrid.Item colspan={5} style={styleCenter}>
													<Avatar src={character.tags.some((el) => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt="?" circle />
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
														<Tag color="green" style={{ marginLeft: '15px' }}>
															God
														</Tag>
													</b>
													<b style={slimText}>{character.email}</b>
												</FlexboxGrid.Item>
											</FlexboxGrid>
										</List.Item>
									))}

								{filteredCharacters
									.filter((el) => el.tags.some((el) => el === 'PC'))
									.map((character, index) => (
										<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
											<FlexboxGrid>
												<FlexboxGrid.Item colspan={5} style={styleCenter}>
													<Avatar src={character.tags.some((el) => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt="?" circle />
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
										<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
											<FlexboxGrid>
												<FlexboxGrid.Item colspan={5} style={styleCenter}>
													<Avatar src={character.tags.some((el) => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt="?" circle />
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
										<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
											<FlexboxGrid>
												<FlexboxGrid.Item colspan={5} style={styleCenter}>
													<Avatar src={character.tags.some((el) => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt="?" circle />
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
														{character.tags.some((el) => el === 'Control') && (
															<Tag color="orange" style={{ marginLeft: '15px' }}>
																Control
															</Tag>
														)}
													</b>
													<b style={slimText}>{character.email}</b>
												</FlexboxGrid.Item>
											</FlexboxGrid>
										</List.Item>
									))}

								{props.myCharacter.tags.some((el) => el === 'Control') && (
									<div>
										<h5>Control Only</h5>
										{filteredCharacters
											.filter((el) => !el.tags.some((el2) => el2 === 'Control' || el2 === 'NPC' || el2 === 'PC' || el2 === 'God'))
											.map((character, index) => (
												<List.Item key={index} index={index} onClick={() => handleSelect(character)} style={listStyle(character)}>
													<FlexboxGrid>
														<FlexboxGrid.Item colspan={5} style={styleCenter}>
															<Avatar src={character.tags.some((el) => el === 'Control') ? `/images/GW_Control_Icon.png` : `/images/${character.characterName}.jpg`} alt="?" circle />
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
																{character.tags.some((el) => el === 'Control') && (
																	<Tag color="orange" style={{ marginLeft: '15px' }}>
																		Control
																	</Tag>
																)}
															</b>
															<b style={slimText}>{character.email}</b>
														</FlexboxGrid.Item>
													</FlexboxGrid>
												</List.Item>
											))}
									</div>
								)}
							</List>
						</div>
					</PanelGroup>
				</Drawer>

				<Container>
					{!showDrawer && (
						<button
							onClick={() => setShowDrawer(!showDrawer)}
							className="toggle-menu"
							style={{
								transform: `translate(${0}px, 100px)`,
								transition: '0.8s ease'
							}}
						/>
					)}
					{selected && (
						<Content style={{ height: 'calc(100vh - 50px)', overflow: 'auto' }}>
							<Grid fluid>
								<Row>
									<Col xs={24} sm={24} md={8} className="gridbox">
										<div>
											<p>
												<img
													className="portrait"
													src={`/images/${selected.characterName}.jpg`}
													alt="Unable to load img"
													width="95%"
													style={{ maxHeight: '40vh', cursor: 'pointer' }}
													onClick={() => openAnvil(selected)}
												/>
											</p>
											<Button appearance="ghost" block onClick={() => copyToClipboard(selected)}>
												{selected.email}
											</Button>
											<p>
												<h5>{selected.characterName}</h5>
												<TagGroup>
													Tags:
													{selected.tags && selected.tags.map((item) => tagStyle(item))}
												</TagGroup>
												<Divider />
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
											<p>
												Time Zone: <b>{selected.timeZone}</b>
											</p>
											<p>
												<b>Bio:</b> {selected.bio}
											</p>
										</div>
									</Col>
								</Row>

								{/*God's Bonds */}
								{selected.tags.some((el) => el === 'God') && (
									<Row>
										<Col xs={8} sm={8} md={8} className="gridbox">
											<Panel bordered style={{ backgroundColor: '#272b34' }} header="Preferred">
												{props.godBonds.filter((el) => el.with._id === selected._id && el.level === 'Preferred').length}
											</Panel>
										</Col>
										<Col xs={8} sm={8} md={8} className="gridbox">
											<Panel bordered style={{ backgroundColor: '#272b34' }} header="Favoured">
												{props.godBonds.filter((el) => el.with._id === selected._id && el.level === 'Favoured').length}
											</Panel>
										</Col>
										<Col xs={8} sm={8} md={8} className="gridbox">
											<Panel bordered style={{ backgroundColor: '#272b34' }} header="Blessed">
												{props.godBonds.filter((el) => el.with._id === selected._id && el.level === 'Blessed').length}
											</Panel>
										</Col>
									</Row>
								)}
							</Grid>

							<ModifyCharacter show={edit} selected={selected} closeDrawer={() => setEdit(false)} />
							<AddAsset show={add} character={selected} closeModal={() => setAdd(false)} />
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
	login: state.auth.login,
	characters: state.characters.list,
	duck: state.gamestate.duck,
	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherCharacters);
