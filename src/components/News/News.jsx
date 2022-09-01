import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Heading } from '@chakra-ui/react';
import { NewArticle } from './NewArticle';
import { Container, FlexboxGrid, Header, Input, InputGroup, Button, Divider } from 'rsuite';
import { Loader } from 'rsuite';
import { getMyCharacter } from '../../redux/entities/characters';
import { getMyArticles, getPublishedArticles } from './../../redux/entities/articles';

const News = (props) => {
	const articles = useSelector(getPublishedArticles);
	const allArticles = useSelector((state) => state.articles.list);
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

	const myArticleEffort = myChar.effort?.find((el) => el.type === 'Article')?.amount;

	const getSortedArticles = () => {
		if (myChar.tags.some((tag) => tag.toLowerCase() === 'control')) {
			const sortedAllArticles = [...allArticles];
			return sortedAllArticles.sort((a, b) => {
				let da = new Date(a.createdAt),
					db = new Date(b.createdAt);
				return db - da;
			});
		}
		return articles.sort((a, b) => {
			let da = new Date(a.publishDate),
				db = new Date(b.publishDate);
			return db - da;
		});
	};

	const mapArticlesToData = (articles) => {
		return articles.map((el) => ({
			authorProfilePicture: el.creator.profilePicture,
			imageURL: el.image,
			author: el.creator?.characterName,
			authorId: el.creator?._id,
			title: el.title,
			body: el.body,
			date: el.publishDate ? el.publishDate : el.createdAt,
			comments: el.comments,
			articleId: el._id,
			tags: el.tags,
			type: 'newsArticle'
		}));
	};

	useEffect(() => {
		let filtered = [];
		if (searchQuery) {
			if (showMyArticles) {
				filtered = mapArticlesToData(myArticles).filter(
					(article) =>
						article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						article.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						article.author.toLowerCase().includes(searchQuery.toLowerCase())
				);
				setFilteredData(filtered);
			} else {
				filtered = mapArticlesToData(getSortedArticles()).filter(
					(article) =>
						article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						article.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						article.author.toLowerCase().includes(searchQuery.toLowerCase())
				);
				setFilteredData(filtered);
			}
		} else if (showMyArticles) setFilteredData(mapArticlesToData(myArticles));
		else setFilteredData(mapArticlesToData(getSortedArticles()));
	}, [articles, searchQuery]);

	useEffect(() => {
		setSearchQuery('');
		if (showMyArticles) {
			setFilteredData(mapArticlesToData(myArticles));
		} else {
			setFilteredData(mapArticlesToData(getSortedArticles()));
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
			<Header>
				<Heading>News</Heading>
				<FlexboxGrid justify="center" align="middle">
					<FlexboxGrid.Item colspan={4}>
						<InputGroup>
							<Input style={{ width: '80%' }} placeholder="Search" value={searchQuery} onChange={(e) => handleSearch(e)} />
							{myArticleEffort > 0 && <NewArticle drawer={true} />}
						</InputGroup>
					</FlexboxGrid.Item>
					<Divider />
					<Button style={{ color: 'black', borderRadius: '5px 5px 5px 5px' }} color="cyan" onClick={() => handleFilter()}>
						{filterButtonText}
					</Button>
				</FlexboxGrid>
			</Header>
			<Container style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
				<NewsFeed data={filteredData} />
			</Container>
		</React.Fragment>
	);
};
export default News;
