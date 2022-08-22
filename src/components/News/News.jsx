import React from 'react'; // React import
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { getArticles } from '../../redux/entities/playerActions';
import { NewArticle } from './NewArticle';
import { Container, FlexboxGrid, Header, Input, InputGroup } from 'rsuite';

const News = () => {
	const articles = useSelector((state) => state.articles.list);
	const dummyArticle = {
		location: '',
		headline: '',
		body: '',
		tags: [],
		imageSrc: ''
	};

	// TODO: get data from redux
	// TODO: get "my articles" from redux
	// TODO: add the edit button
	// TODO: add the publish button in edit and create form  (New Article: Submit and Submit & Publish)

	articles.sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	});

	console.log(articles);

	const data = articles.map((el) => ({ author: el.creator?.characterName, title: el.title, body: el.body, date: el.updatedAt, comments: el.comments, authorId: el.creator?._id, articleId: el._id }));

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>News</Heading>
			<Container>
				<Header>
					<FlexboxGrid justify="center" align="middle">
						<FlexboxGrid.Item colspan={4}>
							<InputGroup>
								<Input style={{ width: '80%' }} placeholder="Search"></Input>
								<NewArticle drawer={true} />
							</InputGroup>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Header>
			</Container>
			<NewsFeed data={data} />
		</React.Fragment>
	);
};
export default News;
