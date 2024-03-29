const tagStyles = {
	variants: {
		primary: {
			bg: 'purple.600',
			color: 'white',
			_hover: {
				bg: 'purple.800',
				color: 'gray.200'
			}
		},
		caution: {
			bg: 'red.600',
			color: 'gray.50',
			_hover: {
				bg: 'red.800',
				color: 'gray.200'
			}
		},
		secondary: {
			borderWidth: '0px',
			borderColor: 'purple.600',
			bg: 'rgba(0, 0, 0, 0)',
			color: 'purple.600',
			_hover: {
				borderColor: 'purple.800',
				bg: 'purple.800',
				color: 'gray.200'
			}
		}
	},
	defaultProps: {
		variant: 'primary'
	}
};

export default tagStyles;
