import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, ButtonGroup } from 'rsuite';
import { actionTypesAdded } from '../../redux/entities/gameConfig';
import socket from '../../socket';
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';

function GameConfig2() {
	const oldConfig = useSelector((state) => state.gameConfig);
	const dispatch = useDispatch();

	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			actionTypes: [oldConfig.actionTypes]
		}
	});
	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'actionTypes',
		control
	});

	const validation = {
		type: {
			required: 'Type is required',
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		minEffort: {
			required: 'Min Effort is required',
			min: { value: 0, message: 'Must be 0 or larger' }
		},
		maxEffort: {
			required: 'Max Effort is required',
			min: { value: 0, message: 'Must be 0 or larger' }
		},
		maxAssets: {
			required: 'Max Assets is required',
			min: { value: 0, message: 'Must be 0 or larger' }
		}
	};

	useEffect(() => {
		const resetValues = [];
		oldConfig.actionTypes.forEach((type) => {
			let value = {};
			value.type = type.type;
			value.effortAmount = type.effortAmount;
			value.assetType = type.assetType;
			value.maxAssets = type.maxAssets;
			value.effortTypes = type.effortTypes;
			value.minEffort = type.minEffort;
			value.maxEffort = type.maxEffort;
			value.public = type.public;
			resetValues.push(value);
		});
		reset({
			actionTypes: resetValues
		});
	}, [reset]);

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	function hasDuplicates(a) {
		let actionNames = [];
		for (const el of a) actionNames.push(el.type);
		const noDups = new Set(actionNames);
		return actionNames.length !== noDups.size;
	}

	function onSubmit(data) {
		if (hasDuplicates(data.actionTypes)) return alert('Action Types have to be unique');
		dispatch(actionTypesAdded(data));

		let configToBeSent = { ...oldConfig };
		configToBeSent.actionTypes = data.actionTypes;
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
			<Flex padding="20px">
				<VStack spacing="24px" align="left">
					{fields.map((item, i) => (
						<div key={i} className="list-group list-group-flush">
							<div className="list-group-item">
								<div>
									<Box>
										<HStack spacing="24px">
											<FormControl variant="floating">
												<FormLabel>Type of Action</FormLabel>
												<Input key={item.id} type="text" size="md" variant="outline" defaultValue={oldConfig.actionTypes?.[i]?.type} {...register(`actionTypes.${i}.type`, validation.type)} />
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.type && errors.actionTypes[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Types of Resources</FormLabel>
												<Controller
													name={`actionTypes.${i}.assetType`}
													control={control}
													render={({ field: { ref, ...rest } }) => {
														console.log(rest);
														return (
															<CheckboxGroup key={item.id} defaultValue={oldConfig.actionTypes?.[i]?.assetType} {...rest}>
																<Stack spacing={[1]} direction={['column']}>
																	<Checkbox value="asset">Asset</Checkbox>
																	<Checkbox value="trait">Trait</Checkbox>
																	<Checkbox value="title">Title</Checkbox>
																</Stack>
															</CheckboxGroup>
														);
													}}
												/>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Max Resources</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.maxAssets}
													{...register(`actionTypes.${i}.maxAssets`, validation.maxAssets)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.maxAssets && errors.actionTypes[i].maxAssets.message}
												</Text>
											</FormControl>
											<FormControl>
												<FormLabel>Types of Effort</FormLabel>
												<Controller
													name={`actionTypes.${i}.effortTypes`}
													control={control}
													render={({ field: { ref, ...rest } }) => (
														<CheckboxGroup key={item.id} defaultValue={oldConfig.actionTypes?.[i]?.effortTypes} {...rest}>
															<Stack spacing={[1]} direction={['column']}>
																{oldConfig.effortTypes.map((item) => (
																	<Checkbox value={item.type} key={item.id}>
																		{item.type}
																	</Checkbox>
																))}
															</Stack>
														</CheckboxGroup>
													)}
												/>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Min Effort</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.minEffort}
													{...register(`actionTypes.${i}.minEffort`, validation.minEffort)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.minEffort && errors.actionTypes[i].minEffort.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Max Effort</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.maxEffort}
													{...register(`actionTypes.${i}.maxEffort`, validation.maxEffort)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.maxEffort && errors.actionTypes[i].maxEffort.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<Checkbox key={item.id} type="text" size="md" defaultValue={oldConfig.actionTypes?.[i]?.public} {...register(`actionTypes.${i}.public`)}>
													Public Action
												</Checkbox>
											</FormControl>
											<Button size="xs" onClick={() => remove(i)}>
												-
											</Button>
										</HStack>
									</Box>
								</div>
							</div>
						</div>
					))}
					<ButtonGroup>
						<Button
							onClick={() =>
								append({
									type: '',
									minEffort: 0,
									maxEffort: 0,
									assetType: [''],
									effortTypes: [''],
									maxAssets: 0,
									public: false,
									icon: ''
								})
							}
						>
							Add Type
						</Button>
						<Button type="submit" className="btn btn-primary mr-1">
							Create Initial Config
						</Button>
						<Button onClick={() => reset()} type="button" className="btn btn-secondary mr-1">
							Reset
						</Button>
					</ButtonGroup>
				</VStack>
			</Flex>
		</form>
	);
}

export default GameConfig2;
