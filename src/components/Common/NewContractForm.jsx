import React from 'react'
import { Button, ButtonGroup, CloseButton, Divider, Flex, IconButton, Input, InputGroup, Spacer, Stack, Text } from '@chakra-ui/react'
import SelectPicker from './SelectPicker';
import socket from '../../socket';
import { useSelector } from 'react-redux';
import { Close, Plus } from '@rsuite/icons';
import InputNumber from './InputNumber';
import NexusTag from './NexusTag';

const NewContractForm = (props) => {
  const [selectedAccount, setselectedAccount] = React.useState(false);
  const [payoutAccount, setpayoutAccount] = React.useState(undefined);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [hours, setHours] = React.useState(0);

  const [rewards, setRewards] = React.useState([]);
  const [target, setTarget] = React.useState([]);
  const [consequence, setConsequence] = React.useState([]);
  const [status, setStatus] = React.useState(props.statusDefault);
  const accounts = useSelector(s => s.accounts.list);
  const blueprints = useSelector(s => s.blueprints.list);
  const gameconfig = useSelector(s => s.gameConfig);

  const fullStatus = ["tradable", "working", 'auto']

  const handleStatus = (tag) => {
    if (status.some(el => el === tag)) setStatus(status.filter(s => s !== tag))
    else setStatus([...status, tag])
  }

  const editState = (incoming, index, type) => {
    let thing;
    let temp;
    switch (type) {
      case 'reward':
        thing = rewards[index];
        temp = [...rewards];
        typeof (incoming) === 'number' ? thing.value = parseInt(incoming) : thing.type = (incoming);
        temp[index] = thing;
        setRewards(temp);
        break;
      case 'target':
        thing = target[index];
        temp = [...target];
        typeof (incoming) === 'number' ? thing.value = parseInt(incoming) : thing.type = (incoming);
        temp[index] = thing;
        setTarget(temp);
        break;
      case 'con':
        thing = consequence[index];
        temp = [...consequence];
        typeof (incoming) === 'number' ? thing.value = parseInt(incoming) : thing.type = (incoming);
        temp[index] = thing;
        setConsequence(temp);
        break;

      default:
        console.log('UwU Scott made an oopsie doodle!')
    }
  }


  const removeElement = (index, type) => {
    let temp;
    switch (type) {
      case 'reward':
        temp = [...rewards];
        temp.splice(index, 1)
        setRewards(temp);
        break;
      case 'target':
        temp = [...target];
        temp.splice(index, 1)
        setTarget(temp);
        break;
      case 'con':
        temp = [...consequence];
        temp.splice(index, 1)
        setConsequence(temp);
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!')

    }
  }

  const handleCreate = () => {
    if (props.handleCreate) props.handleCreate({
      owner: selectedAccount,
      account: selectedAccount,
      payoutAccount,
      name,
      description,
      hours,
      rewards,
      consequence,
      target,
      status
    })
    else socket.emit('request', {
      route: 'asset', action: 'newContract',
      data: {
        owner: selectedAccount,
        account: selectedAccount,
        payoutAccount,
        name,
        description,
        hours,
        rewards,
        consequence,
        target,
        status
      }
    })
  }

  const disabledConditions = [
    {
      text: "Name is too short",
      disabled: description.length < 3
    },
    {
      text: "Name is too long!",
      disabled: name.length >= 1000
    },
    {
      text: "Select an Account",
      disabled: !selectedAccount
    },

  ];
  const isDisabled = disabledConditions.some(el => el.disabled);

  return (
    <>
      <InputGroup>
        <Input placeholder="Name" style={{ width: '50%' }} value={name} onChange={(e) => setName(e.target.value)} />
        Hours til expiration
        <InputNumber defaultValue={hours} prefix='H' style={{ width: 100 }} value={hours} min={0} onChange={(event) => setHours(event)}></InputNumber>
        <SelectPicker placeholder="Select Who owns this contract" label='name' valueKey='_id' data={accounts} value={selectedAccount} style={{ height: '39px', width: '50%' }} onChange={(event) => { setselectedAccount(event); }} />
      </InputGroup>

      <Divider />
      <Flex>
        {fullStatus.map((tag, index) => (
          <div key={index} onClick={() => handleStatus(tag)}>
            <NexusTag variant={status && status.some(el => el === tag) ? 'solid' : 'ghost'} value={tag} key={index} colorScheme='teal'></NexusTag>
          </div>
        ))}
      </Flex>

      <Divider />
      <Input variant='flushed' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Divider />


      {selectedAccount && <div style={{ textAlign: 'center', color: 'white' }}>
        <SelectPicker placeholder="Select payout account (optional)" label='name' valueKey='_id' data={accounts} value={payoutAccount} style={{ height: '39px', width: '50%' }} onChange={(event) => { setpayoutAccount(event); }} />
        <Divider />
        <br />
        Contract Rewards
        <br />
        {rewards.map((reward, index) => (
          <InputGroup key={reward._id} index={index}>
            <SelectPicker label='type' valueKey='type' data={gameconfig.resourceTypes} value={reward.type} onChange={(event) => { editState(event, index, 'reward'); }} />
            <InputNumber prefix='value' style={{ width: 200 }} value={reward.value} min={0} onChange={(event) => editState(parseInt(event), index, 'reward')}></InputNumber>
            <IconButton variant={'outline'} onClick={() => removeElement(index, 'reward')} colorScheme='red' size="sm" icon={<CloseButton />} />
          </InputGroup>
        ))}
        <IconButton variant={'solid'} onClick={() => setRewards([...rewards, { value: 1, type: 'shiny_rock' }])} colorScheme='green' size="sm" icon={<Plus icon="plus" />} />
        <Divider />
        Contract Target (What they need to turn in to complete)
        <br />
        {target.map((target, index) => (
          <InputGroup key={target._id} index={index}>
            <SelectPicker cleanable={false} label='type' valueKey='type' data={gameconfig.resourceTypes} value={target.type} onChange={(event) => { editState(event, index, 'target'); }} />
            <InputNumber prefix='value' style={{ width: 150 }} value={target.value} min={0} onChange={(event) => editState(parseInt(event), index, 'target')}></InputNumber>
            <IconButton variant={'outline'} onClick={() => removeElement(index, 'target')} colorScheme='red' size="sm" icon={<Close />} />
          </InputGroup>
        ))}
        <IconButton variant={'solid'} onClick={() => setTarget([...target, { value: 1, type: 'credit' }])} colorScheme='green' size="sm" icon={<Plus />} />
        <Divider />

        {false && <div>
          Consequences
          <br />
          {consequence.map((con, index) => (
            <InputGroup key={con._id} index={index}>
              {/* <InputPicker cleanable={false} labelKey='code' valueKey='code' data={props.blueprints.filter(el => el.tags.some(tag => tag === 'resource' || tag === 'stock'))} value={con.type} onChange={(event)=> {editState(event, index, 'con'); }} />	
              <InputNumber prefix='value' style={{ width: 150 }} value={con.value} min={0} onChange={(event)=> editState(parseInt(event), index, 'con')}></InputNumber> */}
              <IconButton variant={'solid'} onClick={() => removeElement(index, 'con')} colorScheme='red' size="sm" icon={<Close />} />
            </InputGroup>
          ))}
          <Flex>
            <Spacer />
            <IconButton variant={'solid'} onClick={() => setConsequence([...consequence, { value: 1, type: 'credit' }])} colorScheme='green' size="sm" icon={<Plus />} />
            <Spacer />
          </Flex>
        </div>}

        <Divider />
      </div>}
      <Stack>
        {disabledConditions.filter(el => el.disabled).map((opt, index) =>
          <Text color='red' key={index}>{opt.text}</Text>
        )}
      </Stack>
      <ButtonGroup>
        <Button variant={'solid'} isDisabled={isDisabled} onClick={() => handleCreate()} colorScheme='green'>Submit</Button>
        <Button onClick={() => props.onClose()} colorScheme='red' variant="ghost">
          Close
        </Button>
      </ButtonGroup>
    </>
  );
}

export default NewContractForm;