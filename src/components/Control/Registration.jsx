import React, { useEffect }  from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Grid, GridItem, Heading, IconButton, Input, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import socket from '../../socket';
import SelectPicker from '../Common/SelectPicker';

const Registration = (props) => {		
	const characters = useSelector(s => s.characters.list);

	let [users, setUsers] = React.useState([]);
	let [filter, setFilter] = React.useState('');
	let [selected, setSelected] = React.useState(false);
	let [character, setCharacter] = React.useState(false);

	useEffect(() => {
		try{
			const fetchData = async () => {
				const {data} = await axios.get(`https://nexus-central-server.herokuapp.com/api/users/`);
				setUsers(data);
			}

			if (users.length === 0) fetchData().catch(console.error);
		}
		catch (err) {
			console.log(err)
			// Alert.error(`Error: ${err.response.data ? err.response.data : err.response}`, 5000);
		}	
	}, []);

	const handleRegistration = async () => {
		const data = {
			character: character,
			username: selected.username,
      playerName: selected.name.first
		}
		try{
			socket.emit('request', { route: 'character', action: 'register', data });
		}
		catch (err) {
			console.log(err)
		}
	}	
	
	return ( 
		<Grid
			templateAreas={`"nav main"`}
			gridTemplateColumns={ '400px 1fr'}
			gap='1'
			fontWeight='bold'>

				<GridItem area={'nav'} style={{ height: 'calc(100vh - 170px)', overflow: 'auto', }}>
					<Input onChange={(e) => setFilter(e.target.value)} />
					<VStack  divider={<StackDivider borderColor='gray.200' />}>
						{users
							.filter(user => user.name.first.toLowerCase().includes(filter.toLowerCase()) ||
								user.name.last.toLowerCase().includes(filter.toLowerCase()) ||
								user.username.toLowerCase().includes(filter.toLowerCase()
							))
							.sort((a, b) => { // sort the catagories alphabetically 
								if(a.name.first < b.name.first) { return -1; }
								if(a.name.first > b.name.first) { return 1; }
								return 0;
							})
							.map(user => (
							<div key={user._id} className='nav-item' onClick={() => setSelected(user)} >
								<b className='title-text' >{user.name.first} {user.name.last}</b>

								<p className='slim-text'>{user.email}</p>		
								{characters.some(char => char.username === user.username) && <Tag colorScheme={'pink'}>Has Character</Tag>}				
							</div>
						))}
					</VStack>
				</GridItem>

				<GridItem area={'main'}>
						{selected && <div className='styleCenterTop'>
              {selected.name.first}
						Username: {selected.username}
							<Card>
								<CardHeader>
									<Heading size='md'>
										{characters.some(char => char.username === selected.username) && 
											<Text colorScheme={'pink'}>Character: {characters.find(char => char.username === selected.username)?.characterName}</Text>
										}		
										{!characters.some(char => char.username === selected.username) && 
											<Text colorScheme={'pink'}>No Character </Text>
										}			
									</Heading>

								</CardHeader>

								<CardBody>
									<SelectPicker data={characters} label='characterName' onChange={(e) => setCharacter(e)} />
								</CardBody>
							</Card>
							<Button disabled={!character} onClick={handleRegistration} >Register Player</Button>									
						</div>}
				</GridItem>

		</Grid>
	);
}

export default (Registration);

