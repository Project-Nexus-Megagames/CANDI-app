import React, { useState, useEffect } from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Heading } from '@chakra-ui/react';
import { getAgendaActions, getPublishedAgendas } from '../../redux/entities/playerActions';
import { Stack } from '@chakra-ui/react';
import { Loader, Header, Container, Input, FlexboxGrid, ButtonToolbar, ButtonGroup, Avatar, Button, IconButton, Icon, Divider } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { getFadedColor, getTime } from '../../scripts/frontend';
import socket from '../../socket';
import AgendaDrawer from './AgendaDrawer';

const Agendas = (props) => {
	const login = useSelector((state) => state.auth.login);
	const gamestate = useSelector((state) => state.gamestate);
	const myChar = useSelector(getMyCharacter);

	const agendas = useSelector(getAgendaActions).sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return da - db;
	});

	const publishedAgendas = useSelector(getPublishedAgendas).sort((a, b) => {
		let da = new Date(a.publishDate),
			db = new Date(b.publishDate);
		return da - db;
	});

	const [filter, setFilter] = useState('');
	const [selected, setSelected] = useState(null);
	const [filteredData, setFilteredData] = useState([]);

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	useEffect(() => {
		if (filter) {
			let filtered = [];
			filtered = agendas.filter(
				(agenda) =>
					agenda.name?.toLowerCase().includes(filter.toLowerCase()) || agenda.submission.description?.toLowerCase().includes(filter.toLowerCase()) || agenda.creator.characterName?.toLowerCase().includes(filter.toLowerCase())
			);
			setFilteredData(filtered);
		} else setFilteredData(agendas);
	}, [agendas, filter, publishedAgendas]);

	const handleSearch = (e) => {
		setFilter(e);
	};

	const handlePublish = async (agenda) => {
		const id = agenda._id;
		socket.emit('request', { route: 'action', action: 'publish', id });
	};

	return (
		<React.Fragment>
			<NavigationBar />
			<Header>
				<Stack align="center" spacing="4">
					<Input style={{ width: '30%' }} placeholder="Search" onChange={(e) => handleSearch(e)}></Input>
				</Stack>
			</Header>
			<Container style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
				{filteredData.map((agenda, index) => (
					<div index={index}>
						<Divider vertical />
							<div onClick={() => setSelected(agenda)} style={{ cursor: 'pointer', 
							border: ((agenda.tags.some((tag) => tag !== 'Published') || !agenda.tags.length > 0) && agenda.type === 'Agenda') ? 
							`4px dotted ${getFadedColor(agenda.type)}`	: `4px solid ${getFadedColor(agenda.type)}`, 
							borderRadius: '5px', padding: '15px' }}>
											<FlexboxGrid align="middle" style={{}} justify="center">
												<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
													<Avatar circle size="md" src={agenda.creator.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
												</FlexboxGrid.Item>
							
												<FlexboxGrid.Item colspan={15}>
													<h5>{agenda.name}</h5>
													{agenda.creator.playerName} - {agenda.creator.characterName}
													<p className="slim-text">{getTime(agenda.submission.createdAt)}</p>
												</FlexboxGrid.Item>
							
												<FlexboxGrid.Item colspan={4}>
													{(myChar._id === agenda.creator._id || myChar.tags.some((el) => el === 'Control')) && (
														<ButtonToolbar>
															<ButtonGroup>
																{(agenda.tags.some((tag) => tag !== 'Published') || !agenda.tags.length > 0) && agenda.type === 'Agenda' && (
																	<Button
																		disabled={(gamestate.status !== 'Active' || gamestate.round > agenda.round) && !myChar.tags.some((el) => el === 'Control')}
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
																		(gamestate.status !== 'Active' || gamestate.round > agenda.round || agenda.tags.some((tag) => tag === 'Published')) &&
																		!myChar.tags.some((el) => el === 'Control')
																	}
																	size="md"
																	onClick={() => console.log('edit')}
																	color="blue"
																	icon={<Icon icon="pencil" />}
																/>
																<IconButton
																	disabled={(gamestate.status !== 'Active' || gamestate.round > agenda.round) && !myChar.tags.some((el) => el === 'Control')}
																	size="md"
																	onClick={() => console.log('delete')}
																	color="red"
																	icon={<Icon icon="trash2" />}
																/>
															</ButtonGroup>
														</ButtonToolbar>
													)}
												</FlexboxGrid.Item>
											</FlexboxGrid>
							</div>							
						</div>
				))}
				<AgendaDrawer isOpen={selected} show={selected} selected={selected} closeDrawer={() => setSelected(false)} />
			</Container>
		</React.Fragment>
	);
};
export default Agendas;
