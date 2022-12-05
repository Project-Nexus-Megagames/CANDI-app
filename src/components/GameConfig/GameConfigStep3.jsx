import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup } from 'rsuite';
import { statsAdded } from '../../redux/entities/gameConfig';

import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text } from '@chakra-ui/react';

function GameConfig3() {
	const dispatch = useDispatch();
	const history = useHistory();
	const oldConfig = useSelector((state) => state.gameConfig);

	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			stats: [oldConfig.stats]
		}
	});

	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'stats',
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
		effortAmount: {
			required: 'Amount is required',
		}
	};

	useEffect(() => {
		const resetValues = [];
		oldConfig.stats.forEach((stat) => {
			let a = {};
			a.type = stat.type;
			a.statAmount = stat.statAmount;
			resetValues.push(a);
		});
		reset({
			stats: resetValues
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
		if (hasDuplicates(data.stats)) return alert('Effort Types have to be unique');
		dispatch(statsAdded(data));
		history.push('./GameConfig2');
	};

	return (
		<form onSubmit={handleSubmit(onSubmit, handleError)}>
			<Flex padding="20px">
				<VStack spacing="24px" align="left">
					<h4>Modify Stats</h4>
					{fields.map((item, i) => (
						<div key={i} className="list-group list-group-flush">
							<div className="list-group-item">
								<div>
									<Box>
										<HStack spacing="24px">
											<FormControl variant="floating">
												<FormLabel>Stat name</FormLabel>
												<Input key={item.id} type="text" size="md" variant="outline" defaultValue={oldConfig.stats?.[i]?.type} {...register(`stats.${i}.type`, validation.type)} />

												<Text fontSize="sm" color="red.500">
													{errors.stats?.[i]?.type && errors.stats[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Stat Amount</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													defaultValue={oldConfig.stats?.[i]?.effortAmount}
													{...register(`stats.${i}.effortAmount`, validation.effortAmount)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.stats?.[i]?.effortAmount && errors.stats[i].effortAmount.message}
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
					<ButtonGroup>
						<Button
							onClick={() =>
								append({
									type: '',
									effortAmount: 0
								})
							}
						>
							Add Type
						</Button>
						<Button type="submit" className="btn btn-primary mr-1">
							Next
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
export default GameConfig3;
