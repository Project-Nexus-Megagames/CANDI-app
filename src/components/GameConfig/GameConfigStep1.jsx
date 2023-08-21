import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { effortTypesAdded } from '../../redux/entities/gameConfig';

import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Button, ButtonGroup, Stack } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, TriangleDownIcon } from '@chakra-ui/icons';

function GameConfigStep1() {
	const dispatch = useDispatch();
	const oldConfig = useSelector((state) => state.gameConfig);

	const { formState: { isDirty, dirtyFields }, register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			effortTypes: [oldConfig.effortTypes]
		}
	});

	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'effortTypes',
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
		effortAmount: {
			required: 'Effort Amount is required',
			min: { value: 0, message: 'Must be larger than 0' }
		}
	};

	useEffect(() => {
		const resetValues = [];
		oldConfig.effortTypes.forEach((type) => {
			let a = {};
			a.type = type.type;
			a.effortAmount = type.effortAmount;
			resetValues.push(a);
		});
		reset({
			effortTypes: resetValues
		});
	}, [reset]);

	useEffect(() => {
		console.log(isDirty)
	}, [isDirty]);

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	function hasDuplicates(a) {
		let effortNames = [];
		for (const el of a) effortNames.push(el.type);
		const noDups = new Set(effortNames);
		return effortNames.length !== noDups.size;
	}

	const onSubmit = (data) => {
		// if (hasDuplicates(data.effortTypes)) return alert('Effort Types have to be unique');
		dispatch(effortTypesAdded(data));
		// history.push('./GameConfig2'); // TODO remake this so it doesn't use navigation
	};

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
      <h4>Step 1: Create Effort Types</h4>
			<Flex padding="20px">
				<VStack spacing="24px" align="left">
					{fields.map((item, i) => (
						<div key={i} className="list-group list-group-flush">
							<div className="list-group-item">
								<div>
									<Box>
										<HStack spacing="24px">
											<FormControl variant="floating">
												<FormLabel>Type of Effort</FormLabel>
												<Input key={item.id} type="text" size="md" variant="outline" defaultValue={oldConfig.effortTypes?.[i]?.type} {...register(`effortTypes.${i}.type`, validation.type)} />

												<Text fontSize="sm" color="red.500">
													{errors.effortTypes?.[i]?.type && errors.effortTypes[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Amount of Effort</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.effortTypes?.[i]?.effortAmount}
													{...register(`effortTypes.${i}.effortAmount`, validation.effortAmount)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.effortTypes?.[i]?.effortAmount && errors.effortTypes[i].effortAmount.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Effort Tag</FormLabel>
												<Input key={item.id} type="text" size="md" variant="outline" defaultValue={oldConfig.effortTypes?.[i]?.tag} {...register(`effortTypes.${i}.tag`)} />
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
					<Stack spacing={8} direction='row' align='right' justify={"center"}>
						<Button disabled={!isDirty} rightIcon={<TriangleDownIcon />} colorScheme={'blue'} type="submit" className="btn btn-primary mr-1">
							Save
						</Button>
						<Button
							rightIcon={<PlusSquareIcon />}
							colorScheme={'whatsapp'}
							onClick={() => append({ type: 'Main', effortAmount: 1, tag: 'PC' })} >
							Add Type
						</Button>
						<Button disabled={!isDirty} rightIcon={<RepeatClockIcon />} colorScheme={'yellow'} onClick={() => reset()} type="button" className="btn btn-secondary mr-1"> 
							Reset
						</Button>
					</Stack>
				</VStack>
			</Flex>
		</form>
	);
}
export default GameConfigStep1;
