import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { Button, Flex, Heading, InputGroup, Spinner, Input, Divider, Grid, GridItem, Box, Center, Spacer, Text } from '@chakra-ui/react';
import { NewArticle } from './NewArticle';
import { getMyCharacter } from '../../redux/entities/characters';
import { getMyArticles, getPublishedArticles } from './../../redux/entities/articles';
import socket from '../../socket';
import { maxBy } from 'lodash';
import WordDivider from '../WordDivider';
import { useNavigate } from 'react-router-dom';
import { getCharAccount } from '../../redux/entities/accounts';

const News = (props) => {
	const navigate = useNavigate();
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
	const myChar = useSelector(s => s.auth.myCharacter);
	const [filterButtonText, setFilterButtonText] = useState('Show My Articles');
	const [round, setRound] = useState(gamestate.round);
	const [maxRound, setMaxRound] = useState(gamestate.round);

  const myAccout = useSelector(getCharAccount);


  if (!login) {
    navigate("/");
    return <div />;
  }

	const myArticleEffort = myAccout?.resources.find((el) => el.type == 'article_effort')?.balance;

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
			authorProfilePicture: el.anon ? 'undefined' : el.creator?.profilePicture,
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
    console.log(e)
		setSearchQuery(e);
	};

	const getRoundMap = () => {
		if (myChar.tags.some((el) => el.toLowerCase() === 'control'))
			return (
				<tbody>
					{[...Array(maxRound)].map((x, i) => (
						<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)}  colorScheme="blue" variant={i + 1 === round ? 'solid' : 'ghost'} circle key={gamestate.round}>
							{i + 1} ({articles.filter(el => el.round === i+1).length})
						</Button>
					))}
				</tbody>
			);
		else
			return (
				<tbody>
					{[...Array(gamestate.round)].map((x, i) => (
						<Button style={{ margin: '4px' }} onClick={() => setRound(i + 1)} colorScheme="blue" variant={i + 1 === round ? 'solid' : 'ghost'} circle key={gamestate.round}>
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

      
      <Box bg='#1b2330' style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
      <Flex width={'100%'} alignItems='center' >
            <Input  placeholder="Search" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />
            {myAccout.naqme}
            
            {myArticleEffort > 0 && <NewArticle drawer={true} myArticleEffort={myArticleEffort} />}
            
          {myArticles && myArticles.length > 0 && (
            <Button style={{ color: 'black', borderRadius: '5px 5px 5px 5px' }} colorScheme="cyan" onClick={() => handleFilter()}>
              {filterButtonText}
            </Button>
          )}
        </Flex>
        <Text fontSize={'xl'} >Round: </Text>

        <Center>
        {getRoundMap()}
        
        </Center>
        <NewsFeed round={round} data={filteredData} />
      </Box>
		</React.Fragment>
	);
};
export default News;
