import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Modal, ModalHeader, ModalContent, ModalBody, ButtonGroup, Button, ModalFooter, Spacer, Switch, Grid, InputGroup, IconButton, CloseButton } from '@chakra-ui/react';
import { useForm, useFieldArray, useController } from 'react-hook-form';
import { Plus } from '@rsuite/icons';

import { RepeatClockIcon } from '@chakra-ui/icons';
import SelectPicker from '../Common/SelectPicker';
import socket from '../../socket';
import InputNumber from '../Common/InputNumber';

const LocationForm = (props) => {
	const { location, mode } = props;
	const loggedInUser = useSelector((state) => state.auth.user);
	const locations = useSelector((state) => state.locations.list);
	const accounts = useSelector((state) => state.accounts.list);
	const gameConfig = useSelector((state) => state.gameConfig);

	const [status, setStatus] = useState(location && location.status ? location.status : []);
	const [coords, setCoords] = useState(location && location.coords ? location.coords : {x: 0, y: 0, z: 0});
  

	const { register, handleSubmit, reset, formState, watch } = useForm(
		{
			defaultValues: location
		},
		[props]
	);

	const validation = {
		name: {
			required: 'Name is required',
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
		}
	};

	const { errors } = formState;


	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe;
	}, [watch]);

	const handleStatus = (stuff) => {
		const stat = stuff.target.id;

		if (status.some((el) => el === stat)) {
			let temp = status.filter((el0) => el0 !== stat);
			setStatus(temp);
		} else setStatus([...status, stat]);
	};

	function onSubmit(data, e) {
		if (props.handleSubmit) {
			props.handleSubmit({ ...data, status: status, });
		} else {
			e.preventDefault();
			const location = { ...data, status: status };
			console.log('SENDING DATA', location);
			socket.emit('request', {
				route: 'location',
				action: mode,
				data: location,
			});
		}
		props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

  const editState = (incoming, type, index) => {
		let thing;
		let temp;
		switch (type) {
			case 'coords':
        let newCoords = coords
        newCoords[index] = incoming
        setCoords(newCoords)
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
          
          <Input type='text' size='md' variant='outline'></Input>

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

          {/* <Flex>
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
					</Flex> */}


				</VStack>
			</Box>

			<ButtonGroup>
				<Button type='submit' variant={'solid'} colorScheme='teal' className='btn btn-primary mr-1'>
					{location ? "Edit" : "Create"} Location
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

export default LocationForm;
