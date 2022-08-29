import React, { useState, useEffect } from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Heading } from '@chakra-ui/react';
import { getAgendaActions, getPublishedAgendas } from '../../redux/entities/playerActions';
import { Stack } from '@chakra-ui/react';
import { Loader, Header, Container, Input } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';

const Agendas = (props) => {
	const login = useSelector((state) => state.auth.login);
	const [filter, setFilter] = useState('');
	const agendas = useSelector(getAgendaActions).sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return da - db;
	});
	const myChar = useSelector(getMyCharacter);

	const publishedAgendas = useSelector(getPublishedAgendas).sort((a, b) => {
		let da = new Date(a.publishDate),
			db = new Date(b.publishDate);
		return da - db;
	});

	const [filteredData, setFilteredData] = useState([]);

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	const getSortedAgendas = () => {
		if (myChar.tags.some((tag) => tag.toLowerCase() === 'control')) {
			return agendas;
		}
		return publishedAgendas;
	};

	const mapArticlesToData = (agendas) => {
		return agendas.map((el) => ({
			author: el.creator.characterName,
			authorProfilePicture: el.creator.profilePicture,
			title: el.name,
			body: el.submission?.description,
			date: el.publishDate ? el.publishDate : el.createdAt,
			comments: el.comments,
			authorId: el.creator._id,
			articleId: el._id,
			type: 'agenda'
		}));
	};

	useEffect(() => {
		if (filter) {
			let filtered = [];
			const agendas = mapArticlesToData(getSortedAgendas());
			filtered = agendas.filter(
				(article) =>
					article.title?.toLowerCase().includes(filter.toLowerCase()) || article.body?.toLowerCase().includes(filter.toLowerCase()) || article.author?.toLowerCase().includes(filter.toLowerCase())
			);
			setFilteredData(filtered);
		} else setFilteredData(mapArticlesToData(getSortedAgendas()));
	}, [agendas, filter, publishedAgendas]);

	const handleSearch = (e) => {
		setFilter(e);
	};

	return (
		<React.Fragment>
			<NavigationBar />
			<Header>
				<Stack align="center" spacing="4">
					<Heading>Agendas</Heading>
					<Input style={{ width: '30%' }} placeholder="Search" onChange={(e) => handleSearch(e)}></Input>
				</Stack>
			</Header>
			<Container style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
				<NewsFeed data={filteredData} />
			</Container>
		</React.Fragment>
	);
};
export default Agendas;
