import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor, } from '../../../scripts/frontend';
import { getMyAssets, getTeamAssets } from '../../../redux/entities/assets';
import { getMyCharacter, getPlayerCharacters, getPublicPlayerCharacters } from '../../../redux/entities/characters';
import socket from '../../../socket';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tag, Spinner, Box, Flex, Button, ButtonGroup, Tooltip, Divider, Spacer, Grid, Center, TagLabel, TagCloseButton, Text, VStack, HStack } from '@chakra-ui/react';
import CheckerPick from '../../Common/CheckerPick';
import { AddAsset } from '../../Common/AddAsset';
import { CheckIcon, PlusSquareIcon, ViewIcon } from '@chakra-ui/icons';
import WordDivider from '../../Common/WordDivider';
import AssetCard from '../../Common/AssetCard';
import SelectPicker from '../../Common/SelectPicker';
import { getTeamHQ } from '../../../redux/entities/locations';
import ResourceNugget from '../../Common/ResourceNugget';
import { getCharAccount, getTeamAccount } from '../../../redux/entities/accounts';
import { DiceList } from '../../Common/DiceList';
import { AddCharacter } from '../../Common/AddCharacter';
import axios from 'axios';
import { gameServer } from '../../../config';

/**
 * Form for a new ACTION
 * @param {*} props
 * @returns Component
 */
const NewAction = (props) => {
  const { actionType } = props;
  const gameConfig = useSelector((state) => state.gameConfig);
  const locations = useSelector((state) => state.locations.list)
  const facilities = useSelector((state) => state.facilities.list)
  const playerCharacters = useSelector(getPublicPlayerCharacters);


  const { character, user } = useSelector((s) => s.auth);
  // const character = useSelector(getMyCharacter);
  const myAssets = useSelector(getMyAssets);
  // const hq = useSelector(getTeamHQ);
  const teamAssets = useSelector(getTeamAssets);
  const myAccout = useSelector(getCharAccount);

  const [assets, setAssets] = React.useState([]);
  const [description, setDescription] = React.useState('');
  const [intent, setIntent] = React.useState('');
  const [name, setName] = React.useState('');
  const [destination, setDestination] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [facility, setFacility] = React.useState(undefined);
  const [collaborators, setCollaborators] = React.useState([]);


  useEffect(() => {
    if (actionType) newMap(actionType.maxAssets);
  }, [actionType]);


  const editState = (incoming, type, index) => {
    let thing;
    switch (type) {
      case 'Asset':
        let temp = [...assets];
        temp[index] = incoming;
        setAssets(temp);
        break;
      case 'collab':
        setCollaborators(collaborators.filter(c => c._id !== incoming._id));
        break;
      case 'addCollab':
        setCollaborators([...collaborators, incoming]);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!');
    }
  };

  const handleSubmit = async () => {
    // 1) make a new action
    try {
      const data = {
        submission: {
          assets: assets.filter(el => el),
          description: description,
          intent: intent,
          facility: facility,
        },
        name: name,
        type: actionType?.type,
        creator: character._id,
        collaborators,
        account: myAccout._id,
        location: destination,
        user: user.username
      };

      setLoading(true)
      // socket.emit('request', { route: 'action', action: 'create', data });
      const response = await axios.post(`${gameServer}api/actions/createAction`, { data });
      setLoading(false)

      if (response.data.type === 'success') {
        setDescription('');
        setIntent('');
        setName('');
        setAssets([]);
        props.closeNew();
      }
    }
    catch (err) {
      console.log(err)
    }



  };

  const isResourceDisabled = () => {
    let boolean = false;

    for (const resource of actionType.resourceTypes) {
      boolean = myAccout.resources.some(e => e.type === resource.type) &&
        myAccout.resources.find(e => e.type === resource.type)?.balance >= resource.min
    }
    
    return !boolean;
  };


  const disabledConditions = [
    {
      text: "Description is too short",
      disabled: description.length < 10
    },
    {
      text: "Description is too long!",
      disabled: description.length >= 4000
    },
    {
      text: "Name is too short",
      disabled: name.length < 10
    },
    {
      text: "Name is too long!",
      disabled: name.length >= 1000
    },
    {
      text: "Not Enough Resources for this action",
      disabled: isResourceDisabled()
    },
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);


  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setAssets(arr);
  }

  let inRange = locations;

  return (
    <div>
      <h4>New {actionType.type}</h4>
      <br />

      <form>
        {actionType.collab && <Box>
          Collaborators:
          <AddCharacter characters={playerCharacters.filter(el => !collaborators.some(ass => ass?._id === el._id))} handleSelect={(char) => editState(char, 'addCollab')} />
          {collaborators.length > 0 && collaborators.map(char =>
            <Tag margin={'2px'} key={char._id} variant={'solid'} >
              <TagLabel>{char.characterName}</TagLabel>
              <TagCloseButton onClick={() => editState(char, 'collab')} />
            </Tag>
          )}
        </Box>}
        <HStack width={"100%"} align={"center"} justify={'space-around'}  >
          <Box width={"50%"}>
            Name:
            {10 - name.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - name.length} more characters...
              </Tag>
            )}
            {10 - name.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></textarea>
          </Box>

          {actionType.requiresDestination && <Box width={"49%"}>
            Destination
            {!destination && actionType.requiresDestination && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                Select Destination
              </Tag>
            )}

            {destination && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <Flex>
              <SelectPicker data={inRange} label="name" onChange={setDestination} placeholder={"Select a Destination (" + inRange.length + ") in range"} value={destination} />
              {destination && facilities.filter(el => el.location._id === destination).length > 0 && <SelectPicker onChange={setFacility} data={facilities.filter(el => el.location._id === destination)} label="name" placeholder={"Select a Facility (" + facilities.filter(el => el.location._id === destination).length + ") present"} />}
            </Flex>

          </Box>}

          <Box>
        Needed Resources:
        <Center>
          {actionType.resourceTypes.map(el => (
            <Box key={el._id}>
              
              {myAccout.resources.find(e => e.type === el.type)?.balance < el.min && (
                <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                  Lacking Resources
                </Tag>
              )}
              {myAccout.resources.find(e => e.type === el.type) == undefined || myAccout.resources.find(e => e.type === el.type)?.balance >= el.min && (
                <Tag variant='solid' style={{ color: 'black' }} colorScheme={'green'}>
                  <CheckIcon />
                </Tag>
              )}
              <ResourceNugget type={el.type} value={el.min} label={`You have ${myAccout.resources.find(e => e.type === el.type)?.balance} ${el.type}`} />
            </Box>
          ))}
        </Center>
      </Box>

        </HStack>
        <br />
        <Divider />
        <Flex width={"100%"} >
          <Spacer />
          <Box width={"99%"} >
            Description:
            {10 - description.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - description.length} more characters...
              </Tag>
            )}
            {description.length >= 1000 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                Description is too long.
              </Tag>
            )}

            {10 - description.length <= 0 && description.length < 1000 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)} />
          </Box>
          <Spacer />

        </Flex>
        <br />


        <br />

        {assets.length > 0 && <div>
          Assets:
          <br />
          {actionType.assetTypes?.map((type) => (
            <Tag margin={'3px'} key={type} textTransform='capitalize' backgroundColor={getFadedColor(type)} color={getTextColor(type)} variant={'solid'}>
              {type}
            </Tag>
          ))}
        </div>}


        <Flex>
          {assets.map((ass, index) => (
            <>
              <Spacer />
              <Box
                style={{
                  paddingTop: '5px',
                  paddingLeft: '10px',
                  textAlign: 'left',
                  width: '33%'
                }}
              >
                {!ass &&
                  <AddAsset
                    key={index}
                    handleSelect={(ass) => editState(ass, ass.model, index)}
                    assets={myAssets.filter(el =>
                      (actionType.assetTypes.some(a => a === el.type || a === el.model)) &&
                      (!el.status.some(a => a === 'used' || a === 'working' || a === 'hidden')) &&
                      !assets.some(ass => ass?._id === el._id)
                    )}
                  />}
                {ass &&
                  <AssetCard
                    showRemove
                    removeAsset={() => editState(false, ass.model, index)}
                    type={'blueprint'}
                    asset={ass}
                  />}
              </Box>
              <Spacer />
            </>
          ))}
          <Spacer />
        </Flex>
      </form>
      <div
        style={{
          justifyContent: 'end',
          display: 'flex',
          marginTop: '15px',
          textAlign: 'center'
        }}
      >
        <Spacer />
        <VStack>
          {disabledConditions.filter(el => el.disabled).map((opt, index) =>
            <Text color='red' key={index}>{opt.text}</Text>
          )}
        </VStack>

        <Button loading={loading} colorScheme="green" onClick={() => handleSubmit()} variant='solid' isDisabled={isDisabled} >
          <b>Submit</b>
        </Button>
        <Button colorScheme="red" onClick={() => props.closeNew()} variant='outline'>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewAction;
