import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Modal, ModalHeader, ModalContent, ModalBody, ButtonGroup, Button, ModalFooter, Spacer, Switch, Grid } from '@chakra-ui/react';
import { useForm, useFieldArray, useController } from 'react-hook-form';

import { CloseIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { CandiModal } from './CandiModal';
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import { CandiDrawer } from '../Common/Drawer';

const AssetForm = (props) => {
  const { asset, character, mode } = props;
	const loggedInUser = useSelector((state) => state.auth.user);

	const [imageURL, setImageURL] = useState('');
	const [type, setType] = useState(asset ? asset.type : 'Asset');
	const [status, setStatus] = useState((asset && asset.status) ? asset.status : []);

	const { register, control, handleSubmit, reset, formState, watch } = useForm(
		{
			defaultValues: asset
		},
		[props]
	);

	useEffect(() => {
		reset(asset);
	}, [asset]);


	useEffect(() => {
		const subscription = watch();
		return () => subscription.unsubscribe;
	}, [watch]);

	const handleExit = () => {
		props.closeModal();
	};

	const handleStatus = (stuff) => {
    const stat = stuff.target.id;

    if (status.some(el => el === stat)) {
      let temp = status.filter(el0 => el0 !== stat);
  		setStatus(temp)    
    }
    else setStatus([...status, stat])
	};

	function onSubmit(data, e) {
    if (props.handleSubmit) {
      props.handleSubmit(data)
    }
    else {
      e.preventDefault();
      const asset = { ...data, "type": type, "status": status, ownerCharacter: props.character._id }
      console.log('SENDING DATA', asset);
      // socket.emit('request', {
      //   route: 'asset',
      //   action: mode,
      //   data: { asset, imageURL, loggedInUser }
      // });      
    }
		props.closeModal();
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	return (
    <CandiDrawer>
      <form onSubmit={handleSubmit(onSubmit, handleError)}>
        <Box>
          <VStack spacing="24px" w="100%">
              <Flex >
              <Spacer />
              <FormControl>
                <FormLabel>Type </FormLabel>
                {/* <Input type="text" size="md" variant="outline" {...register('type', validation.type)}></Input> setValue('test', '')  */} 
                <SelectPicker label={'type'} data={[ { type: 'Active' }, { type: 'Resolution' }, { type: 'Down' } ]} onChange={(ddd) => setType(ddd) } value={type}/>
              </FormControl>
              <Spacer />
              </Flex>
          </VStack>
        </Box>
        
        <ButtonGroup>
          <Button type="submit" colorScheme="teal" disabled={type === ''} className="btn btn-primary mr-1">
            Create Asset
          </Button>
          <Button colorScheme={'yellow'} onClick={() => reset()} leftIcon={<RepeatClockIcon />} >
            Reset Form
          </Button>

        </ButtonGroup>
      </form>        
    </CandiDrawer>
 
	);
};

export default AssetForm;
