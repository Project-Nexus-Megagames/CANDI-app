import React from 'react';
import { Avatar, Box, HStack, Stack, StackDivider, Text, VStack, Center } from '@chakra-ui/react';

const NewsFeed = (props) => {
	const data = props.data;

	return (
		<Center>
			<Box bg="bg-surface" py="4">
				<Stack divider={<StackDivider />} spacing="4">
					{data.map((item) => (
						<Stack key={item.id} fontSize="sm" px="4" spacing="4" margin="5px">
							<Stack direction="row" justify="space-between" spacing="4">
								<HStack spacing="3">
									<Avatar src={item.avatarUrl} boxSize="10" />
									<Box>
										<Text fontWeight="medium" color="emphasized">
											{item.name}
										</Text>
									</Box>
								</HStack>
								<Text color="muted">{item.date}</Text>
							</Stack>
							<VStack align="left">
								<Text fontSize="2xl" align="left">
									{item.title}
								</Text>
								<Text
									color="muted"
									noOfLines={2}
									align="left"
									sx={{
										'-webkit-box-orient': 'vertical',
										'-webkit-line-clamp': '2',
										overflow: 'hidden',
										display: '-webkit-box'
									}}
								>
									Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot
									cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups
									dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow. Candy donut tart pudding macaroon. Soufflé carrot cake choc late cake biscuit jelly beans chupa chups dragée. Cupcake toffee gummies lemon drops halvah. Cookie fruitcake jelly beans gingerbread soufflé marshmallow.
								</Text>
							</VStack>
						</Stack>
					))}
				</Stack>
			</Box>
		</Center>
	);
};

export default NewsFeed;
