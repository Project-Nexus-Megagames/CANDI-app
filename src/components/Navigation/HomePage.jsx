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
import leaderboard from '../Images/hello.jpg';

import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';
//import { Link } from 'react-router-dom';
import UserList from './UserList';
import { signOut, setCharacter } from '../../redux/entities/auth';
import Loading from './Loading';
import { useNavigate } from 'react-router';
import usePermissions from '../../hooks/usePermissions';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { loading, login, myCharacter, } = useSelector(s => s.auth);
  const gamestate = useSelector(state => state.gamestate)
	const newArticles = useSelector((state) => state.articles.new);

	const [loaded, setLoaded] = React.useState(false);
	const [clock, setClock] = React.useState({ hours: 0, minutes: 0, days: 0 });
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar));
  const {isControl} = usePermissions(); 

  if (!props.login) {
    navigate("/");
    return <div />;
  }

	useEffect(() => {
		renderTime(gamestate.endTime);
		setInterval(() => {
			renderTime(gamestate.endTime);
			//clearInterval(interval);
		}, 60000);
	}, [gamestate.endTime]);

	useEffect(() => {
		if (myCharacter && !loaded) {
			setLoaded(true);
		}
	}, [myCharacter]);

	useEffect(() => {
		if (tempCharacter) reduxAction(setCharacter(tempCharacter));
	}, [tempCharacter]);

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
		} else setSelectedChar(myCharacter._id);
	};

	if (!loaded) {
		return <Spinner  />;
	}
  else if (gamestate.status === 'Down') {
		navigate('/down');
		return <Spinner  />;
	}

	return (
		<React.Fragment>
      <Grid templateColumns='repeat(2, 1fr)' gap={1}>
        <GridItem>
          <ImgPanel disabled new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
        </GridItem>

        <GridItem>
          <ImgPanel img={actions} to="actions" title="~ Actions ~" body="Do the things" />
        </GridItem>

        <GridItem>
          <ImgPanel img={other} to="others" title={'~ Other Characters ~'} body="Character Details" />
        </GridItem>


        <GridItem>
        <ImgPanel disabled img={myCharacter.profilePicture} to="character" title="~ My Character ~" body="My Assets and Traits" />
        </GridItem>

        {isControl && <GridItem colSpan={2} >
            <ImgPanel img={control2} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
        </GridItem>}

        {/* <GridItem>
          <ImgPanel img={leaderboard} to="leaderboard" title="~ Character Leaderboard ~" body="Who is winning?" />
        </GridItem> */}

      </Grid>
		</React.Fragment>
	);
};

export default (HomePage);
