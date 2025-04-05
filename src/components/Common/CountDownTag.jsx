import { Tag, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCountdownHours, getFadedColor } from '../../scripts/frontend';

const CountDownTag = (props) => {
	const { timeout } = props;
	const clock = useSelector(s => s.clock);
	const {roundLength} = useSelector(s => s.gamestate);
	/*
	*/
  const ticks = timeout - clock.tickNum;
  
  const estTime = { 
    hours: (ticks * roundLength.hours) + Math.floor((ticks * roundLength.minutes) / 60), 
    minutes: (ticks * roundLength.minutes) % 60, 
    seconds: ticks * roundLength.seconds
  }

  if (ticks > -1)
  return (
    <Tooltip  hasArrow delay={100} placement='top' trigger='hover'
      label={`Triggers on tick ${timeout} (${estTime.hours}h, ${estTime.minutes}m)-ish`} >
        <Tag colorScheme={ticks < 4 ? 'green' : ticks < 10 ? 'orange' :'red'} size='md' variant='solid'>
          {ticks}  
        </Tag>
    </Tooltip>      
  )
  else return (
    <></>
  )

};

export default CountDownTag;
