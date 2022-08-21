import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Icon, Input, Alert, List, FlexboxGrid } from 'rsuite';
import { useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, AlertDialogHeader, AlertDialogFooter, Drawer, DrawerBody, Button, ButtonGroup, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Center, Box, Avatar, HStack, Stack, Text, VStack, setScript } from '@chakra-ui/react';
import { getCharacterById } from '../../redux/entities/characters';
import { getDateString } from '../../scripts/dateTime';
import { getMyCharacter } from '../../redux/entities/characters';
import { getAgendaActions } from '../../redux/entities/playerActions';
import socket from '../../socket';

const ViewArticle = (props) => {
	const [newComment, setNewComment] = useState('');
	const [commentId, setCommentId] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const myChar = useSelector(getMyCharacter);
	const agendaActions = useSelector(getAgendaActions);

	let article = props.selected;

	const getAgenda = (articleId) => {
		article = agendaActions.find((el) => el._id === articleId);
		console.log(article);
		return article;
	};

	const getAvatarUrl = (charId) => {
		const char = useSelector(getCharacterById(charId));
		return char?.profilePicture;
	};

	useEffect(() => {
		socket.on('actionCommentDeleted', (payload) => {
			article = getAgenda(payload);
		});
	}, []);

	//const calculate = (reactions, type) => {
	//	let temp = reactions.filter((el) => el.emoji === 'thumbs-up');
	//	temp = temp.length;
	//	return temp;
	////};

	const deleteComment = (commentId) => {
		console.log(commentId);
		const data = {
			id: props.selected.articleId,
			comment: commentId
		};
		socket.emit('request', {
			route: 'action',
			action: 'deleteSubObject',
			data
		});
		setCommentId('');
		onClose;
	};

	const handleComment = () => {
		//socket.emit('request', { route: 'article', action: 'comment', data: { id: article._id, user: props.user, comment } });
		console.log(newComment);
		setNewComment('');
	};

	return (
		<Drawer
			isOpen={props.isOpen}
			placement="top"
			size="full"
			show={props.show}
			closeOnEsc="true"
			onClose={() => {
				props.closeDrawer();
			}}
		>
			<DrawerOverlay />
			<DrawerContent bgColor="#0f131a">
				<DrawerCloseButton />
				<DrawerHeader align="center">
					<Text>{article?.title}</Text>
				</DrawerHeader>
				<DrawerBody>
					<Center maxW="960px" mx="auto">
						<Stack fontSize="sm" px="4" spacing="4" margin="5px">
							<Stack direction="row" justify="space-between" spacing="4">
								<HStack spacing="3">
									<Avatar src={getAvatarUrl(article?.authorId)} boxSize="10" />
									<Box>
										<Text fontWeight="medium" color="emphasized">
											{article?.author}
										</Text>
									</Box>
								</HStack>
								<Text color="muted">{getDateString(article?.date)}</Text>
							</Stack>
							<VStack>
								<Text color="muted" align="left" style={{ whiteSpace: 'pre-wrap' }}>
									{article?.body}
								</Text>
							</VStack>

							<Input value={newComment} componentClass="textarea" placeholder="Leave a Comment!" rows={3} onChange={(value) => setNewComment(value)} />
							<Button bg="black" onClick={() => handleComment()}>
								Send Comment
							</Button>
							<List hover>
								{/*// TODO add character.id to comment*/}

								{article?.comments.map((comment, index) => (
									<List.Item key={index}>
										<Stack align="left">
											<HStack align="left">{/* <TeamAvatar size={'sm'} code={'none'} />  */}</HStack>
											<VStack align="left">
												<Stack direction="row" justify="space-between" spacing="4">
													<HStack>
														<b>{comment.commentor}</b>
													</HStack>
													<HStack>
														<ButtonGroup>
															{comment.commentor === myChar.characterName && (
																<IconButton
																	size="xs"
																	onClick={() => {
																		onOpen(setCommentId(comment._id));
																	}}
																	color="red"
																	icon={<Icon icon="trash2" />}
																/>
															)}
														</ButtonGroup>
													</HStack>
												</Stack>
												<p>{comment.body}</p>
											</VStack>
										</Stack>
									</List.Item>
								))}
							</List>
						</Stack>
					</Center>
				</DrawerBody>
				<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
					<AlertDialogOverlay>
						<AlertDialogContent bgColor="#0f131a">
							<AlertDialogHeader fontSize="lg" fontWeight="bold">
								Delete Customer
							</AlertDialogHeader>
							<AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
							<AlertDialogFooter>
								<Button ref={cancelRef} onClick={onClose} bgColor="black">
									Cancel
								</Button>
								<Button colorScheme="red" onClick={() => onClose(deleteComment(commentId))} ml={3}>
									Delete
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>
			</DrawerContent>
		</Drawer>

		//		</Modal.Body>
		//		<Modal.Footer>
		//			<ButtonToolbar style={{ float: 'right' }}>
		//				{/*<IconButton icon={<Icon icon="thumbs-up" />} onClick={() => socket.emit('request', { route: 'article', action: 'react', data: { id: article._id, user: props.user, emoji: 'thumbs-up' } })}>
		//					{calculate(article.reactions, 'thumbs-up')}
		//				</IconButton>*/}
		//				<Button color="red" onClick={() => props.onClose()} appearance="subtle">
		//					Close
		//				</Button>
		//			</ButtonToolbar>
		//		</Modal.Footer>
		//	</React.Fragment>
		//);
	);
};

export default ViewArticle;
