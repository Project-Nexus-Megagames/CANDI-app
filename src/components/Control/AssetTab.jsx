import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Grid, GridItem, Input, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getFadedColor, getTextColor } from '../../scripts/frontend';
import CharacterListItem from '../OtherCharacters/CharacterListItem';
import DynamicForm from './DynamicForm';
import AssetCard from '../Common/AssetCard';

const AssetTab = (props) => {
	const assets = useSelector(s => s.assets.list);
	const { login, team, character} = useSelector(s => s.auth);
	const loading =  useSelector(s => s.gamestate.loading);
  const [renderTags, setRenderTags] = useState([]); // TODO: update with Faction tags
	const [selected, setSelected] = useState(undefined);
	const [fil, setFilter] = useState('');

  // dynamically creat tags based on the assets that exis
	useEffect(() => {
		if (assets) {
			let uniqueChars = [];
			for (const char of assets) {
				uniqueChars = uniqueChars.concat(char.tags);
			}
      uniqueChars = [...new Set(uniqueChars)];      
			setRenderTags(uniqueChars);
		}
	}, [assets]);

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
                {assets
              	.filter(user => user.name.toLowerCase().includes(fil.toLowerCase()) ||
                  user.description.toLowerCase().includes(fil.toLowerCase()
                ))
                .filter((el) => el.tags.some((el) => el.toLowerCase() === tag.toLowerCase() ))
                  .map((asset =>
                    <AssetCard asset={asset} key={asset._id} disabled handleSelect={(asset) => setSelected(asset)}  />
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

export default (AssetTab);