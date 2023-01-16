import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, ButtonGroup, Button } from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import socket from '../../socket';
import { cloudinaryUploadMedium } from '../../services/uploads';
import { CandiModal } from '../Common/CandiModal';

const NewCharacter = (props) => {
	const gameConfig = useSelector((state) => state.gameConfig);
	const loggedInUser = useSelector((state) => state.auth.user);

	const effortTypes = gameConfig.effortTypes;
	const [imageURL, setImageURL] = useState('');

	const { register, control, handleSubmit, reset, formState, watch } = useForm({
		defaultValues: {
			characterName: 'Character_Name_Here',
			email: 'temp@temp',
			wiki: '',
			tags: ['PC', 'Public'],
			control: [''],
			playerName: '',
			timeZone: '',
			bio: '',
			characterTitle: '',
			pronouns: '',
			//effort: [effortTypes],
			username: 'temp'
		},
		shouldUnregister: true
	});

	const validation = {
		characterName: {
			required: 'Character Name is required',
			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		email: {
			required: 'E-Mail is required',
			pattern: { value: /^\S+@\S+$/i, message: 'That is not a valid email' }
		},
		playerName: {
			required: 'Player Name is required',
			//pattern: {
			//	value: /^[a-zA-Z0-9,!\-?_.-=+*%'"\s]+$/,
			//	message: "That's not a valid name where I come from..."
			//},

			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		username: {
			//pattern: {
			//	value: /^[a-zA-Z0-9,!\-?_.-=+*%'"\s]+$/,
			//	message: "That's not a valid name where I come from..."
			//},

			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		bio: {
			//pattern: {
			//	value: /^[a-zA-Z0-9,!\-?_.-=+*%'"’`\s()]+$/,
			//	message: 'Good try...'
			//},
			maxLength: {
				value: 3000,
				message: "That's way too long, try again"
			}
		},
		wiki: {
			//pattern: {
			//	value: /^[a-zA-Z0-9_.-\s]+$/,
			//	message: "That's not a valid wiki name where I come from..."
			//},

			maxLength: {
				value: 300,
				message: "That's way too long, try again"
			}
		},
		amount: {
			required: 'Effort Amount is required',
			min: { value: 0, message: 'Must be larger than 0' }
		}
	};

	const { errors } = formState;
	const watchCharName = watch('characterName', 'New Character');

	//const { fields: effortFields } = useFieldArray({
	//	name: 'effort',
	//	control
	//});

	const {
		fields: tagFields,
		append: appendTag,
		remove: removeTag
	} = useFieldArray({
		name: 'tags',
		control
	});

	const {
		fields: controlFields,
		append: appendControl,
		remove: removeControl
	} = useFieldArray({
		name: 'control',
		control
	});

	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe;
	}, [watch]);

	const handleFileUpload = async (e) => {
		const uploadData = new FormData();
		uploadData.append('file', e.target.files[0], 'file');
		const img = await cloudinaryUploadMedium(uploadData);
		setImageURL(img.secure_url);
	};

	const renderImage = () => {
		return <img src={imageURL}></img>;
	};

	const handleExit = () => {
		setImageURL('');
		props.closeModal();
	};

	function onSubmit(data) {
		socket.emit('request', {
			route: 'character',
			action: 'create',
			data: { data, imageURL, loggedInUser }
		});
		setImageURL('');
		props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	return (
		<CandiModal>
			<form onSubmit={handleSubmit(onSubmit, handleError)}>
					<Flex w="100%">
						<VStack spacing="24px" w="100%">
							<HStack w="100%">
								<FormControl>
									<FormLabel>Character Name </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('characterName', validation.characterName)}></Input>
									<Text fontSize="sm" color="red.500">
										{errors.characterName && errors.characterName.message}
									</Text>
								</FormControl>
								<FormControl>
									<FormLabel>Pronouns </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('pronouns')}></Input>
								</FormControl>
							</HStack>
							<HStack w="100%">
								<FormControl>
									<FormLabel>Player Name </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('playerName', validation.playerName)}></Input>

									<Text fontSize="sm" color="red.500">
										{errors.playerName && errors.playerName.message}
									</Text>
								</FormControl>
								<FormControl>
									<FormLabel>User Name </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('username', validation.username)}></Input>

									<Text fontSize="sm" color="red.500">
										{errors.username && errors.username.message}
									</Text>
								</FormControl>
								<FormControl>
									<FormLabel>E-Mail </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('email', validation.email)}></Input>

									<Text fontSize="sm" color="red.500">
										{errors.email && errors.email.message}
									</Text>
								</FormControl>
								<FormControl>
									<FormLabel>Time Zone </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('timeZone')}></Input>
								</FormControl>
							</HStack>
							<HStack w="100%">
								<FormControl>
									<FormLabel>Character Title </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('characterTitle')}></Input>
								</FormControl>
								<FormControl>
									<FormLabel>Wiki </FormLabel>
									<Input type="text" size="md" variant="outline" {...register('wiki', validation.wiki)}></Input>
									<Text fontSize="sm" color="red.500">
										{errors.wiki && errors.wiki.message}
									</Text>
								</FormControl>
							</HStack>
							<FormControl>
								<FormLabel>Bio </FormLabel>
								<Input type="text" size="md" variant="outline" {...register('bio', validation.bio)}></Input>
								<Text fontSize="sm" color="red.500">
									{errors.bio && errors.bio.message}
								</Text>
							</FormControl>
							{/*<HStack w="100%">
								{effortFields.map((item, i) => (
									<div key={i}>
										<FormControl>
											<FormLabel>Effort {effortTypes?.[i]?.type}</FormLabel>
											<Input key={item.id} type="number" size="md" variant="outline" defaultValue={effortTypes?.[i]?.effortAmount} {...register(`effort.${i}.amount`, validation.amount)}></Input>
											<Text fontSize="sm" color="red.500">
												{errors.effort?.[i]?.amount && errors.effort[i].amount.message}
											</Text>
										</FormControl>
									</div>
								))}
							</HStack>*/}

							<HStack w="100%">
								<FormLabel>Tags</FormLabel>
								{tagFields.map((item, i) => (
									<div key={i}>
										<HStack>
											<FormControl>
												<Input size="md" {...register(`tags.${i}`)}></Input>
											</FormControl>{' '}
											<Button onClick={() => removeTag(i)}>-</Button>
										</HStack>
									</div>
								))}
								<Button onClick={() => appendTag('')}>+</Button>
							</HStack>

							<HStack w="100%">
								<FormLabel>Control</FormLabel>
								{controlFields.map((item, i) => (
									<div key={i}>
										<HStack>
											<FormControl>
												<Input size="md" {...register(`control.${i}`)}></Input>
											</FormControl>
											<Button onClick={() => removeControl(i)}>-</Button>
										</HStack>
									</div>
								))}
								<Button onClick={() => appendControl('')}>+</Button>
							</HStack>
							<Box w="100%">
								<div style={{ margin: 10 }}>
									<label style={{ margin: 10 }}>Character Image:</label>
									<Input type="file" onChange={(e) => handleFileUpload(e)} />
								</div>
								<div> {renderImage()}</div>
							</Box>
						</VStack>
					</Flex>

					<ButtonGroup>
						<Button type="submit" color="green" className="btn btn-primary mr-1">
							Create new Character
						</Button>
						<Button onClick={() => reset()} className="btn btn-secondary mr-1">
							Reset Form
						</Button>
					</ButtonGroup>
			</form>
		</CandiModal>
	);
};

export default NewCharacter;
