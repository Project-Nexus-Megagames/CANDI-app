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
    <NumberInput height={'100%'} allowMouseWheel size={'sm'} min={min} onChange={(valueString) => onChange(parse(valueString))} defaultValue={format(defaultValue)} >
      <NumberInputField />
      <NumberInputStepper >
        <NumberIncrementStepper overflow='hidden' bg='green' color='white' />
        <NumberDecrementStepper bg='tomato' color='white' />
      </NumberInputStepper>
    </NumberInput>
   );
}
 
export default InputNumber;