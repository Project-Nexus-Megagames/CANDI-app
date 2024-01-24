import { Tag, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCountdownHours, getFadedColor } from '../../scripts/frontend';

const CountDownTag = (props) => {
	const { timeout } = props;
	const clock = useSelector(s => s.clock);
	/*
	*/
  const hours = timeout - clock.tickNum;

  if (hours > -1)
  return (
    <Tooltip  hasArrow delay={100} placement='top' trigger='hover'
      label={`Comes off cooldown in ${hours} Turns`} >
        <Tag colorScheme={hours < 4 ? 'red' : hours < 10 ? 'orange' :'green'} size='md' variant='solid'>
          {(hours)}
        </Tag>
    </Tooltip>      
  )
  else return (
    <></>
  )

};

export default CountDownTag;
