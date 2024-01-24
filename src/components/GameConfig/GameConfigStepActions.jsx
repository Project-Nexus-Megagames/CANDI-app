import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { actionTypesAdded } from '../../redux/entities/gameConfig';
import socket from '../../socket';
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Checkbox, CheckboxGroup, Stack, Button, ButtonGroup, Center } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, TriangleDownIcon } from '@chakra-ui/icons';

function GameConfigStepActions() {
  const oldConfig = useSelector((state) => state.gameConfig);
  const dispatch = useDispatch();

  const {
    formState: { isDirty, dirtyFields },
    register,
    control,
    handleSubmit,
    reset,
    formState
  } = useForm({
    defaultValues: {
      actionTypes: [oldConfig.actionTypes]
    }
  });
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'actionTypes',
    control
  });

  const validation = {
    type: {
      required: 'Type is required',
      maxLength: {
        value: 300,
        message: "That's way too long, try again"
      }
    },
    min: {
      required: 'Min Effort is required',
      min: { value: 0, message: 'Must be 0 or larger' }
    },
    max: {
      required: 'Max Effort is required',
      min: { value: 0, message: 'Must be 0 or larger' }
    },
    maxAssets: {
      required: 'Max Assets is required',
      min: { value: 0, message: 'Must be 0 or larger' }
    }
  };

  useEffect(() => {
    const resetValues = [];
    oldConfig.actionTypes.forEach((type) => {
      let value = {};
      value.type = type.type;
      value.effortAmount = type.effortAmount;
      value.maxAssets = type.maxAssets;
      value.resourceTypes = type.resourceTypes;
      value.assetTypes = type.assetTypes;
      value.min = type.min;
      value.max = type.max;
      value.public = type.public;
      resetValues.push(value);
    });
    reset({
      actionTypes: resetValues
    });
  }, [reset]);

  const handleError = (errors) => {
    console.log('ERROR', errors);
  };

  function hasDuplicates(a) {
    let actionNames = [];
    for (const el of a) actionNames.push(el.type);
    const noDups = new Set(actionNames);
    return actionNames.length !== noDups.size;
  }

  function onSubmit(data) {
    if (hasDuplicates(data.actionTypes)) return alert('Action Types have to be unique');
    dispatch(actionTypesAdded(data));
    //reset({keepValues: true});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <h4>Step 3: Create Action Types</h4>
      <Flex padding='20px'>
        <VStack spacing='24px' align='left'>
          {fields.map((item, i) => (
            <div key={item.id} className='list-group list-group-flush'>
              <div className='list-group-item'>
                <div>
                  <Box>
                    <HStack spacing='24px'>
                      <FormControl variant='floating'>
                        <FormLabel>Type of Action</FormLabel>
                        <Input
                          key={item.id}
                          type='text'
                          size='md'
                          variant='outline'
                          defaultValue={oldConfig.actionTypes?.[i]?.type}
                          {...register(`actionTypes.${i}.type`, validation.type)}
                        />
                        <Text fontSize='sm' color='red.500'>
                          {errors.actionTypes?.[i]?.type && errors.actionTypes[i].type.message}
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Assets accepted</FormLabel>
                        <Controller
                          name={`actionTypes.${i}.assetTypes`}
                          control={control}
                          render={({ field: { ref, ...rest } }) => (
                            <CheckboxGroup key={item.id} defaultValue={oldConfig.actionTypes?.[i]?.assetTypes} {...rest}>
                              <Stack spacing={[1]} direction={['column']}>
                                {oldConfig?.assetTypes.map((item) => (
                                  <Checkbox value={item.type} key={item.id}>
                                    {item.type}
                                  </Checkbox>
                                ))}
                              </Stack>
                            </CheckboxGroup>
                          )}
                        />
                      </FormControl>
                      <FormControl variant='floating'>
                        <FormLabel>Max Assets</FormLabel>
                        <Input
                          key={item.id}
                          type='number'
                          size='md'
                          variant='outline'
                          defaultValue={oldConfig.actionTypes?.[i]?.maxAssets}
                          {...register(`actionTypes.${i}.maxAssets`, validation.maxAssets)}
                        />
                        <Text fontSize='sm' color='red.500'>
                          {errors.actionTypes?.[i]?.maxAssets && errors.actionTypes[i].maxAssets.message}
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Types of Effort</FormLabel>
                        <Controller
                          name={`actionTypes.${i}.resourceTypes`}
                          control={control}
                          render={({ field: { ref, ...rest } }) => (
                            <CheckboxGroup key={item.id} defaultValue={oldConfig.actionTypes?.[i]?.resourceTypes} {...rest}>
                              <Stack spacing={[1]} direction={['column']}>
                                {oldConfig.resourceTypes.map((item) => (
                                  <Center key={item.id}>

                                    <Checkbox value={item.type} >
                                      {item.type}
                                    </Checkbox>

                                    <FormControl variant='floating'>
                                      <FormLabel>Min Effort</FormLabel>
                                      <Input
                                        key={item.id}
                                        type='number'
                                        size='md'
                                        variant='outline'
                                        defaultValue={item?.min}
                                        {...register(`actionTypes.${i}.min`, validation.min)}
                                      />
                                      <Text fontSize='sm' color='red.500'>
                                        {errors.actionTypes?.[i]?.min && errors.actionTypes[i].min.message}
                                      </Text>
                                    </FormControl>

                                    <FormControl variant='floating'>
                                      <FormLabel>Max Effort</FormLabel>
                                      <Input
                                        key={item.id}
                                        type='number'
                                        size='md'
                                        variant='outline'
                                        defaultValue={item?.max}
                                        {...register(`actionTypes.${i}.max`, validation.max)}
                                      />
                                      <Text fontSize='sm' color='red.500'>
                                        {errors.actionTypes?.[i]?.max && errors.actionTypes[i].max.message}
                                      </Text>
                                    </FormControl>
                                  </Center>


                                ))}
                              </Stack>
                            </CheckboxGroup>
                          )}
                        />
                      </FormControl>

                      <FormControl variant='floating'>
                        <Checkbox key={item.id} type='text' size='md' defaultValue={oldConfig.actionTypes?.[i]?.public} {...register(`actionTypes.${i}.public`)}>
                          Public Action
                        </Checkbox>
                      </FormControl>
                      <Button size='xs' onClick={() => remove(i)}>
                        -
                      </Button>
                    </HStack>
                  </Box>
                </div>
              </div>
            </div>
          ))}

          <Stack spacing={8} direction='row' align='right' justify={"center"}>
            <Button disabled={!isDirty} rightIcon={<TriangleDownIcon />} colorScheme={'blue'} type="submit" className="btn btn-primary mr-1">
              Save
            </Button>
            <Button
              rightIcon={<PlusSquareIcon />}
              colorScheme={'whatsapp'}
              onClick={() => append({ type: 'Effot_Type', effortAmount: 0 })} >
              Add Type
            </Button>
            <Button disabled={!isDirty} rightIcon={<RepeatClockIcon />} colorScheme={'yellow'} onClick={() => reset()} type="button" className="btn btn-secondary mr-1">
              Reset
            </Button>
          </Stack>

        </VStack>
      </Flex>
    </form>
  );
}

export default GameConfigStepActions;
