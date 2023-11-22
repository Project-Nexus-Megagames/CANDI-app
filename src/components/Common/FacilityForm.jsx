import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Modal, ModalHeader, ModalContent, ModalBody, ButtonGroup, Button, ModalFooter, Spacer, Switch, Grid, InputGroup, IconButton, CloseButton } from '@chakra-ui/react';
import { useForm, useFieldArray, useController } from 'react-hook-form';

import { RepeatClockIcon } from '@chakra-ui/icons';
import { CandiModal } from './CandiModal';
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import InputNumber from './InputNumber';
import { Plus } from '@rsuite/icons';
import { getCharAccount } from '../../redux/entities/accounts';
import { AddCharacter } from './AddCharacter';

const FacilityForm = (props) => {
	const { facility, mode } = props;
	const loggedInUser = useSelector((state) => state.auth.user);
	const locations = useSelector((state) => state.locations.list);
	const accounts = useSelector((state) => state.accounts.list);
	const gameConfig = useSelector((state) => state.gameConfig);
  const account = useSelector(getCharAccount);

	const [imageURL, setImageURL] = useState('');
	const [status, setStatus] = useState(facility && facility.status ? facility.status : []);
	const [owner, setOwner] = useState(facility && facility.account ? facility.account : false);
	const [location, setLocation] = useState(facility && facility.location ? facility.location : false);
	const [resources, setResource] = React.useState(facility ? [...facility.producing] : []);
  

	const { register, handleSubmit, reset, formState, watch } = useForm(
		{
			defaultValues: facility
		},
		[props]
	);

	useEffect(() => {
    if (facility) {
      reset(facility);
      let temp = []
      for (const ass of facility.producing) {
        temp.push({ amount: ass.amount, type: ass.type })
      }
      setResource(temp);      
    }
	}, [facility]);

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


	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe;
	}, [watch]);


  const removeElement = (index, type) => {
		let temp;
		switch (type) {
			case 'resources':
				temp = [...resources];
				temp.splice(index, 1)
				setResource(temp);
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
			props.handleSubmit({ ...data, producing: resources, status: status, });
		} else {
			e.preventDefault();
			const facility = { ...data, producing: resources, status: status, account: owner, location };
			console.log('SENDING DATA', facility);
			socket.emit('request', {
				route: 'facility',
				action: mode,
				data: facility,
			});
		}
		props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

  const editState = (incoming, index, type) => {
		let thing;
		let temp;
		switch (type) {
			case 'die':
			case 'resources':
				thing = resources[index];
				temp = [...resources];
				typeof(incoming) === 'number' ? thing.amount = parseInt(incoming) : thing.type = (incoming);
				temp[index] = thing;
				setResource(temp);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!')
		}
	}

	//const assetTypes = [ { name: 'Asset'}, { name: 'Trait' }, { name: 'Power' } ];

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
			<Box>
				<VStack spacing='24px' w='100%'>

					<FormControl>
						<FormLabel>Name</FormLabel>
						<Input type='text' size='md' variant='outline' {...register('name', validation.name)}></Input>
						<Text fontSize='sm' color='red.500'>
							{errors.name && errors.name.message}
						</Text>
					</FormControl>

					<FormControl>
						<FormLabel>Description</FormLabel>
						<Input type='text' size='md' variant='outline' {...register('description', validation.description)}></Input>
						<Text fontSize='sm' color='red.500'>
							{errors.description && errors.description.message}
						</Text>
					</FormControl>

          <Flex>
						<Spacer />
						<FormControl>
							<FormLabel>Owner </FormLabel>
              {<SelectPicker onChange={setOwner} data={accounts} label='name' />}
						</FormControl>
						<Spacer />
            <FormControl>
							<FormLabel>Location </FormLabel>
              {<SelectPicker onChange={setLocation} data={locations} label='name' />}
						</FormControl>
					</Flex>

          <FormControl>
						<FormLabel>Produces </FormLabel>
            {resources.map((die, index) => (
              
								<InputGroup key={die._id} index={index}>
                  {die.amount}?
                  <SelectPicker label='type' valueKey='type' data={gameConfig.resourceTypes} value={die.type} onChange={(event)=> {editState(event, index, 'resources'); }} />
									<InputNumber prefix='value' style={{ width: 200 }} defaultValue={die.amount.toString()} value={die.amount} min={0} onChange={(event)=> editState(parseInt(event), index, 'die')}></InputNumber>
									<IconButton variant={'outline'} onClick={() => removeElement(index, 'resources')} colorScheme='red' size="sm" icon={<CloseButton />} />   
								</InputGroup>
							))}		
              <IconButton variant={'solid'}  onClick={() => setResource([...resources, { amount: 1, type: gameConfig.resourceTypes[resources.length-1]?.type} ])} colorScheme='green' size="sm" icon={<Plus/>} />   
					</FormControl>

				</VStack>
			</Box>

			<ButtonGroup>
				<Button type='submit' variant={'solid'} colorScheme='teal' className='btn btn-primary mr-1'>
					{facility ? "Edit" : "Create"} Facility
				</Button>
				<Button variant={'solid'} colorScheme={'yellow'} onClick={() => reset()} leftIcon={<RepeatClockIcon />}>
					Reset Form
				</Button>
        <Button variant={'solid'} colorScheme={'red'} onClick={() => props.closeModal()} leftIcon={<CloseButton />}>
					Cancel
				</Button>
			</ButtonGroup>
		</form>
	);
};

export default FacilityForm;
