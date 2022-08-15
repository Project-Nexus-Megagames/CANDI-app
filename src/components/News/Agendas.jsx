import React from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Heading } from '@chakra-ui/react';
import { getAgendaActions } from '../../redux/entities/playerActions';

const Agendas = () => {
	const agendas = useSelector(getAgendaActions);

	agendas.sort((a, b) => {
		let da = new Date(a.updatedAt),
			db = new Date(b.updatedAt);
		return db - da;
	});

	const data = agendas.map((el) => ({ author: el.creator.characterName, title: el.name, body: el.submission?.description, date: el.createdAt, comments: el.comments, authorId: el.creator._id, articleId: el._id }));

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>Agendas</Heading>
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default Agendas;
