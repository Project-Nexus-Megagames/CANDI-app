import React from 'react';
import { Box, IconButton, Stack, Heading, Text, Container, useBreakpointValue } from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
// And react-slick as our Carousel Lib
import Slider from 'react-slick';



// Settings for the slider
const settings = {
	arrows: false,
	dots: true,
	fade: true,
	infinite: true,
	autoplay: true,
	speed: 500,
	autoplaySpeed: 5000,
	slidesToShow: 1,
	slidesToScroll: 1
};

const Carousel = ({ data, height, to, images, folder }) => {
	// As we have used custom buttons, we need a reference variable to
	// change the state
	const [slider, setSlider] = React.useState();
	const [imgs, setImgs] = React.useState([]);

	// These are the breakpoints which changes the position of the
	// buttons as the screen size changes
	const top = useBreakpointValue({ base: '90%', md: '50%' });
	const side = useBreakpointValue({ base: '30%', md: '40px' });

	
	return (
		<Box
		style={{ color: 'black'}}
		position={'relative'}
		height={'600px'}
		width={'full'}
		overflow={'hidden'}>
		{/* CSS files for react-slick */}
		<link
			rel="stylesheet"
			type="text/css"
			charSet="UTF-8"
			href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
		/>
		<link
			rel="stylesheet"
			type="text/css"
			href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
		/>
		{/* Left Icon */}
		<IconButton
			aria-label="left-arrow"
			colorScheme="messenger"
			borderRadius="full"
			position="absolute"
			left={side}
			top={top}
			transform={'translate(0%, -50%)'}
			zIndex={2}
			onClick={() => slider?.slickPrev()}>
			<BiLeftArrowAlt />
		</IconButton>
		{/* Right Icon */}
		<IconButton
			aria-label="right-arrow"
			colorScheme="messenger"
			borderRadius="full"
			position="absolute"
			right={side}
			top={top}
			transform={'translate(0%, -50%)'}
			zIndex={2}
			onClick={() => slider?.slickNext()}>
			<BiRightArrowAlt />
		</IconButton>
		{/* Slider */}
		<Slider {...settings} ref={(slider) => setSlider(slider)}>
			{Object.keys(images).map((url, index) => (
				<Box
					key={index}
					height={'6xl'}
					position="relative"
					backgroundPosition="center"
					backgroundRepeat="no-repeat"
					backgroundSize="cover"
					backgroundImage={`./images/${folder}/${url}`}
				>
				</Box>
			))}
		</Slider>
	</Box>
	);
};

export default Carousel;
