import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Select, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { getMyCharacter, getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

// import aang from '../Images/aang.jpg'
import other from '../Images/other.jpg';
import news from '../Images/News.jpg';
import actions from '../Images/actions.jpg';
import map from '../Images/science.jpg';
import leaderboard from '../Images/leaderboard.png';
import control from '../Images/control.png';
import trade from '../Images/trade.png';
import agendas from '../Images/agenda.jpg';


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
import NoCharacter from './NoCharacter';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { login, loadComplete, myCharacter, team } = useSelector(s => s.auth)
  const gamestate = useSelector(state => state.gamestate)
	const newArticles = useSelector((state) => state.articles.new);

	const [loaded, setLoaded] = React.useState(false);
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar));
  const {isControl} = usePermissions(); 
	const [rand, setRand] = React.useState(Math.floor(Math.random() * 10000));
  const columns = useBreakpointValue({base: 1, lg: 3, md: 2, sm: 1});

  if (!props.login) {
    navigate("/");
    return <div />;
  }

	useEffect(() => {
		if (tempCharacter) reduxAction(setCharacter(tempCharacter));
	}, [tempCharacter]);
  
 if (gamestate.status === 'Down') {
		navigate('/down');
		return <Spinner  />;
	}
	return (
		<React.Fragment>
      {!loadComplete && <Loading />}      
			{loadComplete && (!myCharacter || !team) && <NoCharacter />}

      {loadComplete && myCharacter && team && 
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={1}>        

      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={trade} to="trading" title={'~ Exchange resources and Assets with other players ~'} body="Trading" />
      </GridItem>  

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={actions} to="actions" title="~ Actions ~" body="Do the things" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={agendas} to="agendas" title="~ Agendas ~" body="Do the things" />
      </GridItem>   


      <GridItem colSpan={columns == 1 ? 1 : 2}>
        <ImgPanel img={news} to="locations" title="~ Locations ~" body="Where am I" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1} >
        <ImgPanel  new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
      </GridItem>

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={myCharacter.profilePicture} to="character" title="~ My Character ~" body="My Assets and Traits" />
      </GridItem>

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://docs.google.com/document/d/1qynD1iNvi7zGyQyL1c3LL-yN8bmHh5ZrCLOl9YvpFqo/edit")} >
        <ImgPanel img={map} to="" title="~ Wiki ~" body="Learn more about the world"/>
      </GridItem>


      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={other} to="others" title={'~ Other Characters ~'} body="Character Details" />
      </GridItem>    

      <GridItem colSpan={columns == 1 ? 2 : columns == 2 ? 2 : 1}>
        <ImgPanel img={leaderboard} to="leaderboard" title="~ Character Leaderboard ~" body="Who's big in town?" />
      </GridItem>                        

      {isControl && <GridItem colSpan={columns} >
          <ImgPanel img={control} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
      </GridItem>}



    </Grid>
      }

      <CandiWarning open={rand === 1} title={"You sure about that?"} onClose={() => setRand(-1)} handleAccept={() => setRand(-1)}>
        Looks like you are about to delete the entire database. Are ya sure?
      </CandiWarning>

      <CandiWarning open={rand === -1} title={"Really?"} onClose={() => setRand(-2)} handleAccept={() => setRand(-2)}>
        Are you really, REALLY Sure?
      </CandiWarning>

      <CandiWarning open={rand === -2} title={"Really Really?"} onClose={() => setRand(-3)} handleAccept={() => setRand(-3)} rejectText={'UNDO'} confirmText={'UNDO'}>
        Ok the database has been deleted. 
      </CandiWarning>

      <CandiWarning open={rand === -3} title={"AAAAAAAAAAAAA"} onClose={() => setRand(0)} handleAccept={() => setRand(0)} rejectText={'UNDO UNDO UNDO'} confirmText={'UNDO UNDO UNDO'}>
        I also took the liberty of deleting all the source code for CANDI everywhere
      </CandiWarning>

		</React.Fragment>
	);
};

export default (HomePage);
