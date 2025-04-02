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

  const { defaultValue, onChange, min, max, prefix } = props;
  return ( 
    <NumberInput height={'100%'} allowMouseWheel size={'sm'} min={min} max={max} onChange={(valueString) => onChange(parse(valueString))} defaultValue={format(defaultValue)} >
      {prefix}
      <NumberInputField />
      <NumberInputStepper >
        <NumberIncrementStepper overflow='hidden' bg='green' color='white' />
        <NumberDecrementStepper bg='tomato' color='white' />
      </NumberInputStepper>
    </NumberInput>
   );
}
 
export default InputNumber;