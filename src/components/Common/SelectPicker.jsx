import { Select, Input } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { getFadedColor } from '../../scripts/frontend';

function SelectPicker(props) {
	const { data, value, onChange, label, valueKey } = props;
	let [filter, setFilter] = React.useState('');
	return (
		<Select
			style={{ border: `4px solid ${getFadedColor(value)}`, minWidth: '10vw' }}
			onChange={(event) => onChange(event.target.value)}
			icon={<IoChevronDownCircleOutline />}
			placeholder={value ? value : 'Select Option'}
		>
			{data &&
				data
					.filter((el) => el[label]?.toLowerCase().includes(filter.toLowerCase()))
					.map((el) => (
						<option style={{ background: '#2d3748', color: 'white' }} key={el[label]} value={el[valueKey]}>
							{el[label]}
						</option>
					))}
		</Select>
	);
}

export default SelectPicker;
