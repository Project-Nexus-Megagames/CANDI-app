import { Box, Divider, Flex, IconButton, Button, InputGroup, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputStepper, Select, Tag, NumberInputField, Card, Grid, VStack, SimpleGrid, Center, Stack, Text } from '@chakra-ui/react';
import { Check, CheckOutline, Close, CloseOutline, Plus } from '@rsuite/icons';
import React, { useEffect, useState } from 'react'; // React import
import { BsPencilFill, BsSave } from 'react-icons/bs';

import SelectPicker from '../Common/SelectPicker';
import ResourceNugget from '../Common/ResourceNugget';
import { AddAsset } from '../Common/AddAsset';
import AssetCard from '../Common/AssetCard';
import WordDivider from '../Common/WordDivider';
import TeamAvatar from '../Common/TeamAvatar';


import { useSelector } from 'react-redux';
import { getMyTradableAssets, getTeamAssets } from '../../redux/entities/assets';
import { getFadedColor } from '../../scripts/frontend';

const TradeOffer = (props) => { //trade object
  const [resources, setResources] = React.useState((props.offer && props.offer.resources) ? props.offer?.resources : []);
  const [assets, setAssets] = React.useState(props.offer?.assets ? props.offer.assets : []);
  const [comments, setComments] = useState(props.offer?.comments);
  const [add, setAdd] = React.useState(false);
  const [mode, setMode] = useState('disabled');
  const teamAssets = useSelector(getTeamAssets);
  const myAssets = useSelector(getMyTradableAssets);
  const gameConfig = useSelector((state) => state.gameConfig);
  const disabled = mode === 'disabled';
  const readOnly = mode === 'readonly';

  useEffect(() => {
    setResources(props.offer?.resources)
  }, [props.offer]);

  useEffect(() => {
    setAssets(props.offer?.assets)
  }, [props.offer]);

  function onEdit() {
    // props.onOfferEdit();
    setMode("normal");
  }

  const submitEdit = async () => {
    props.onOfferEdit({ resources, assets, comments });
    setMode("disabled")
  }

  const removeElement = (index, type) => {
    let temp;
    switch (type) {
      case 'resource':
        temp = [...resources];
        temp.splice(index, 1)
        setResources(temp);
        break;
      case 'asset':
        temp = [...assets];
        temp.splice(index, 1)
        setAssets(temp);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }

  const editState = (incoming, index, type) => {
    // console.log(incoming, index, type)
    let thing;
    let temp;
    switch (type) {
      case 'add':
        setResources([...resources, { type: incoming, value: 0 }])
        setAdd(false)
        break;
      case 'resource':
        thing = { ...resources[index] };
        temp = [...resources];

        if (typeof (incoming) === 'number') {
          thing.value = parseInt(incoming)
        }
        else {
          thing.type = (incoming);
          thing.value = 0;
        }
        temp[index] = thing;
        setResources(temp);
        break;
      case 'add-asset':
        // thing = teamAssets.find(el => el._id === incoming);
        setAssets([...assets, incoming]);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }

  const getMax = (res) => {
    return props.myAccount.resources.find(el => el.type === res)?.balance || 0;
  }

  const disabledConditions = [
    {
      text: "Not allowed to offer no resources in a trade",
      disabled: resources.some(el => el.value <= 0)
    },
    {
      text: "You must offer them SOMETHING",
      disabled: (resources.length === 0 && assets.length === 0)
    }
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);

  return (
    <div className='trade' style={{ padding: '8px', height: 'calc(100vh - 100px)', overflow: 'auto', borderColor: getFadedColor(props.team?.name), border: '2px solid', textAlign: 'center' }}>
      {props.account && <TeamAvatar online={props.ratified} badge account={props.account._id} />}
      <h3>{props.account.name}</h3>
      {props.status.some(t => t === 'completed') && <h4 style={{ textAlign: 'center' }}>Traded away these items</h4>}

      {props.status.some(el => el !== 'completed') && <Center >
        <Box  >
          {props.myAccount._id === props.account._id && <div>
            {disabled && <IconButton size='sm' variant="solid" colorScheme={"facebook"} icon={<BsPencilFill />} onClick={() => onEdit()}>Edit Trade</IconButton>}
            {!disabled && <IconButton isDisabled={isDisabled} size='sm' variant="solid" colorScheme={"facebook"} icon={<BsSave />} onClick={() => submitEdit()}>Save Offer</IconButton>}
            <Stack>
              {!disabled && disabledConditions.filter(el => el.disabled).map((opt, index) =>
                <Text color='red' key={index}>{opt.text}</Text>
              )}
            </Stack>

          </div>}
        </Box>
        <Box  >
          {props.myAccount._id === props.account._id && <div className='styleCenter' >
            {props.ratified && <Button isLoading={props.loading} colorScheme={'green'} variant="solid" isDisabled={mode === 'normal' || props.loading} size='sm' leftIcon={<CheckOutline />} onClick={() => props.rejectProposal()}>Proposal Approved (Click to Reject)</Button>}
            {!props.ratified && <Button isLoading={props.loading} colorScheme={'orange'} variant="solid" isDisabled={(resources.length === 0 && assets.length === 0) || mode === 'normal' || props.loading} size='sm' leftIcon={<CloseOutline />} onClick={() => props.submitApproval()}>Un-Approved (Click to Approve)</Button>}
          </div>}
          {props.myAccount._id !== props.account._id && <div>
            {props.ratified && <Tag variant={'solid'} colorScheme='green'>Deal Approved by {props.account.name}</Tag>}
            {!props.ratified && <Tag variant={'solid'} colorScheme='red'>Awaiting approval by {props.account.name}</Tag>}
          </div>}

        </Box>
      </Center>}

      <WordDivider word={'Resources'}></WordDivider>

      <VStack divider={<Divider style={{ width: '80%' }} />} >
        {!disabled && resources.map((resource, index) => (
          <InputGroup key={index} className='styleCenter'>

            <ResourceNugget fontSize={'2em'} height="150px" index={index} value={`${resource.value}`} type={resource.type} />
            <NumberInput
              style={{ width: '50%' }}
              size='lg'
              prefix='value'
              defaultValue={resource.value}
              value={resource.value}
              max={getMax(resource.type)}
              min={0}
              onChange={(event) => editState(parseInt(event), index, 'resource')}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <IconButton onClick={() => removeElement(index, 'resource')} variant="outline" colorScheme='red' size="sm" icon={<Close />} />
          </InputGroup>
        ))}
      </VStack>



      {!disabled &&
        <div>
          {!add && <IconButton variant="solid" colorScheme='green' size="sm" icon={<Plus />} isDisabled={resources.length == gameConfig.resourceTypes.length} onClick={() => setAdd(true)} ></IconButton>}
          {add &&
            <SelectPicker
              valueKey={'type'}
              label={'type'}
              data={props.myAccount.resources.filter(el => el.tradable && el.balance > 0 && !resources.some(r => r.type === el.type))}
              onChange={(ddd) => editState(ddd, 0, 'add')}
            />}
        </div>
      }
      {disabled && <Flex style={{ minHeight: '20vh' }} justify="space-around" align={'center'} >
        {resources.length === 0 && <h5>No Resources Offered</h5>}
        {disabled && resources.map((resource, index) => (
          <Box key={resource._id}>
            <ResourceNugget fontSize={'2em'} height="150px" index={index} value={`${resource.value}`} type={resource.type} />
          </Box>
        ))}
        {/* {!disabled && 
						<ResourceNugget type='plus' amount={'Add'}/>} */}
      </Flex>}

      <WordDivider word={'Assets'}></WordDivider>

      {<SimpleGrid style={{ minHeight: '20vh' }} minChildWidth='300px' spacing='10px' align={'center'}>
        {assets && disabled && assets.length === 0 && <h5>No Assets Offered</h5>}
        {assets && assets.map((asset, index) => (
          <Box key={assets._id}>
            <AssetCard showRemove={!disabled} removeAsset={() => removeElement(index, 'asset')} height="150px" index={index} asset={asset} />
          </Box>
        ))}

        {!disabled &&
          <AddAsset assets={myAssets.filter(el => !assets.some(a => a._id == el._id))} handleSelect={(asset) => editState(asset, 0, 'add-asset')} />}
      </SimpleGrid >}

      <Divider />

      <textarea disabled={disabled} readOnly={readOnly} className='textStyle' rows='5' value={comments} onChange={(event) => setComments(event.target.value)}></textarea>

    </div>
  )
}

export default (TradeOffer);