import { Select, Input } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';

function SelectPicker(props) {
  const { data, value, onChange, label } = props;
  let [filter, setFilter] = React.useState('');
  return (
    <Select icon={<IoChevronDownCircleOutline />} placeholder={value ? value : 'Select Option'}>
      {data && data
      .filter(el => el[label]?.toLowerCase().includes(filter.toLowerCase()))
      .map(el => (
        <option onClick={() => onChange(el._id)} key={el._id} value={el._id} >{el[label]}</option>
      ))}
    </Select>
	);
}

export default SelectPicker;