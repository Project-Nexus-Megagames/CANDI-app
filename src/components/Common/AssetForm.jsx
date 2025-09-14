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
import { getCharAccount } from '../../redux/entities/accounts';
import CharacterTag from './CharacterTag';
import { AddCharacter } from './AddCharacter';
import MDEditor from '@uiw/react-md-editor';

const AssetForm = (props) => {
	const { asset, character, mode } = props;
	const loggedInUser = useSelector((state) => state.auth.user);
	const gameConfig = useSelector((state) => state.gameConfig);
	const characters = props.characters || useSelector((state) => state.characters.list);

	const [imageURL, setImageURL] = useState('');
	const [type, setType] = useState(asset ? asset.type : 'Asset'); // TODO change to first element of resourceType
	const [status, setStatus] = useState(asset && asset.status ? asset.status : ['hidden']);
	const [dice, setDice] = React.useState(asset ? [...asset.dice] : []);
	const [account, setAccount] = React.useState(asset ? (asset.account) : 
  character ? character.account : false); 
	const [description, setDescription] = useState(asset?.description || '');

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
      setAccount(asset.account) 
    }
	}, [asset]);

	const validation = {
		name: {
			required: 'Asset Name is required',
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		// description: {
		// 	maxLength: {
		// 		value: 3000,
		// 		message: "That's way too long, try again"
		// 	}
		// },
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
			props.handleSubmit({ ...data, dice, type: type, status: status, account: account, description});
		} else {
			e.preventDefault();
			const asset = { ...data, dice, type: type, status: status, account: account, description};
			socket.emit('request', {
				route: 'asset',
				action: mode,
				data: { asset, imageURL, loggedInUser }
			});
		}
		props.closeModal();
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
				typeof(incoming) === 'number' ? thing.amount = parseInt(incoming) : thing.type = (incoming);
				temp[index] = thing;
				setDice(temp);
				break;
      
			case 'selectAccount':
        setAccount(incoming.account);
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
          
          {!account && <AddCharacter characters={characters} handleSelect={(char) => editState(char, 0, 'selectAccount')} />}
            {account && 
              <CharacterTag isAccessible character={account} onClick={() => setAccount(false)} />
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
            <div data-color-mode="dark">
              <MDEditor
                style={{ backgroundColor: '#1a1d24', color: 'white' }}
                value={description}
                preview="edit"
                onChange={setDescription} />
            </div>

						<Text fontSize='sm' color='red.500'>
							{errors.description && errors.description.message}
						</Text>
					</FormControl>

          <FormControl>
						<FormLabel>Dice! </FormLabel>
            {dice.map((die, index) => (
              
								<InputGroup key={die._id} index={index}>
                  {die.amount}?
                  <SelectPicker label='type' valueKey='type' data={gameConfig.assetTypes} value={die.type} onChange={(event)=> {editState(event, index, 'dice'); }} />
									<InputNumber prefix='value' style={{ width: 200 }} defaultValue={die.amount.toString()} value={die.amount} min={0} onChange={(event)=> editState(parseInt(event), index, 'die')}></InputNumber>
									<IconButton variant={'outline'} onClick={() => removeElement(index, 'dice')} colorScheme='red' size="sm" icon={<CloseButton />} />   
								</InputGroup>
							))}		
              <IconButton variant={'solid'}  onClick={() => setDice([...dice, { amount: 1, type: type} ])} colorScheme='green' size="sm" icon={<Plus/>} />   
					</FormControl>

          <FormControl>
						<FormLabel>Uses (Set to 999 for infinite uses)</FormLabel>
						<Input type='text' size='md' variant='outline' {...register('uses', validation.uses)}></Input>
						<Text fontSize='sm' color='red.500'>
							{errors.uses && errors.uses.message}
						</Text>
					</FormControl>

          <FormControl>
						<FormLabel>Lend Uses (How many times this asset can be lent out per round)</FormLabel>
						<Input type='text' size='md' variant='outline' {...register('lendUses', validation.lendUses)}></Input>
						<Text fontSize='sm' color='red.500'>
							{errors.lendUses && errors.lendUses.message}
						</Text>
					</FormControl>

					<Grid templateColumns={`repeat(2, 1fr)`} width={'100%'}>
						{['hidden', 'multi-use', 'lendable', 'used', 'working'].map((stat, index) => (
							<FormControl key={index} display='flex' alignItems='center'>
								<FormLabel mb='0'>{stat}</FormLabel>
								<Switch id={stat} onChange={handleStatus} isChecked={status.some((el) => el === stat)} />
							</FormControl>
						))}
					</Grid>
				</VStack>
			</Box>

      <VStack>
        {disabledConditions.filter(el=> el.disabled).map((opt, index) => 
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
