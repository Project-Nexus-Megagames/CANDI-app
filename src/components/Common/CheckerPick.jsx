import { Checkbox, Menu, Tag, MenuButton, MenuList, Box, VStack, IconButton, HStack } from '@chakra-ui/react';
import React from 'react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';

function CheckerPick({ data, onChange, placeholder, button, label, value }) {
  value = value || [];

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
            <Tag key={el}>{data.find(e => e._id === el)?.name}</Tag>
          ))}  
        </Box>}
        <IconButton variant={'ghost'} icon={<IoChevronDownCircleOutline />} />        
      </HStack>}
      {button && button}

      
      </MenuButton>
      <MenuList style={{ backgroundColor: "#0f0f0f", color: 'white' }} minWidth={'90%'}  >
        <VStack spacing={1} align="start" marginLeft="5px">
          {data && data.map(el => (
            <Checkbox onChange={() => handleChange(el._id)} key={el._id} isChecked={value.some(e => e === el._id)}  >{label ? el[label] : el._id}</Checkbox>                        
          ))}      
        </VStack>
      </MenuList>
		</Menu>	
	);
}

export default CheckerPick;