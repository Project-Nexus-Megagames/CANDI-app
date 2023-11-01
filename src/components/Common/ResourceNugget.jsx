import { Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor } from '../../scripts/frontend';

	/**
		value: numerical value of the resource/asset

		type:  name of the resource. if set to 'blueprint' the nugget will look up what blueprint this is rendering based on the unique code passed

		blueprint: unique code that nugget can look up

		loading: if the game is loading or not

		And before you say it yeah I know it's not great but it's better than my usual code. Plus I am even leaving documentation of sorts. Look at me programming here.
	*/
const ResourceNugget = (props) => {
	const { value, type, blueprint, fontSize, width, loading, altIconPath, backgroundColor, compact, label } = props;

	let blueprints = useSelector((state) => state.blueprints.list);
	let lookup = blueprints.find((el) => el.code === type);
	if (!lookup) lookup = blueprints.find((el) => el.code === blueprint);
  let altP = altIconPath ? altIconPath : "";

	return (
    <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
    label={label ? label :(
      <div style={{ textTransform: 'capitalize', }}>
        {lookup ? <h5>{lookup.name} {value}</h5> :<h5>{type} {value}</h5>} 
        {lookup && lookup.description && <p>{lookup.description}</p>}  </div>)} >
      <div
        className='styleCenter'
        style={{
          opacity: loading ? 0.5 : 1,
          display: 'flex',
          border: `3px solid ${getFadedColor(type)}`,
          borderRadius: '10px',
          width: width ? width : '100px',
          backgroundColor: props.selected ? getFadedColor(type, 0.7) : backgroundColor,
        }}
      >
        {type !== 'blueprint' && <img src={`/images/Icons/${type}${altP}.png`} width={'50%'} alt={`${type}${altP}`} />}
        {type === 'blueprint' && lookup && <img src={`/images/Icons/${lookup.model}/${lookup.code}${altP}.png`} width={'50%'} alt={`${lookup.model} / ${lookup.code}`} />}

        {value && !compact && <h5  style={{ fontSize: fontSize }}>{value}</h5>}
      </div>
    </Tooltip>
	);
};

export default ResourceNugget;
