import React, { useState, useEffect } from 'react'; // React import
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { getArticles } from '../../redux/entities/playerActions';
import { NewArticle } from './NewArticle';
import { Container, FlexboxGrid, Header, Input, InputGroup } from 'rsuite';
import { Loader } from 'rsuite';

const News = (props) => {
	const articles = useSelector((state) => state.articles.list);
	const login = useSelector((state) => state.auth.login);
	const [data, setData] = useState([]);

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	// TODO: get "my articles" from redux
	// TODO: add the edit button
	// TODO: add the publish button in edit and create form  (New Article: Submit and Submit & Publish)

	useEffect(() => {
		const sortedArticles = [...articles];
		sortedArticles.sort((a, b) => {
			let da = new Date(a.createdAt),
				db = new Date(b.createdAt);
			return db - da;
		});
		const tempData = sortedArticles.map((el) => ({ authorProfilePicture: el.creator.profilePicture, imageURL: el.image, author: el.creator?.characterName, title: el.title, body: el.body, date: el.createdAt, comments: el.comments, articleId: el._id, type: 'newsArticle' }));
		setData(tempData);
	}, [articles]);

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
