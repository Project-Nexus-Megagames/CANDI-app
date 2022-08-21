import React, { useState, useEffect } from 'react';
import { Avatar, Box, HStack, Stack, StackDivider, Text, VStack, Center, Image, Divider } from '@chakra-ui/react';
import { getDateString } from '../../scripts/dateTime';
import ViewArticle from './ViewArticle';

const NewsFeed = (props) => {
	const [articleModal, setArticleModal] = useState(false);
	const [selected, setSelected] = useState();
	const [searchQuery, setSearchQuery] = useState('');

	const data = props.data;

	useEffect(() => {
		if (selected) {
			const newSelected = data.find((el) => el.articleId === selected.articleId);
			setSelected(newSelected);
		}
	}, [data]);

	const translateComment = (number) => {
		if (number === 1) return 'comment';
		return 'comments';
	};

	// TODO add search function on top
	// TODO add display of image if image is attached
	if (data.length === 0) return <p>Nothing to see here, move along!</p>;

	return (
		<Center maxW="960px" mx="auto">
			<Box bg="bg-surface" py="4">
				<Divider />
				<Stack divider={<StackDivider />} spacing="4">
					{data.map((item) => (
						<Stack key={item.articleId} fontSize="sm" px="4" spacing="4" margin="5px">
							<HStack>
								{item.imageURL && <Image src={item.imageURL} width="200px" />}
								<Image src="https://images.unsplash.com/photo-1616225372747-5b3894991eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" width="100px" />
								<VStack align="left">
									<Text
										fontSize="2xl"
										align="left"
										onClick={() => {
											setSelected(item), setArticleModal(true);
										}}
									>
										{item.title}
									</Text>
									<Box>
										<Stack direction="row" justify="space-between" spacing="4">
											<HStack>
												<Avatar src={item.authorProfilePicture} boxSize="10" />
												<Text fontWeight="medium" color="emphasized" align="left" fontSize="xs">
													by {item.author}
												</Text>
											</HStack>
											<HStack>
												<Text color="muted">{getDateString(item.date)}</Text>
											</HStack>
										</Stack>
									</Box>
									<Text
										onClick={() => {
											setSelected(item), setArticleModal(true);
										}}
										color="muted"
										noOfLines={2}
										align="left"
									>
										{item.body}
									</Text>
									<Text align="right">
										{item.comments?.length} {translateComment(item.comments?.length)}
									</Text>
								</VStack>
							</HStack>
						</Stack>
					))}
				</Stack>
			</Box>
			<ViewArticle isOpen={articleModal} show={articleModal} selected={selected} closeDrawer={() => setArticleModal(false)} />
		</Center>
	);
};

export default NewsFeed;
