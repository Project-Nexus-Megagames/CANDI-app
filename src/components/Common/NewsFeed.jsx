import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	Avatar,
	Box,
	HStack,
	Stack,
	StackDivider,
	Text,
	VStack,
	Center,
	Image,
	Divider,
	useDisclosure,
	AlertDialogContent,
	AlertDialogBody,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialog,
	Button,
	AlertDialogOverlay
} from '@chakra-ui/react';
import { IconButton, Icon, ButtonGroup } from 'rsuite';
import { getDateString } from '../../scripts/dateTime';
import ViewArticle from './ViewArticle';
import { getMyCharacter } from '../../redux/entities/characters';
import { CandiDrawer } from './Drawer';
import { ArticleForm } from '../News/ArticleForm';
import socket from '../../socket';

const NewsFeed = (props) => {
	const [articleModal, setArticleModal] = useState(false);
	const [selected, setSelected] = useState();
	const [article, setArticle] = useState('');
	const [articleId, setArticleId] = useState('');
	const myChar = useSelector(getMyCharacter);
	const data = props.data;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete, cancelRef } = useDisclosure();

	console.log(data);

	useEffect(() => {
		if (selected) {
			const newSelected = data.find((el) => el.articleId === selected.articleId);
			setSelected(newSelected);
		}
	}, [data]);

	const showEditAndDelete = (item) => {
		return ((item.author === myChar.characterName && item.tags?.some((tag) => tag === 'Draft')) || myChar.tags.some((tag) => tag.toLowerCase() === 'control')) && item.type === 'newsArticle';
	};

	const isDraft = (item) => {
		return item.tags?.some((tag) => tag === 'Draft');
	};

	const translateComment = (number) => {
		if (number === 1) return 'comment';
		return 'comments';
	};

	const deleteArticle = (articleId) => {
		socket.emit('request', { route: 'article', action: 'delete', data: { id: articleId } });
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
											{isDraft(item) && (
												<Text fontSize="2xl" color="red">
													DRAFT ARTICLE
												</Text>
											)}
											<Text
												fontSize="2xl"
												align="left"
												onClick={() => {
													setSelected(item), setArticleModal(true);
												}}
											>
												{item.title}
											</Text>
										</HStack>
										<HStack>
											{showEditAndDelete(item) && (
												<ButtonGroup>
													<IconButton size="xs" onClick={() => onOpen(setArticle(item))} color="blue" icon={<Icon icon="edit" />} align="right" />
													<IconButton
														size="xs"
														onClick={() => {
															onOpenDelete(setArticleId(item.articleId));
														}}
														color="red"
														icon={<Icon icon="trash2" />}
														align="right"
													/>
												</ButtonGroup>
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
			<CandiDrawer open={isOpen} title="" onClose={onClose} onOpen={onOpen}>
				<ArticleForm article={article} onSubmit={onClose} onCancel={onClose} />
			</CandiDrawer>

			<AlertDialog isOpen={isOpenDelete} leastDestructiveRef={cancelRef} onClose={onCloseDelete}>
				<AlertDialogOverlay>
					<AlertDialogContent bgColor="#0f131a">
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Comment
						</AlertDialogHeader>
						<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onCloseDelete} bgColor="black">
								Cancel
							</Button>
							<Button colorScheme="red" onClick={() => onCloseDelete(deleteArticle(articleId))} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Center>
	);
};

export default NewsFeed;
