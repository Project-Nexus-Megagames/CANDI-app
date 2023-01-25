import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { setCharacter, signOut } from '../../redux/entities/auth';
import { getCharacterById, getMyCharacter } from '../../redux/entities/characters';
import { Box, Button, Container, Divider, Flex, IconButton, Input, Link, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, VStack } from "@chakra-ui/react";
import { ArrowBackIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import usePermissions from "../../hooks/usePermissions";
import { useLocation, useNavigate } from 'react-router';
import socket from '../../socket';
import { toggleDuck } from '../../redux/entities/gamestate';

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
    const {isControl} = usePermissions();
    const gamestate = useSelector(state => state.gamestate)

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

    const handleCharChange = (charId) => {
        console.log('charID', charId);
        if (charId) {
            setSelectedChar(charId);
            console.log(myChar)
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
        setTime(`${days} Days, ${hours} Hours, ${minutes} Minutes`);
    };

    const handleLogOut = () => {
      reduxAction(signOut());
      socket.emit('logout');
      navigate('/login');
    };

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
                  flex={1}
                  display='flex'
                  marginRight='auto'
                >
                  {location.pathname !== "/home" && <IconButton
                    onClick={() => navigate('/home')}
                    icon={<ArrowBackIcon/>}
                    variant='outline'
                    aria-label={'go home'}
                  />}
                  {location.pathname === "/home" && 
                  <Menu>
                    <MenuButton >
                      <IconButton 
                        icon={<HamburgerIcon/>}
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
                    display='flex'
                    flex={3}
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
                    </Box>
                </Box>
                <Box
                    flex={1}
                    display='flex'
                    marginLeft='auto'
                    justifyContent='right'
                >
                  {myChar && myChar !== myCharacter && <Button onClick={() => handleCharChange(myChar._id)}>Reset</Button>}
                    {isControl && (
                        <Popover>
                            <PopoverTrigger
                                as={Button}
                                rightIcon={<ChevronDownIcon/>}
                                colorScheme={'#0f131a'}
                                _hover={{bg: 'gray.400'}}
                            >
                              <Button>View As</Button>  
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
                                  {allCharacters.filter(el => el.characterName.toLowerCase().includes(filter)).map(character => (
                                      <Button
                                          variant={"unstyled"}
                                          key={character._id}
                                          value={character._id}
                                          _hover={{bg: 'gray.400'}}
                                          onClick={() => {
                                              handleCharChange(character._id);
                                          }}
                                      >
                                          {character.characterName}
                                      </Button>
                                  ))}                                     
                                </VStack>
                             
                              </PopoverBody>

                            </PopoverContent >
                        </Popover>
                    )}
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
