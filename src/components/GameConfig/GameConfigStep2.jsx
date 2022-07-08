import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, ButtonGroup } from 'rsuite';
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
	Stack
} from '@chakra-ui/react';

function GameConfig2() {
	const config = useSelector((state) => state.gameConfig);
	const { register, control, handleSubmit, reset, formState, setValue } =
		useForm({
			defaultValues: {
				actionTypes: [
					{
						type: '',
						minEffort: 0,
						maxEffort: 0,
						assetTypes: [''],
						maxAssets: 0,
						public: false,
						icon: ''
					}
				]
			}
		});
	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'actionTypes',
		control
	});
	// TODO: add minErffort, etc, >0
	const validation = {
		type: {
			required: 'Type is required',
			pattern: {
				value: /^[a-zA-Z0-9_.-]+$/,
				message: "That's not a valid type where I come from..."
			},
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		minEffort: { required: 'Min Effort is required' },
		maxEffort: { required: 'Max Effort is required' },
		maxAssets: { required: 'Max Assets is required' }
	};

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	function onSubmit(data) {
		console.log(data);
		//try {
		//	socket.emit('request', {
		//		route: 'gameConfig',
		//		action: 'create',
		//		data
		//	});
		//	// eslint-disable-next-line no-empty
		//} catch (err) {}
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
												<CheckboxGroup key={item.id}>
													<Stack spacing={[1, 5]} direction={['column', 'row']}>
														<Checkbox
															value="asset"
															{...register(`actionTypes.${i}.assetTypes`)}
														>
															Asset
														</Checkbox>
														<Checkbox
															value="trait"
															{...register(`actionTypes.${i}.assetTypes`)}
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
											<FormControl variant="floating">
												<Checkbox
													key={item.id}
													type="text"
													size="md"
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
						<Button
							onClick={() => reset()}
							type="button"
							className="btn btn-secondary mr-1"
						>
							Reset
						</Button>
					</ButtonGroup>
				</VStack>
			</Flex>
		</form>
	);
}

export default GameConfig2;
