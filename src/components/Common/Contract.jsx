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

const Contract = (props) => {
  const { contract, show } = props;
  const { control, character, login } = useSelector(s => s.auth);
  const clock = useSelector(s => s.clock);
  const account = useSelector(getCharAccount);
  const isCompleted = contract.status.some(el => el === 'completed')
  const [loading, setLoading] = React.useState(false);

  const submit = (goal) => {
    const data = {
      contract: goal._id,
      account: account._id
    }
    setLoading(true)
    socket.emit('request', { route: 'asset', action: 'contract', data }, (response) => {
      console.log(response);
      setLoading(false)
    });
  }

  const getTag = (target) => {
    const rawr = account !== undefined ? account.resources.find(el => el.type === target.type) : undefined
    const megabucks = rawr ? rawr.balance : 'Error w/ account';
    return target.value > megabucks ? <Tag variant='solid' colorScheme='red'><Close />{"  "}{megabucks}</Tag> : <Tag variant='solid' colorScheme='green'><Check />{"  "}{megabucks}</Tag>
  }

  const isDisabled = (goal) => {
    for (const target of goal.target) {
      const rawr = account !== undefined ? account.resources.find(el => el.type === target.type) : undefined
      const megabucks = rawr ? rawr.balance : 'Error w/ account';
      if (megabucks < target.value || typeof (megabucks) === 'string') return true;
    }
    return false;
  }

  return (
    <Box>
      <div style={{ border: `4px solid ${getFadedColor('')}`, minWidth: '20vw', textAlign: 'center' }}>
        <h5>{contract.name}</h5>

        {show && !isCompleted && <ButtonGroup style={{ marginTop: '10px' }}>
          <Button variant={'solid'} colorScheme='green' size='sm' isLoading={loading} isDisabled={isDisabled(contract)} onClick={() => submit(contract)} >Complete</Button>
        </ButtonGroup>}

        <p>{contract.description}</p>

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
      <Wrap justify={'space-around'} style={{ border: `4px solid ${getFadedColor('contract')}`, }} >

        <VStack  >
          <Tooltip openDelay={50} placement="top" label={(<div>What you need to spend to complete this contract</div>)} trigger="hover">
            <h4>Target</h4>
          </Tooltip >

          <HStack >
            {contract.target.map(g => (
              <div key={g._id} style={{ paddingBottom: '10px' }}  >
                <ResourceNugget fontSize={'2em'} width={'100px'} index={g._id} value={g.value} type={g.type} />
                {/* <div style={{ position: 'relative', top: '-30px', left: '70px'	}} >
											{show && getTag(g)}
										</div> */}

              </div>
            ))}
          </HStack>
        </VStack>

        <VStack className="reward-container">
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
        </VStack>

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


      </Wrap>
    </Box>


  );
}

export default (Contract);