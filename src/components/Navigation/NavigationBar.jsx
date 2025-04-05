import React, { useEffect } from 'react'; // React
import { connect, useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Link wrapper for react router
import socket from '../../socket' // Socket.io client
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { clockRequested } from '../../redux/entities/clock';
import { getCharAccount, getTeamAccount } from '../../redux/entities/accounts';
import { gamestateRequested, gamestateRequestFailed, toggleLoading } from '../../redux/entities/gamestate';
import { Button, Divider, Menu, MenuButton, MenuList, MenuItem, Popover, PopoverContent, PopoverTrigger, Portal, Progress, Switch, VStack, IconButton, ButtonGroup, Input, Center } from '@chakra-ui/react';
import { BsFillGearFill, BsPause, BsPlayFill } from "react-icons/bs"
import ResourceNugget from '../Common/ResourceNugget';
import { setCharacter, setTeam, signOut } from '../../redux/entities/auth';
import TeamCard from '../Common/TeamCard';
import { CandiModal } from '../Common/CandiModal';
import { getCharacterById, getMyCharacter } from '../../redux/entities/characters';

// const mapStateToProps = state => ({
// 	login: state.auth.login,
// 	loading: state.gamestate.loading,
// 	clock: state.clock,
// 	team: state.auth.team,
// 	account: state.auth.character ? getCharAccount(state) : undefined,
// 	teamAccount: state.auth.team ? getTeamAccount(state) : undefined,
// 	character:  state.auth.character,
// });


const NavBar = (props) => {
  const reduxAction = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, team, myCharacter, control } = useSelector(s => s.auth)
  const loading = useSelector(s => s.gamestate.loading)
  const allCharacters = useSelector(state => state.characters.list);
  const teams = useSelector(state => state.teams.list);
  const clock = useSelector(s => s.clock)
  const teamAccount = useSelector(getTeamAccount);
  const gamestate = useSelector(state => state.gamestate)
  const account = useSelector(getCharAccount);

  const myChar = useSelector(getMyCharacter);
  const [selectedChar, setSelectedChar] = React.useState(myChar._id);
  const currentCharacter = useSelector(getCharacterById(selectedChar));

  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [filter, setFilter] = React.useState('');
  const [mode, setMode] = React.useState('');

  useEffect(() => { //equivalent of comonentDidMount
    if (clock) {
      const interval = setInterval(() => {
        let countDownDate = new Date(clock.nextTick).getTime();
        const now = new Date().getTime();

        let distance = countDownDate - now;
        const second = Math.floor((distance / 1000) % 60);
        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

        if (second + minutes <= 0 || clock.paused) {
          clearInterval(interval);
          if (clock?.curentTime) {
            setSeconds(clock?.curentTime?.seconds);
            setMinutes(clock?.curentTime?.minutes);
            setHours(clock?.curentTime?.hours);
          }

        }
        else {
          setSeconds(second);
          setMinutes(minutes);
          setHours(hours);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [clock])

  useEffect(() => {
    reduxAction(setCharacter(currentCharacter));
    const myTeam = teams.find((el) => el.characters.some((user) => user._id == currentCharacter._id));
    reduxAction(setTeam(myTeam));
  }, [currentCharacter]);

  const rawr = account !== undefined ? account.resources.find(el => el.type === 'credit') : undefined
  const megabucks = rawr ? rawr.balance : 'Error w/ account';

  const rawr2 = teamAccount !== undefined ? teamAccount.resources.find(el => el.type === 'r_credit') : undefined
  const megabucksTeam = rawr2 ? rawr2.balance : `Error w/ account credits`;
  const max = (gamestate?.roundLength?.minutes * 60) + gamestate?.roundLength?.seconds || 0;
  const fraction = ((minutes * 60) + seconds) / max;

  const handleLogOut = () => {
    reduxAction(signOut());
    socket.emit('logout');
    navigate('/login');
  };

  const handleCharChange = (charId) => {
    if (charId) {
      setSelectedChar(charId);
    } else setSelectedChar(myChar._id);
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'left', alignItems: 'center', color: 'white', fontSize: '0.966em', maxHeight: "70px", backgroundColor: '#746d75', borderBottom: '3px solid', borderRadius: 0, borderColor: '#d4af37',
    }} >

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
            <MenuItem>
              {control &&
                <ButtonGroup>
                  <IconButton disabled icon={<ArrowLeftIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'revert' })} />
                  <IconButton
                    disabled={clock.paused}
                    icon={<BsPause />}
                    onClick={() => {
                      socket.emit('request', { route: 'clock', action: 'pause' });
                    }}
                  />
                  <IconButton
                    disabled={!clock.paused}
                    icon={<BsPlayFill />}
                    onClick={() => {
                      socket.emit('request', { route: 'clock', action: 'play' });
                    }}
                  />

                  <IconButton icon={<ArrowRightIcon />} onClick={() => socket.emit('request', { route: 'clock', action: 'skip' })} />
                </ButtonGroup>}
            </MenuItem>
          </MenuList>
        </Menu>}

      <div style={{ width: '40%', margin: '8px', }}>



        {login && <div className='styleCenterLeft'>
          {hours}:{minutes <= 9 && <>0</>}{minutes}:{seconds <= 9 && <>0</>}{seconds} ~
          Round {gamestate.round} Pick: {clock.tickNum}
          <BsFillGearFill spin={clock.loading.toString()} onClick={() => { reduxAction(clockRequested()); socket.emit('request', { route: 'clock', action: 'getState' }); }} style={{ cursor: 'pointer', marginLeft: "5px" }} />
        </div>}
        {<Progress
          isIndeterminate={loading}
          value={loading ? 100 : fraction * 100}
          colorScheme={clock.paused ? 'whiteAlpha' : loading ? 'gray' : (fraction * 100) >= 66 ? "cyan" : (fraction * 100) >= 33 ? "yellow" : "red"}
          style={{ width: '30%', }} />}

      </div>

      <div style={{ borderRadius: '5px', display: 'flex', width: '40%' }}>
        {teamAccount &&
          <div className='styleCenter'>
            {teamAccount.resources.filter(el => el.balance > 0).map(resource => (
              <ResourceNugget
                fontSize={'1.5em'}
                key={resource._id}
                type={resource.code ? resource.code : resource.type}
                value={resource.balance}
                width={"70px"}
                height={"50px"}
              />)
            )}
          </div>}
      </div>

      <Center
        style={{
          textAlign: 'right',
          justifyContent: 'right',
          alignItems: 'right',
          width: '16%',
          marginRight: '10px',
          marginTop: '15px',
          marginBottom: '10px',
        }} >
        {team && <TeamCard team={team} handleSelect={(() => { if (control) setMode('change') })} />}
        {myChar && myCharacter && myChar !== myCharacter && <Button size={'xs'} onClick={() => handleCharChange(myChar._id)}>{myCharacter.characterName} (Reset)</Button>}
        {!team && <Link style={{ color: 'white' }} to="/login">Sign In</Link>}
      </Center>
      <div />

      <CandiModal open={mode === 'change'} onClose={() => setMode(false)} >
        <Input onChange={(event) => setFilter(event.target.value.toLowerCase())} />

        <VStack divider={<Divider />} overflow={"auto"} >
          {allCharacters.filter(el => el.characterName.toLowerCase().includes(filter)).map(character => (
            <Button
              variant={"unstyled"}
              key={character._id}
              value={character._id}
              _hover={{ bg: 'gray.400' }}
              onClick={() => {
                handleCharChange(character._id);
                setMode(false)
              }}
            >
              {character.characterName}
            </Button>
          ))}
        </VStack>
      </CandiModal>
    </div>
  )
};


export default (NavBar);