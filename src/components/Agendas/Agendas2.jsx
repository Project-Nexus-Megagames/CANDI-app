import React from 'react'; // React import
import AgendaFeed from '../Agendas/AgendaFeed';
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

	const data = agendas.map((el) => ({ author: el.creator.characterName, title: el.name, body: el.submission?.description, date: el.updatedAt, comments: el.comments, authorId: el.creator._id, articleId: el._id, type: 'agenda' }));

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>Agendas</Heading>
			<AgendaFeed />
		</React.Fragment>
	);
};
export default Agendas;
