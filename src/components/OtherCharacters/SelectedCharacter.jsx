import React from 'react';
import { Box, ButtonGroup, Card, CardBody, CardHeader, Flex, Grid, GridItem, IconButton, Spacer, Tag } from '@chakra-ui/react';
import CharacterListItem from './CharacterListItem';
import ResourceNugget from '../Common/ResourceNugget';
import { useSelector } from 'react-redux';
import { getFadedColor } from '../../scripts/frontend';
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import NewAsset from '../Common/NewAsset';
import { useState } from 'react';
import { CandiWarning } from '../Common/CandiWarning';
import socket from '../../socket';
import AssetCard from '../Common/AssetCard';

const SelectedCharacter = (props) => {
  const { selected } = props;
  const [mode, setMode] = useState(false);
  const assets = useSelector(state => state.assets.list);

  const deleteAssert = async (asset) => {
    socket.emit('request', {
        route: 'asset',
        action: 'delete',
        data: {id: asset._id}
    });
};

	return ( 
		<Grid
        templateAreas={`"side main"
                        "body body"`}
        gridTemplateColumns={ '50% 50%'}
        gridTemplateRows={ '40% 60%'}
        fontWeight='bold'>
			<GridItem pl='2'  area={'side'} >
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
			<GridItem pl='2'  area={'main'} >
        <img
          src={`${selected.profilePicture}`}
          alt='Img could not be displayed'
          style={{ maxHeight: "50vh", width: '90%' }}
        />
			</GridItem>

      <GridItem  bg='#555555' area={'body'} >
        <h5 style={{ backgroundColor: getFadedColor("Asset"), color: 'black' }} >
          Assets and Resources 
          <IconButton onClick={() => setMode("new")} variant={'solid'} colorScheme="green" size={'sm'} icon={<PlusSquareIcon />} />
        </h5>
				<Grid templateColumns='repeat(3, 1fr)' gap={1}>
            {assets
              .filter((el) => el.ownerCharacter === selected._id)
              .map((asset) => (
                <AssetCard key={asset._id} asset={asset} character={selected} />
              ))}
        </Grid>
			</GridItem>

      <NewAsset show={mode === "new"} closeModal={() => setMode(false)} character={selected} mode={mode}/>
		</Grid>
	);
}

export default (SelectedCharacter);