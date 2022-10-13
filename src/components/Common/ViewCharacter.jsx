import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Content, Container, Sidebar, Input, Panel, ButtonGroup, Button, FlexboxGrid, Col, Tag, Row, Loader, TagGroup, Alert, InputGroup, Icon } from 'rsuite';

import {
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Center,
	Box,
	Avatar,
	HStack,
	Stack,
	Text,
	VStack
} from '@chakra-ui/react';
import { getDateString } from '../../scripts/dateTime';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';
import ResourceNugget from './ResourceNugget';
import ModifyCharacter from '../OtherCharacters/ModifyCharacter';
import AddAsset from '../OtherCharacters/AddAsset';
import DynamicForm from '../OtherCharacters/DynamicForm';

const ViewCharacter = (props) => {
	const [edit, setEdit] = useState(false);
	const [add, setAdd] = useState(false);
	const [asset, setAsset] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const myChar = useSelector(getMyCharacter);
	const loggedInUser = useSelector((state) => state.auth.user);

	let selected = props.selected;

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
			}
		}
	};

	return (
		<Drawer
			isOpen={props.isOpen}
			placement="right"
			size="xl"
			show={props.show}
			closeOnEsc="true"
			onClose={() => {
				props.closeDrawer();
			}}
		>
			<DrawerOverlay />
			<DrawerContent bgColor="#0f131a">
				<DrawerCloseButton />
				<DrawerHeader align="center">
					<Text>{selected?.characterName}</Text>
				</DrawerHeader>
				<DrawerBody>
          {selected && <FlexboxGrid>
								{/*Control Panel*/}
								{props.control && (
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
											
											<ButtonGroup style={{ marginTop: '5px' }}>
												<Button appearance={'ghost'} onClick={() => setEdit(true)}>
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
															{selected.tags && selected.tags.map((item, index) => <ResourceNugget value={item} width={'50px'} height={'30'} /> )}
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
											<FlexboxGrid.Item colspan={9} style={{ cursor: 'pointer' }} onClick={() => openAnvil(selected)}>
												<img src={`${selected.profilePicture}`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</Panel>
								</FlexboxGrid.Item>
					</FlexboxGrid>}

							<ModifyCharacter
								show={edit}
								selected={selected}
								closeModal={() => {
									setEdit(false);
								}}
							/>
							<AddAsset show={add} character={selected} loggedInUser={loggedInUser} closeModal={() => setAdd(false)} />
							<DynamicForm show={asset !== false} selected={asset} closeDrawer={() => setAsset(false)} />
				</DrawerBody>

			</DrawerContent>
		</Drawer>
	);
};

export default ViewCharacter;
