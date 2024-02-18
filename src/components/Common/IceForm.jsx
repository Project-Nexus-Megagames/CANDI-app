import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { VStack, Flex, FormControl, Box, FormLabel, Input, Text, ButtonGroup, Button, Spacer, InputGroup, IconButton, CloseButton, Switch, Tag, TagCloseButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { RepeatClockIcon } from '@chakra-ui/icons';
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import InputNumber from './InputNumber';
import { Plus } from '@rsuite/icons';
import axios from 'axios';
import { gameServer } from '../../config';
import { getIce } from '../../redux/entities/blueprints';
import { cloudinaryUploadMedium } from '../../services/uploads';
import CheckerPick from './CheckerPick';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const IceForm = (props) => {
  const { ice, action } = props;
  const loggedInUser = useSelector((state) => state.auth.user);
  const iceBlueprints = useSelector(getIce);
  const gameConfig = useSelector((state) => state.gameConfig);
  const characters = props.characters || useSelector((state) => state.characters.list);

  const [imageUrl, setImageURL] = useState(ice?.imageUrl || '');
  const [template, setTemplate] = useState(false);
  const [createBlue, setCreateBlue] = useState(false);
  const [add, setAdd] = useState(-1);
  const [name, setName] = useState(ice?.name || 'Ice_Name');
  const [code, setCode] = useState(ice?.code || 'Ice_code');
  const [description, setDescription] = useState(ice?.description || 'Ice_description');

  const launderOptions = (options) => {
    if (options)
      return options.map(op => {
        let newObj = {
          description: op.description,
          challengeCost: { ...op.challengeCost },
          consequence: op.consequence,
        }
        return newObj;
      })
  }

  const [options, setOptions] = React.useState(launderOptions(ice?.options) || []);

  let ConsequenceSchema = {
    allowed: ['asset'],
    value: 0
  };

  const OptionSchema = {
    opType: 'gCheck',
    successText: "You did it!",
    failText: "You didn't it!",
    description: "",
    challengeCost: ConsequenceSchema, // what it values to pass this option
    consequence: [] // what it values when you fail this option
  };

  useEffect(() => {
    if (template) {
      const blue = iceBlueprints.find(el => el._id === template)

      let ops = launderOptions(blue.options);

      setOptions(ops);
      setDescription(blue?.description);
      setName(blue.name);
      setCode(blue.code);
      setImageURL(blue.imageUrl);
    }
  }, [template]);

  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append('file', e.target.files[0], 'file');
    const img = await cloudinaryUploadMedium(uploadData);

    console.log(img)
    setImageURL(img.secure_url);
  };

  const disabledConditions = [
    {
      text: "Provide a name",
      disabled: !name
    },
  ];
  const isDisabled = disabledConditions.some(el => el.disabled);

  const removeElement = (index, type) => {
    let temp;
    switch (type) {
      case 'options':
        temp = [...options];
        temp.splice(index, 1)
        setOptions(temp);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')

    }
  }

  async function onSubmit(data) {
    if (props.handleSubmit) {
      props.handleSubmit({ ...data, options, name, description, code, imageUrl, id: ice._id, action: action._id, });
    } else {
      const ice = { ...data, options, name, description, code, imageUrl, action: action._id, createBlue };
      const response = await axios.post(`${gameServer}api/ice/createIce`, { ice })
      console.log(response)
      // socket.emit('request', {
      // 	route: 'blueprint',
      // 	action: mode,
      // 	data: { asset, imageUrl, loggedInUser }
      // });
    }
    // props.closeModal();
  }

  const renderImage = () => {
    if (!imageUrl) return <img src={ice?.imageUrl}></img>;
    return <img src={imageUrl}></img>;
  };

  const editState = (incoming, type, index, subIndex) => {
    console.log(incoming, type, index, subIndex)
    let thing;
    let temp;
    switch (type) {
      case 'code':
        setCode(incoming)
        break;
      case 'name':
        setName(incoming)
        break;
      case 'description':
        setDescription(incoming)
        break;
      case 'optionChallengeType':
      case 'optionChallengeValue':
        thing = options[index];
        temp = [...options]
        if (typeof (incoming) === 'number') thing.challengeCost.value = parseInt(incoming)
        else {
          // TODO: UPDATE FORM TO ALLOW ARRAY OF ALLOWED
          thing.challengeCost.allowed = incoming;
        }

        temp[index] = thing;
        setOptions(temp);
        break;
      case 'optionDescription':
        thing = options[index];
        thing.description = incoming
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }

  return (
    <form style={{ width: '90%' }} >
      <Box>
        <VStack spacing='24px' w='100%'>
          <Flex>
            <Spacer />

            <Spacer />
          </Flex>
          {ice?.imageUrl}
          <Box>
            <p>Blueprint:</p>
            <SelectPicker
              label='name'
              valueKey='_id'
              data={iceBlueprints}
              onChange={(event) => { setTemplate(event) }}
            />
          </Box>



          <FormControl>
            <FormLabel>Name </FormLabel>
            <Input onChange={(event) => { editState(event.target.value, 'name'); }} value={name} type='text' size='md' variant='outline'></Input>

            <Text fontSize='sm' color='red.500'>
            </Text>

          </FormControl>

          <FormControl>
            <FormLabel>Code </FormLabel>
            <Switch onChange={() => setCreateBlue(!createBlue)} isChecked={createBlue} />
            <Input onChange={(event) => { editState(event.target.value, 'code'); }} value={code} type='text' size='md' variant='outline'></Input>

            <Text fontSize='sm' color='red.500'>
            </Text>

          </FormControl>

          <FormControl>
            <FormLabel>Ice Description </FormLabel>
            <Input
              onChange={(event) => { editState(event.target.value, 'description'); }}
              value={description}
              type='text'
              size='md'
              variant='outline'></Input>

            <Text fontSize='sm' color='red.500'>
            </Text>
          </FormControl>

          <Box w="100%">
            <div style={{ margin: 10 }}>
              <label style={{ margin: 10 }}>Ice Image:</label>
              <Input type="file" onChange={(e) => handleFileUpload(e)} />
            </div>
            <div> {renderImage()}</div>
          </Box>

          <FormControl>
            <FormLabel>Options! </FormLabel>
            {options.map((option, index) => (
              <Box style={{ border: '3px solid black' }} key={option.description} index={index}>
                <IconButton variant={'outline'} onClick={() => removeElement(index, 'options')} colorScheme='red' size="sm" icon={<CloseButton />} />
                <FormLabel>Description</FormLabel>
                <Input
                  onChange={(event) => { editState(event.target.value, 'optionDescription', index); }}
                  type='text'
                  size='md'
                  defaultValue={option.description}
                  variant='outline'></Input>

                <FormLabel>Challenge</FormLabel>
                <InputGroup  >
                  {/* <SelectPicker label='type' valueKey='type' data={gameConfig.assetTypes} onChange={(event) => { editState(event, 'optionChallengeType', index); }} /> */}
                  {option.challengeCost.allowed.map(tag => (
                    <Tag margin={'3px'} key={tag} textTransform='capitalize' backgroundColor={getFadedColor(tag)} color={getTextColor(tag)} variant={'solid'}>
                      {tag}
                      {<TagCloseButton onClick={() => { editState(option.challengeCost.allowed.filter(el => el !== tag), 'optionChallengeType', index); }} />}
                    </Tag>
                  ))}
                  {add == index && <SelectPicker
                    label='type'
                    valueKey='type'
                    data={gameConfig.assetTypes.filter(el => !option.challengeCost.allowed.some(t => el.type.toLowerCase() === t.toLowerCase()))}
                    onChange={(tag) => { editState([...option.challengeCost.allowed, tag], 'optionChallengeType', index); setAdd(-1) }}
                  />}
                  {add < 0 && <IconButton
                    onClick={() => { setAdd(index) }}
                    variant="solid"
                    colorScheme='green'
                    size="sm"
                    icon={<Plus />}
                  />}

                  <InputNumber prefix='value' style={{ width: 200 }} defaultValue={option.challengeCost.value.toString()} value={option.challengeCost.value} min={0} onChange={(event) => editState(parseInt(event), 'optionChallengeValue', index)}></InputNumber>

                </InputGroup>

                {/* <FormLabel>Consequences</FormLabel>
                {option.consequence.map((consequence, conIndex) => (
                  <InputGroup key={consequence._id} index={conIndex}>
                    <SelectPicker
                      label='type'
                      valueKey='type'
                      data={consequenceTypes}
                      value={consequence.type}
                      onChange={(event) => { editState(event, 'consequenceType', conIndex); }}
                    />
                    <InputNumber
                      prefix='value'
                      style={{ width: 200 }}
                      defaultValue={consequence.value.toString()}
                      value={consequence.value}
                      min={0}
                      onChange={(event) => editState(parseInt(event), 'consequence', conIndex)}
                    />
                    <IconButton
                      variant={'outline'}
                      onClick={() => removeElement(conIndex, 'consequence')}
                      colorScheme='red'
                      size="sm"
                      icon={<CloseButton />}
                    />
                  </InputGroup>
                ))} */}


              </Box>
            ))}
            <IconButton variant={'solid'} onClick={() => setOptions([...options, OptionSchema])} colorScheme='green' size="sm" icon={<Plus />} />
          </FormControl>

        </VStack>
      </Box>

      <VStack>
        {disabledConditions.filter(el => el.disabled).map((opt, index) =>
          <Text color='red' key={index}>{opt.text}</Text>
        )}
      </VStack>

      <ButtonGroup>
        <Button variant={'solid'} onClick={() => onSubmit()} colorScheme='teal' isDisabled={isDisabled} className='btn btn-primary mr-1'>
          Submit
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default IceForm;
