import React, { useState, useEffect } from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Box, Heading } from '@chakra-ui/react';
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
	const [round, setRound] = useState(gamestate.round);
	const [selected, setSelected] = useState(null);
	const [filteredData, setFilteredData] = useState([]);

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	useEffect(() => {
		if (selected) {
			const newSelected = agendas.find((el) => el._id === selected._id);
			setSelected(newSelected);
		}
	}, [agendas, selected]);

	useEffect(() => {
		if (filter) {
			let filtered = [];
			let agendasToFilter = [];
			myChar.tags.some((el) => el.toLowerCase() === 'control') ? (agendasToFilter = agendas) : (agendasToFilter = publishedAgendas);

			filtered = agendasToFilter.filter(
				(agenda) =>
					agenda.name?.toLowerCase().includes(filter.toLowerCase()) ||
					agenda.submission.description?.toLowerCase().includes(filter.toLowerCase()) ||
					agenda.creator.characterName?.toLowerCase().includes(filter.toLowerCase())
			);
			setFilteredData(filtered);
		} else myChar.tags.some((el) => el.toLowerCase() === 'control') ? setFilteredData(agendas) : setFilteredData(publishedAgendas);
	}, [agendas, filter, publishedAgendas, myChar]);

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
				<Stack direction={['column', 'row']} align="center" spacing="4" justify={'center'}>
					<tbody>
						{[...Array(gamestate.round)].map((x, i) => (
							<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} color="blue" appearance={i + 1 === round ? 'primary' : 'ghost'} circle>
								{i + 1}
							</Button>
						))}
					</tbody>

					<Input style={{ width: '20%' }} placeholder="Search" onChange={(e) => handleSearch(e)}></Input>
				</Stack>
			</Header>
			<Container style={{ height: 'calc(100vh - 100px)', overflow: 'auto', display: 'flex', alignItems: 'center' }}>
				<h5>Round {round}</h5>
				{filteredData.filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
				{filteredData
					.filter((el) => el.round === round)
					.map((agenda, index) => (
						<div index={index} key={index}>
							<Divider vertical />
							<div
								onClick={() => setSelected(agenda)}
								style={{
									cursor: 'pointer',
									border:
										(agenda.tags.some((tag) => tag.toLowerCase() !== 'published') || !agenda.tags.length > 0) && agenda.type === 'Agenda'
											? `4px dotted ${getFadedColor(agenda.type)}`
											: `4px solid ${getFadedColor(agenda.type)}`,
									borderRadius: '5px',
									padding: '15px',
									width: '800px'
								}}
							>
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
										<b>Comments {agenda.comments.length}</b>
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
