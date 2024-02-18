import React, { useState, useEffect } from 'react';
import { VStack, FormControl, Box, FormLabel, Input, Text, ButtonGroup, Button, CloseButton, NumberInput } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { RepeatClockIcon } from '@chakra-ui/icons';
import socket from '../../socket';
import InputNumber from '../Common/InputNumber';

const LocationForm = (props) => {
  const { location, mode, coords, action, character } = props;

  const [status, setStatus] = useState(location && location.status ? location.status : []);
  const [xCoords, setXCoords] = useState(location && location.coords ? location.coords.x : coords ? coords.x : 0);
  const [yCoords, setYCoords] = useState(location && location.coords ? location.coords.y : coords ? coords.y : 0);

  const { register, handleSubmit, reset, formState, watch } = useForm(
    {
      defaultValues: location
    },
    [props]
  );

  const validation = {
    name: {
      required: 'Name is required',
      maxLength: {
        value: 300,
        message: "That's way too long, try again"
      }
    },
    description: {
      maxLength: {
        value: 3000,
        message: "That's way too long, try again"
      }
    }
  };

  const { errors } = formState;


  useEffect(() => {
    const subscription = watch();
    return () => subscription.unsubscribe;
  }, [watch]);


  function onSubmit(data, e) {
    if (props.handleSubmit) {
      props.handleSubmit({ ...data, status: status, });
    } else {
      e.preventDefault();
      const location = { ...data, coords: { x: xCoords, y: yCoords, z: 2 }, action, effector: character._id };
      console.log('SENDING DATA', location);
      socket.emit('request', {
        route: 'location',
        action: mode,
        data: location,
      });
    }
    // props.closeModal();
  }

  const handleError = (errors) => {
    console.log('ERROR', errors);
  };


  //const assetTypes = [ { name: 'Asset'}, { name: 'Trait' }, { name: 'Power' } ];

  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <Box>
        <VStack spacing='24px' w='100%'>

          <FormLabel>X</FormLabel>
          <InputNumber defaultValue={xCoords} onChange={(thing) => setXCoords(thing)} />


          <FormLabel>Y</FormLabel>
          <InputNumber defaultValue={yCoords} onChange={(thing) => setYCoords(thing)} />

          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type='text' size='md' variant='outline' {...register('name', validation.name)}></Input>
            <Text fontSize='sm' color='red.500'>
              {errors.name && errors.name.message}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input type='text' size='md' variant='outline' {...register('description', validation.description)}></Input>
            <Text fontSize='sm' color='red.500'>
              {errors.description && errors.description.message}
            </Text>
          </FormControl>

          {/* <Flex>
						<Spacer />
						<FormControl>
							<FormLabel>Owner </FormLabel>
              {<SelectPicker onChange={setOwner} data={accounts} label='name' />}
						</FormControl>
						<Spacer />
            <FormControl>
							<FormLabel>Location </FormLabel>
              {<SelectPicker onChange={setLocation} data={locations} label='name' />}
						</FormControl>
					</Flex> */}


        </VStack>
      </Box>

      <ButtonGroup>
        <Button type='submit' variant={'solid'} colorScheme='teal' className='btn btn-primary mr-1'>
          {location ? "Edit" : "Create"} Location
        </Button>
        <Button variant={'solid'} colorScheme={'yellow'} onClick={() => reset()} leftIcon={<RepeatClockIcon />}>
          Reset Form
        </Button>
        <Button variant={'solid'} colorScheme={'red'} onClick={() => props.closeModal()} leftIcon={<CloseButton />}>
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default LocationForm;
