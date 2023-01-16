import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Button, Flex, Heading, InputGroup, Spinner, Input, Divider, Grid, GridItem, Box } from '@chakra-ui/react';
import { NewArticle } from './NewArticle';
import { getMyCharacter } from '../../redux/entities/characters';
import { getMyArticles, getPublishedArticles } from './../../redux/entities/articles';
import socket from '../../socket';
import { maxBy } from 'lodash';

const News = (props) => {
	const articles = useSelector(getPublishedArticles);
	const allArticles = useSelector((state) => state.articles.list);
	const gamestate = useSelector((state) => state.gamestate);
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
	const [round, setRound] = useState(gamestate.round);
	const [maxRound, setMaxRound] = useState(gamestate.round);

	console.log(myArticles);

	if (!login) {
		props.history.push('/');
		return <Spinner />;
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
			authorProfilePicture: el.anon ? 'undefined' : el.creator.profilePicture,
			imageURL: el.image,
			author: el.anon ? 'anonymous' : el.creator?.characterName,
			authorId: el.creator?._id,
			title: el.title,
			round: el.round,
			body: el.body,
			date: el.publishDate ? el.publishDate : el.createdAt,
			comments: el.comments,
			articleId: el._id,
			tags: el.tags,
			type: 'newsArticle',
			anon: el.anon ? el.anon : false
		}));
	};

	useEffect(() => {
		let max = gamestate.round;
		const temp = allArticles.filter((el) => el.round > gamestate.round);
		temp.forEach((el) => (el.round > max ? (max = el.round) : null));
		setMaxRound(max);
	}, [articles]);

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
	}, [articles, searchQuery, myChar]);

	useEffect(() => {
		setSearchQuery('');
		if (showMyArticles) {
			setFilteredData(mapArticlesToData(myArticles));
		} else {
			setFilteredData(mapArticlesToData(getSortedArticles()));
		}
		console.log(filteredData);
	}, [articles, showMyArticles, myChar]);

	const handleSearch = (e) => {
		setSearchQuery(e);
	};

	const getRoundMap = () => {
		if (myChar.tags.some((el) => el.toLowerCase() === 'control'))
			return (
				<tbody>
					{[...Array(maxRound)].map((x, i) => (
						<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} colorScheme="blue" appearance={i + 1 === round ? 'primary' : 'ghost'} circle key={gamestate.round}>
							{i + 1}
						</Button>
					))}
				</tbody>
			);
		else
			return (
				<tbody>
					{[...Array(gamestate.round)].map((x, i) => (
						<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} colorScheme="blue" appearance={i + 1 === round ? 'primary' : 'ghost'} circle key={gamestate.round}>
							{i + 1}
						</Button>
					))}
				</tbody>
			);
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
      <Grid
      templateAreas={`"nav main"`}
      gridTemplateColumns={ '20% 80%'}
      gap='1'
      fontWeight='bold'>
    <GridItem pl='2' bg='#0f131a' area={'nav'} >
      <Flex justify="center" align="middle">
            {getRoundMap()}
            <div >
              <InputGroup>
                <Input style={{ width: '80%' }} placeholder="Search" value={searchQuery} onChange={(e) => handleSearch(e)} />
                {myArticleEffort > 0 && <NewArticle drawer={true} />}
              </InputGroup>
            </div>
            <Divider />
            {myArticles && myArticles.length > 0 && (
              <Button style={{ color: 'black', borderRadius: '5px 5px 5px 5px' }} color="cyan" onClick={() => handleFilter()}>
                {filterButtonText}
              </Button>
            )}
          </Flex>
    </GridItem>
    <GridItem pl='2' bg='#0f131a' area={'main'} >
      
      <Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
        <NewsFeed round={round} data={filteredData} />
      </Box>
    </GridItem>
  </Grid>
		</React.Fragment>
	);
};
export default News;
