import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getTextColor } from '../../../scripts/frontend';
import { getMyAssets } from '../../../redux/entities/assets';
import { Tag, Box, Flex, Button, Divider, Spacer, Center, useBreakpointValue, Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import AssetCard from '../../Common/AssetCard';
import { AddAsset } from '../../Common/AddAsset';
import SelectPicker from '../../Common/SelectPicker';
import { getCharAccount } from '../../../redux/entities/accounts';
import ResourceNugget from '../../Common/ResourceNugget';
import { HiSave } from 'react-icons/hi';

/**
 * Form for a new ACTION
 * @param { , collabMode, handleSubmit, defaultValue, actionID, closeNew } props
 * @returns Component
 */
const ActionForm = (props) => {
  const { collabMode, handleSubmit, defaultValue, actionID, closeNew, header } = props;

  const { gameConfig } = useSelector((state) => state);
  const { myCharacter } = useSelector((s) => s.auth);
  // const myCharacter = useSelector(getMyCharacter);
  const myAssets = useSelector(getMyAssets);
  const myContacts = useSelector(s => s.characters.list);
  const locations = useSelector((state) => state.locations.list)
  const facilities = useSelector((state) => state.facilities.list)
  const myAccout = useSelector(getCharAccount);

  const [effort, setEffort] = React.useState(defaultValue?.effort ? { effortType: defaultValue.effort.effortType, amount: defaultValue.effort.amount } : { effortType: 'Normal', amount: 0 });
  const [resources, setResources] = React.useState(defaultValue?.resouces ? defaultValue.resouces : []);
  const [assets, setAssets] = React.useState(defaultValue?.assets ? defaultValue.assets : []);
  const [collaborators, setCollaborators] = React.useState([]);
  const [actionType, setActionType] = React.useState(
    props.actionType ? gameConfig.actionTypes.find(el => el.type === props.actionType) :
      gameConfig.actionTypes[0]);
  const [description, setDescription] = React.useState(defaultValue?.description ? defaultValue.description : '');

  const [intent, setIntent] = React.useState(defaultValue?.intent ? defaultValue.intent : '');
  const [name, setName] = React.useState(defaultValue?.name ? defaultValue.name : '');
  const [destination, setDestination] = React.useState(defaultValue?.location ? defaultValue.location : false);
  const [facility, setFacility] = React.useState(undefined);

  const breakpoints = useBreakpointValue({
    base: { columns: 0, rows: 3, width: '15rem', bottom: '1.75rem', left: '7.5rem' },
    md: { columns: 3, rows: 0, width: '10rem', bottom: '1.75rem', left: '5rem' },
    lg: { columns: 3, rows: 0, width: '15rem', bottom: '1.75rem', left: '7.5rem' }
  })


  useEffect(() => {
    if (actionType && actionType.type && !defaultValue) {
      // setEffort({ effortType: actionType.effortTypes[0], amount: 0 });
      newMap(actionType.maxAssets);
    }
  }, [actionType?.type]);

  useEffect(() => {
    newMap(actionType?.maxAssets);
  }, [actionType])

  useEffect(() => {
    console.log(destination);
  }, [destination])

  const editState = (incoming, type, index) => {
    console.log(incoming, type, index)
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
      default:
        console.log(`uWu Scott made an oopsie doodle! ${type} `);
    }
  };

  const passSubmit = async () => {
    // 1) make a new action
    const data = {
      assets: assets.filter(el => el),
      description: description,
      intent: intent,
      name: name,
      type: actionType.type,
      location: destination,
      myCharacter: myCharacter._id,
      creator: myCharacter._id,
      collaborators,
      id: actionID
    };
    console.log(data)
    closeNew();
     handleSubmit(data)

    setActionType(false);
    setDescription('');
    setIntent('');
    setName('');
    setResources([]);
    setCollaborators([]);

  };

  function isDisabled(effort) {
    if (description.length < 10 || (name.length < 10 && !collabMode)) return true;
    // if ((effort.amount === 0 || effort <= 0) && !collabMode) return true;
    else return false;
  }

  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(defaultValue?.assets[i]);
    }
    setAssets(arr);
  }

  return (
    <div>
      {header && <h4>{header}</h4>}
      {!header && <h4>Edit {actionType.type} Action</h4>}
      <br />
      <form>
        <Flex width={"100%"} align={"end"} >
          {actionType.collab && !collabMode && <Box>
            Collaborators:   
          </Box>}
          <Spacer />
          {!collabMode && <Box width={"49%"}>
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
          </Box>}
          <Spacer />
          {!collabMode && <Box width={"49%"}>
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
            <h5>{locations.find(el => el._id === destination)?.name}</h5>
            <Flex>              
              <SelectPicker 
              data={locations} 
              label="name" 
              onChange={setDestination} 
              placeholder={destination ? locations.find(el => el._id === destination)?.name : "Select a Destination (" + locations.length + ") in range"} 
              value={destination} 
              />

              {destination && facilities.filter(el => el.location._id === destination).length > 0 && <SelectPicker onChange={setFacility} data={facilities.filter(el => el.location._id === destination)} label="name" placeholder={"Select a Facility (" + facilities.filter(el => el.location._id === destination).length + ") present"} />}
            </Flex>

          </Box>}
          <Spacer />
        </Flex>
        <br />
        <Divider />
        <Flex width={"100%"} >
          <Spacer />
          <Box width={"49%"} >
            Description:
            {10 - description.length > 0 && (
              <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                {10 - description.length} more characters...
              </Tag>
            )}
            {10 - description.length <= 0 && (
              <Tag variant='solid' colorScheme={'green'}>
                <CheckIcon />
              </Tag>
            )}
            <textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)} />
          </Box>
          <Spacer />
          <Box width={"49%"}>
            Needed Resources:
            <Center>
              {actionType.resourceTypes.map(el => {
                const resources = myAccout.resources.find(e => e.type === el.type);
                return (
                <Box key={el._id}>
                  {resources?.balance < el.min && (
                    <Tag variant='solid' style={{ color: 'black' }} colorScheme={'orange'}>
                      Lacking Resources
                    </Tag>
                  )}
                  {resources == undefined || resources?.balance >= el.min && (
                    <Tag variant='solid' style={{ color: 'black' }} colorScheme={'green'}>
                      <CheckIcon />
                    </Tag>
                  )}
                  <ResourceNugget type={el.type} value={el.min} label={`You have ${resources?.balance} ${el.type} resource${resources?.balance > 0 && 's'}`} />
                </Box>)
              }

              )}
            </Center>

            {/* <DiceList assets={assets} type={"all"} /> */}
          </Box>
          <Spacer />
        </Flex>
        <br />


        <br />

        Assets:
        <br />
        {actionType.assetTypes?.map((type) => (
          <Tag margin={'3px'} key={type} textTransform='capitalize' backgroundColor={getFadedColor(type)} color={getTextColor(type)} variant={'solid'}>
            {type}
          </Tag>
        ))}

        <Flex>
          {assets.map((ass, index) => (
            <>
              <Spacer />
              <Box
                style={{
                  paddingTop: '5px',
                  paddingLeft: '10px',
                  textAlign: 'left',
                }}
              >
                {!ass &&
                  <AddAsset
                    key={index}
                    handleSelect={(ass) => editState(ass, ass.model, index)}
                    assets={myAssets.filter(el => actionType.assetTypes.some(a => a === el.type) && !assets.some(ass => ass?._id === el._id))} />}
                {ass && <AssetCard showRemove removeAsset={() => editState(false, ass.model, index)} compact type={'blueprint'} asset={ass} />}
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
        <Button leftIcon={<Icon as={HiSave} />} colorScheme="green" onClick={() => passSubmit()} variant='solid' disabled={isDisabled()} >
          <b>Submit</b>
        </Button>
        <Button colorScheme="red" onClick={() => closeNew()} variant='outline'>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ActionForm;
