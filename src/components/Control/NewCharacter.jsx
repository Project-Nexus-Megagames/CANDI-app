import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, ButtonGroup, Button, Panel } from 'rsuite';
import {
	HStack,
	VStack,
	Flex,
	FormControl,
	Box,
	FormLabel,
	Input,
	Text,
	Stack
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import socket from '../../socket';
import _ from 'lodash';

const NewCharacter = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const gameConfig = useSelector((state) => state.gameConfig);

	const effortTypes = gameConfig.effortTypes;

	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			characterName: 'Test',
			email: '',
			wiki: '',
			tags: ['NPC'],
			control: ["Add Controller's Name"],
			playerName: '',
			timeZone: '',
			bio: '',
			characterTitle: 'ex: The Agent',
			pronouns: '',
			effort: [{ type: '', amount: 0 }],
			username: 'temp'
		}
	});
	const { errors } = formState;

	const handleExit = () => {
		props.closeModal();
	};

	function onSubmit(data) {
		//socket.emit('request', {
		//	route: 'character',
		//	action: 'create',
		//	data
		//});
		console.log(data);
		props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	return (
		<Modal
			overflow
			full
			size="lg"
			show={props.show}
			onHide={() => {
				handleExit();
			}}
		>
			<Modal.Header>
				<Modal.Title>New Character</Modal.Title>
			</Modal.Header>
			<form onSubmit={handleSubmit(onSubmit, handleError)}>
				<Panel>
					<FormControl>
						<FormLabel>Name </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('characterName')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>Bio </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('bio')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>Character Title </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('characterTitle')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>E-Mail </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('email')}
						></Input>
					</FormControl>
				</Panel>

				<Modal.Footer>
					<Button type="submit" color="red" className="btn btn-primary mr-1">
						Create new Character
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};

export default NewCharacter;
