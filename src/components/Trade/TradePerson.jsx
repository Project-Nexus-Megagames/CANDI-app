import { Box, Button, Card, IconButton, StackDivider, VStack } from '@chakra-ui/react';
import { Close } from '@rsuite/icons';
import React from 'react';

const TradePerson = ({ initiator, removeAsset, person, completed, ratifyTrade, ratified }) => {
	if (initiator) {
		return (
			<div style={{ backgroundColor: '#282c34', height: '94vh', borderRight: '3px solid white', }}>
				<Card style={{ backgroundColor: '#413938', height: '10vh',  }} > 
					<h5 style={{  }} >{person.character.characterName}'s Offer</h5>
					{!completed && <Button style={{  }} onClick={ratifyTrade} color={!ratified ? 'green' : 'red'} >{!ratified ? 'Approve' : 'Reject'} Trade</Button>			}		
				</Card>
				<VStack  divider={<StackDivider borderColor='gray.200' />}>
					{person.offer.map((asset, index) => (
						<div key={asset._id} className='nav-item'  >
							{asset.name}	<IconButton disabled={completed} onClick={() => removeAsset(asset)} color='red' size="lg" icon={<Close/>} />
						</div>
					))}
				</VStack>					
			</div>
		);		
	}
	else {
		return (
			<div style={{ backgroundColor: '#282c34', height: '94vh', borderLeft: '3px solid white' }}>
				<Box style={{ height: '10vh', backgroundColor: '#413938', }}>
					<h5>{person.character.characterName}'s Offer</h5>					
				</Box>

				<VStack  divider={<StackDivider borderColor='gray.200' />}>
					{person.offer.map((asset, index) => (
						<div key={asset._id} className='nav-item'  >
							{asset.name}	<IconButton disabled={completed} onClick={() => removeAsset(asset)} color='red' size="lg" icon={<Close/>} />
						</div>
					))}
				</VStack>							
			</div>
		);
	}


}


export default (TradePerson);