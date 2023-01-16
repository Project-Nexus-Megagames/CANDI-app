import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Select, Spinner } from '@chakra-ui/react';
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

const HomePage = (props) => {
	const [loaded, setLoaded] = React.useState(false);
	const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0 });
	const [selectedChar, setSelectedChar] = React.useState('');
	const newsArticles = useSelector(getPublishedArticles);
	const newArticles = useSelector((state) => state.articles.new);
	const allCharacters = useSelector((state) => state.characters.list);
	const sortedArticles = [...newsArticles].sort((a, b) => {
		let da = new Date(a.createdAt),
			db = new Date(b.createdAt);
		return db - da;
	});
	const tempCharacter = useSelector(getCharacterById(selectedChar));

	useEffect(() => {
		if (
			!props.loading &&
			props.actionsLoaded &&
			props.gamestateLoaded &&
			props.charactersLoaded &&
			props.locationsLoaded &&
			//props.gameConfigLoaded &&
			props.assetsLoaded
		) {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		renderTime(props.gamestate.endTime);
		setInterval(() => {
			renderTime(props.gamestate.endTime);
			//clearInterval(interval);
		}, 60000);
	}, [props.gamestate.endTime]);

	useEffect(() => {
		if (
			!props.loading &&
			props.actionsLoaded &&
			props.gamestateLoaded &&
			props.charactersLoaded &&
			props.locationsLoaded &&
			// props.gameConfigLoaded &&
			props.assetsLoaded
		) {
			setTimeout(() => setLoaded(true), 2000);
		}
	}, [props]);

	useEffect(() => {
		if (tempCharacter) props.setCharacter(tempCharacter);
	}, [tempCharacter]);

	const handleLogOut = () => {
		props.logOut();
		socket.emit('logout');
		props.history.push('/login');
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

	if (!props.login && !props.loading) {
		props.history.push('/');
		return <Spinner  />;
	}
	if (!loaded) {
		return <Loading />;
	} else if (props.login && !props.myCharacter) {
		props.history.push('/no-character');
		return <Spinner  />;
	} else if (props.gamestate.status === 'Down') {
		props.history.push('/down');
		return <Spinner  />;
	}

	return (
		<React.Fragment>
      Homepage
		</React.Fragment>
	);
};

export default (HomePage);
