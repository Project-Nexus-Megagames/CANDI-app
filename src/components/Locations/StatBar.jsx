import { Button, Wrap } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';

const StatBar = (props) => {

  return (
    <Wrap justify='center'>
      {!props.selectedStat && props.globalStats &&  props.globalStats.map(stat => (
        <div key={stat._id} onClick={() => props.setSelectedStat(stat)}>
          <ResourceNugget value={stat.statAmount} type={`${stat.type}`} selected={props.selectedStat == stat} />
        </div>
      ))}

      {props.selectedStat && <div onClick={() => props.setSelectedStat(props.selectedStat)}>
        <ResourceNugget value={props.globalStats.find(el => el.type === props.selectedStat.type)?.statAmount} type={`${props.selectedStat.type}`} selected={true} />
      </div>}

      {props.selectedStat && <Button onClick={() => props.setSelectedStat(false)} >Reset</Button>}
    </Wrap>
  );
}

export default StatBar;
