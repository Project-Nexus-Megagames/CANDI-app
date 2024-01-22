import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { setCharacter, signOut } from '../../redux/entities/auth';
import { getCharacterById, getMyCharacter } from '../../redux/entities/characters';
import { Box, Button, ButtonGroup, Container, Divider, Flex, IconButton, Input, Link, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, Progress, VStack } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import usePermissions from "../../hooks/usePermissions";
import { useLocation, useNavigate } from 'react-router';
import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';
import UserList from './UserList';
import { getCharAccount } from '../../redux/entities/accounts';
import ResourceNugget from '../Common/ResourceNugget';
import { BsGearFill } from 'react-icons/bs';
import { clockRequested } from '../../redux/entities/clock';
import { FaEmpire } from 'react-icons/fa';
import { PauseOutline, PlayOutline } from '@rsuite/icons';
import { getFadedColor } from '../../scripts/frontend';
import { AlertList } from './AlertList';
import CharacterNugget from '../Common/CharacterNugget';
import CharacterListItem from '../OtherCharacters/CharacterListItem';

const Navigation = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduxAction = useDispatch();

  const { myCharacter, } = useSelector(s => s.auth);
  const [time, setTime] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const myChar = useSelector(getMyCharacter);
  const [selectedChar, setSelectedChar] = React.useState(myChar._id);
  const currentCharacter = useSelector(getCharacterById(selectedChar));
  const allCharacters = useSelector(state => state.characters.list);
  const loading = useSelector(s => s.gamestate.loading)
  const { isControl } = usePermissions();
  const gamestate = useSelector(state => state.gamestate)
  const clock = useSelector(s => s.clock)
  const myAccout = useSelector(getCharAccount);


  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const max = 900;

  useEffect(() => {
    renderTime();
    setInterval(() => {
      renderTime();
      //clearInterval(interval);
    }, 60000);
  }, [props.gamestate.endTime]);

  useEffect(() => {
    reduxAction(setCharacter(currentCharacter));
  }, [currentCharacter]);

  useEffect(() => { //equivalent of comonentDidMount
    if (clock) {
      const interval = setInterval(() => {
        let countDownDate = new Date(clock.nextTick).getTime();
        const now = new Date().getTime();

        let distance = countDownDate - now;
        const second = Math.floor((distance % (1000 * 120)) / 1000);
        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));


        if (second <= 0 || clock.paused) {
          clearInterval(interval);
        }
        else {
          setSeconds(second);
          setMinutes(minutes);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [clock,])

  const handleCharChange = (charId) => {
    if (charId) {
      setSelectedChar(charId);
    } else setSelectedChar(myChar._id);
  };

  const getTimeToEndOfRound = () => {
    return new Date(gamestate.endTime).getTime() - new Date().getTime();
  }

  const renderTime = () => {
    const distance = getTimeToEndOfRound();
    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    if (days > 0) setTime(`${days} Days, ${hours} Hours, ${minutes} Minutes`);
    else if (hours > 0) setTime(`${hours} Hours, ${minutes} Minutes`);
    else setTime(`${minutes} Minutes`);
  };

  const handleLogOut = () => {
    reduxAction(signOut());
    socket.emit('logout');
    navigate('/login');
  };


  const speaker = (
    <div >
      {true &&
        <ButtonGroup>
          <IconButton disabled icon={<ArrowLeftIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'revert' })} />
          <IconButton
            disabled={clock.paused}
            icon={<PauseOutline />}
            onClick={() => {
              socket.emit('request', { route: 'clock', action: 'pause' });
              setOpen(false);
            }}
          />
          <IconButton
            disabled={!clock.paused}
            icon={<PlayOutline />}
            onClick={() => {
              socket.emit('request', { route: 'clock', action: 'play' });
              setOpen(false);
            }}
          />
          <IconButton icon={<ArrowRightIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'skip' })} />
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </ButtonGroup>}
    </div>
  );

  return (
    <Container
      style={{
        backgroundColor: '#746d75',
        width: '100%',
        fontSize: '0.966em',
        borderBottom: '3px solid',
        borderRadius: 0,
        borderColor: '#d4af37',
      }}
      maxW={'100vw'}
      minW={'350px'}
      paddingTop={'0.5rem'}
      paddingBottom={'0.5rem'}
    >
      <Flex
        alignItems={'center'}
      >
        <Box
          justify="start"
          display='flex'
          marginRight='auto'
        >
          {location.pathname !== "/home" && <IconButton
            onClick={() => navigate('/home')}
            icon={<ArrowBackIcon />}
            variant='outline'
            aria-label={'go home'}
          />}
          {location.pathname === "/home" &&
            <Menu>
              <MenuButton >
                <IconButton
                  icon={<HamburgerIcon />}
                  variant='outline' />
              </MenuButton>
              <MenuList>
                <MenuItem>Version: {gamestate.version}</MenuItem>
                <MenuItem onClick={() => window.open('https://github.com/Project-Nexus-Megagames/CANDI-issues/issues')}>Report Issues</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                <MenuItem onClick={() => reduxAction(toggleDuck())}>Spook</MenuItem>
              </MenuList>
            </Menu>}
        </Box>

        <Box
          flex={2}
          style={{ width: '70%', margin: '8px', }}
        >
          {/* <div className='styleCenterLeft'>
            {minutes}:{seconds <= 9 && <t>0</t>}{seconds} ~
            Tick {clock.tickNum}
            <BsGearFill
              spin={clock.loading.toString()}
              onClick={() => { reduxAction(clockRequested()); socket.emit('request', { route: 'clock', action: 'getState' }); }}
              style={{ cursor: 'pointer', marginLeft: "5px" }}
            />

            <Popover 
            isOpen={open}
            closeOnBlur
            openDelay={200} 
            hasArrow  
            placement='right'>
              <PopoverTrigger>
                <FaEmpire
                  spin={clock.loading.toString()}
                  onClick={() => { setOpen(true); socket.emit('request', { route: 'clock', action: 'getState' }); }}
                  style={{ cursor: 'pointer', marginLeft: "5px" }}
                />
              </PopoverTrigger>
              <PopoverContent backgroundColor={getFadedColor('background')} >
              {minutes}:{seconds} ~
                {speaker}
              </PopoverContent>
            </Popover>

          </div>
          <Progress
            isIndeterminate={loading}
            value={loading ? 100 : (seconds + (minutes * 60)) * 100 / max}
            colorScheme={clock.paused ? 'whiteAlpha' : loading ? 'gray' : ((seconds + (minutes * 60)) * 100 / max >= 66) ? "cyan" : ((seconds + (minutes * 60)) * 100 / max >= 33 ? "yellow" : "red")}
            style={{ width: '30%', }} /> */}
        </Box>

        <Box
          display='flex'
          flex={2}
        >
          <Box
            justifyContent={'center'}
            alignItems={'center'}
            display='flex'
            flexDir={'column'}
            width={'100%'}
          >
            <p>Round: {props.gamestate.round} </p>
            {getTimeToEndOfRound() > 0 && <Box>Time Left: {time}</Box>}
            {getTimeToEndOfRound() <= 0 && <Box>Game Status: {props.gamestate.status}</Box>}
            {false &&
              <div className='styleCenter'>
                {myAccout.resources.filter(el => el.balance > 0).map(resource => (<ResourceNugget fontSize={'1.5em'} key={resource._id} type={resource.code ? resource.code : resource.type} value={resource.balance} width={"70px"} />))}
              </div>}
          </Box>
        </Box>

        <Box
          flex={2}
          display='flex'
          marginLeft='auto'
          justifyContent='right'
        >

          <AlertList />
          {myChar && myCharacter && myChar !== myCharacter && <Button onClick={() => handleCharChange(myChar._id)}>{myCharacter.characterName} (Reset)</Button>}
          {isControl && (
            <Popover>
              <PopoverTrigger
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme={'#0f131a'}
                _hover={{ bg: 'gray.400' }}
              >
                <Button variant={'ghost'} >View As</Button>
              </PopoverTrigger>
              <PopoverContent
                backgroundColor={'#0f131a'}
                overflow="hidden"
                maxHeight={'50vh'}
              >
                <PopoverHeader >
                  <Input onChange={(event) => setFilter(event.target.value.toLowerCase())} />
                </PopoverHeader >
                <PopoverBody overflow={'scroll'} style={{ scrollbarWidth: "thin" }} >
                  <VStack divider={<Divider />} overflow={"auto"} >
                    {allCharacters
                    .filter(el => el.characterName.toLowerCase().includes(filter) || el.playerName.toLowerCase().includes(filter))
                    .map(character => (
                        <CharacterListItem
                          character={character}
                          key={character._id}
                          isAccessible
                          size='md'
                          handleSelect={() => {
                            handleCharChange(character._id);
                          }} />
                    ))}
                  </VStack>

                </PopoverBody>

              </PopoverContent >
            </Popover>
          )}

          {isControl && <UserList />}
        </Box>
      </Flex>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  gamestate: state.gamestate
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(signOut()),
  setCharacter: (payload) => dispatch(setCharacter(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
