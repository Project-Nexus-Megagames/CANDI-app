import React, { useEffect }  from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import Registration from './Registration';
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ActionTable from './ActionTable';
import GameConfig from '../GameConfig/GameConfig';
import CharacterTab from './CharacterTab';
import AssetTab from './AssetTab';
import { CandiWarning } from '../Common/CandiWarning';
import EditGamestate from './EditGamestate';


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

  const handleClose = () => {
    const data = user.username;
    socket.emit('request', { route: 'gamestate', action: 'closeRound', data });
  }
  

	return ( 
		<Tabs isLazy variant='enclosed' index={tab} onChange={setTab}>
		<TabList>
			<Tab>DashBoard</Tab>
      <Tab>Actions</Tab>			
			<Tab>Configuration</Tab>
			<Tab>Register</Tab>
      {user?.username.toLowerCase() === 'bobtheninjaman' &&<Tab>Characters</Tab>}
      {user?.username.toLowerCase() === 'bobtheninjaman' && <Tab>Assets</Tab>}
		</TabList>

		<TabPanels>

			<TabPanel>
				<div>

          <Button variant={'solid'} colorScheme='teal' onClick={handleClose}>Close</Button>
          <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("edit")}>Edit Round</Button>          
          <Button variant={'solid'} colorScheme='teal' onClick={() => setMode("next")}>Next Round</Button>
				</div>

        <div>
          {assets.filter(el => el.status.some(s => s=== 'used')).length}
          <Button onClick={() => handleUnUseAll()} >Reset Assets</Button>
        </div>

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


		</TabPanels>
	</Tabs>
	);
}

export default (ControlTerminal);