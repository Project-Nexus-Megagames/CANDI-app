import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, HStack, Stack, StackDivider, Text, VStack, Center, Image, Divider } from '@chakra-ui/react';
import { IconButton, Icon } from 'rsuite';
import { getDateString } from '../../scripts/dateTime';
import ViewArticle from './ViewArticle';
import { getMyCharacter } from '../../redux/entities/characters';

const NewsFeed = (props) => {
	const [articleModal, setArticleModal] = useState(false);
	const [selected, setSelected] = useState();
	const myChar = useSelector(getMyCharacter);

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

	if (data.length === 0) return <p>Nothing to see here, move along!</p>;

	return (
		<Center maxW="960px" mx="auto">
			<Box bg="bg-surface" py="4">
				<Divider />
				<Stack divider={<StackDivider />} spacing="4">
					{data.map((item) => (
						<Stack key={item.articleId} fontSize="sm" px="4" spacing="4" margin="5px">
							<HStack>
								{item.imageURL && <Image src={item.imageURL} width="100px" />}
								<VStack align="left" width="960px">
									<Stack direction="row" justify="space-between" spacing="4">
										<HStack>
											<Text
												fontSize="2xl"
												align="left"
												onClick={() => {
													setSelected(item), setArticleModal(true);
												}}
											>
												{item.title}
											</Text>{' '}
										</HStack>
										<HStack>
											{item.author === myChar.characterName && item.type === 'newsArticle' && (
												<IconButton
													size="xs"
													onClick={() => {
														console.log(item.articleId);
													}}
													color="blue"
													icon={<Icon icon="edit" />}
													align="right"
												/>
											)}
											{item.author === myChar.characterName && item.type === 'newsArticle' && (
												<IconButton
													size="xs"
													onClick={() => {
														console.log(item.articleId);
													}}
													color="red"
													icon={<Icon icon="trash2" />}
													align="right"
												/>
											)}
										</HStack>
									</Stack>
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
