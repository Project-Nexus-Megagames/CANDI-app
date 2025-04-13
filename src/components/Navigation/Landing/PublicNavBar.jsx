import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { useHistory } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select, Menu, MenuButton, MenuList, MenuItem, Button, useDisclosure, Text, Hide, Progress, Box, ButtonGroup } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { BsFillGearFill, BsPause, BsPlayFill } from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux';
import { clockRequested } from '../../../redux/entities/clock';
import socket from '../../../socket';
import { setTab } from '../../../redux/entities/auth';

const NavbarContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: #393c3e;
	justify-content: space-between;
	color: #ffffff;
  height: 100%;
`;


const PublicNavBar = (props) => {
	const { setShow, setSubTab, width } = props;
	const reduxAction = useDispatch();
	const clock = useSelector(s => s.clock);
	const { tab } = useSelector(s => s.auth);
	const gamestate = useSelector(state => state.gamestate);
	const loading = useSelector(s => s.gamestate.loading);

	const matchesLoaded = useSelector(s => s.events.loaded)
	const assetsLoaded = useSelector(s => s.assets.loaded)
	const gamestateLoaded = useSelector(s => s.gamestate.loaded)
	const gameConfigLoaded = useSelector(s => s.gamestate.loaded)
	const teamsLoaded = useSelector(s => s.teams.loaded)

	const navigate = useNavigate();
	const [seconds, setSeconds] = React.useState(0);
	const [minutes, setMinutes] = React.useState(0);
	const [hours, setHours] = React.useState(0);
	const max = (gamestate?.roundLength?.hours * 60 * 60) + (gamestate?.roundLength?.minutes * 60) + gamestate?.roundLength?.seconds || 0;
	const fraction = ((hours * 60 * 60) + (minutes * 60) + seconds) / max;

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

	return (
		<NavbarContainer style={{ width: width }} >
			<Box style={{ width: '10%', marginLeft: '15px' }}>
				{clock && <div className='styleCenterLeft'>
					{hours}:{minutes <= 9 && <>0</>}{minutes}:{seconds <= 9 && <>0</>}{seconds} ~
					Round {gamestate.round} {clock.tickNum && <>Pick: {clock.tickNum}</>}
					<BsFillGearFill spin={clock.loading.toString()} onClick={() => { reduxAction(clockRequested()); socket.emit('request', { route: 'clock', action: 'getState' }); }} style={{ cursor: 'pointer', marginLeft: "5px" }} />
				</div>}
				{<Progress
					isIndeterminate={loading}
					value={loading ? 100 : fraction * 100}
					colorScheme={clock.paused ? 'whiteAlpha' : loading ? 'gray' : (fraction * 100) >= 66 ? "cyan" : (fraction * 100) >= 33 ? "yellow" : "red"}
				/>}
			</Box>

			<ButtonGroup spacing='1'>
				<Button colorScheme='blue' variant={tab === 'landing' ? 'solid' : 'ghost'} onClick={() => {reduxAction(setTab('landing')); navigate('/landing')} } >Home</Button>
				<Button isDisabled={!matchesLoaded} colorScheme='blue' variant={tab === 'matches' ? 'solid' : 'ghost'} onClick={() => {reduxAction(setTab('matches')); navigate('/landing')}} >Matches</Button>
				<Button isDisabled={!teamsLoaded} colorScheme='blue' variant={tab === 'teams' ? 'solid' : 'ghost'} onClick={() => {reduxAction(setTab('teams')); navigate('/landing')}} >Teams</Button>
				<Button isDisabled={!assetsLoaded} colorScheme='blue' variant={tab === 'athletes' ? 'solid' : 'ghost'} onClick={() => {reduxAction(setTab('athletes')); navigate('/landing')}} >Athletes</Button>
			</ButtonGroup>

			<Button onClick={() => navigate('/login')} margin={'50px'} variant={'link'} >Login</Button>
		</NavbarContainer>

	);
}
export default PublicNavBar;