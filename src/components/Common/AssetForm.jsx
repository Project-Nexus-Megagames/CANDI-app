import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { VStack, Flex, FormControl, Box, FormLabel, Input, Text, ButtonGroup, Button, Spacer, Switch, Grid, InputGroup, IconButton, CloseButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { RepeatClockIcon } from '@chakra-ui/icons';
import socket from '../../socket';
import SelectPicker from './SelectPicker';
import InputNumber from './InputNumber';
import { Plus } from '@rsuite/icons';

const AssetForm = (props) => {
	const { asset, character, mode } = props;
	const loggedInUser = useSelector((state) => state.auth.user);
	const gameConfig = useSelector((state) => state.gameConfig);
	const [imageURL, setImageURL] = useState('');
	const [dice, setDice] = React.useState([]);
	const [type, setType] = useState(asset ? asset.type : 'Asset'); // TODO change to first element of resourceType
	const [status, setStatus] = useState(asset && asset.status ? asset.status : []);

	const { register, control, handleSubmit, reset, formState, watch } = useForm(
		{
			defaultValues: asset
		},
		[props]
	);

	useEffect(() => {
		reset(asset);
	}, [asset]);

  const editState = (incoming, index, type) => {
		let thing;
		let temp;
		switch (type) {
			case 'dice':
				thing = dice[index];
				temp = [...dice];
				typeof(incoming) === 'number' ? thing.value = parseInt(incoming) : thing.type = (incoming);
				temp[index] = thing;
				setDice(temp);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

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

	const { errors } = formState;
	const watchCharName = watch('name', 'New Asset');

	// const { fields: effortFields } = useFieldArray({
	// 	name: 'effort',
	// 	control
	// });

	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe;
	}, [watch]);

	const handleExit = () => {
		props.closeModal();
	};

	const handleStatus = (stuff) => {
		const stat = stuff.target.id;

		if (status.some((el) => el === stat)) {
			let temp = status.filter((el0) => el0 !== stat);
			setStatus(temp);
		} else setStatus([...status, stat]);
	};

	function onSubmit(data, e) {
		if (props.handleSubmit) {
			props.handleSubmit({ ...data, dice, type: type });
		} else {
			e.preventDefault();
			const asset = { ...data, type: type, status: status, ownerCharacter: props.character._id };
			console.log('SENDING DATA', asset);
			socket.emit('request', {
				route: 'asset',
				action: mode,
				data: { asset, imageURL, loggedInUser }
			});
		}
		// props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	const diceTypes = [ { name: 'hack'}, { name: 'brawn' }, { name: 'stealth' } ];

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
			<Box>
				<VStack spacing='24px' w='100%'>
					<Flex>
						<Spacer />
						<FormControl>
							<FormLabel>Type</FormLabel>
							{/* <Input type="text" size="md" variant="outline" {...register('type', validation.type)}></Input> setValue('test', '')  */}
							<SelectPicker valueKey={'type'} label={'type'} data={gameConfig?.assetTypes} onChange={(ddd) => setType(ddd)} value={type} />
						</FormControl>
						<Spacer />
					</Flex>

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
						<FormLabel>Dice </FormLabel>
            {dice.map((die, index) => (
								<InputGroup key={die._id} index={index}>
                  <SelectPicker label='name' valueKey='name' data={diceTypes} value={die.type} onChange={(event)=> {editState(event, index, 'dice'); }} />
									<InputNumber prefix='value' style={{ width: 200 }} value={die.value} min={0} onChange={(event)=> editState(parseInt(event), index, 'die')}></InputNumber>
									<IconButton variant={'outline'} onClick={() => removeElement(index, 'dice')} colorScheme='red' size="sm" icon={<CloseButton />} />   
								</InputGroup>
							))}		
              <IconButton variant={'solid'}  onClick={() => setDice([...dice, { value: 1, type: 'brawn'} ])} colorScheme='green' size="sm" icon={<Plus/>} />   
					</FormControl>

					<Grid templateColumns={`repeat(2, 1fr)`} width={'100%'}>
						{['hidden', 'lent', 'lendable', 'used'].map((stat) => (
							<FormControl key={stat} display='flex' alignItems='center'>
								<FormLabel mb='0'>{stat}</FormLabel>
								<Switch id={stat} onChange={handleStatus} isChecked={status.some((el) => el === stat)} />
							</FormControl>
						))}
					</Grid>
				</VStack>
			</Box>

			<ButtonGroup>
				<Button type='submit' colorScheme='teal' disabled={type === ''} className='btn btn-primary mr-1'>
					Create Asset
				</Button>
				<Button colorScheme={'yellow'} onClick={() => reset()} leftIcon={<RepeatClockIcon />}>
					Reset Form
				</Button>
			</ButtonGroup>
		</form>
	);
};

export default AssetForm;
