import React, { useEffect } from 'react'; // React import
import { useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from 'react-router-dom';
import { Wrap, Grid, GridItem, Box, VStack } from '@chakra-ui/react';
import { getTeamDraft, getTeamAthletes } from '../../redux/entities/assets';
import AssetCard from '../Common/AssetCard';
import LogRecords from '../Logs/LogRecords';
import { getMyTeamLogs } from '../../redux/entities/actionLogs';
import AthleteCard from '../Assets/AthleteCard';
import DraftCard from '../Assets/DraftCard';
import MatchesCarosel from './MatchesCarosel';
import { getTeamMatches } from '../../redux/entities/events';


const TeamDashboard = () => {
  const navigate = useNavigate();
  const { login, team } = useSelector(s => s.auth);
  const { teamTab } = useSelector(s => s.gamestate);
  const drafts = useSelector(getTeamDraft);
  const athletes = useSelector(getTeamAthletes);
  const myLogs = useSelector(getMyTeamLogs);
  const matches = useSelector(getTeamMatches);

  // const [tabIndex, setTab] = React.useState(0);

  useEffect(() => {
    if (!login)
      navigate('/');
  }, [login, navigate])



  return (
    <Grid
      templateAreas={`
    "transaction account account account drafts"
    "transaction account account account drafts"
    "athlete athlete athlete athlete drafts"
    "athlete athlete athlete athlete drafts"
  `}
      gridTemplateRows={'repeat(4, 1fr)'}
      gridTemplateColumns={'repeat(5, 1fr)'}
      gap='1'
      bg={team.color || '#242c3b'}
      h='calc(100vh - 78px)'
      fontWeight='bold'
    >
      <GridItem area={'transaction'} bg='blue.500'>
        transaction Section
        <LogRecords reports={myLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} />
      </GridItem>

      <GridItem area={'account'} bg='orange.400'>
        <MatchesCarosel matches={matches} />
      </GridItem>

      <GridItem area={'drafts'} bg='#0f131a'>
        <VStack>
          {drafts.map(asset => (
            <DraftCard draft={asset} key={asset._id} />
          ))}
        </VStack>
      </GridItem>

      <GridItem area={'athlete'} bg='green.300'>
        <Box>Athlete Section {athletes.length}</Box>
        <Box>
          <Wrap spacing='10px' justify='space-around'>
            {athletes.map(asset => (
              <AthleteCard asset={asset} key={asset._id} />
            ))}
          </Wrap>
        </Box>
      </GridItem>
    </Grid>

  );

}


export default (TeamDashboard);