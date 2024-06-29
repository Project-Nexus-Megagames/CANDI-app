import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Modal, ModalHeader, ModalContent, ModalBody, ButtonGroup, Button, ModalFooter, Spacer, Switch, Grid, InputGroup, IconButton, CloseButton } from '@chakra-ui/react';
import { useForm, useFieldArray, useController } from 'react-hook-form';

import { CloseIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { CandiModal } from './CandiModal';
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import InputNumber from './InputNumber';
import { Plus } from '@rsuite/icons';
import { getTeamAccounts } from '../../redux/entities/accounts';
import CharacterTag from './CharacterTag';
import { AddCharacter } from './AddCharacter';
import TeamAvatar from './TeamAvatar';
import { AddAccount } from './AddAccount';
import { AddTeam } from './AddTeam';

const AssetForm = (props) => {
  const { asset, character, mode, teamAccount } = props;
  const loggedInUser = useSelector((state) => state.auth.user);
  const teams = useSelector((state) => state.teams.list);
  const blueprints = useSelector((state) => state.blueprints.list);
  const accounts = useSelector((state) => state.accounts.list);
  const gameConfig = useSelector((state) => state.gameConfig);
  const characters = props.characters || useSelector((state) => state.characters.list);

  const [imageURL, setImageURL] = useState('');
  const [blueprint, setBlueprint] = useState(false);
  const [type, setType] = useState(asset ? asset.type : 'Asset'); // TODO change to first element of resourceType
  const [status, setStatus] = useState(asset && asset?.status ? asset?.status : []);
  const [dice, setDice] = React.useState(asset ? [...asset.dice] : []);
  const [resources, setResources] = React.useState((asset && asset.resource) ? [...asset.resources] : []);
  const [account, setAccount] = React.useState((asset && asset.account) ? (asset.account) :
    character ? character.account :
      teamAccount ? teamAccount : false);



  const { register, control, handleSubmit, reset, formState, watch } = useForm(
    {
      defaultValues: asset
    },
    [props]
  );

  useEffect(() => {
    if (asset) {
      reset(asset);
      let temp = []
      for (const ass of asset.dice) {
        temp.push({ amount: ass.amount, type: ass.type })
      }
      setDice(temp);
      setAccount(asset?.account)
    }
  }, [asset]);

  useEffect(() => {
    if (account) {
      console.log(account)
    }
  }, [account]);



  useEffect(() => {
    if (blueprint) {
      console.log(blueprint)
      let found = blueprints.find(el => el._id === blueprint)
      reset(found);
      let temp = []
      let resouces = []
      for (const ass of found.dice) {
        temp.push({ amount: ass.amount, type: ass.type })
      }
      setDice(temp);

      for (const ass of found.resources) {
        resouces.push({ amount: ass.amount, type: ass.type })
      }
      setDice(temp);
      setResources(resouces);
      setType(found.type || "Asset")
    }
  }, [blueprint]);

  const validation = {
    name: {
      required: 'Asset Name is required',
      maxLength: {
        value: 300,
        message: "That's way too long, try again"
      }
    },
    description: {
      maxLength: {
        value: 3000,
        message: "That's way too long, try again"
      }
    },
    uses: {
      required: 'Use Amount is required',
      min: { value: 0, message: 'Must be larger than 0' }
    }
  };

  const disabledConditions = [
    {
      text: "Provide a type",
      disabled: !type
    },
    {
      text: "Asset needs a Character",
      disabled: !account
    },
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);
  const isTeam = account?.type === 'team';
  const { errors } = formState;
  const watchCharName = watch('name', 'New Asset');


  useEffect(() => {
    const subscription = watch();
    return () => subscription.unsubscribe;
  }, [watch]);

  const removeElement = (index, type) => {
    let temp;
    switch (type) {
      case 'dice':
        temp = [...dice];
        temp.splice(index, 1)
        setDice(temp);
        break;
      case 'resource':
        temp = [...resources];
        temp.splice(index, 1)
        setResources(temp);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')

    }
  }

  const handleStatus = (stuff) => {
    const stat = stuff.target.id;

    if (status.some((el) => el === stat)) {
      let temp = status.filter((el0) => el0 !== stat);
      setStatus(temp);
    } else setStatus([...status, stat]);
  };

  function onSubmit(data, e) {
    if (props.handleSubmit) {
      props.handleSubmit({ ...data, dice, resources, type: type, status: status, account: account });
    } else {
      e.preventDefault();
      const asset = { ...data, dice, resources, type: type, status: status, account: account };
      socket.emit('request', {
        route: 'asset',
        action: mode,
        data: { asset, imageURL, loggedInUser }
      });
    }
    if (props.closeModal) props.closeModal();
  }

  const handleError = (errors) => {
    console.log('ERROR', errors);
  };

  const editState = (incoming, index, type) => {
    console.log(incoming.account, index, type)
    let thing;
    let temp;
    switch (type) {
      case 'die':
      case 'dice':
        thing = dice[index];
        temp = [...dice];
        typeof (incoming) === 'number' ? thing.amount = parseInt(incoming) : thing.type = (incoming);
        temp[index] = thing;
        setDice(temp);
        break;
      case 'resource':
        thing = resources[index];
        temp = [...resources];
        typeof (incoming) === 'number' ? thing.amount = parseInt(incoming) : thing.type = (incoming);
        temp[index] = thing;
        setResources(temp);
        break;
      case 'selectAccount':
        setAccount(accounts.find(a => a._id === incoming.account));
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }

  //const assetTypes = [ { name: 'Asset'}, { name: 'Trait' }, { name: 'Power' } ];

  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)} style={{ width: '90%' }} >
      <Box>
        <VStack spacing='24px' w='100%'>
          <SelectPicker
            valueKey={'_id'}
            label={'name'}
            data={blueprints.filter(el => el.subModel === 'asset')}
            onChange={(ddd) => setBlueprint(ddd)}
            value={blueprint} />
          <Flex>
            <Spacer />
            <FormControl>
              <FormLabel>Type </FormLabel>
              {/* <Input type="text" size="md" variant="outline" {...register('type', validation.type)}></Input> setValue('test', '')  */}
              <SelectPicker
                valueKey={'type'}
                label={'type'}
                data={gameConfig.assetTypes}
                onChange={(ddd) => setType(ddd)}
                value={type} />
            </FormControl>
            <Spacer />
          </Flex>

          <Box>
            <p>Owner:</p>

            {!account &&
              <div >
                <AddCharacter characters={characters} handleSelect={(char) => editState(char, 0, 'selectAccount')} />
                <AddTeam teams={teams} handleSelect={(t) => editState(t, 0, 'selectAccount')} />
              </div>
            }
            {account && !isTeam &&
              <CharacterTag isAccessible character={account} onClick={() => setAccount(false)} />
            }
            {account && isTeam &&
              <div onClick={() => setAccount(false)} >
                <TeamAvatar account={account._id} />
              </div>

            }
          </Box>



          <FormControl>
            <FormLabel>Asset Name </FormLabel>
            <Input type='text' size='md' variant='outline' {...register('name', validation.name)}></Input>
            <Text fontSize='sm' color='red.500'>
              {errors.name && errors.name.message}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Description </FormLabel>
            <Input type='text' size='md' variant='outline' {...register('description', validation.description)}></Input>
            <Text fontSize='sm' color='red.500'>
              {errors.description && errors.description.message}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Dice! </FormLabel>
            {dice.map((die, index) => (

              <InputGroup key={die._id} index={index}>
                {die.amount}?
                <SelectPicker label='type' valueKey='type' data={gameConfig.assetTypes} value={die.type} onChange={(event) => { editState(event, index, 'dice'); }} />
                <InputNumber prefix='value' style={{ width: 200 }} defaultValue={die.amount.toString()} value={die.amount} min={0} onChange={(event) => editState(parseInt(event), index, 'die')}></InputNumber>
                <IconButton variant={'outline'} onClick={() => removeElement(index, 'dice')} colorScheme='red' size="sm" icon={<CloseButton />} />
              </InputGroup>
            ))}
            <IconButton variant={'solid'} onClick={() => setDice([...dice, { amount: 1, type: type }])} colorScheme='green' size="sm" icon={<Plus />} />
          </FormControl>

          <FormControl>
            <FormLabel>Resouces! </FormLabel>
            {resources.map((resource, index) => (

              <InputGroup key={resource._id} index={index}>
                {resource.amount}?
                <SelectPicker label='type' valueKey='type' data={gameConfig.resourceTypes} value={resource.type} onChange={(event) => { editState(event, index, 'resource'); }} />
                <InputNumber prefix='value' style={{ width: 200 }} defaultValue={resource.amount.toString()} value={resource.amount} min={0} onChange={(event) => editState(parseInt(event), index, 'resource')}></InputNumber>
                <IconButton variant={'outline'} onClick={() => removeElement(index, 'resource')} colorScheme='red' size="sm" icon={<CloseButton />} />
              </InputGroup>
            ))}
            <IconButton variant={'solid'} onClick={() => setResources([...resources, { amount: 1, type: gameConfig.resourceTypes[0].type || 'effort' }])} colorScheme='green' size="sm" icon={<Plus />} />
          </FormControl>

          <FormControl>
            <FormLabel>Uses (Set to 999 for infinite uses)</FormLabel>
            <Input type='text' size='md' variant='outline' {...register('uses', validation.uses)}></Input>
            <Text fontSize='sm' color='red.500'>
              {errors.uses && errors.uses.message}
            </Text>
          </FormControl>

          <Grid templateColumns={`repeat(2, 1fr)`} width={'100%'}>
            {['hidden', 'lent', 'lendable', 'used', 'working'].map((stat, index) => (
              <FormControl key={index} display='flex' alignItems='center'>
                <FormLabel mb='0'>{stat}</FormLabel>
                <Switch id={stat} onChange={handleStatus} isChecked={status.some((el) => el === stat)} />
              </FormControl>
            ))}
          </Grid>
        </VStack>
      </Box>

      <VStack>
        {disabledConditions.filter(el => el.disabled).map((opt, index) =>
          <Text color='red' key={index}>{opt.text}</Text>
        )}
      </VStack>

      <ButtonGroup>
        <Button variant={'solid'} type='submit' colorScheme='teal' isDisabled={isDisabled} className='btn btn-primary mr-1'>
          Submit
        </Button>
        <Button variant={'outline'} colorScheme={'yellow'} onClick={() => reset()} leftIcon={<RepeatClockIcon />}>
          Reset Form
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default AssetForm;
