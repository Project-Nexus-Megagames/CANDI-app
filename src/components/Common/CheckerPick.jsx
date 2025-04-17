import { Checkbox, Menu, Tag, MenuButton, MenuList, Box, VStack, IconButton, HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';

function CheckerPick({ data, onChange, placeholder, button, label = "_id", value, valueKey = "_id" }) {
  value = value || [];

  let [filter, setFilter] = React.useState('');

  const handleChange = (id) => {
    if (value.some(el => el === id)) {
      onChange(value.filter((el) => el !== id))
    }
    else {
      onChange([...value, id])
    }
  }

  return (
    <Menu maxHeight={"45px"} overflow={'hidden'}>
      <MenuButton
        aria-label='Options'
        variant='outline'
        overflow={'hidden'}
        alignContent={'start'}

      >
        {!button && <HStack border={'1px'} borderRadius='lg'>
          {value && <Box width={'90%'} overflow={'hidden'}>
            {value.length === 0 && placeholder}
            {value.map(el => (
              <Tag key={el}>{data.find(e => e[valueKey] === el)?.name}</Tag>
            ))}
          </Box>}
          <IconButton variant={'ghost'} icon={<IoChevronDownCircleOutline />} />
        </HStack>}
        {button && button}
      </MenuButton>

      <MenuList style={{ backgroundColor: "#0f0f0f", color: 'white' }} minWidth={'90%'}  >
        <Input value={filter} onChange={(e) => setFilter(e.target.value)}></Input>
        <VStack spacing={1} align="start" marginLeft="5px">
          {data && data.filter(el => el[label].includes(filter)).map(el => (
            <Checkbox
              onChange={() => handleChange(el[valueKey])}
              key={el[valueKey]}
              isChecked={value.some(e => e === el[valueKey])}  >
              {label ? el[label] : el[valueKey]}
            </Checkbox>
          ))}
        </VStack>
      </MenuList>
    </Menu>
  );
}

export default CheckerPick;