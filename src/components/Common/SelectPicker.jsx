import { Select, Input } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { getFadedColor } from '../../scripts/frontend';

function SelectPicker(props) {
  const { data, value, onChange, label } = props;
  let [filter, setFilter] = React.useState('');
  return (
    <Select style={{ border: `4px solid ${getFadedColor(value)}`, minWidth: '10vw' }} icon={<IoChevronDownCircleOutline />} placeholder={value ? value : 'Select Option'}>
      {data && data
      .filter(el => el[label]?.toLowerCase().includes(filter.toLowerCase()))
      .map(el => (
        <option onClick={() => onChange(el[label])} key={el[label]} value={el[label]} >{el[label]}</option>
      ))}
    </Select>
	);
}

export default SelectPicker;