import React from 'react';
import { useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup } from 'rsuite';
import { effortTypesAdded } from '../../redux/entities/gameConfig';

import {
	HStack,
	VStack,
	Flex,
	FormControl,
	Box,
	FormLabel,
	Input,
	Text
} from '@chakra-ui/react';

function GameConfig() {
	const dispatch = useDispatch();
	const history = useHistory();

	//TODO: add validation for EffortAmount, incl >0
	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			effortTypes: [
				{
					type: '',
					effortAmount: 0
				}
			]
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
			pattern: {
				value: /^[a-zA-Z0-9_.-]+$/,
				message: "That's not a valid type where I come from..."
			},
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		}
	};

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	const onSubmit = (data) => {
		console.log(data);
		dispatch(effortTypesAdded(data));
		history.push('./GameConfig2');
	};

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
												<FormLabel>Type of Effort</FormLabel>
												<Input
													key={item.id}
													type="text"
													size="md"
													variant="outline"
													{...register(
														`effortTypes.${i}.type`,
														validation.type
													)}
												/>
												<Text fontSize="sm" color="red.500">
													{errors.effortTypes?.[i]?.type &&
														errors.effortTypes[i].type.message}
												</Text>
											</FormControl>
											<FormControl variant="floating">
												<FormLabel>Max Amount of Resources</FormLabel>
												<Input
													key={item.id}
													type="number"
													size="md"
													variant="outline"
													{...register(`effortTypes.${i}.effortAmount`)}
												/>
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
export default GameConfig;
