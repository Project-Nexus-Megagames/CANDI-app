import React, { useEffect }  from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Grid, GridItem, Heading, IconButton, Input, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import SelectPicker from '../Common/SelectPicker';
import socket from '../../socket';
import CharacterTag from '../Common/CharacterTag';

const Teams = (props) => {		
	const teams = useSelector(s => s.teams.list);
	const characters = useSelector(s => s.characters.list);

	let [users, setUsers] = React.useState([]);
	let [filter, setFilter] = React.useState('');
	let [selected, setSelected] = React.useState(false);
	let [character, setCharacter] = React.useState(false);

	const handleEdit = async () => {
		const data = {
		}
		try{
			socket.emit('request', { route: 'team', action: 'changethis', data });
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
						{teams
							.filter(team => team.name.toLowerCase().includes(filter.toLowerCase()) )
							.sort((a, b) => { // sort the catagories alphabetically 
								if(a.name < b.name) { return -1; }
								if(a.name > b.name) { return 1; }
								return 0;
							})
							.map(team => (
							<div key={team._id} className='nav-item' onClick={() => setSelected(team)} >
								<b className='title-text' >{team.name}</b>
							</div>
						))}
					</VStack>
				</GridItem>

				<GridItem area={'main'}>
						{selected && <div className='styleCenterTop'>
							<Card border={`2px solid ${selected.color}`}  >
								<CardHeader>
									<Text colorScheme={'pink'}>Team: {selected.name}</Text>

								</CardHeader>

								<CardBody>
                  Characters
                  {selected.characters.map(character => (
                    <CharacterTag character={character} />
                  ))}
								</CardBody>
							</Card>
							<Button disabled={!character} onClick={handleEdit} >Register Player</Button>									
						</div>}
				</GridItem>

		</Grid>
	);
}

export default (Teams);

