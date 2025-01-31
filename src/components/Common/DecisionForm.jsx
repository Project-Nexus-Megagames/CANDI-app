import React, { useEffect, useRef } from 'react'
import { Button, ButtonGroup, CloseButton, Divider, Flex, IconButton, Input, InputGroup, Spacer, Stack, Text } from '@chakra-ui/react'
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import { useSelector } from 'react-redux';
import { Close, Plus } from '@rsuite/icons';
import InputNumber from './InputNumber';
import NexusTag from './NexusTag';
import { getFadedColor } from '../../scripts/frontend';

const DecisionForm = (props) => {
  const [name, setName] = React.useState(props.decision?.name || '');
  const [description, setDescription] = React.useState(props.decision?.description || '');
  const [code, setCode] = React.useState(props.decision?.code || '');
  const deepCloneOptions = (options) => options.map(option => JSON.parse(JSON.stringify(option)));

  const [options, setOptions] = React.useState(
    props.decision?.options ? deepCloneOptions(props.decision?.options) :
      [{ name: 'Option_0', acceptedAssets: [], acceptedResources: [], rewards: [], id: Date.now().toString(16) }]
  );

  const accounts = useSelector(s => s.accounts.list);
  const blueprints = useSelector(s => s.blueprints.list);
  const gameconfig = useSelector(s => s.gameConfig);

  const editState = (incoming, optionId, type) => {
    // console.log(incoming, optionId, type);
    // Update only the option being changed
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option) =>
        (option.id === optionId || option._id === optionId) ? { ...option, [type]: incoming } : option
      );
      return updatedOptions;
    });
  };

  const editSubArray = ({ incoming, optionId, arrayType, arrayIndex, changingField }) => {
    // console.log(incoming, optionId, arrayType, arrayIndex, changingField);
    let thingy = { ...options.find(el => el.id === optionId || el._id === optionId) }
    let arrayObject = thingy[arrayType][arrayIndex];
    changingField ? arrayObject[changingField] = incoming : arrayObject = incoming;
    thingy[arrayType][arrayIndex] = arrayObject

    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option) =>
        (option.id === optionId || option._id === optionId) ? thingy : option
      );
      return updatedOptions;
    });
  }

  const removeElement = ({ optionId, subId, type }) => {
    //console.log(optionId, subId, type)
    switch (type) {
      case 'option':
        setOptions((prevOptions) => prevOptions.filter((op) => op.id !== optionId && op._id !== optionId));
        break;
      default:
        let thingy = { ...options.find(el => el.id === optionId || el._id === optionId) }
        let arrayObject = thingy[type].filter(el => el.id !== subId && el !== subId);
        console.log(arrayObject)
        thingy[type] = arrayObject

        setOptions((prevOptions) => {
          const updatedOptions = prevOptions.map((option) =>
            (option.id === optionId || option._id === optionId) ? thingy : option
          );
          return updatedOptions;
        });
    }
  };

  const handleCreate = () => {
    if (props.handleCreate)
      props.handleCreate({
        id: props.action,
        decision: {
          name,
          description,
          code,
          options
        },
        decisionId: props.decision?._id
      });
    else
      socket.emit('request', {
        route: 'action',
        action: 'newDecision',
        data: {
          action: props.action,
          name,
          description,
          code,
          options
        },
      });
  };

  const disabledConditions = [
    {
      text: 'Name is too short',
      disabled: name.length < 3,
    },
    {
      text: 'Name is too long!',
      disabled: name.length >= 1000,
    },
  ];
  const isDisabled = disabledConditions.some((el) => el.disabled);

  return (
    <>
      <Input
        variant='flushed'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Divider />

      <Input
        variant='flushed'
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        variant='flushed'
        placeholder='code'
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Divider />

      {options.map((option, i) => (
        <div
          key={option.id} // Use option.id as key
          style={{
            textAlign: 'center',
            color: 'white',
            backgroundColor: getFadedColor('', 1 - i * 0.25),
          }}
        >
          <InputGroup alignItems={'center'}>
            <IconButton
              variant={'outline'}
              onClick={() => removeElement({ optionId: option.id || option._id, type: 'option' })}
              colorScheme='red'
              size='sm'
              icon={<CloseButton />}
            />
            <Input
              variant='outline'
              value={option.name}
              onChange={(e) => editState(e.target.value, option.id || option._id, 'name')}
            />
          </InputGroup>

          <br />
          acceptedAssets
          {option?.acceptedAssets.map((code, index) => (
            <InputGroup key={code} index={index}>
              <SelectPicker
                label='code'
                valueKey='code'
                data={blueprints}
                value={code}
                onChange={(event) => {
                  editSubArray({ arrayIndex: index, incoming: event, optionId: option.id || option._id, arrayType: 'acceptedAssets' })
                }}
              />
              {/* <Input
                variant='outline'
                value={asset}
                onChange={(e) => 
                  editSubArray({arrayIndex: index, incoming: e.target.value, optionId: option.id || option._id, arrayType: 'acceptedAssets'})
                }
              /> */}
              <IconButton
                variant={'outline'}
                onClick={() => removeElement({ optionId: option.id || option._id, subId: code, type: 'acceptedAssets' })}
                colorScheme='red'
                size='sm'
                icon={<CloseButton />}
              />
            </InputGroup>
          ))}
          <IconButton
            variant={'solid'}
            onClick={() => editState([...option.acceptedAssets, 'a_battleship'], option.id || option._id, 'acceptedAssets')}
            colorScheme='green'
            size='sm'
            icon={<Plus icon='plus' />}
          />
          <Divider />

          acceptedResources
          {option?.acceptedResources.map((accepted, index) => (
            <InputGroup key={accepted.id} index={index}>
              <SelectPicker
                label='type'
                valueKey='type'
                data={gameconfig.resourceTypes}
                value={accepted.type}
                onChange={(event) => {
                  editSubArray({ arrayIndex: index, incoming: event, optionId: option.id || option._id, arrayType: 'acceptedResources', changingField: 'type' })
                }}
              />
              <InputNumber
                prefix='amount'
                style={{ width: 200 }}
                defaultValue={accepted.amount}
                value={accepted.amount}
                min={0}
                onChange={(e) =>
                  editSubArray({ arrayIndex: index, incoming: parseInt(e), optionId: option.id || option._id, arrayType: 'acceptedResources', changingField: 'amount' })
                }
              ></InputNumber>
              <IconButton
                variant={'outline'}
                onClick={() => removeElement({ optionId: option.id || option._id, subId: accepted.id, type: 'acceptedResources' })}
                colorScheme='red'
                size='sm'
                icon={<CloseButton />}
              />
            </InputGroup>
          ))}
          <IconButton
            variant={'solid'}
            onClick={() => editState([...option.acceptedResources, { id: Date.now().toString(16), type: '', amount: 0 }], option.id || option._id, 'acceptedResources')}
            colorScheme='green'
            size='sm'
            icon={<Plus icon='plus' />}
          />

          <Divider />
          rewards
          {option?.rewards.map((reward, index) => (
            <InputGroup key={reward.id} index={index}>
              {/* <SelectPicker
                label='type'
                valueKey='type'
                data={gameconfig.resourceTypes}
                value={reward.type}
                onChange={(event) => {
                  editState(event, reward.id, 'rewards');
                }}
              /> */}
              <Input
                variant='outline'
                value={reward.type}
                onChange={(e) =>
                  editSubArray({ arrayIndex: index, incoming: e.target.value, optionId: option.id, arrayType: 'rewards', changingField: 'type' })
                }
              />
              <InputNumber
                prefix='value'
                style={{ width: 200 }}
                defaultValue={reward.value}
                value={reward.value}
                min={0}
                onChange={(e) =>
                  editSubArray({ arrayIndex: index, incoming: parseInt(e), optionId: option.id, arrayType: 'rewards', changingField: 'value' })
                }
              ></InputNumber>
              <IconButton
                variant={'outline'}
                onClick={() => removeElement({ optionId: option.id, subId: reward.id, type: 'rewards' })}
                colorScheme='red'
                size='sm'
                icon={<CloseButton />}
              />
            </InputGroup>
          ))}
          <IconButton
            variant={'solid'}
            onClick={() => editState([...option.rewards, { id: Date.now().toString(16), type: '', value: 0 }], option.id, 'rewards')}
            colorScheme='green'
            size='sm'
            icon={<Plus icon='plus' />}
          />
          <Divider />
        </div>
      ))}
      <IconButton
        variant={'solid'}
        onClick={() =>
          setOptions([
            ...options,
            {
              name: `Option_${options.length}`,
              acceptedAssets: [],
              acceptedResources: [],
              rewards: [],
              id: Date.now().toString(16),
            },
          ])
        }
        colorScheme='green'
        size='sm'
        icon={<Plus icon='plus' />}
      />

      <Stack>
        {disabledConditions
          .filter((el) => el.disabled)
          .map((opt, index) => (
            <Text color='red' key={index}>
              {opt.text}
            </Text>
          ))}
      </Stack>
      <ButtonGroup>
        <Button
          variant={'solid'}
          isDisabled={isDisabled}
          onClick={() => handleCreate()}
          colorScheme='green'
        >
          Submit
        </Button>
        <Button onClick={() => props.onClose()} colorScheme='red' variant='ghost'>
          Close
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DecisionForm;
