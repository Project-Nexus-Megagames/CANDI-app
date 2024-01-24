import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

const InputNumber = (props) => {
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')

  const { defaultValue, onChange, min } = props;
  return ( 
    <NumberInput min={min} onChange={(valueString) => onChange(parse(valueString))} defaultValue={format(defaultValue)} >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
   );
}
 
export default InputNumber;