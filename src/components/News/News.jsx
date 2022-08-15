import React from 'react'; // React import
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { getArticles } from '../../redux/entities/playerActions';

const News = () => {
	const articleActions = useSelector(getArticles);
	const articles = [];
	articleActions.forEach((action) => {
		action.attachments.forEach((attachment) => {
			let enrichtedAttachment = { ...attachment };
			enrichtedAttachment.creator = action.creator;
			articles.push(enrichtedAttachment);
		});
	});

	articles.sort((a, b) => {
		let da = new Date(a.updatedAt),
			db = new Date(b.updatedAt);
		return db - da;
	});

	const data = articles.map((el) => ({ author: el.creator?.characterName, title: el.title, body: el.body, date: el.updatedAt, comments: el.comments, authorId: el.creator?._id, articleId: el._id }));

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>News</Heading>
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default News;
