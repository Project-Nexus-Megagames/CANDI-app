import { Select, Input } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { getFadedColor, getThisTeamFromAccount } from '../../scripts/frontend';
import { useSelector } from 'react-redux';

function SelectPicker(props) {
	const { data, value, onChange, label, placeholder } = props;
  let valueKey = props.valueKey ? props.valueKey : '_id';
	let [filter, setFilter] = React.useState('');
	const accounts = useSelector(s => s.accounts.list);  
  const teams = useSelector(s => s.teams.list);

	return (
		<Select 
      style={{ border: `4px solid ${getFadedColor(value)}`, backgroundColor: "#343840",  }} 
      icon={<IoChevronDownCircleOutline />} 
      placeholder={value ? value : placeholder? placeholder : `Select Option (${data?.length})`} 
      onChange={(event) => onChange(event.target.value)}>
			{data &&
				data
					//.filter((el) => el[label]?.toLowerCase().includes(filter.toLowerCase()))
					.map((el) => (
						<option style={{ backgroundColor: "#343840" }} key={el[label]} value={el[valueKey]}>
              {el.account && getThisTeamFromAccount(accounts, teams, el.account).name} 
							{el[label]?.toUpperCase()}
						</option>
					))}
		</Select>
	);
}

export default SelectPicker;
