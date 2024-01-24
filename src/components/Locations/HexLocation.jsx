import { Button, Wrap } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import tiles from './hexIcons';

const HexLocation = (props) => {
  const { location } = props;

  const hash = (location.coords.y * 6 + location.coords.x * 6) % 7;
  return (
    <span
    className='hexagon'
    // onClick={handleClick}
    id={location?._id}
    style={{
      // opacity: (loc && loc._id === props.selected?._id) ? 0.7 : 'inherit',
      backgroundImage: true ?
        "url(" + tiles[hash] + ")" :
        "inherit",
    }} >♦
    
    <div className='container' >
      <t>{location?.name}</t>
{/* 
      {stat && <ResourceNugget key={x} value={stat?.statAmount} type={`${props.selectedStat.type}`} />} */}
    </div>

  </span>
  );
}

export default HexLocation;
