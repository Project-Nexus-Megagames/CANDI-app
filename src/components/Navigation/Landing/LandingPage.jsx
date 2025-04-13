import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, GridItem, Wrap, useBreakpoint } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from './PublicNavBar';
import ImageTextPair from './ImageTextPair';
import backgroundImg from '../../Images/Old Images/agenda.jpg';
import WordDivider from '../../WordDivider';
import ImgPanel from '../ImgPanel';
import { openLink } from '../../../scripts/frontend';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gameServer } from '../../../config';
import MatchesByRound from '../../Assets/MatchesByRound';
import Standing from '../../Team/Standing';
import Athletes from '../../Assets/Athletes';
import { loadTeams } from '../../../redux/entities/teams';
import { loadAssets } from '../../../redux/entities/assets';
import { loadClock } from '../../../redux/entities/clock';
import { loadGamestate } from '../../../redux/entities/gamestate';
import { loadEvents, eventsReceived } from '../../../redux/entities/events';
import { loadGameConfig } from '../../../redux/entities/gameConfig';



const LandingPage = (props) => {  
  const { login, team, myCharacter, control, tab } = useSelector(s => s.auth)
  const matches = useSelector(s => s.events.list)
  const assets = useSelector(s => s.assets.list)
  const gamestateLoaded = useSelector(s => s.gamestate.loaded)
  const gameConfigLoaded = useSelector(s => s.gamestate.loaded)
  const teams = useSelector(s => s.teams.list)
  
  const [rounds, setRounds] = useState([]);
  const [subTab, setSubTab] = useState(0);
  const navigate = useNavigate();
  const url = `${gameServer}api/events/matches`;
	const reduxAction = useDispatch();

	useEffect(() => {
		try{

			const fetchData = async () => {        
				const {data} = await axios.get(url);
        reduxAction(eventsReceived(data.matches));
        setRounds(data.rounds);
        reduxAction(loadEvents())
			}
      if (teams.length == 0) reduxAction(loadTeams())
      if (assets.length == 0) reduxAction(loadAssets())
      if (teams.length == 0) reduxAction(loadClock())
      if (!gamestateLoaded) reduxAction(loadGamestate())
      if (!gameConfigLoaded) reduxAction(loadGameConfig())

			if (matches.length === 0) fetchData().catch(console.error);
		}
		catch (err) {
			console.log(err)
			// Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}	
	}, []);


  return (
    <Box >

      {tab === 'landing' && <div>
        <h2>Welcome to Goblin League!</h2>
        <ImageTextPair
          bg='#fefefc'
          title={'What is Goblin League?'}
          description={'Goblin League is a sports drafting game created by throwing several other megagames into a blender. "Heavily inspired" by Draft Night, OWL League, and Blaseball this game simulates a season of the made up game Goblin Ball. Teams draft new athletes, create new rules, and create a game plan to become the Champion of the season (or the most popular team!)'}
          imgUrl={backgroundImg}
          reversed
        />

        {/* <ImageTextPair
            title='Have confidence in your tile projects'
            description="At Walnut Creek Flooring and Tile, we specialize in creating stunning and functional tile installations for homes and businesses. Our team of skilled professionals install custom tile showers, tub surrounds, backsplashes, and more. We work closely with our clients to understand their vision and bring their ideas to life, paying close attention to every detail of the installation process. With a focus on exceptional craftsmanship and customer satisfaction, we are committed to delivering results that exceed your expectations. Whether you're looking to update your kitchen or bathroom, or want to add a unique touch to your commercial space, we can help you create a custom tile installation that will elevate the look and feel of the room. Contact us today to schedule a consultation and start planning your next tile project."
            imgUrl={backgroundImg}
          /> */}


      </div>}

      {tab === 'matches' && <div>
        {matches && <MatchesByRound matches={matches} rounds={rounds} />}

      </div>}

      {tab === 'teams' && <div>
        {teams.length == 0 && <CircularProgress isIndeterminate color='green.300' />}
        {teams && <Standing />}

      </div>}

      {tab === 'athletes' && <div>
        {assets.length == 0 && <CircularProgress isIndeterminate color='green.300' />}
        {assets && <Athletes />}

      </div>}

    </Box>
  );
}

export default (LandingPage);