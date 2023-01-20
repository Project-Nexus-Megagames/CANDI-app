import React from 'react';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import CharacterListItem from './CharacterListItem';
import ResourceNugget from '../Common/ResourceNugget';

const SelectedCharacter = (props) => {
  const { selected } = props;
	return ( 
		<Grid
        templateAreas={`"side main"
                        "body body"`}
        gridTemplateColumns={ '50% 50%'}
        gridTemplateRows={ '40% 60%'}
        gap='1'
        fontWeight='bold'>
			<GridItem pl='2' bg='#333333' area={'side'} >
        <CharacterListItem character={selected} />
        <Flex  >
        {selected.tags && selected.tags.filter(el => el.toLowerCase() !== 'public').map((item) =>
         <ResourceNugget key={item} value={item} width={'50px'} height={'30'} />
         )}
        </Flex>		
        {selected.pronouns && <p>
          Character Pronouns: <b>{selected.pronouns}</b>
        </p>}
        {selected.timeZone && <p>
          Time Zone: <b>{selected.timeZone}</b>
        </p>}
        <p style={{ color: "rgb(153, 153, 153)" }}>Bio</p>
        <p>{selected.bio}</p>
			</GridItem>
			<GridItem pl='2' bg='#444444' area={'main'} >
        <img
          src={`${selected.profilePicture}`}
          alt='Img could not be displayed'
          style={{ maxHeight: "50vh", width: '100%' }}
        />
			</GridItem>

      <GridItem pl='2' bg='#555555' area={'body'} >
				cccc
			</GridItem>
		</Grid>
	);
}

export default (SelectedCharacter);