import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the parts you're going to style
  label: {
    fontWeight: 'bold',
    fontSize: '40px',
    textTransform: 'capitalize'
  },
  helpText: {fontSize: '30px',},
  container: {},
  icon: {},
  number: {fontSize: '30px',},
})

export const statTheme = defineMultiStyleConfig({ baseStyle })