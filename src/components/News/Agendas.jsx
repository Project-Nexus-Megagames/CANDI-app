import React, { useState, useEffect } from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Heading } from '@chakra-ui/react';
import { getAgendaActions } from '../../redux/entities/playerActions';
import { Stack, Input } from '@chakra-ui/react';
import { Loader } from 'rsuite';

const Agendas = (props) => {
	const login = useSelector((state) => state.auth.login);
	const [filter, setFilter] = useState('');
	const agendas = useSelector(getAgendaActions);
	agendas.sort((a, b) => {
		let da = new Date(a.updatedAt),
			db = new Date(b.updatedAt);
		return db - da;
	});

	const [filteredData, setFilteredData] = useState([]);

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	useEffect(() => {
		const data = agendas.map((el) => ({ author: el.creator.characterName, authorProfilePicture: el.creator.profilePicture, title: el.name, body: el.submission?.description, date: el.updatedAt, comments: el.comments, authorId: el.creator._id, articleId: el._id, type: 'agenda' }));
		if (filter) {
			let filtered = [];
			filtered = data.filter((article) => article.title.toLowerCase().includes(filter) || article.body?.toLowerCase().includes(filter));
			setFilteredData(filtered);
		} else setFilteredData(data);
	}, [agendas, filter]);

	const handleSearch = (e) => {
		setFilter(e);
	};

	return (
		<React.Fragment>
			<NavigationBar />
			<Stack align="center" spacing="4">
				<Heading>Agendas</Heading>
				<Input style={{ width: '30%' }} placeholder="Search" onChange={(e) => handleSearch(e.target.value)}></Input>
			</Stack>
			<NewsFeed data={filteredData} />
		</React.Fragment>
	);
};
export default Agendas;
