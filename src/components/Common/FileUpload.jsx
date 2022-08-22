import React, { useRef, useState } from 'react';
import { Input, FormControl, FormLabel, InputGroup, InputLeftElement, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useController } from 'react-hook-form';
import { Icon } from 'rsuite';
import cloudinaryUpload from '../../services/uploads';

export const FileUpload = ({ name, placeholder, acceptedFileTypes, control, children, isRequired = false }) => {
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

	const handleFileUpload = async (e) => {
		toast({
			description: 'Hello?',
			status: 'info',
			duration: 9000
		});
		const uploadData = new FormData();
		uploadData.append('file', e.target.files[0], 'file');
		// TODO: needs a switch to determine which cloudinaryUpload to call. And then feed small / medium / large into props of component
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
