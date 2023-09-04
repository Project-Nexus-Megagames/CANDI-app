import React, { useEffect } from 'react';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { connect, useSelector } from 'react-redux';
import { getGodBonds, getMortalBonds } from '../../redux/entities/assets';
import { Box, Button, Flex, HStack, SimpleGrid, Spacer, Spinner, Stack, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CharacterNugget from '../Common/CharacterNugget';

const  CharacterStats = (props) => {
	const config = useSelector((state) => state.gameConfig);
  const navigate = useNavigate();  
	const [copy, setCopy] = React.useState([]);
	const [number, setNumber] = React.useState(3);

	

  return ( 		
		<Box>
				<h3>Leaderboard</h3>
				{<Button onClick={() => setNumber(number === 3 ? 100 : 3)}>Show All</Button>}
        <SimpleGrid columns={1} spacing={10}>
        {config.characterStats && config.characterStats.map((stat, index) => (
            <div key={stat._id} style={{ border: '3px solid pink', borderRadius: '5px', width: '100%', }} >
              <h5 style={{ backgroundColor: 'pink', color: 'black' }}>{stat.type}</h5>
              <VStack hover size="sm">
                {props.characters.filter(el => el.tags.some(tag => tag.toLowerCase() === 'pc')).sort(function(a, b){return b.characterStats.find(el => el.type === stat.type)?.statAmount - a.characterStats.find(el => el.type === stat.type)?.statAmount}).splice(0, number).map((character, index) => (
                <Box key={index} index={index}>
                <HStack >
                  <Box colspan={2}>
                    <b>{index+1}</b>{index === 0 ? <b>st</b> : index === 1 ? <b>nd</b> : <b>rd</b>}
                  </Box>

                  <Box colspan={2}>
                    <CharacterNugget character={character} />
                  </Box>

                  <Spacer />

                  <Box colspan={20}>
                    {character.characterName} {character.characterTitle && <b>({character.characterTitle})</b>}
                  </Box>
                  <Box colspan={2}>
                    {<div> 
                      {character.characterStats.find(el => el.type === stat.type)?.statAmount}
                      </div>}
                  </Box>
                </HStack>
              </Box>
              ))}
              </VStack>
            </div>          
        ))}

        </SimpleGrid>
		</Box>
	);
}

export default (CharacterStats);
