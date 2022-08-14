import React from 'react';
import { Avatar, Box, HStack, Stack, StackDivider, Text, VStack, Center } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getCharacterById } from '../../redux/entities/characters';
import { getDateString } from '../../scripts/dateTime';

const NewsFeed = (props) => {
	const data = props.data;

	const translateComment = (number) => {
		if (number === 1) return 'comment';
		return 'comments';
	};

	const getAvatarUrl = (charId) => {
		const char = useSelector(getCharacterById(charId));
		return char?.profilePicture;
	};

	return (
		<Center maxW="960px" mx="auto">
			<Box bg="bg-surface" py="4">
				<Stack divider={<StackDivider />} spacing="4">
					{data.map((item) => (
						<Stack key={item.id} fontSize="sm" px="4" spacing="4" margin="5px">
							<Stack direction="row" justify="space-between" spacing="4">
								<HStack spacing="3">
									<Avatar src={getAvatarUrl(item.authorId)} boxSize="10" />
									<Box>
										<Text fontWeight="medium" color="emphasized">
											{item.author}
										</Text>
									</Box>
								</HStack>
								<Text color="muted">{getDateString(item.date)}</Text>
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
									{item.body}
								</Text>
								<Text align="right">
									{item.comments?.length} {translateComment(item.comments?.length)}
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
