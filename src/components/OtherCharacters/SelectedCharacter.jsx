import React from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, Grid, GridItem, IconButton, SimpleGrid, Spacer, Tag } from '@chakra-ui/react';
import CharacterListItem from './CharacterListItem';
import ResourceNugget from '../Common/ResourceNugget';
import { useSelector } from 'react-redux';
import { getFadedColor } from '../../scripts/frontend';
import { CloseIcon, CopyIcon, DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import AssetForm from '../Common/AssetForm';
import { useState } from 'react';
import AssetCard from '../Common/AssetCard';
import WordDivider from '../WordDivider';
import { CandiModal } from '../Common/CandiModal';
import { AddResource, EditAccount } from '../Common/EditAccount';
import usePermissions from '../../hooks/usePermissions';
import ManageContacts from '../Control/ManageContacts';
import CharacterTag from '../Common/CharacterTag';
import { BsPencil } from 'react-icons/bs';

const SelectedCharacter = (props) => {
  const { selected } = props;
  const [mode, setMode] = useState(false);
  const accounts = useSelector(state => state.accounts.list);
  const assets = useSelector(state => state.assets.list);
  const characters = useSelector(state => state.characters.list);
  const control = useSelector(state => state.auth.control);
  const { isControl } = usePermissions();
  const myCharacter = useSelector(state => state.auth.myCharacter);

  const copyToClipboard = (character) => {
    if (character.characterName === 'The Box') {
      const audio = new Audio('/candi1.mp3');
      audio.loop = true;
      audio.play();
    } else {
      let board = `${character.email}`;
      let array = [...character.control];

      for (const controller of myCharacter.control) {
        if (!array.some((el) => el === controller)) {
          array.push(controller);
        }
      }

      for (const controller of array) {
        const character = characters.find((el) => el.characterName === controller);
        if (character) {
          board = board.concat(`; ${character.email}`);
        } else console.log(`${controller} could not be added to clipboard`);
        // Alert.error(`${controller} could not be added to clipboard`, 6000);
      }

      navigator.clipboard.writeText(board);
      // Alert.success('Email Copied!', 6000);
    }
  };

  const selectedResource = accounts.find(el => el._id === selected.account)?.resources.filter(r => r.balance !== 0) || [-420]
  return (
    <Grid
      width={'99%'}
      templateAreas={`"side main"
                        "body body"`}
      gridTemplateColumns={'50% 50%'}
      gap={2}
      fontWeight='bold'>

      <GridItem pl='2' area={'side'} >
        <div className='styleCenter' >
          <CharacterListItem handleSelect={() => console.log("Hello Player! Hope you are having fun!")} character={selected} />
        </div>


        < Button
          onClick={(e) => { e.stopPropagation(); copyToClipboard(selected) }}
          leftIcon={<CopyIcon />}
          colorScheme='white'
          variant='outline'
        >
          {selected?.email}
        </Button>

        {selected.pronouns && <p>
          Character Pronouns: <b>{selected.pronouns}</b>
        </p>}
        {selected.timeZone && <p>
          Time Zone: <b>{selected.timeZone}</b>
        </p>}

        {(isControl || myCharacter._id === selected._id) && selected.account && <div>
          <WordDivider word={"Effort"} ></WordDivider>
          <Center>
            {selectedResource.map((item) =>
              <ResourceNugget key={item.type} type={item.type} value={item.balance} width={'80px'} height={'30'} />
            )}
            {isControl && selected && <EditAccount account={accounts.find(el => el._id === selected.account)} />}
          </Center>
        </div>}

        {(isControl || myCharacter._id === selected._id) && selected.characterStats && selected.characterStats.length > 0 && <div>
          {/* <WordDivider word={"Stats"} ></WordDivider>
          {selected.characterStats && selected.characterStats.map((item) =>
            <ResourceNugget key={item.type} type={item.type} value={item.statAmount} width={'80px'} height={'30'} />
          )} */}

          <h4>Contacts{isControl && <IconButton icon={<BsPencil/>} onClick={() => setMode('editContacts')} ></IconButton>}</h4>
          {selected.knownContacts.length == 0 && <b>No Contacts Found</b>}
          <Grid templateColumns='repeat(3, 1fr)' gap={1}>
            {selected && selected.knownContacts.map(el => (
              <CharacterTag key={el} character={characters.find(ch => ch._id === el)} />
            ))}
          </Grid>          
        </div>}



        <p style={{ color: "rgb(153, 153, 153)" }}>Bio</p>
        <p>{selected.bio}</p>

      </GridItem>

      <GridItem pl='2' area={'main'} >
        <img
          src={`${selected.profilePicture}`}
          alt='Img could not be displayed'
          style={{ maxHeight: "50vh", width: '90%' }}
        />
      </GridItem>

      {(isControl || myCharacter._id === selected._id) && <GridItem bg={mode === "new" ? '#232c3b' :'#555555'} area={'body'} >
        <h5 style={{ backgroundColor: getFadedColor("Asset"), color: 'black' }} >
          Assets
          {isControl && mode !== "new" && <IconButton onClick={() => setMode("new")} variant={'solid'} colorScheme="green" size={'sm'} icon={<PlusSquareIcon />} />}
          {isControl && mode === "new" && <IconButton onClick={() => setMode(false)} variant={'solid'} colorScheme="red" size={'sm'} icon={<CloseIcon />} />}
        </h5>
        {mode !== "new" && <Grid templateColumns='repeat(3, 1fr)' gap={1}>
          { assets
            .filter((el) => (el.account && el.account === selected.account) || el.sharedWith.some(c => c._id === selected._id))
            .map((asset) => (
              <AssetCard key={asset._id} asset={asset} character={selected} showButtons  />
            ))}
        </Grid>}

        {mode === "new" &&
            <Center  >
              <AssetForm closeModal={() => setMode(false)} character={selected} mode={mode} />
            </Center>
          }

        {mode === 'editContacts' && <ManageContacts defaultCharacter={selected._id} show={mode === 'editContacts'} closeModal={() => setMode(false)} />}
      </GridItem>}

      {/* <CandiModal onClose={() => { setMode(false); }} open={mode === "new"} title={`${mode} Asset`}>
        <AssetForm closeModal={() => setMode(false)} character={selected} mode={mode}/>
      </CandiModal> */}

    </Grid>
  );
}

export default (SelectedCharacter);