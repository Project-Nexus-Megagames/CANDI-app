import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray } from 'react-hook-form';
import {
	Input,
	Form,
	SelectPicker,
	ButtonGroup,
	Button,
	CheckboxGroup,
	Checkbox,
	Panel
} from 'rsuite';
import socket from '../../socket';

function GameConfig() {
	const { register, control, handleSubmit, reset, formState, setValue } =
		useForm({
			defaultValues: {
				types: ['']
			}
		});
	const { errors } = formState;
	const { fields, append, remove } = useFieldArray({
		name: 'types',
		control
	});

	const handleError = (errors) => {
		console.log(errors);
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
		<Form onSubmit={handleSubmit(onSubmit, handleError)}>
			{fields.map((item, i) => (
				<div key={i} className="list-group list-group-flush">
					<div className="list-group-item">
						<div>
							<Input placeholder=" " type="text" {...register(`types.${i}`)} />
						</div>
					</div>
				</div>
			))}

			<ButtonGroup>
				<Button onClick={() => append({ type: '' })}>Add Type</Button>
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
		</Form>
	);
}

export default GameConfig;
