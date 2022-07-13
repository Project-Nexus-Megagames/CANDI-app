import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, ButtonGroup } from 'rsuite';
import { actionTypesAdded } from '../../redux/entities/gameConfig';
import socket from '../../socket';
import {
	HStack,
	VStack,
	Flex,
	FormControl,
	Box,
	FormLabel,
	Input,
	Text,
	Checkbox,
	CheckboxGroup,
	Stack,
	Select
} from '@chakra-ui/react';

function GameConfig2() {
	const oldConfig = useSelector((state) => state.gameConfig);
	const dispatch = useDispatch();

	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			effortTypes: [oldConfig.actionTypes]
		}
	});
	const { errors } = formState;
	const { fields, append, remove, update } = useFieldArray({
		name: 'actionTypes',
		control
	});
	// TODO: add minErffort, etc, >0
	const validation = {
		type: {
			required: 'Type is required',
			pattern: {
				value: /^[a-zA-Z0-9_.-\s]+$/,
				message: "That's not a valid type where I come from..."
			},
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		minEffort: {
			required: 'Min Effort is required',
			min: { value: 0, message: 'Must be larger than 0' }
		},
		maxEffort: {
			required: 'Max Effort is required',
			min: { value: 0, message: 'Must be larger than 0' }
		},
		maxAssets: {
			required: 'Max Assets is required',
			min: { value: 0, message: 'Must be larger than 0' }
		}
	};

	useEffect(() => {
		oldConfig.actionTypes.forEach((type, index) => {
			console.log(type);
			Object.keys(type).forEach((key) => {
				update(index, type[key]);
			});
		});
	}, [oldConfig, update]);

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
		if (hasDuplicates(data.actionTypes))
			return alert('Effort Types have to be unique');
		dispatch(actionTypesAdded(data));
		let configToBeSent = { ...oldConfig };
		configToBeSent.actionTypes = data.actionTypes;
		try {
			socket.emit('request', {
				route: 'gameConfig',
				action: 'create',
				data: configToBeSent
			});
			console.log('try block called');
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
												<Input
													key={item.id}
													type="text"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.type}
													{...register(
														`actionTypes.${i}.type`,
														validation.type
													)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.type &&
														errors.actionTypes[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Types of Resources</FormLabel>
												<CheckboxGroup
													key={item.id}
													defaultValue={oldConfig.actionTypes?.[i]?.assetType}
												>
													<Stack spacing={[1, 5]} direction={['column', 'row']}>
														<Checkbox
															value="asset"
															{...register(`actionTypes.${i}.assetType`)}
														>
															Asset
														</Checkbox>
														<Checkbox
															value="trait"
															{...register(`actionTypes.${i}.assetType`)}
														>
															Trait
														</Checkbox>
													</Stack>
												</CheckboxGroup>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Max Amount of Resources</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.maxAssets}
													{...register(
														`actionTypes.${i}.maxAssets`,
														validation.maxAssets
													)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.maxAssets &&
														errors.actionTypes[i].maxAssets.message}
												</Text>
											</FormControl>
											<FormControl>
												<Select
													label="Type of Effort"
													{...register(`actionTypes.${i}.effortType`)}
													defaultValue={oldConfig.actionTypes?.[i]?.effortType}
												>
													{oldConfig.effortTypes.map((item) => (
														<option key={item.type} value={item.type}>
															{item.type}
														</option>
													))}
												</Select>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Min Effort</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.actionTypes?.[i]?.minEffort}
													{...register(
														`actionTypes.${i}.minEffort`,
														validation.minEffort
													)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.minEffort &&
														errors.actionTypes[i].minEffort.message}
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
													{...register(
														`actionTypes.${i}.maxEffort`,
														validation.maxEffort
													)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.actionTypes?.[i]?.maxEffort &&
														errors.actionTypes[i].maxEffort.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<Checkbox
													key={item.id}
													type="text"
													size="md"
													defaultValue={oldConfig.actionTypes?.[i]?.public}
													{...register(`actionTypes.${i}.public`)}
												>
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
									assetTypes: [''],
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
						{/*<Button
							onClick={() => reset()}
							type="button"
							className="btn btn-secondary mr-1"
						>
							Reset
						</Button>*/}
					</ButtonGroup>
				</VStack>
			</Flex>
		</form>
	);
}

export default GameConfig2;
