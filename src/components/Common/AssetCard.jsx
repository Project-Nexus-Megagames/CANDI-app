import React from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, IconButton, Spacer, Text } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from './CandiWarning';
import ResourceNugget from './ResourceNugget';
import AssetForm from './AssetForm';
import { useSelector } from 'react-redux';
import { CandiModal } from './CandiModal';
import { Close } from '@rsuite/icons';
import { FaHandshake } from 'react-icons/fa';
import SelectPicker from './SelectPicker';
import { getPlayerCharacters } from '../../redux/entities/characters';
import CharacterNugget from './CharacterNugget';
import CharacterListItem from '../OtherCharacters/CharacterListItem';
import { getFadedColor } from '../../scripts/frontend';

const AssetCard = (props) => {
  const { character, disabled, marginTop, handleSelect, removeAsset } = props;
  const [mode, setMode] = useState(false);
  const control = useSelector(state => state.auth.control);
  const characters = useSelector(getPlayerCharacters);
  const assets = useSelector(state => state.assets.list);
  let asset = props.asset._id ? props.asset : assets.find(el => el._id === props.asset)
	const [selectedCharacter, setCharacter] = useState(undefined);

  const deleteAssert = async () => {
    socket.emit('request', {
        route: 'asset',
        action: 'delete',
        data: {id: asset._id}
    });
  };

  const lendAsset = async () => {
    socket.emit('request', {
        route: 'asset',
        action: 'lend',
        data: {id: asset._id, target: selectedCharacter, lendingBoolean: true}
    });
  };

  const unLendAsset = async () => {
    socket.emit('request', {
        route: 'asset',
        action: 'lend',
        data: {id: asset._id, target: selectedCharacter, lendingBoolean: false}
    });
  };


	if (asset) return ( 
		<div style={{ overflow: 'clip' }} onClick={() => handleSelect ? handleSelect(asset) : console.log("Peekabo!")} >
      <Card marginTop={marginTop} key={asset._id} style={{ border: `4px solid ${getFadedColor(asset.type)}` }} >
        <CardHeader>
          <h5>{asset.name}
          {control && !disabled && <ButtonGroup isAttached>
           <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<EditIcon />} />         
           <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<DeleteIcon />} />                  
          </ButtonGroup>}

          {character?._id === asset.ownerCharacter && asset.status.some(el => el === 'lendable') && <IconButton variant={'ghost'} onClick={() => setMode("lend")} colorScheme="blue" size={'sm'} icon={<FaHandshake />} />}

          {removeAsset && <IconButton variant={'outline'} onClick={() => removeAsset({model: asset.model, })} colorScheme="red" size={'sm'} icon={<Close/>}  />}
          
          </h5>
          {asset.currentHolder && asset.currentHolder !== 'None' && <Center>
            Lent to:
            {characters.find(el => el._id === asset.currentHolder) && <CharacterNugget character={characters.find(el => el._id === asset.currentHolder)} />}
            {characters.find(el => el._id === asset.currentHolder)?.characterName}
            <Button onClick={() => unLendAsset()} variant={'solid'} colorScheme='red' >Take asset back</Button>
            </Center>}
          <Flex align={'center'} >
            <Spacer />
            <ResourceNugget value={asset.type} width={'60px'}></ResourceNugget>
            {asset.uses !== 999 && <ResourceNugget value={"Uses"} amount={asset.uses}></ResourceNugget>}
            {asset.status?.map(el => (
              <ResourceNugget key={el} value={el}></ResourceNugget>
            ))}
            <ResourceNugget value={"Dice"} amount={asset.dice}></ResourceNugget>
            <Spacer />
          </Flex>

        </CardHeader>
        <CardBody style={{ maxHeight: '20vh', textOverflow: 'ellipsis', paddingTop: '0px' }} >
        {asset.description}
        </CardBody>
        {/* <div style={{ maxHeight: '20vh', overflow: 'clip', textOverflow: 'ellipsis', }} >                    
          {asset.description}
          
        </div>                 */}
      </Card>

      {asset && <CandiWarning open={mode === 'delete'} title={`Delete "${asset.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
        This can never be undone.
      </CandiWarning>}

      <CandiModal onClose={() => { setMode(false); }} open={mode === "modify"} title={`${mode} Asset`}>
        <AssetForm character={character} asset={asset} mode={mode}/>
      </CandiModal>

      <CandiModal onClose={() => { setMode(false); }} open={mode === "lend"} title={`Lend Asset ''${asset.name}'' to:`}>
        <SelectPicker
					block
					placeholder={`Select Character`}
					onChange={(event) => setCharacter(event)}
					data={characters}
          value={selectedCharacter}
					valueKey="_id"
					label="characterName"
				></SelectPicker>
        {selectedCharacter && <Box style={{ textAlign: 'center' }} >
          Lend This Asset to 
          <CharacterListItem character={characters.find(el => el._id === selectedCharacter)} />
          <Text>You will get it back at the start of next round</Text>
          <Button onClick={() => lendAsset()} >Lend Away!</Button>
        </Box>}
      </CandiModal>
      
		</div>
	);
  return(
    <b>oops</b>
  )
}

export default (AssetCard);