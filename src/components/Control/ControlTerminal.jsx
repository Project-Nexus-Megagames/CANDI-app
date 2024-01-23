import React, { useEffect }  from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import Registration from './Registration';
import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ActionTable from './ActionTable';
import GameConfig from '../GameConfig/GameConfig';
import CharacterTab from './CharacterTab';
import AssetTab from './AssetTab';
import { CandiWarning } from '../Common/CandiWarning';
import EditGamestate from './EditGamestate';
import TeamTab from './TeamTab';


const ControlTerminal = (props) => {		
	const { login, team, character, loading, user } = useSelector(s => s.auth);
  const assets = useSelector(s => s.assets.list);

	let [account, setAccount] = React.useState();
	const [mode, setMode] = React.useState(false);

	const navigate = useNavigate();
	const [target, setTarget] = React.useState();
	const [tab, setTab] = React.useState(0);
	
	const tags = ['dice', 'contract', 'ice']

	useEffect(() => {
		if(!login || !user)
			navigate('/');
	}, [login, navigate])

	const handleCreate = (code, amount=false) => {
		if (amount) {
			socket.emit('request', { route: 'transaction', action: 'deposit', data: {resource: code, amount, to: target } });
		}
		else
			socket.emit('request', { route: 'asset', action: 'create', 
				data: { 
					owner: target,
					account: target,
					amount: amount,
					code,
				}});
	} 

  const handleRound = () => {
    const data = user.username;
		socket.emit('request', { route: 'gamestate', action: 'nextRound', data });
  }

  const handleUnUseAll = () => {
    const data = user.username;
		socket.emit('request', { route: 'asset', action: 'unuseAll', data });
  }

  const handleResetEfferot = () => {
    const data = user.username;
		socket.emit('request', { route: 'character', action: 'resetEffort', data });
  }

  const handleClose = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'closeRound', data });
  }
  
  const handleEffect = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'unhideEffects', data });
  }

  const handleUnhideAll = () => {
    const data = user.username;
    socket.emit('request', { route: 'asset', action: 'unhide', data });
  }

	return ( 
		<Tabs isLazy variant='enclosed' index={tab} onChange={setTab}>
		<TabList>
			<Tab>DashBoard</Tab>
      <Tab>Actions</Tab>			
			<Tab>Configuration</Tab>
			<Tab>Register</Tab>
      {<Tab>Characters</Tab>}
      {user?.username.toLowerCase() === 'bobtheninjaman' && <Tab> * Assets</Tab>}
      {user?.username.toLowerCase() === 'bobtheninjaman' && <Tab> * Teams</Tab>}
		</TabList>

		<TabPanels>

			<TabPanel>
				<div>

          <Button variant={'solid'} colorScheme='teal' onClick={handleClose}>Close</Button>
          <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("edit")}>Edit Round</Button>          
          <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("next")}>Next Round</Button>
				</div>

        {user?.username.toLowerCase() === 'bobtheninjaman' && <div>
          <Box>
            Used Assets: {assets.filter(el => el.status.some(s => s=== 'used')).length}
            Working Assets: {assets.filter(el => el.status.some(s => s=== 'working')).length}
            Hidden Assets: {assets.filter(el => el.status.some(s => s=== 'hidden')).length}            
          </Box>

          <Button onClick={() => handleUnUseAll()} >Reset Assets</Button>          
          <Button onClick={() => handleUnhideAll()} >Unhide Assets</Button>
          <Button onClick={() => handleResetEfferot()} >Reset Effort</Button>
          <Button onClick={() => handleEffect()} >Unhide Effects</Button>
        </div>}

        <CandiWarning open={mode === "next"} title={"You sure about that?"} onClose={() => setMode(false)} handleAccept={() => { handleRound(); setMode(false); }}>
          Are ya sure?
        </CandiWarning>

        <EditGamestate show={mode === 'edit'} onClose={() => setMode(false)} />

			</TabPanel>

      <TabPanel>
        <ActionTable />
			</TabPanel>

      <TabPanel>
				<div style={{ width: '90%', height: '95vh'}}>
					<GameConfig />
				</div>
			</TabPanel>		

			<TabPanel>
				<Registration />
			</TabPanel>			

      <TabPanel>
				<CharacterTab />
			</TabPanel>

      <TabPanel>
				<AssetTab />	
			</TabPanel>

      <TabPanel>
				<TeamTab />	
			</TabPanel>


		</TabPanels>
	</Tabs>
	);
}

export default (ControlTerminal);