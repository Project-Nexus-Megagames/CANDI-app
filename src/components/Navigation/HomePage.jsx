import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { getCharacterById } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

// import aang from '../Images/aang.jpg'
import other from '../Images/other.jpg';
import news from '../Images/News.jpg';
import actionImg from '../Images/actions.jpg';
import map from '../Images/location.png'; 
import lore from '../Images/lore.jpg'; 
import control from '../Images/control.png';
import agendas from '../Images/agenda.jpg';
import gcBanner from '../Images/gcBanner.png';
import rules from '../Images/rules.png';


//import { Link } from 'react-router-dom';
import { setCharacter } from '../../redux/entities/auth';
import Loading from './Loading';
import { useNavigate } from 'react-router';
import usePermissions from '../../hooks/usePermissions';
import { CandiWarning } from '../Common/CandiWarning';
import { openLink } from '../../scripts/frontend';
import NoCharacter from './NoCharacter';
import CharacterCreation from '../MyCharacters/CharacterCreation';
import { toggleAuido } from '../../redux/entities/gamestate';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { login, loadComplete, myCharacter, team } = useSelector(s => s.auth)
  const play = useSelector(state => state.gamestate.play);
  const actions = useSelector(state => state.actions.list)
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

  useEffect(() => {
		setRand(Math.floor(Math.random() * 500))
	}, [actions]);
  
 if (gamestate.status === 'Down') {
		navigate('/down');
		return <Spinner  />;
	}
	return (
		<React.Fragment>
      {!loadComplete && <Loading />}      
			{loadComplete && (!myCharacter ) && <NoCharacter />}

      {myCharacter && <CharacterCreation />}

      {loadComplete && myCharacter && 
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={1}>        

      
      {/* <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={trade} to="trading" body={'Exchange resources and Assets with other players'} title="~ Trading ~" />
      </GridItem>   */}

      <GridItem  colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={actionImg} to="actions" title="~ Actions ~" body="Private Actions" />
      </GridItem>   

      {/* <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={agendas} to="agendas" title="~ Forum ~" body="Surf the Web!" />
      </GridItem>    */}

      {/* <GridItem colSpan={columns == 1 ? 2 : 1} >
        <ImgPanel  new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
      </GridItem> */}

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={myCharacter.profilePicture} to="character" title="~ My Character ~" body="My Assets and Traits" />
      </GridItem>
      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={other} to="others" title={'~ Other Characters ~'} body="Character Details" />
      </GridItem>    

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://drive.google.com/file/d/1uuMXpxaqXojf88YKPaIaPO6tgpca2cl9/view")} >
        <ImgPanel img={rules} to="" title="~ Rules ~" body="Learn how to play the game"/>
      </GridItem>

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://docs.google.com/document/d/1mK73XowcXWt28nTSHDwmaDRsBL1R8JiQHYOo0i8oq5A/edit")} >
        <ImgPanel img={lore} to="" title="~ Lore ~" body="Learn more aobut the world"/>
      </GridItem>

      {/* <GridItem colSpan={columns == 1 ? 2 : columns == 2 ? 2 : 1}>
        <ImgPanel img={leaderboard} to="leaderboard" title="~ Character Leaderboard ~" body="Who's big in town?" />
      </GridItem>                         */}

<GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://docs.google.com/forms/d/e/1FAIpQLSeo0RErM5tnKoD9exGiYk3JRw-0Z0bU9PzuUa4XDy7DorKe3w/viewform")} >
        <ImgPanel img={gcBanner} to="" title="~ Goblin City playtest ~" body="Sign up to play in the Goblin City playtest!"/>
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
