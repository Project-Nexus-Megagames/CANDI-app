import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { setCharacter, signOut } from '../../redux/entities/auth';
import { getCharacterById, getMyCharacter } from '../../redux/entities/characters';
import { Box, Button, Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import usePermissions from "../../hooks/usePermissions";

const Navigation = (props) => {
    const [time, setTime] = React.useState('');
    const myChar = useSelector(getMyCharacter);
    const [selectedChar, setSelectedChar] = React.useState(myChar._id);
    const currentCharacter = useSelector(getCharacterById(selectedChar));
    const allCharacters = useSelector(state => state.characters.list);
    const history = useHistory();
    const {isControl} = usePermissions();

    useEffect(() => {
        renderTime();
        setInterval(() => {
            renderTime();
            //clearInterval(interval);
        }, 60000);
    }, [props.gamestate.endTime]);

    useEffect(() => {
        props.setCharacter(currentCharacter);
    }, [currentCharacter]);

    const handleCharChange = (charId) => {
        console.log('charID', charId);
        if (charId) {
            setSelectedChar(charId);
        } else setSelectedChar(myChar._id);
    };

    const getTimeToEndOfRound = () => {
        return new Date(props.gamestate.endTime).getTime() - new Date().getTime();
    }

    const renderTime = () => {
        const distance = getTimeToEndOfRound();
        const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setTime(`${days} Days, ${hours} Hours, ${minutes} Minutes`);
    };

    return (
        <Container
            style={{
                backgroundColor: '#0f131a',
                width: '100%',
                fontSize: '0.966em',
                borderBottom: '3px solid',
                borderRadius: 0,
                borderColor: 'white',
            }}
            maxW={'1200px'}
            minW={'350px'}
            paddingTop={'1rem'}
            paddingBottom={'1rem'}
        >
            <Flex
                alignItems={'center'}
            >
                <Box
                    onClick={() => history.push('/home')}
                    justify="start"
                    flex={1}
                    display='flex'
                    marginRight='auto'
                >
                    <IconButton
                        onClick={() => history.push('/home')}
                        icon={<ArrowBackIcon/>}
                        variant='outline'
                        aria-label={'go home'}
                    />
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
                        <Box>Time Left: {time}</Box>
                        {getTimeToEndOfRound <= 0 && <Box>Game Status: {props.gamestate.status}</Box>}
                    </Box>
                </Box>
                <Box
                    flex={1}
                    display='flex'
                    marginLeft='auto'
                    justifyContent='right'
                >
                    {isControl && (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon/>}
                                colorScheme={'#0f131a'}
                                _hover={{bg: 'gray.400'}}
                            >
                                View As
                            </MenuButton>
                            <MenuList
                                backgroundColor={'#0f131a'}
                            >
                                {allCharacters.map(character => (
                                    <MenuItem
                                        key={character._id}
                                        value={character._id}
                                        _hover={{bg: 'gray.400'}}
                                        onClick={(event) => {
                                            console.log(event);
                                            handleCharChange(event.target.attributes.value);
                                        }}
                                    >
                                        {character.characterName}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
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
