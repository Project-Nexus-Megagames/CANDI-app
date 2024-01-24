import React, { useState, useEffect } from 'react'; // React import
import NewsFeed from '../Common/NewsFeed';
import NavigationBar from '../Navigation/NavigationBar';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, Center, CloseButton, Flex, Grid, GridItem, Heading, IconButton, Input, Progress, Spinner, Wrap } from '@chakra-ui/react';
import { getAgendaActions, getPublishedAgendas } from '../../redux/entities/playerActions';
import { Stack } from '@chakra-ui/react';
import { getMyCharacter } from '../../redux/entities/characters';
import { calculateProgress, getFadedColor, getTime } from '../../scripts/frontend';
import socket from '../../socket';
import AgendaDrawer from './AgendaDrawer';
import { useNavigate } from 'react-router';
import Action from '../Actions/ActionList/Action/Action';
import { Plus } from '@rsuite/icons';
import NewAction from '../Actions/Modals/NewAction';

const Agendas = (props) => {
  const navigate = useNavigate();
  const { login, myCharacter } = useSelector((state) => state.auth);
  const gamestate = useSelector((state) => state.gamestate);
  const gameConfig = useSelector(s => s.gameConfig);
  
  const agendas = useSelector(getAgendaActions).sort((a, b) => {
    let da = new Date(a.createdAt),
      db = new Date(b.createdAt);
    return da - db;
  });
  
  const myDrafts = agendas.filter(el => el.creator._id === myCharacter._id && !el.tags.some(tag => tag.toLowerCase() === 'published'))

  const publishedAgendas = useSelector(getPublishedAgendas).sort((a, b) => {
    let da = new Date(a.publishDate),
      db = new Date(b.publishDate);
    return da - db;
  });

  const [filter, setFilter] = useState('');
  const [round, setRound] = useState(gamestate.round);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  if (!login) {
    navigate('/');
    return <Spinner />;
  }

  useEffect(() => {
    if (selected) {
      const newSelected = agendas.find((el) => el._id === selected._id);
      setSelected(newSelected);
    }
  }, [agendas, selected]);

  useEffect(() => {
    if (filter) {
      let filtered = [];
      let agendasToFilter = [];
      myCharacter.tags.some((el) => el.toLowerCase() === 'control') ? (agendasToFilter = agendas) : (agendasToFilter = publishedAgendas);

      filtered = agendasToFilter.filter(
        (agenda) =>
          agenda.name?.toLowerCase().includes(filter.toLowerCase()) ||
          agenda.submission.description?.toLowerCase().includes(filter.toLowerCase()) ||
          agenda.creator.characterName?.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredData(filtered);
    } else myCharacter.tags.some((el) => el.toLowerCase() === 'control') ? setFilteredData(agendas) : setFilteredData(publishedAgendas);
  }, [agendas, filter, publishedAgendas, myCharacter]);

  const handleSearch = (e) => {
    setFilter(e);
  };

  const handlePublish = async (agenda) => {
    const id = agenda._id;
    socket.emit('request', { route: 'action', action: 'publish', id });
  };

  return (
    <React.Fragment>
      <Grid
        templateAreas={`"nav"`}
        gridTemplateColumns={'100%'}
        gap='1'
        fontWeight='bold'>

        <GridItem pl='2' area={'nav'} >

        <Box>
          <Input style={{ width: '80%', margin: '5px' }} placeholder="Search" onChange={(e) => handleSearch(e)}></Input>
          {!selected && <IconButton variant={'solid'} onClick={() => setMode('new')}  colorScheme='green' size="sm" icon={<Plus/>} />}
          {selected && <IconButton variant={'outline'} onClick={() => setSelected(false)} colorScheme='red' size="sm" icon={<CloseButton />} /> }
          </Box>
          <Box>
            <Stack direction={['column', 'row']} align="center" spacing="4" justify={'center'}>
              <tbody>
              {<h5>Round {round}</h5>}         
                {[1, 2, 3, 4, 5, 6, 7, 8].filter(el => el <= gamestate.round).map((x, i) => (
                  <Button key={i} style={{ margin: '4px' }} onClick={() => setRound(i + 1)}  variant={x === round ? 'solid' : 'outline'} circle>
                    {i + 1}
                  </Button>
                ))}
              </tbody>
            </Stack>
            
          </Box>
          
          {!selected && mode !== 'new' && <Wrap justify="space-around" align={'center'} >
            {[...filteredData, ...myDrafts].filter((el) => el.round === round).length === 0 && <b>Nothing here yet...</b>}
            {[...filteredData, ...myDrafts]
              .filter((el) => el.round === round)
              .map((agenda) => (
                <div key={agenda._id}
                  onClick={() => setSelected(agenda)}
                  style={{
                    cursor: 'pointer',
                    border:
                      (agenda.tags.some((tag) => tag.toLowerCase() !== 'published') || !agenda.tags.length > 0) && agenda.type === 'Agenda'
                        ? `4px dotted ${getFadedColor(agenda.type)}`
                        : `4px solid ${getFadedColor(agenda.type)}`,
                    borderRadius: '5px',
                    padding: '15px',
                    width: '35vw',
                    minWidth: '500px'
                  }}
                >
                  <Flex align="middle" style={{}} justify="space-between">
                    <Box style={{ margin: '5px' }} width={'25%'}>
                      <Avatar circle size="md" src={agenda.creator.profilePicture} alt="?" style={{ maxHeight: '50vh' }} />
                    </Box>

                    <Box >
                      <h5>{agenda.name}</h5>
                      {agenda.creator.playerName} - {agenda.creator.characterName}
                      <p className="slim-text">{getTime(agenda.submission.updatedAt)}</p>
                    </Box>

                    <Box width={'25%'} >
                      <Center>{calculateProgress(agenda.options)}</Center>

                      <Progress
                        borderRadius={'20px'}
                        colorScheme={calculateProgress(agenda.options) > 0 ? 'green' : 'red'}
                        size='lg'
                        marginBottom={'5px'}
                        marginLeft={'5px'}
                        marginRight={'5px'}
                        marginTop={'5px'}
                        value={Math.abs(calculateProgress(agenda.options))} />
                      <b>Comments {agenda.comments.length}</b>
                    </Box>
                  </Flex>
                </div>
              ))}
          </Wrap>}
          
          {mode === 'new' && <NewAction closeNew={() => setMode(false)} actionType={gameConfig.actionTypes.find(el => el.type === 'Agenda')} />}

          {selected && 
          <Center>
            <Action
              actionType={gameConfig.actionTypes[1]}
              action={selected}
            />
            </Center>}            


        </GridItem>
      </Grid>


      {/* <Container style={{ height: 'calc(100vh - 100px)', overflow: 'auto', display: 'flex', alignItems: 'center' }}>

			</Container> */}
    </React.Fragment>
  );
};
export default Agendas;
