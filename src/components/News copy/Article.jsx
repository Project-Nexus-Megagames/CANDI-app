import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import socket from '../../socket';
import { getFadedColor, getThisEffort } from '../../scripts/frontend';
import { CandiModal } from '../Common/Modal';
import { RemindOutline, Trash } from '@rsuite/icons';
import { Avatar, Box, Button, ButtonGroup, Divider, Flex, IconButton } from '@chakra-ui/react';
import { HiPencil } from 'react-icons/hi';
import { IoThumbsUp } from 'react-icons/io5';


// const mapStateToProps = (state) => ({
// 	user: state.auth.user,
// 	gamestate: state.gamestate,
// 	myCharacter: state.auth.user ? getMyCharacter(state) : undefined
// });


const Submission = (props) => {
	const [show, setShow] = React.useState(false);
	const [effort, setEffort] = React.useState({ effortType: 'Normal', amount: 0 });
	const [resources, setResources] = React.useState([]);
	const [description, setDescription] = React.useState('');
	const [intent, setIntent] = React.useState('');
	const [name, setName] = React.useState('');
	const [inputValue, setInputValue] = React.useState('');
	const [tags, setTags] = React.useState([]);
	const [max, setMax] = React.useState(0);
	const [infoAsset, setInfoAsset] = React.useState(false);

	// useEffect(() => {
	// 	if (props.submission) {
	// 		setEffort(props.submission.effort)
	// 		setResources(props.submission.assets)
	// 		setDescription(props.submission.description)
	// 		setIntent(props.submission.intent)
	// 		setName(article.name)
	// 		setTags(props.submission.tags)
	// 		setMax(getThisEffort(props.myCharacter.effort, props.submission.effort.effortType))
	// 	}
	// }, [props.submission]);

	const calculate = (reactions, type) => {
		let temp = reactions.filter((el) => el.emoji === 'thumbs-up');
		temp = temp.length;
		return temp;
	};

	const handleInputConfirm = () => {
		const nextTags = inputValue ? [...article.tags, inputValue] : article.tags;
		setShow(false);
		setInputValue('');

		const data = {
			id: article._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	const handleTagRemove = (tag) => {
		const nextTags = article.tags.filter((item) => item !== tag);
		const data = {
			id: article._id,
			tags: nextTags
		};
		socket.emit('request', { route: 'action', action: 'update', data });
	};

	const article = props.article;
	return (
		<div>
			<Divider vertical />
			<Box
				collapsible
				header={
					<span>
						{/* <TeamAvatar size={"sm"} code={article.agency} /> */}
						<Flex align="middle" style={{}} justify="space-between">

							<Avatar circle size="md" src={`/images/.jpg`} alt="?" style={{ maxHeight: '50vh' }} />

							<Box >
								<h5>{article.headline}</h5>
								{article.publisher.characterName}
								<p className="slim-text">{/* {getTime(props.submission.createdAt)} */}TODO TIME HERE</p>
							</Box>

							<Box>
								{(props.myCharacter._id === article.publisher._id || props.myCharacter.tags.some((el) => el === 'Control')) && (
									<ButtonGroup>
										<IconButton
											disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > article.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
											size="sm"
											onClick={() => props.handleEdit(article)}
											colorScheme="blue"
											icon={<HiPencil />}
										/>
										<IconButton
											disabled={(props.gamestate.status !== 'Active' || props.gamestate.round > article.round) && !props.myCharacter.tags.some((el) => el === 'Control')}
											size="sm"
											onClick={() => setShow('delete')}
											colorScheme="red"
											icon={<Trash />}
										/>
									</ButtonGroup>
								)}
							</Box>
						</Flex>
					</span>
				}
				style={{ border: `4px solid ${getFadedColor(article.type)}`, borderRadius: '5px', padding: '15px' }}
			>
				<Box className="blob">
					<ReactMarkdown children={article.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
				</Box>
				<IconButton icon={<IoThumbsUp />} onClick={() => socket.emit('request', { route: 'article', action: 'react', data: { id: article._id, user: props.user, emoji: 'thumbs-up' } })}>
					{calculate(article.reactions, 'thumbs-up')}
				</IconButton>
			</Box>

      <CandiModal title={
        <div>
          <RemindOutline style={{ color: '#ffb300', fontSize: 24 }} />
          {'  '}
          Warning! Are you sure you want delete your action?
          <RemindOutline style={{ color: '#ffb300', fontSize: 24 }} />
        </div>
      }>
					<Button onClick={() => props.handleHide()} appearance="primary">
						I am Sure!
					</Button>
					<Button onClick={() => setShow(false)} appearance="subtle">
						Nevermind!
					</Button>        
      </CandiModal>

			{/* <Modal size="sm" show={show === 'delete'} onHide={() => setShow(false)}>
				<Modal.Body>
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
					{'  '}
					Warning! Are you sure you want delete your action?
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }} />
				</Modal.Body>
				<Modal.Footer>

				</Modal.Footer>
			</Modal> */}
		</div>
	);
};

export default (Submission);
