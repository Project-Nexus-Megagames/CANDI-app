import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Redux store provider
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { characterTagsAdded } from '../../redux/entities/gameConfig';
import socket from '../../socket';
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Checkbox, CheckboxGroup, Stack, Button, ButtonGroup } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, TriangleDownIcon } from '@chakra-ui/icons';

function GameConfigStepCharacterTag() {
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
      characterTags: [oldConfig.characterTags]
    }
  });
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'characterTags',
    control
  });

  const validation = {
    name: {
      required: 'name is required',
      maxLength: {
        value: 300,
        message: "That's way too long, try again"
      }
    }
  };

  useEffect(() => {
    const resetValues = [];
    oldConfig.characterTags?.forEach((tag) => {
      let value = {};

      value.name = tag.name;
      value.description = tag.description;
      value.color = tag.color;

      resetValues.push(value);
    });
    reset({
      characterTags: resetValues
    });
  }, [reset]);

  const handleError = (errors) => {
    console.log('ERROR', errors);
  };

  function hasDuplicates(a) {
    let resourceNames = [];
    for (const el of a) resourceNames.push(el.name);
    const noDups = new Set(resourceNames);
    return resourceNames.length !== noDups.size;
  }

  function onSubmit(data) {
    if (hasDuplicates(data.characterTags)) return alert('Resource Types have to be unique');
    dispatch(characterTagsAdded(data));

    let configToBeSent = { ...oldConfig };
    configToBeSent.characterTags = data.characterTags;
    console.log('DATA', configToBeSent);
    try {
      socket.emit('request', {
        route: 'gameConfig',
        action: 'create',
        data: configToBeSent
      });
    } catch (err) {
      console.log('catch block called', err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <h4>Step 7: Create Character Tags</h4>
      <Flex padding='20px'>
        <VStack spacing='24px' align='left'>
          {fields.map((item, i) => (
            <div key={i} className='list-group list-group-flush'>
              <div className='list-group-item'>
                <HStack spacing='24px'>

                  <FormControl variant='floating'>
                    <FormLabel>Name of Tag</FormLabel>
                    <Input
                      key={item.id}
                      type='text'
                      size='md'
                      variant='outline'
                      defaultValue={oldConfig.characterTags?.[i]?.name}
                      {...register(`characterTags.${i}.name`, validation.name)}
                    />
                    <Text fontSize='sm' color='red.500'>
                      {errors.characterTags?.[i]?.name && errors.characterTags[i].name.message}
                    </Text>
                  </FormControl>

                  <FormControl variant='floating'>
                    <FormLabel>Descrption of Tag</FormLabel>
                    <Input
                      key={item.id}
                      type='text'
                      size='md'
                      variant='outline'
                      defaultValue={oldConfig.characterTags?.[i]?.description}
                      {...register(`characterTags.${i}.description`, validation.description)}
                    />
                    <Text fontSize='sm' color='red.500'>
                      {errors.characterTags?.[i]?.description && errors.characterTags[i].description.message}
                    </Text>
                  </FormControl>

                  <FormControl variant='floating'>
                    <FormLabel>Color of Tag (hex code)</FormLabel>
                    <Input
                      borderColor={item.color}
                      key={item.id}
                      type='text'
                      size='md'
                      variant='outline'
                      defaultValue={oldConfig.characterTags?.[i]?.color}
                      {...register(`characterTags.${i}.color`, validation.color)}
                    />
                    <Text fontSize='sm' color='red.500'>
                      {errors.characterTags?.[i]?.color && errors.characterTags[i].color.message}
                    </Text>
                  </FormControl>

                  <FormControl variant='floating'>
                    <FormLabel>Text color of Tag (hex code)</FormLabel>
                    <Input
                      borderColor={item.textColor}
                      key={item.id}
                      type='text'
                      size='md'
                      variant='outline'
                      defaultValue={oldConfig.characterTags?.[i]?.textColor}
                      {...register(`characterTags.${i}.textColor`, validation.textColor)}
                    />
                    <Text fontSize='sm' color='red.500'>
                      {errors.characterTags?.[i]?.textColor && errors.characterTags[i].textColor.message}
                    </Text>
                  </FormControl>

                  <Button size='xs' onClick={() => remove(i)}>
                    -
                  </Button>

                </HStack>
              </div>
            </div>
          ))}
          <ButtonGroup>
            <Button disabled={!isDirty} rightIcon={<TriangleDownIcon />} colorScheme={'blue'} type='submit' className='btn btn-primary mr-1'>
              Save
            </Button>

            <Button
              rightIcon={<PlusSquareIcon />}
              colorScheme={'whatsapp'}
              onClick={() =>
                append({
                  name: 'tag_name',
                  description: 'tag_description',
                  color: '#00a0bd',
                  textColor: '#000000'
                })
              }
            >
              Add Resource
            </Button>

            <Button disabled={!isDirty} rightIcon={<RepeatClockIcon />} colorScheme={'yellow'} onClick={() => reset()} type='button' className='btn btn-secondary mr-1'>
              Reset
            </Button>
          </ButtonGroup>
        </VStack>
      </Flex>
    </form>
  );
}

export default GameConfigStepCharacterTag;
