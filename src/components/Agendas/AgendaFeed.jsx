import React, { useState } from 'react';
import { Avatar, Box, HStack, Stack, StackDivider, Text, VStack, Center, Image } from '@chakra-ui/react';
import { useSelector, connect } from 'react-redux';
import { getCharacterById } from '../../redux/entities/characters';
import { getDateString } from '../../scripts/dateTime';
import ViewArticle from './ViewArticle';
import { getAgendaActions } from '../../redux/entities/playerActions';

const AgendaFeed = () => {
	const agendas = useSelector(getAgendaActions);

	agendas.sort((a, b) => {
		let da = new Date(a.updatedAt),
			db = new Date(b.updatedAt);
		return db - da;
	});

	const [articleModal, setArticleModal] = useState(false);
	const [selected, setSelected] = useState();

	const translateComment = (number) => {
		if (number === 1) return 'comment';
		return 'comments';
	};

	const getAvatarUrl = (charId) => {
		const char = useSelector(getCharacterById(charId));
		return char?.profilePicture;
	};

	// TODO add search function on top
	// TODO add display of image if image is attached

	return (
		<Center maxW="960px" mx="auto">
			<Box bg="bg-surface" py="4">
				<Stack divider={<StackDivider />} spacing="4">
					{agendas.map((item) => (
						<Stack key={item._id} fontSize="sm" px="4" spacing="4" margin="5px">
							<HStack>
								<VStack align="left">
									<Text
										fontSize="2xl"
										align="left"
										onClick={() => {
											setSelected(item), setArticleModal(true);
										}}
									>
										{item.name}
									</Text>
									<Box>
										<Stack direction="row" justify="space-between" spacing="4">
											<HStack>
												<Avatar src={getAvatarUrl(item.creator_id)} boxSize="10" />
												<Text fontWeight="medium" color="emphasized" align="left" fontSize="xs">
													by {item.creator.characterName}
												</Text>
											</HStack>
											<HStack>
												<Text color="muted">{getDateString(item.updatedAt)}</Text>
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
										{item.submission?.description}
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

export default AgendaFeed;
