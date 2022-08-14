import React from 'react';
import { Box, IconButton, Stack, Heading, Text, Container, useBreakpointValue } from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
// And react-slick as our Carousel Lib
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import '../../slick.css';
import '../../slick-theme.css';

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

const Carousel = (props) => {
	// As we have used custom buttons, we need a reference variable to
	// change the state
	const [slider, setSlider] = React.useState();

	// These are the breakpoints which changes the position of the
	// buttons as the screen size changes
	const top = useBreakpointValue({ base: '90%', md: '50%' });
	const side = useBreakpointValue({ base: '30%', md: '40px' });

	// This list contains all the data for carousels
	// This can be static or loaded from a server
	const cards = [
		{
			title: 'Design Projects 1',
			text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60'
		},
		{
			title: 'Design Projects 2',
			text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image: 'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80'
		},
		{
			title: 'Design Projects 3',
			text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image: 'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60'
		}
	];

	return (
		<Box
			position={'relative'}
			height={props.height}
			overflow={'hidden'}
			style={{
				border: '5px solid #d4af37',
				borderRadius: '10px',
				margin: '10px'
			}}
		>
			{/* Left Icon */}
			<IconButton aria-label="left-arrow" variant="ghost" position="absolute" left={side} top={top} transform={'translate(0%, -50%)'} zIndex={2} onClick={() => slider?.slickPrev()}>
				<BiLeftArrowAlt size="40px" />
			</IconButton>
			{/* Right Icon */}
			<IconButton aria-label="right-arrow" variant="ghost" position="absolute" right={side} top={top} transform={'translate(0%, -50%)'} zIndex={2} onClick={() => slider?.slickNext()}>
				<BiRightArrowAlt size="40px" />
			</IconButton>
			{/* Slider */}
			<Slider {...settings} ref={(slider) => setSlider(slider)}>
				{cards.map((card, index) => (
					<Box key={index} height={'6xl'} position="relative" backgroundPosition="center" backgroundRepeat="no-repeat" backgroundSize="cover" backgroundImage={`url(${card.image})`}>
						{/* This is the block you need to change, to customize the caption */}
						<Container size="container.lg" height={props.height} position="relative">
							<Stack spacing={6} w={'full'} maxW={'lg'} position="absolute" top="50%" transform="translate(0, -50%)">
								<Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>{card.title}</Heading>
								<Text fontSize={{ base: 'md', lg: 'lg' }} color="GrayText" noOfLines={2}>
									{card.text}
								</Text>
							</Stack>
						</Container>
					</Box>
				))}
			</Slider>
			<div>
				<Link to={props.to}>
					<h6
						style={{
							position: 'absolute',
							bottom: '15px',
							left: '0px',
							color: 'white',
							background: '#663300'
						}}
					>
						~News~
					</h6>
					<p
						style={{
							position: 'absolute',
							bottom: '0px',
							left: '0px',
							color: 'white',
							background: '#663300',
							fontSize: '0.966em'
						}}
					>
						Go here for juicy news
					</p>
				</Link>
			</div>
		</Box>
	);
};

export default Carousel;
