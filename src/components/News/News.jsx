import React, { useState, useEffect } from 'react'; // React import
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { NewArticle } from './NewArticle';
import { Container, FlexboxGrid, Header, Input, InputGroup, Button, Divider } from 'rsuite';
import { Loader } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';

const News = (props) => {
	const articles = useSelector((state) => state.articles.list);
	const login = useSelector((state) => state.auth.login);
	const myCharacter = useSelector(getMyCharacter);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredData, setFilteredData] = useState([]);
	const [filtered, setFiltered] = useState(false);

	const [filterButtonText, setFilterButtonText] = useState('Show My Articles');

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	// TODO: add the edit button in NewsFeed (but only for News Articles!)
	// TODO: add the publish button in edit and create form  (New Article: Submit and Submit & Publish)

	const sortedArticles = [...articles];
	sortedArticles.sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	});
	const data = sortedArticles.map((el) => ({ authorProfilePicture: el.creator.profilePicture, imageURL: el.image, author: el.creator?.characterName, title: el.title, body: el.body, date: el.createdAt, comments: el.comments, articleId: el._id, type: 'newsArticle' }));

	useEffect(() => {
		if (searchQuery) {
			let filtered = [];
			filtered = data.filter((article) => article.title.toLowerCase().includes(searchQuery) || article.body?.toLowerCase().includes(searchQuery) || article.author.toLowerCase().includes(searchQuery));
			setFilteredData(filtered);
		} else setFilteredData(data);
	}, [articles, searchQuery]);

	useEffect(() => {
		if (filtered) {
			setSearchQuery('');
			let filtered = [];
			filtered = data.filter((article) => article.author.toLowerCase() === myCharacter.characterName.toLowerCase());
			setFilteredData(filtered);
		} else {
			setSearchQuery('');
			setFilteredData(data);
		}
	}, [articles, filtered]);

	const handleSearch = (e) => {
		setSearchQuery(e);
	};

	const handleFilter = () => {
		if (filtered === true) {
			console.log('this triggered');
			setFiltered(false);
			setFilterButtonText('Show My Articles');
		} else {
			setFiltered(true);
			setFilterButtonText('Show All Articles');
		}
	};

	return (
		<React.Fragment>
			<NavigationBar />
			<Heading>News</Heading>
			<Divider />
			<Container>
				<Header>
					<FlexboxGrid justify="center" align="middle">
						<FlexboxGrid.Item colspan={4}>
							<InputGroup>
								<Input style={{ width: '80%' }} placeholder="Search" value={searchQuery} onChange={(e) => handleSearch(e)} />
								<NewArticle drawer={true} />
							</InputGroup>
						</FlexboxGrid.Item>
						<Button style={{ color: 'black', borderRadius: '5px 5px 5px 5px' }} color="cyan" onClick={() => handleFilter()}>
							{filterButtonText}
						</Button>
					</FlexboxGrid>
				</Header>
			</Container>
			<NewsFeed data={filteredData} />
		</React.Fragment>
	);
};
export default News;
