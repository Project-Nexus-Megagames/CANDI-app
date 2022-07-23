import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { Modal, ButtonGroup, Button, Panel, TagGroup, Tag } from 'rsuite';
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
import { useForm, useFieldArray } from 'react-hook-form';
import socket from '../../socket';
import _ from 'lodash';
import cloudinaryUpload from '../../services/uploads';

const NewCharacter = (props) => {
	const gameConfig = useSelector((state) => state.gameConfig);

	const effortTypes = gameConfig.effortTypes;
	const [imageURL, setImageURL] = useState('');

	const { register, control, handleSubmit, reset, formState, watch } = useForm({
		defaultValues: {
			characterName: 'New Character',
			email: '',
			wiki: '',
			tags: ['NPC'],
			control: ["Add Controller's Name"],
			playerName: '',
			timeZone: '',
			bio: '',
			characterTitle: 'ex: The Agent',
			pronouns: '',
			effort: effortTypes,
			username: 'temp'
		}
	});
	const { errors } = formState;
	const watchCharName = watch('characterName', 'New Character');

	const { fields: effortFields } = useFieldArray({
		name: 'effort',
		control
	});

	const { fields: tagFields, append: appendTag } = useFieldArray({
		name: 'tags',
		control
	});

	const { fields: controlFields, append: appendControl } = useFieldArray({
		name: 'control',
		control
	});

	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe();
	}, [watch]);

	const handleFileUpload = async (e) => {
		const uploadData = new FormData();
		uploadData.append('file', e.target.files[0], 'file');
		const img = await cloudinaryUpload(uploadData);
		setImageURL(img.secure_url);
	};

	const renderImage = () => {
		return <img src={imageURL}></img>;
	};

	const handleExit = () => {
		props.closeModal();
	};

	function onSubmit(data) {
		//socket.emit('request', {
		//	route: 'character',
		//	action: 'create',
		//	data: {data, imageURL}
		//});
		console.log(data, imageURL);
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
				<Modal.Title>New Character "{watchCharName}"</Modal.Title>
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
						<FormLabel>Pronouns </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('pronouns')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>Player Name </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('playerName')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>User Name </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('username')}
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
					<FormControl>
						<FormLabel>Time Zone </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('timeZone')}
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
						<FormLabel>Bio </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('bio')}
						></Input>
					</FormControl>
					<FormControl>
						<FormLabel>Wiki </FormLabel>
						<Input
							type="text"
							size="md"
							variant="outline"
							{...register('wiki')}
						></Input>
					</FormControl>
					{effortFields.map((item, i) => (
						<div key={i}>
							<FormControl>
								<FormLabel>Effort {effortTypes?.[i]?.type}</FormLabel>
								<Input
									key={item.id}
									type="number"
									size="md"
									variant="outline"
									defaultValue={effortTypes?.[i]?.effortAmount}
									{...register(`effort.${i}.effortAmount`)}
								></Input>
							</FormControl>
						</div>
					))}
					<FormLabel>Tags</FormLabel>

					{tagFields.map((item, i) => (
						<div key={i}>
							<FormControl>
								<Input size="md" {...register(`tags.${i}`)}></Input>
							</FormControl>
						</div>
					))}
					<Button onClick={() => appendTag('')}>+</Button>
					{controlFields.map((item, i) => (
						<div key={i}>
							<FormControl>
								<Input size="md" {...register(`control.${i}`)}></Input>
							</FormControl>
						</div>
					))}
					<Button onClick={() => appendControl('')}>+</Button>

					<div>
						<div style={{ margin: 10 }}>
							<label style={{ margin: 10 }}>Cloudinary:</label>
							<Input type="file" onChange={(e) => handleFileUpload(e)} />
						</div>
						<div>
							<p>test</p>
							{renderImage()}
						</div>
					</div>
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
