import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { resourceTypesAdded } from '../../redux/entities/gameConfig';
import socket from '../../socket';
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Checkbox, CheckboxGroup, Stack, Button, ButtonGroup } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, TriangleDownIcon } from '@chakra-ui/icons';

function GameConfigStepResources() {
	const oldConfig = useSelector((state) => state.gameConfig);
	const dispatch = useDispatch();

	const {
		formState: { isDirty, dirtyFields },
		register,
		control,
		handleSubmit,
		reset,
		formState
	} = useForm({
		defaultValues: {
			resouceTypes: [oldConfig.assetTypes]
		}
	});
	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'resourceTypes',
		control
	});

	const validation = {
		type: {
			required: 'Type is required',
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		}
	};

	useEffect(() => {
		const resetValues = [];
		oldConfig.assetTypes?.forEach((type) => {
			let value = {};
			value.type = type.type;
			resetValues.push(value);
		});
		reset({
			resourceTypes: resetValues
		});
	}, [reset]);

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	function hasDuplicates(a) {
		let resourceNames = [];
		for (const el of a) resourceNames.push(el.type);
		const noDups = new Set(resourceNames);
		return resourceNames.length !== noDups.size;
	}

	function onSubmit(data) {
		if (hasDuplicates(data.assetTypes)) return alert('Resource Types have to be unique');
		dispatch(resourceTypesAdded(data));

		let configToBeSent = { ...oldConfig };
		configToBeSent.assetTypes = data.assetTypes;
		console.log('DATA', configToBeSent);
		try {
			socket.emit('request', {
				route: 'gameConfig',
				action: 'create',
				data: configToBeSent
			});
		} catch (err) {
			console.log('catch block called', err);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
			<h4>Step 2: Create Resource Types</h4>
			<Flex padding='20px'>
				<VStack spacing='24px' align='left'>
					{fields.map((item, i) => (
						<div key={i} className='list-group list-group-flush'>
							<div className='list-group-item'>
								<div>
									<Box>
										<HStack spacing='24px'>
											<FormControl variant='floating'>
												<FormLabel>Type of Resource</FormLabel>
												<Input
													key={item.id}
													type='text'
													size='md'
													variant='outline'
													defaultValue={oldConfig.assetTypes?.[i]?.type}
													{...register(`resourceTypes.${i}.type`, validation.type)}
												/>
												<Text fontSize='sm' color='red.500'>
													{errors.assetTypes?.[i]?.type && errors.assetTypes[i].type.message}
												</Text>
											</FormControl>

											<Button size='xs' onClick={() => remove(i)}>
												-
											</Button>
										</HStack>
									</Box>
								</div>
							</div>
						</div>
					))}
					<ButtonGroup>
						<Button disabled={!isDirty} rightIcon={<TriangleDownIcon />} colorScheme={'blue'} type='submit' className='btn btn-primary mr-1'>
							Save
						</Button>

						<Button
							rightIcon={<PlusSquareIcon />}
							colorScheme={'whatsapp'}
							onClick={() =>
								append({
									type: ''
								})
							}
						>
							Add Resource
						</Button>

						<Button disabled={!isDirty} rightIcon={<RepeatClockIcon />} colorScheme={'yellow'} onClick={() => reset()} type='button' className='btn btn-secondary mr-1'>
							Reset
						</Button>
					</ButtonGroup>
				</VStack>
			</Flex>
		</form>
	);
}

export default GameConfigStepResources;
