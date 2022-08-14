import React from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Heading } from '@chakra-ui/react';

const Agendas = () => {
	const actions = useSelector((state) => state.actions.list);
	const agendas = actions.filter((el) => el.type === 'Agenda');
	const data = agendas.map((el) => ({ author: el.creator.characterName, title: el.name, body: el.submission?.description, date: el.createdAt, comments: el.comments, authorId: el.creator._id }));

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>Agendas</Heading>
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default Agendas;
