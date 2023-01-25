import { extendTheme } from '@chakra-ui/react';
import buttonStyles from '../styles/buttonStyles';
import colors from '../styles/colors';
import { modalTheme } from '../styles/modalStyles';
import { statTheme } from '../styles/statStyles';
import tagStyles from '../styles/tagStyles';

export const myTheme = extendTheme({
	components: {
		Button: buttonStyles,
		Tag: tagStyles,
		Stat: statTheme,
    Modal: modalTheme
	},
	styles: {
    global: {
      // styles for the `h5`
      h5: {
        color: 'white',
      },
			p: {
        color: 'white',
      },
			FormLabel: {
        color: 'white',
      },
			Input: {
        color: 'white',
      },
    },
  },
});
