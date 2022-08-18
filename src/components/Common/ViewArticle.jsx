import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, ButtonToolbar, Icon, Alert, Modal, Divider, Input, List, FlexboxGrid } from 'rsuite';
import { Drawer, DrawerBody, Button, ButtonGroup, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Center, Box, Avatar, HStack, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { getCharacterById } from '../../redux/entities/characters';
import { getDateString } from '../../scripts/dateTime';
import { useForm } from 'react-hook-form';
import socket from '../../socket';

const ViewArticle = (props) => {
	const [comment, setComment] = useState('');
	//let article = props.articles.find((el) => el._id === props.id);
	const article = props.selected;
	const { register, control, handleSubmit, reset, formState } = useForm({
		defaultValues: {}
	});

	const getAvatarUrl = (charId) => {
		const char = useSelector(getCharacterById(charId));
		return char?.profilePicture;
	};

	//const calculate = (reactions, type) => {
	//	let temp = reactions.filter((el) => el.emoji === 'thumbs-up');
	//	temp = temp.length;
	//	return temp;
	////};

	const handleComment = () => {
		//socket.emit('request', { route: 'article', action: 'comment', data: { id: article._id, user: props.user, comment } });
		console.log(comment);
		setComment('');
	};

	const deleteComment = () => {};

	const editComment = () => {};

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

							<Input value={comment} componentClass="textarea" placeholder="Leave a Comment!" rows={3} onChange={(value) => setComment(value)} />
							<Button bg="black" onClick={console.log('boop')}>
								Send Comment
							</Button>
							<List hover>
								{/*// TODO add character.id to comment*/}
								{article?.comments.map((comment, index) => (
									<List.Item key={index}>
										<FlexboxGrid align="middle">
											<FlexboxGrid.Item colspan={4}>
												{/*//{this.props.myCharacter.characterName === this.props.comment.commentor && */}
												<ButtonToolbar>
													<ButtonGroup>
														<IconButton size="xs" onClick={() => this.setState({ commentEdit: true })} color="blue" icon={<Icon icon="pencil" />} />
														<IconButton size="xs" onClick={() => this.setState({ deleteWarning: true })} color="red" icon={<Icon icon="trash2" />} />
													</ButtonGroup>
												</ButtonToolbar>
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={1}>{/* <TeamAvatar size={'sm'} code={'none'} />  */}</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={23}>
												<b>{comment.commentor}</b>
												<p>{comment.body}</p>
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</List.Item>
								))}
							</List>
						</Stack>
					</Center>
				</DrawerBody>
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
