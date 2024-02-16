import React, { useState, useEffect } from 'react';
import { VStack, FormControl, Box, FormLabel, Input, Text, ButtonGroup, Button, CloseButton, Flex, IconButton, InputGroup } from '@chakra-ui/react';

import CharacterTag from '../../Common/CharacterTag';
import { useSelector } from 'react-redux';
import InputNumber from '../../Common/InputNumber';
import SelectPicker from '../../Common/SelectPicker';
import { PlusSquareIcon } from '@chakra-ui/icons';
import socket from '../../../socket';
import { Random } from '@rsuite/icons';

const ResourceEffect = ({ characters, action, myChar, loggedInUser }) => {

  const [resource, setResource] = useState([]);
  const [random, setRandom] = React.useState(0);
  const [add, setAdd] = React.useState(-1);
  const gameConfig = useSelector(s => s.gameConfig);

  useEffect(() => {
    let temp = []
    for (let char of characters) {
      temp.push([])
    }
    setResource(temp)
  }, []);


  const editState = (incoming, type, index, subIndex) => {
    console.log(incoming, type, index, subIndex)
    let temp;
    let array = [...resource];
    let subArray = array[index];
    switch (type) {
      case 'add':
        subArray.push({ type: incoming, amount: 0 })
        array[index] = subArray;
        setResource(array);
        setAdd(-1)
        break;
      case 'increase':
      case 'type':
        temp = subArray[subIndex];
        type === "type" ?
          temp.type = incoming :
          temp.amount = parseInt(incoming);

        subArray[subIndex] = temp;
        array[index] = subArray;

        setResource(array);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }


  function onSubmit() {
    const data = {
      type: 'resource',
      action,
      document: resource.filter(r => r.length > 0).map((r, index) => { return { id: characters[index].account, array: r } }),
      effector: myChar._id,
      loggedInUser
    };
    socket.emit('request', {
      route: 'action',
      action: 'effect',
      data: data,
    });
    // props.closeModal();
  }

  const randomizeIt = () => {
    const validResource = gameConfig.resourceTypes.filter(el => el.tradable)
    let array = []
    for (const char of characters) {
      let total = random;
      let subArray = []
      while (total > 0) {
        let resource = validResource[Math.floor(Math.random() * validResource.length)];
        let index = subArray.findIndex(el => el.type === resource.type);
        index == -1 ? subArray.push({ type: resource.type, amount: 1 }) : subArray[index].amount++;
        total--;
      }
      array.push(subArray)
    }
    setResource(array)
  }

  return (
    <Box >
      <InputGroup>
        <InputNumber
          onChange={(incoming) => setRandom(incoming)}
          defaultValue={random}
        />
        <IconButton onClick={randomizeIt} icon={<Random />} />
      </InputGroup>
      {characters.map((char, index) => (
        <Box key={char._id} >
          <CharacterTag character={char} />
          {resource[index]?.length}
          {resource[index]?.map((res, subIndex) => (
            <Flex key={subIndex}>
              <SelectPicker
                value={res.type}
                valueKey={'type'}
                label={'type'}
                data={gameConfig.resourceTypes.filter(el => !resource[index].some(r => r.type === el.type))}
                onChange={(incoming) => editState(incoming, 'type', index, subIndex)}
              />
              <InputNumber
                onChange={(incoming) => editState(incoming, 'increase', index, subIndex)}
                defaultValue={res.amount}
              ></InputNumber>
            </Flex>
          ))}
          {<IconButton
            icon={<PlusSquareIcon />}
            variant={'solid'}
            colorScheme='green'
            isDisabled={resource[index]?.length == gameConfig.resourceTypes.length || add >= 0}
            onClick={() => setAdd(index)} >

          </IconButton>}
          {add === index &&
            <SelectPicker
              valueKey={'type'}
              label={'type'}
              data={gameConfig.resourceTypes.filter(el => !resource[index]?.some(r => r.type === el.type))}
              onChange={(ddd) => editState(ddd, 'add', index)}
            />}
        </Box>
      ))}
      <Button onClick={onSubmit} >Submit</Button>
    </Box>
  );
};

export default ResourceEffect;
