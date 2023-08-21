import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { characterStatsAdded } from '../../redux/entities/gameConfig';

import { Button, ButtonGroup,  HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Stack } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, TriangleDownIcon } from '@chakra-ui/icons';

function GameConfigStep4() {
	const dispatch = useDispatch();
	const oldConfig = useSelector((state) => state.gameConfig);

	const { formState: { isDirty, dirtyFields }, register, control, handleSubmit, reset, formState, } = useForm({
		defaultValues: {
			characterStats: [oldConfig.characterStats]
		}
	});

	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'characterStats',
		control
	});

	const validation = {
		type: {
			required: 'Type is required',
			maxLength: {
				value: 300,
				message: "That's way too long!"
			}
		},
		statAmount: {
			required: 'Amount is required',
		}
	};

	useEffect(() => {
		const resetValues = [];
		oldConfig.characterStats?.forEach((stat) => {
			let a = {};
			a.type = stat.type;
			a.statAmount = stat.statAmount;
			resetValues.push(a);
		});
		reset({
			characterStats: resetValues
		});
	}, [reset]);

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
		if (hasDuplicates(data.characterStats)) return alert('characterStats have to be unique');
		dispatch(characterStatsAdded(data));
		reset({keepValues: true});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
      <h4>Step 2: Create Character Stat Trackers</h4>
			<Flex padding="20px">
				<VStack spacing="24px" align="left">
					<h4>Modify characterStats</h4>
					{fields && fields.map((item, i) => (
						<div key={i} className="list-group list-group-flush">
							<div className="list-group-item">
								<div>
									<Box>
										<HStack spacing="24px">
											<FormControl variant="floating">
												<FormLabel>Stat name</FormLabel>
												<Input key={item.id} type="text" size="md" variant="outline" defaultValue={oldConfig.characterStats?.[i]?.type} {...register(`characterStats.${i}.type`, validation.type)} />

												<Text fontSize="sm" color="red.500">
													{errors.characterStats?.[i]?.type && errors.characterStats[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Stat Amount</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.characterStats?.[i]?.statAmount}
													{...register(`characterStats.${i}.statAmount`, validation.statAmount)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.characterStats?.[i]?.statAmount && errors.characterStats[i].statAmount.message}
												</Text>
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
							onClick={() => append({ type: 'Character_Stat', statAmount: 0 })} >
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
export default GameConfigStep4;
