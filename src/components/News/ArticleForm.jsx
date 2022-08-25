import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, FormErrorMessage, Input, Stack, HStack, Textarea, Flex, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { Icon, Tag } from 'rsuite';
import ErrorTag from '../Common/FormError';
import FileUpload from '../Common/FileUpload';
import { useSelector } from 'react-redux';
import { getMyCharacter } from '../../redux/entities/characters';
import socket from '../../socket';

export const ArticleForm = ({ onSubmit, onCancel, article }) => {
	const myCharacter = useSelector(getMyCharacter);
	let defaultValues = {
		creator: myCharacter._id,
		title: '',
		body: '',
		image: ''
	};

	const {
		register,
		control,
		getValues,
		handleSubmit: formSubmit,
		formState: { errors, isValid, dirtyFields }
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
		defaultValues: !article
			? defaultValues
			: {
					creator: article.authorId,
					title: article.title,
					body: article.body,
					image: article.imageURL
			  },

		criteriaMode: 'firstError',
		shouldFocusError: true,
		shouldUnregister: false,
		delayError: undefined
	});

	const handleSubmit = (data, e) => {
		e.preventDefault();

		if (onSubmit instanceof Function) onSubmit(data);
		if (article) socket.emit('request', { route: 'article', action: 'edit', data: { article: data, id: article.articleId } });
		else socket.emit('request', { route: 'article', action: 'post', data });
		console.log(data);
	};

	const handleCancel = () => {
		if (onCancel instanceof Function) onCancel();
	};

	const renderImage = () => {
		return <img src={getValues('image')}></img>;
	};

	return (
		<form onSubmit={formSubmit(handleSubmit)}>
			<Stack>
				<FormControl isRequired isInvalid={errors.title}>
					<HStack>
						<FormLabel m={0} htmlFor="title">
							Title
						</FormLabel>
						{dirtyFields.title && <ErrorTag error={errors.title} />}
					</HStack>
					<Input
						id="title"
						placeholder="title"
						{...register('title', {
							required: 'Required',
							minLength: { value: 1, message: `Title must be over 1 character` },
							maxLength: { value: 100, message: 'Title cannot be over 100 characters' }
						})}
					/>
				</FormControl>
				<FormControl isRequired isInvalid={errors.body}>
					<HStack>
						<FormLabel m={0} htmlFor="body">
							Body
						</FormLabel>
						{dirtyFields.body && <ErrorTag error={errors.body} />}
					</HStack>
					<Textarea
						isRequired
						id="body"
						placeholder="Body"
						noOfLines={40}
						{...register('body', {
							required: 'Required',
							minLength: { value: 20, message: 'Body must be must be more then 20 characters' },
							maxLength: { value: 10000, message: 'Title cannot be over 3000 characters' }
						})}
					/>
				</FormControl>
				<Box w="100%">
					<FileUpload name="image" acceptedFileTypes="image/*" isRequired={false} placeholder="Article Image" control={control} size="large">
						Image
					</FileUpload>
					<div>{renderImage()}</div>
				</Box>
				<DevTool control={control} placement="bottom-right" />
				<HStack justifyContent="end">
					<Button type="submit" colorScheme="green" disabled={!isValid}>{`Submit`}</Button>
					<Button colorScheme="red" onClick={() => handleCancel()}>{`Cancel`}</Button>
				</HStack>
			</Stack>
		</form>
	);
};
