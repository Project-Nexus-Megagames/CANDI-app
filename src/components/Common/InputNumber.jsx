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

  const { defaultValue, onChange, min, max, width } = props;
  return (
    <NumberInput
      min={min}
      max={max}
      onChange={(valueString) => onChange(parseInt(valueString))}
      defaultValue={format(defaultValue)}
      width={width}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}

export default InputNumber;