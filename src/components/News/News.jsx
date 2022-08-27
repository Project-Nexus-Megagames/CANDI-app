import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { NewArticle } from './NewArticle';
import { Container, FlexboxGrid, Header, Input, InputGroup, Button, Divider } from 'rsuite';
import { Loader } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { getMyArticles } from './../../redux/entities/articles';

const News = (props) => {
	const articles = useSelector((state) => state.articles.list);
	const myArticles = useSelector(getMyArticles).sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	});
	const login = useSelector((state) => state.auth.login);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredData, setFilteredData] = useState([]);
	const [showMyArticles, setShowMyArticles] = useState(false);
	const myChar = useSelector(getMyCharacter);
	const [filterButtonText, setFilterButtonText] = useState('Show My Articles');

	if (!login) {
		props.history.push('/');
		return <Loader inverse center content="doot..." />;
	}

	const myArticleEffort = myChar.effort.find((el) => el.type === 'Article').amount;

	// TODO: add the publish button in edit and create form  (New Article: Submit and Submit & Publish)

	const sortedArticles = [...articles];
	sortedArticles.sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	});

	const mapArticlesToData = (articles) => {
		return articles.map((el) => ({
			authorProfilePicture: el.creator.profilePicture,
			imageURL: el.image,
			author: el.creator?.characterName,
			authorId: el.creator?._id,
			title: el.title,
			body: el.body,
			date: el.createdAt,
			comments: el.comments,
			articleId: el._id,
			type: 'newsArticle'
		}));
	};

	useEffect(() => {
		let filtered = [];
		if (searchQuery) {
			if (showMyArticles) {
				filtered = mapArticlesToData(myArticles).filter(
					(article) => article.title.toLowerCase().includes(searchQuery) || article.body?.toLowerCase().includes(searchQuery) || article.author.toLowerCase().includes(searchQuery)
				);
				setFilteredData(filtered);
			} else {
				filtered = mapArticlesToData(sortedArticles).filter(
					(article) => article.title.toLowerCase().includes(searchQuery) || article.body?.toLowerCase().includes(searchQuery) || article.author.toLowerCase().includes(searchQuery)
				);
				setFilteredData(filtered);
			}
		} else if (showMyArticles) setFilteredData(mapArticlesToData(myArticles));
		else setFilteredData(mapArticlesToData(sortedArticles));
	}, [articles, searchQuery]);

	useEffect(() => {
		setSearchQuery('');
		if (showMyArticles) {
			setFilteredData(mapArticlesToData(myArticles));
		} else {
			setFilteredData(mapArticlesToData(sortedArticles));
		}
	}, [articles, showMyArticles]);

	const handleSearch = (e) => {
		setSearchQuery(e);
	};

	const handleFilter = () => {
		if (showMyArticles === true) {
			setShowMyArticles(false);
			setFilterButtonText('Show My Articles');
		} else {
			setShowMyArticles(true);
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
								{myArticleEffort > 0 && <NewArticle drawer={true} />}
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
