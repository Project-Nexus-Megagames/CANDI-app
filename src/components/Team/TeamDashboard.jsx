import React, { useEffect } from 'react'; // React import
import { useSelector } from 'react-redux'; // Redux store provider
import { useNavigate } from 'react-router-dom';
import { Wrap, Grid, GridItem, Box, VStack, WrapItem, Center } from '@chakra-ui/react';
import { getTeamDraft, getTeamAthletes } from '../../redux/entities/assets';
import AssetCard from '../Common/AssetCard';
import LogRecords from '../Logs/LogRecords';
import { getMyTeamLogs } from '../../redux/entities/actionLogs';
import AthleteCard from '../Assets/AthleteCard';
import DraftCard from '../Assets/DraftCard';
import MatchesCarosel from './MatchesCarosel';
import { getTeamMatches } from '../../redux/entities/events';
import { EditAccount } from '../Common/EditAccount';
import ResourceNugget from '../Common/ResourceNugget';
import { getTeamAccount } from '../../redux/entities/accounts';
import { getTeamFacilities } from '../../redux/entities/facilities';
import FacilityCard from './FacilityCard';


const TeamDashboard = () => {
  const navigate = useNavigate();
  const { login, team, isControl } = useSelector(s => s.auth);
  const { teamTab } = useSelector(s => s.gamestate);
  const drafts = useSelector(getTeamDraft);
  const athletes = useSelector(getTeamAthletes);
  const facilities = useSelector(getTeamFacilities);
  const myLogs = useSelector(getMyTeamLogs);
  const matches = useSelector(getTeamMatches);
  const account = useSelector(getTeamAccount);

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
      <GridItem area={'transaction'} bg='#1a1d24' overflow={'auto'} >
        <Box bg='blue.300' color="black">Team Account</Box>
        <Center>
          {account && account.resources.map((item) =>
            <ResourceNugget key={item.type} type={item.type} value={item.balance} width={'80px'} height={'30'} />
          )}
          {isControl && account && <EditAccount account={account} />}
        </Center>
        <LogRecords reports={myLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} />
      </GridItem>

      <GridItem area={'account'} bg='#1a1d24' overflow={'auto'}>
        <MatchesCarosel matches={matches} />
      </GridItem>

      <GridItem area={'drafts'} bg='#0f131a' overflow={'auto'}>
        <VStack>
          {facilities.map(facility => (
            <FacilityCard key={facility._id} facility={facility._id} />
          ))}
          {drafts.map(asset => (
            <DraftCard draft={asset} key={asset._id} />
          ))}
        </VStack>
      </GridItem>

      <GridItem area={'athlete'} bg='#1a1d24' overflow={'auto'}>
        <Box bg='green.300' color="black">Asset Section</Box>
        <Wrap spacing='10px' justify='space-around'>
          {athletes.map(asset => (
            <WrapItem key={asset._id}>
              <AthleteCard asset={asset} />
            </WrapItem>
          ))}
        </Wrap>
      </GridItem>
    </Grid>

  );

}


export default (TeamDashboard);