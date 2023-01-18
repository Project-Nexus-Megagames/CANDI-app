import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Select, Spinner } from '@chakra-ui/react';
import { getMyCharacter, getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

// import aang from '../Images/aang.jpg'
import control2 from '../Images/control.png';
import other from '../Images/other.jpg';
import news from '../Images/News.jpg';
import actions from '../Images/actions.jpg';
import agendas from '../Images/agendas.webp';
import hello from '../Images/hello.jpg';

import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';
//import { Link } from 'react-router-dom';
import UserList from './UserList';
import LoadingNew from './Loading';
import { getPublishedArticles } from '../../redux/entities/articles';
import { signOut, setCharacter } from '../../redux/entities/auth';
import Loading from './Loading';
import { useNavigate } from 'react-router';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { loading, login, myCharacter } = useSelector(s => s.auth);
  const gamestate = useSelector(state => state.gamestate)
  const gamestateLoaded = useSelector(state => state.gamestate.loaded)
	const actionsLoaded = useSelector(state => state.actions.loaded)
	const charactersLoaded = useSelector( state => state.characters.loaded)
	const assetsLoaded = useSelector(state => state.assets.loaded)
	const locationsLoaded = useSelector( state => state.locations.loaded)

	const newsArticles = useSelector(getPublishedArticles);
	const newArticles = useSelector((state) => state.articles.new);
	const allCharacters = useSelector((state) => state.characters.list);
	const sortedArticles = [...newsArticles].sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	}); 

	const [loaded, setLoaded] = React.useState(false);
	const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0 });
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar)); 



	useEffect(() => {
		if (
			!loading &&
			actionsLoaded &&
			gamestateLoaded &&
			charactersLoaded &&
			locationsLoaded &&
			//gameConfigLoaded &&
			assetsLoaded
		) {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		renderTime(gamestate.endTime);
		setInterval(() => {
			renderTime(gamestate.endTime);
			//clearInterval(interval);
		}, 60000);
	}, [gamestate.endTime]);

	useEffect(() => {
		if (
			!loading &&
			actionsLoaded &&
			gamestateLoaded &&
			charactersLoaded &&
			locationsLoaded &&
			// gameConfigLoaded &&
			assetsLoaded
		) {
			setTimeout(() => setLoaded(true), 2000);
		}
	}, [props]);

	useEffect(() => {
		if (tempCharacter) setCharacter(tempCharacter);
	}, [tempCharacter]);

	const handleLogOut = () => {
		reduxAction(signOut());
		socket.emit('logout');
		navigate('/login');
	};

	const renderTime = (endTime) => {
		let countDownDate = new Date(endTime).getTime();
		const now = new Date().getTime();
		let distance = countDownDate - now;

		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		setClock({ hours, minutes, days });
	};

	const openNexus = () => {
		const win = window.open('https://www.patreon.com/wcmprojectnexus', '_blank');
		win.focus();
	};

	const handleCharChange = (charId) => {
		if (charId) {
			setSelectedChar(charId);
		} else setSelectedChar(props.myCharacter._id);
	};

	if (!login && !loading) {
		navigate('/');
		return <Spinner  />;
	}
	if (!loaded) {
		return <Loading />;
	} else if (login && !myCharacter) {
		navigate('/no-character');
		return <Spinner  />;
	} else if (gamestate.status === 'Down') {
		navigate('/down');
		return <Spinner  />;
	}

	return (
		<React.Fragment>
      Homepage
      <Grid templateColumns='repeat(2, 1fr)' gap={4}>
        <GridItem>
          <ImgPanel new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
        </GridItem>

        <GridItem>
          <ImgPanel img={actions} to="actions" title="~ Actions ~" body="Do the things" />
        </GridItem>

        <GridItem>
          <ImgPanel img={other} to="others" title={'~ Other Characters ~'} body="Character Details" />
        </GridItem>


        <GridItem>
        <ImgPanel img={myCharacter.profilePicture} to="character" title="~ My Character ~" body="My Assets and Traits" />
        </GridItem>

        <GridItem>
            <ImgPanel img={control2} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
        </GridItem>

        <GridItem>
          <ImgPanel img={hello} to="leaderboard" title="~ Character Leaderboard ~" body="Who is winning?" />
        </GridItem>

      </Grid>
		</React.Fragment>
	);
};

export default (HomePage);
