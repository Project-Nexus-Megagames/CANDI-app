import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, GridItem, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { getCharacterById } from '../../redux/entities/characters';
import ImgPanel from './ImgPanel';

//import { Link } from 'react-router-dom';
import { setCharacter } from '../../redux/entities/auth';
import Loading from './Loading';
import { useNavigate } from 'react-router';
import { openLink } from '../../scripts/frontend';
import NoCharacter from './NoCharacter';
import CharacterCreation from '../MyCharacters/CharacterCreation';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { login, loadComplete, myCharacter, control, team } = useSelector(s => s.auth)
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

      {loadComplete && myCharacter && team &&
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={1}>      

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor={team.color} img={`/images/team/${team.code}.png`} to="team" body={'Manage team assets'} title="~ Team ~" />
      </GridItem>  
      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor="#cb904d" img={"/images/panels/trophy.png"} to="trading" body={'Exchange resources and Assets with other players'} title="~ Trading ~" />
      </GridItem>  


      
      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor="#499797" img={"/images/panels/skills.png"} to="athletes" title={'~ Athletes~'} body="players available to be drafted" />
      </GridItem>    

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor="#8C271E" img={"/images/panels/card-pick.png"} to="draft" title={'~ Draft ~'} body="Draft order" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor="#432534" img={"/images/panels/matches.png"} to="matches" title={'~ Matches ~'} body="Upcoming Goblin Ball Matches" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel backgroundColor="#a452ba" img={"/images/panels/standing.png"} to="standing" title={'~ Standing ~'} body="Check teams win loss records and popularity" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel disabled backgroundColor="#55c96a" img={"/images/panels/auctions.png"} to="market" title={'~ Free Agent Market ~'} body="Free Agents" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://docs.google.com/document/d/1XMHhRa4F77vL6f8xppPhA_YHuWMvKxJPlwzHjX6LzyE/edit?usp=sharing")} >
        <ImgPanel backgroundColor="#499797" img={"/images/panels/medallist.png"} to="" title="~ Rules ~" body="Learn how to play the game"/>
      </GridItem>

      {control && <GridItem colSpan={columns} >
          <ImgPanel img={"/images/panels/trophy.png"} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
      </GridItem>}



    </Grid>}


		</React.Fragment>
	);
};

export default (HomePage);
