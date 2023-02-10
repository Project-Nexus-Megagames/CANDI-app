import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Grid, GridItem, Input, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import CharacterListItem from '../OtherCharacters/CharacterListItem';
import DynamicForm from './DynamicForm';

const CharacterTab = (props) => {
	const navigate = useNavigate();
	const characters = useSelector(s => s.characters.list);
	const { login, team, character} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
  const [renderTags, setRenderTags] = useState([]); // TODO: update with Faction tags
	const [selected, setSelected] = useState(undefined);
	const [fil, setFilter] = useState('');

  // dynamically creat tags based on the characters that exis
	useEffect(() => {
		if (characters) {
			let uniqueChars = [];
			for (const char of characters) {
				uniqueChars = uniqueChars.concat(char.tags);
			}
      uniqueChars = [...new Set(uniqueChars)];      
			setRenderTags(uniqueChars);
		}
	}, [characters]);

	return ( 
		<Grid
        templateAreas={`"nav main"`}
        gridTemplateColumns={ '400px 1fr'}
        height={"5vh"}
        bg='blue'
        gap='1'
        fontWeight='bold'>

			<GridItem pl='2' bg='#0f131a' area={'nav'} style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }} >
      <Input style={{ width: '100%' }} placeholder="Search" onChange={(e) => setFilter(e.target.value)}></Input>
        {renderTags.map((tag, index) => (
          <Box key={index}>
              <Box
                  marginTop='2rem'
              />
              <h5 style={{ backgroundColor: getFadedColor(tag), color: getTextColor(`${tag}-text`), textAlign: 'center',  }} >{tag}</h5>
              <Box
                  marginBottom='1rem'
              />
              <VStack divider={<Divider/>} > 
                {characters
              	.filter(user => user.characterName.toLowerCase().includes(fil.toLowerCase()) ||
                  user.characterTitle.toLowerCase().includes(fil.toLowerCase()) ||
                  user.playerName.toLowerCase().includes(fil.toLowerCase()
                ))
                .filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase() ))
                  .map((character =>
                    <CharacterListItem key={character._id} character={character} handleSelect={(character) => setSelected(character)}  />
                  ))}        
              </VStack>
          </Box>
        ))}
			</GridItem>
			<GridItem pl='2' bg='#0f131a' area={'main'} >
				
				<Box style={{ height: 'calc(100vh - 120px)', overflow: 'auto', }}> 
          {selected && <DynamicForm selected={selected} background={111} /> }
				</Box>
			</GridItem>
		</Grid>
	);
}

export default (CharacterTab);