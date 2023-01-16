import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

const InputNumber = (props) => {
  const { defaultValue, onChange } = props;
  return ( 
    <NumberInput defaultValue={defaultValue} onChange={onChange} >
     <NumberInputField />
     <NumberInputStepper>
       <NumberIncrementStepper />
       <NumberDecrementStepper />
     </NumberInputStepper>
</NumberInput>
   );
}
 
export default InputNumber;