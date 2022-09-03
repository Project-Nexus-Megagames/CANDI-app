import React, { useRef, useState } from 'react';
import { Input, FormControl, FormLabel, InputGroup, InputLeftElement, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useController } from 'react-hook-form';
import { Icon } from 'rsuite';
import { cloudinaryUploadLarge, cloudinaryUpload, cloudinaryUploadSmall, cloudinaryUploadMedium } from '../../services/uploads';

export const FileUpload = ({ name, placeholder, acceptedFileTypes, control, children, size, isRequired = false }) => {
	const [imgName, setImgName] = useState();
	const inputRef = useRef();
	const toast = useToast();
	const {
		field: { ref, onChange, setValue, value, ...inputProps },
		fieldState: { isTouched, isDirty }
	} = useController({
		name,
		control,
		rules: { required: isRequired }
	});

	console.log('SIZE', size);

	const handleFileUpload = async (e) => {
		toast({
			description: 'Uploading...',
			status: 'info',
			duration: 9000
		});
		const uploadData = new FormData();
		uploadData.append('file', e.target.files[0], 'file');
		if (size === 'large') {
			try {
				const img = await cloudinaryUploadLarge(uploadData);
				onChange(img.secure_url);
				setImgName(e.target.files[0].name);
				toast({
					description: 'Upload complete!',
					status: 'success',
					duration: 9000
				});
			} catch (err) {
				toast({
					description: `${err.message}`,
					status: 'error',
					duration: 9000
				});
			}
		} else if (size === 'medium') {
			try {
				const img = await cloudinaryUploadMedium(uploadData);
				onChange(img.secure_url);
				setImgName(e.target.files[0].name);
				toast({
					description: 'Upload complete!',
					status: 'success',
					duration: 9000
				});
			} catch (err) {
				toast({
					description: `${err.message}`,
					status: 'error',
					duration: 9000
				});
			}
		} else if (size === 'small') {
			try {
				const img = await cloudinaryUploadSmall(uploadData);
				onChange(img.secure_url);
				setImgName(e.target.files[0].name);
				toast({
					description: 'Upload complete!',
					status: 'success',
					duration: 9000
				});
			} catch (err) {
				toast({
					description: `${err.message}`,
					status: 'error',
					duration: 9000
				});
			}
		} else {
			try {
				const img = await cloudinaryUpload(uploadData);
				onChange(img.secure_url);
				setImgName(e.target.files[0].name);
				toast({
					description: 'Upload complete!',
					status: 'success',
					duration: 9000
				});
			} catch (err) {
				toast({
					description: `${err.message}`,
					status: 'error',
					duration: 9000
				});
			}
		}
	};

	return (
		<FormControl isRequired>
			<FormLabel htmlFor="writeUpFile">{children}</FormLabel>
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<Icon icon="file" />
				</InputLeftElement>
				<input type="file" onChange={(e) => handleFileUpload(e)} accept={acceptedFileTypes} name={name} ref={inputRef} {...inputProps} style={{ display: 'none' }} />
				<Input placeholder={placeholder || 'Your file ...'} onClick={() => inputRef.current.click()} onChange={(e) => handleFileUpload(e)} readOnly={true} value={(value && imgName) || ''} />
			</InputGroup>
		</FormControl>
	);
};

FileUpload.defaultProps = {
	acceptedFileTypes: '',
	allowMultipleFiles: false
};

export default FileUpload;
