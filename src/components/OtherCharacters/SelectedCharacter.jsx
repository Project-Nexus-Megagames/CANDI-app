import React from 'react';
import { Box, ButtonGroup, Card, CardBody, CardHeader, Flex, Grid, GridItem, IconButton, Spacer, Tag } from '@chakra-ui/react';
import CharacterListItem from './CharacterListItem';
import ResourceNugget from '../Common/ResourceNugget';
import { useSelector } from 'react-redux';
import { getFadedColor } from '../../scripts/frontend';
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import AssetForm from '../Common/AssetForm';
import { useState } from 'react';
import AssetCard from '../Common/AssetCard';
import WordDivider from '../WordDivider';
import { CandiModal } from '../Common/CandiModal';

const SelectedCharacter = (props) => {
  const { selected } = props;
  const [mode, setMode] = useState(false);
  const assets = useSelector(state => state.assets.list);
  const control = useSelector(state => state.auth.control);
  const myCharacter = useSelector(state => state.auth.myCharacter);

	return ( 
		<Grid
        templateAreas={`"side main"
                        "body body"`}
        gridTemplateColumns={ '50% 50%'}
        gridTemplateRows={ '40% 60%'}
        gap={2}
        fontWeight='bold'>
			<GridItem pl='2' area={'side'} >
        <div className='styleCenter' >
          <CharacterListItem character={selected} />
          {(control || myCharacter._id === selected._id) && <div>
            <WordDivider word={"Effort"} ></WordDivider>
            {selected.effort && selected.effort.map((item) =>
            <ResourceNugget key={item.type} value={item.type} amount={item.amount} width={'50px'} height={'30'} />
          )}
          </div>}
        </div>
        
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

      {(control || myCharacter._id === selected._id) && <GridItem bg='#555555' area={'body'} >
        <h5 style={{ backgroundColor: getFadedColor("Asset"), color: 'black' }} >
          Assets and Resources 
          {control && <IconButton onClick={() => setMode("new")} variant={'solid'} colorScheme="green" size={'sm'} icon={<PlusSquareIcon />} />}
        </h5>
				<Grid templateColumns='repeat(3, 1fr)' gap={1}>
            {assets
              .filter((el) => el.ownerCharacter === selected._id)
              .map((asset) => (
                <AssetCard key={asset._id} asset={asset} character={selected} />
              ))}
        </Grid>
			</GridItem>}

      <CandiModal onClose={() => { setMode(false); }} open={mode === "new"} title={`${mode} Asset`}>
        <AssetForm character={selected} mode={mode}/>
      </CandiModal>

		</Grid>
	);
}

export default (SelectedCharacter);