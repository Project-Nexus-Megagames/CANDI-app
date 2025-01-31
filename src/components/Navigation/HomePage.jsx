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

	const { login, loadComplete, myCharacter, control } = useSelector(s => s.auth)
  const play = useSelector(state => state.gamestate.play);
  const actions = useSelector(state => state.actions.list)
  const gamestate = useSelector(state => state.gamestate)
	const newArticles = useSelector((state) => state.articles.new);

	const [loaded, setLoaded] = React.useState(false);
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar));
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

      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={gcBanner} to="trading" body={'Exchange resources and Assets with other players'} title="~ Trading ~" />
      </GridItem>  


      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={other} to="athletes" title={'~ Athletes~'} body="players available to be drafted" />
      </GridItem>    

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={other} to="draft" title={'~ Draft ~'} body="Draft order" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://drive.google.com/file/d/1uuMXpxaqXojf88YKPaIaPO6tgpca2cl9/view")} >
        <ImgPanel img={rules} to="" title="~ Rules ~" body="Learn how to play the game"/>
      </GridItem>

      {control && <GridItem colSpan={columns} >
          <ImgPanel img={control} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
      </GridItem>}



    </Grid>}


		</React.Fragment>
	);
};

export default (HomePage);
