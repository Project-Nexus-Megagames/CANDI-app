import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { getMyCharacter, getMyTeamMembers, } from '../../redux/entities/characters';
import socket from '../../socket';
import { getMyAssets, getTeamContracts } from '../../redux/entities/assets';
import { getCountdownHours, getFadedColor } from '../../scripts/frontend';
import { getCharAccount, getTeamAccount } from '../../redux/entities/accounts';
import ResourceNugget from '../Common/ResourceNugget';
import { Check, Close } from '@rsuite/icons';
import { Button, ButtonGroup, HStack, Tag, Tooltip, VStack, Flex, Spacer, Wrap, Box } from '@chakra-ui/react';
import NexusTag from './NexusTag';
import InputNumber from './InputNumber';
import { CandiModal } from './CandiModal';
import NewContractForm from './NewContractForm';

const Contract = (props) => {
  const { contract, show } = props;
  const { control, character, login } = useSelector(s => s.auth);
  const clock = useSelector(s => s.clock);
  const loggedInUser = useSelector((state) => state.auth.user);

  const charAccount = useSelector(getCharAccount);
  const teamAccount = useSelector(getTeamAccount);


  const [account, setAccount] = React.useState(charAccount || teamAccount);

  const isCompleted = contract.status.some(el => el === 'completed')
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState(false);
  const [resources, setResources] = React.useState(contract.target.map(c => { return { type: c.type, value: 0 } }));

  const contribute = () => {
    const data = {
      contract: contract._id,
      resources: resources.filter(el => el.value > 0),
      account: account._id
    }
    setLoading(true)
    socket.emit('request', { route: 'asset', action: 'contractContribute', data }, (response) => {
      console.log(response);
      setLoading(false)
      setMode(false)
      setResources(contract.target.map(c => { return { type: c.type, value: 0 } }))
    });
  }

  const reset = () => {
    const data = {
      contract: contract._id,
      account: account._id
    }
    setLoading(true)
    socket.emit('request', { route: 'asset', action: 'contractReset', data }, (response) => {
      console.log(response);
      setLoading(false)
      setMode(false)
      setResources(contract.target.map(c => { return { type: c.type, value: 0 } }))
    });
  }

  const editContract = (inc) => {
    setLoading(true)
    socket.emit('request', { route: 'asset', action: 'modify', data: { ...inc, loggedInUser } }, (response) => {
      console.log(response);
      setLoading(false)
      setMode(false)
    });
  }

  const getContribtuedAmount = (type) => {
    const rawr = contract.contributed.find(el => el.type === type);
    if (rawr) return (rawr.value)
    return (0)
  }

  const getTag = (target) => {
    const contributed = getContribtuedAmount(target.type);
    return target.value > contributed ?
      false :
      <Tag variant='solid' colorScheme='green'><Check />{"  "}</Tag>
  }



  const isDisabled = (goal) => {
    for (const target of goal.target) {
      const rawr = account !== undefined ? account.resources.find(el => el.type === target.type) : undefined
      const megabucks = rawr ? rawr.balance : 'Error w/ account';
      if (megabucks < target.value || typeof (megabucks) === 'string') return true;
    }
    return false;
  }

  const getMax = (res) => {
    return account.resources.find(el => el.type === res)?.balance || 0;
  }

  const handleChange = (resource, value) => {
    const res = resources.findIndex(el => el.type === resource)
    resources[res].value = value;
    setResources(resources)
  }

  return (
    <Box style={{ border: `4px solid ${getFadedColor('')}`, backgroundColor: '#1f2021', minWidth: '100%', textAlign: 'center', borderRadius: '10px' }}>
      <div >
        <h4>{contract.name}</h4>
        <h5>{contract.description}</h5>

        {show && !isCompleted && <ButtonGroup style={{ marginTop: '10px' }}>
          <Button variant={'solid'} colorScheme='blue' size='sm' isLoading={loading} onClick={() => setMode(mode ? false : 'contribute')} >{mode ? 'Cancel' : 'Contribute'}</Button>
          {!mode && control && <Button variant={'solid'} colorScheme='orange' size='sm' isLoading={loading} onClick={() => reset(contract)} >Reset</Button>}
          {!mode && control && <Button variant={'solid'} colorScheme='yellow' size='sm' isLoading={loading} onClick={() => setMode('edit')} >Edit</Button>}
          {mode && <Button variant={'solid'} colorScheme='green' size='sm' isLoading={loading} onClick={() => contribute()} >Submit</Button>}
        </ButtonGroup>}

        {clock.gametime < contract.timeout &&
          <Tooltip openDelay={50} placement="top" label={(<div>Expires on {new Date(contract.timeout).toDateString()} {new Date(contract.timeout).getHours()}:00</div>)} >
            <p>Expires: <Button size='xs' appearance='ghost' >{getCountdownHours(clock.gametime, contract.timeout) * 2} minutes</Button></p>
          </Tooltip >}

        {<Flex>
          {control && contract.status.map((tag, index) => (
            <NexusTag variant='solid' value={tag} key={index} colorScheme='teal'></NexusTag>
          ))}
        </Flex>}
      </div>
      <Wrap justify={'space-around'} style={{ border: `4px solid ${getFadedColor('contract')}`, margin: '5px', backgroundColor: '#303134', borderRadius: '10px' }} >

        <VStack  >
          <Tooltip openDelay={50} placement="top" label={(<div>What you need to spend to complete this contract</div>)} trigger="hover">
            <h4>Target</h4>
          </Tooltip >

          {mode === 'contribute' && [charAccount, teamAccount].map(acc => (
            <Button
              key={acc._id}
              onClick={() => setAccount(acc)}
              size='xs'
              margin={'0'}
              variant={account === acc ? 'solid' : 'link'}
              colorScheme={account === acc ? 'teal' : 'none'}
            >
              {acc.name}
            </Button>
          ))}

          <Wrap >
            {contract.target.map(g => (
              <div key={g._id} width={'100px'} style={{ paddingBottom: '5px' }}  >
                <ResourceNugget fontSize={'2em'} index={g._id} value={`${getContribtuedAmount(g.type)}/${g.value}`} type={g.type} />
                <div style={{ position: 'relative', top: '-30px', left: '30px' }} >
                  {show && getTag(g)}
                </div>
                {mode === 'contribute' && <div style={{}} >
                  <InputNumber width={'100px'} defaultValue={0} min={0} max={getMax(g.type)} onChange={(value) => handleChange(g.type, value)} />
                </div>}

              </div>
            ))}
          </Wrap>
        </VStack>

        {contract.rewards && contract.rewards.length > 0 && <VStack className="reward-container">
          <Tooltip openDelay={50} placement="top" label={(<div>What you will recieve when you complete this contract</div>)} trigger="hover">
            <h4>Rewards</h4>
          </Tooltip >
          <Wrap>
            {contract.rewards && contract.rewards.map(reward => (
              <div key={reward._id}>
                {reward.type !== 'stat' && <ResourceNugget fontSize={'2em'} width={'100px'} blueprint={reward.blueprint} value={reward.value} type={reward.type} />}
                {reward.type === 'stat' && <ResourceNugget fontSize={'2em'} width={'100px'} value={reward.value} type={reward.blueprint} />}
              </div>

            ))}
          </Wrap>
        </VStack>}

        {/* {false && contract.consequence && contract.consequence.length > 0 && <VStack className="consequence-container">
						<Tooltip className="consequence-container" openDelay={50} placement="top" label={(<div>What you will be punished with if you let this contract expire</div>)} trigger="hover">
							<h4>Consequences</h4>
						</Tooltip>
						<HStack>
							{contract.consequence && contract.consequence.map(con => (
								<ResourceNugget fontSize={'2em'} width={'100px'} key={con._id} blueprint={con.blueprint} altIconPath={"-consequence"} value={con.value} type={con.type} />
							))}
						</HStack>												
			</VStack>} */}

        <CandiModal open={mode === 'edit'} onClose={() => setMode(false)}  >
          <NewContractForm contract={contract} statusDefault={["action"]} onClose={() => setMode(false)} handleCreate={editContract} />
        </CandiModal>

      </Wrap>
    </Box>


  );
}

export default (Contract);