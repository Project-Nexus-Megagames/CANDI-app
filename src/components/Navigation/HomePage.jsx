import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Select, Spinner } from '@chakra-ui/react';
import { getMyCharacter, getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

// import aang from '../Images/aang.jpg'
import nexus from '../Images/Project_Nexus.jpg';
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
import { CandiWarning } from '../Common/CandiWarning';
import { openLink } from '../../scripts/frontend';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { loading, login, myCharacter, } = useSelector(s => s.auth);
  const gamestate = useSelector(state => state.gamestate)
	const newArticles = useSelector((state) => state.articles.new);

	const [loaded, setLoaded] = React.useState(false);
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar));
  const {isControl} = usePermissions(); 
	const [rand, setRand] = React.useState(Math.floor(Math.random() * 1000));

  if (!props.login) {
    navigate("/");
    return <div />;
  }

	useEffect(() => {
		if (myCharacter && !loaded) {
			setLoaded(true);
		}
	}, [myCharacter]);

	useEffect(() => {
		if (tempCharacter) reduxAction(setCharacter(tempCharacter));
	}, [tempCharacter]);



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
        {/* <GridItem>
          <ImgPanel new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
        </GridItem> */}
        <GridItem  onClick={() => openLink("https://docs.google.com/document/d/1OgCb85bcSL2ethht-e4CCdch5Eg2gksO8U3yGFyVs7k/edit")} >
          <ImgPanel new={newArticles.length > 0} img={news} to="" title="~ Rules ~" />
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

        {isControl && <GridItem colSpan={2} >
            <ImgPanel img={leaderboard} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
        </GridItem>}

        {/* <GridItem>
          <ImgPanel img={leaderboard} to="leaderboard" title="~ Character Leaderboard ~" body="Who is winning?" />
        </GridItem> */}

      </Grid>

      <CandiWarning open={rand === 1} title={"You sure about that?"} onClose={() => setRand(-1)} handleAccept={() => setRand(-1)}>
        Are ya sure?
      </CandiWarning>

      <CandiWarning open={rand === -1} title={"Really?"} onClose={() => setRand(-2)} handleAccept={() => setRand(-2)}>
        Are you really, REALLY Sure?
      </CandiWarning>

      <CandiWarning open={rand === -2} title={"Really Really?"} onClose={() => setRand(-3)} handleAccept={() => setRand(-3)}>
        Look, I haven't even told you what you need to be sure about is. How can you be sure if you are uninformed?
      </CandiWarning>

      <CandiWarning open={rand === -3} title={"AAAAAAAAAAAAA"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        Wait that wasn't a yes or no question... What? 
      </CandiWarning>

		</React.Fragment>
	);
};

export default (HomePage);
