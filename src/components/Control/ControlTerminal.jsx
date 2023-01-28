import React, { useEffect }  from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import Registration from './Registration';
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ActionTable from './ActionTable';
import GameConfig from '../GameConfig/GameConfig';

const ControlTerminal = (props) => {		
	const { login, team, character, loading, user } = useSelector(s => s.auth);

	let [account, setAccount] = React.useState();
	const navigate = useNavigate();
	const [target, setTarget] = React.useState();
	const [tab, setTab] = React.useState(0);
	
	const tags = ['dice', 'contract', 'ice']

	useEffect(() => {
		if(!login)
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

	
	return ( 
		<Tabs isLazy variant='enclosed' index={tab} onChange={setTab}>
		<TabList>
			<Tab>DashBoard</Tab>
      <Tab>Actions</Tab>
			<Tab>Characters</Tab>
			<Tab>Resources (Assets)</Tab>
			<Tab>GameState</Tab>
			<Tab>Configuration</Tab>
			<Tab>Register</Tab>
		</TabList>

		<TabPanels>

			<TabPanel>
				<div>
          {/* <Button onClick={handleRound}>Hello</Button> */}
				</div>
			</TabPanel>

      <TabPanel>
        <ActionTable />
			</TabPanel>

			<TabPanel>
				BBBBB
			</TabPanel>
			
			<TabPanel>
				CCCCC			
			</TabPanel>

			<TabPanel>
				DDDDD			
			</TabPanel>

      <TabPanel>
				<div style={{ width: '90%', height: '95vh'}}>
					<GameConfig />
				</div>
			</TabPanel>		

			<TabPanel>
				<Registration />
			</TabPanel>			

		</TabPanels>
	</Tabs>
	);
}

export default (ControlTerminal);