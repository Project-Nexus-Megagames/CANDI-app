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
import control from '../Images/control.png';
import agendas from '../Images/agenda.jpg';


//import { Link } from 'react-router-dom';
import { setCharacter } from '../../redux/entities/auth';
import Loading from './Loading';
import { useNavigate } from 'react-router';
import usePermissions from '../../hooks/usePermissions';
import { CandiWarning } from '../Common/CandiWarning';
import { openLink } from '../../scripts/frontend';
import NoCharacter from './NoCharacter';
import CharacterCreation from '../MyCharacters/CharacterCreation';

const HomePage = (props) => {
	const navigate = useNavigate();
	const reduxAction = useDispatch();

	const { login, loadComplete, myCharacter, team } = useSelector(s => s.auth)
  const actions = useSelector(state => state.actions.list)
  const gamestate = useSelector(state => state.gamestate)
	const newArticles = useSelector((state) => state.articles.new);

	const [loaded, setLoaded] = React.useState(false);
	const [selectedChar, setSelectedChar] = React.useState('');
	const tempCharacter = useSelector(getCharacterById(selectedChar));
  const {isControl} = usePermissions();
	const [rand, setRand] = React.useState(Math.floor(Math.random() * 1000));
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

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={actionImg} to="actions" title="~ Actions ~" body="Private Actions" />
      </GridItem>   

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={agendas} to="agendas" title="~ Forum ~" body="Surf the Web!" />
      </GridItem>   


      <GridItem colSpan={columns == 1 ? 2 : 1} >
        <ImgPanel  new={newArticles.length > 0} img={news} to="news" title="~ News ~" body="What is happening in the world?" />
      </GridItem>

      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={myCharacter.profilePicture} to="character" title="~ My Character ~" body="My Assets and Traits" />
      </GridItem>

      <GridItem colSpan={columns == 1 ? 2 : 1} onClick={() => openLink("https://docs.google.com/document/d/1r2wGtHui3ymEjglQu13MInGw7KZcDOH3xlQuZdz6XDA/edit#heading=h.kj1qlof232om")} >
        <ImgPanel img={map} to="" title="~ Rules ~" body="Learn how to play the game"/>
      </GridItem>


      <GridItem colSpan={columns == 1 ? 2 : 1}>
        <ImgPanel img={other} to="others" title={'~ Other Characters ~'} body="Character Details" />
      </GridItem>    

      {/* <GridItem colSpan={columns == 1 ? 2 : columns == 2 ? 2 : 1}>
        <ImgPanel img={leaderboard} to="leaderboard" title="~ Character Leaderboard ~" body="Who's big in town?" />
      </GridItem>                         */}

      {isControl && <GridItem colSpan={columns} >
          <ImgPanel img={control} to="control" title={'~ Control Terminal ~'} body='"Now he gets it!"' />
      </GridItem>}



    </Grid>
      }

      {/* <CandiWarning open={rand === 1} title={"You sure about that?"} onClose={() => setRand(-1)} handleAccept={() => setRand(-1)}>
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
      </CandiWarning> */}

      <CandiWarning open={rand > 10 && rand < 100} title={"He can see why"} rejectText={'Uhhh, ok?'} confirmText={"Me too!"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://cdn.discordapp.com/attachments/1212818889382305864/1231677129213612164/images.png?ex=6637d3b7&is=66255eb7&hm=f78fb90909003ceeb018c1bbd8af848bea69ca2089a650a026a9ea3e3a983398&' ></img>
      </CandiWarning>

      <CandiWarning open={rand > 101 && rand < 150} title={"We can see the future. Are you in it?"} rejectText={'I reject.'} confirmText={"Of course"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://cdn.discordapp.com/attachments/1212818889382305864/1231712941699629146/sunglasses_PNG155.png?ex=6637f511&is=66258011&hm=298ed216cfbca369b0098d90465f09f385b292ed39b93bae8738e34a4b871cdd&' ></img>
      </CandiWarning>

      <CandiWarning open={rand > 150 && rand < 200} title={"It's so bright, why can't you see it?"} rejectText={'I must not look...'} confirmText={"I want to."} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://cdn.discordapp.com/attachments/857862435096100884/1231713818103644311/Sun-Shaped-Sunglasses-removebg-preview.png?ex=6637f5e2&is=662580e2&hm=ea0f7bc352360901883eb905cd3ad6939695b3def4e6a15a63aea9f9777ff950&' ></img>
      </CandiWarning>

      <CandiWarning open={rand > 201 && rand < 202} title={"SUBMITSUBMITSUBMITSUBMIT\nSUBMITSUBMITSUBMITSUBMIT\nSUBMITSUBMITSUBMITSUBMIT\nSUBMITSUBMITSUBMITSUBMIT"} rejectText={'SUBMIT'} confirmText={"SUBMIT"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://cdn.discordapp.com/attachments/857862435096100884/1231714459366457394/sunglasses-graphic-design-template-vector-png_248576-removebg-preview.png?ex=6626d2fb&is=6625817b&hm=d43f3326e1240c6ca14ebd5e91bd7861af45e08c4668ee3d8ddda5b2151d5cad&' ></img>
      </CandiWarning>

      <CandiWarning open={rand > 251 && rand < 300} title={"Safe, protective and fun for the whole family"} rejectText={'Nah'} confirmText={"Okie-dokie!"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://static.vecteezy.com/system/resources/thumbnails/021/729/466/small/classic-80s-90s-elements-in-modern-style-flat-line-style-hand-drawn-illustration-of-retro-or-vintage-pink-striped-sunglasses-summer-accessory-fashion-patch-badge-emblem-logo-png.png' ></img>
      </CandiWarning>

      <CandiWarning open={rand > 301 && rand < 350} title={"You are what you wear. Choose wisely."} rejectText={"I willn't"} confirmText={"I conform"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://cdn.discordapp.com/attachments/1212818889382305864/1231712941699629146/sunglasses_PNG155.png?ex=6637f511&is=66258011&hm=298ed216cfbca369b0098d90465f09f385b292ed39b93bae8738e34a4b871cdd&' ></img>
      </CandiWarning>

      <CandiWarning open={ rand > 351 && rand < 400} title={"OBEY"} rejectText={'OBEY'} confirmText={"OBEY"} onClose={() => setRand(0)} handleAccept={() => setRand(0)}>
        <img src='https://static.vecteezy.com/system/resources/thumbnails/021/729/466/small/classic-80s-90s-elements-in-modern-style-flat-line-style-hand-drawn-illustration-of-retro-or-vintage-pink-striped-sunglasses-summer-accessory-fashion-patch-badge-emblem-logo-png.png' ></img>
      </CandiWarning>



		</React.Fragment>
	);
};

export default (HomePage);
