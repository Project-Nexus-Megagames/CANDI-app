import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tag, Spinner, Box, Flex, Button } from '@chakra-ui/react';
import { getFadedColor, getThisEffort } from '../../../scripts/frontend';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../../socket';
import { getMyAssets } from '../../../redux/entities/assets';
import { CheckIcon } from '@chakra-ui/icons';
import CheckerPick from '../../Common/CheckerPick';
import NexusSlider from '../../Common/NexusSlider';

function EditAction({ action, showEdit, handleClose }) {
	if (!showEdit) {
		return <></>;
	}

	const actionLoading = useSelector((state) => state.actions.loading);
	const myCharacter = useSelector((state) => state.auth.myCharacter);
	const actionType = useSelector((state) => {
		return state.gameConfig.actionTypes?.find((el) => el.type.toLowerCase() === action.type.toLowerCase());
	});
	const myAssets = useSelector((state) => getMyAssets(state));

	const [description, setDescription] = useState(action.submission.description);
	const [intent, setIntent] = useState(action.submission.intent);
	const [name, setName] = useState(action.name);
	const [effort, setEffort] = useState(action.submission.effort);

	const characterEffort = getThisEffort(myCharacter.effort, actionType.type) + action.submission.effort.amount;

	const [max, setMax] = useState(characterEffort < actionType.maxEffort ? characterEffort : actionType.maxEffort);
	const [resources, setResources] = React.useState(action.submission.assets);

	const editEffort = (incoming, type) => {
		let thing;
		switch (type) {
			case 'effort':
				thing = { ...effort };
				if (typeof incoming === 'number') {
					thing.amount = parseInt(incoming);
				} else {
					thing.effortType = incoming;
					thing.amount = 0;

					setMax(characterEffort < actionType.maxEffort ? characterEffort : actionType.maxEffort);
				}
				setEffort(thing);
				break;
			default:
				console.log('UwU Scott made an oopsie doodle!');
		}
	};

	const handleSubmit = async () => {
		const data = {
			id: action._id,
			name: name,
			tags: action.tags,
			submission: {
				effort,
				assets: resources,
				description,
				intent
			}
		};
		socket.emit('request', { route: 'action', action: 'update', data });
		handleClose();
	};

	function formattedUsedAssets() {
		let temp = [];
		let assets = myAssets;
		assets = assets.filter((el) => el.uses <= 0 || el.status?.some((s) => s === 'used'));

		for (const asset of assets) {
			temp.push(asset._id);
		}
		return temp;
	}

	return (
		<Modal overflow style={{ width: '90%' }} size='md' isOpen={showEdit} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Edit {action.type} action {name}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					style={{
						border: `4px solid ${getFadedColor(action.type)}`,
						borderRadius: '5px',
						padding: '15px'
					}}
				>
					{actionLoading && <Spinner />}
					<form>
						Name:
						{10 - name.length > 0 && (
							<Tag style={{ color: 'black' }} colorScheme={'orange'} variant='solid'>
								{10 - name.length} more characters...
							</Tag>
						)}
						{10 - name.length <= 0 && (
							<Tag variant='solid' colorScheme={'green'}>
								<CheckIcon />
							</Tag>
						)}
						<textarea rows='1' value={name} className='textStyle' onChange={(event) => setName(event.target.value)}></textarea>
						Description:
						{10 - description.length > 0 && (
							<Tag style={{ color: 'black' }} colorScheme={'orange'} variant='solid'>
								{10 - description.length} more characters...
							</Tag>
						)}
						{10 - description.length <= 0 && (
							<Tag variant='solid' colorScheme={'green'}>
								<CheckIcon />
							</Tag>
						)}
						<textarea rows='6' value={description} className='textStyle' onChange={(event) => setDescription(event.target.value)} />
						<br />
						<Box>
							Intent:
							{10 - intent.length > 0 && (
								<Tag style={{ color: 'black' }} colorScheme={'orange'} variant='solid'>
									{10 - intent.length} more characters...
								</Tag>
							)}
							{10 - intent.length <= 0 && (
								<Tag variant='solid' colorScheme={'green'}>
									<CheckIcon />
								</Tag>
							)}
							<textarea rows='6' value={intent} className='textStyle' onChange={(event) => setIntent(event.target.value)} />
						</Box>
						<Flex>
							<Box
								style={{
									paddingTop: '25px',
									paddingLeft: '10px',
									textAlign: 'left'
								}}
								align='middle'
							>
								<h5 style={{ textAlign: 'center' }}>
									Effort {effort.amount} / {max}
									{effort === 0 && (
										<Tag style={{ color: 'black' }} colorScheme={'orange'}>
											Need Effort
										</Tag>
									)}
								</h5>

								<NexusSlider
									min={0}
									max={max}
									defaultValue={action.submission.effort.amount}
									value={effort.amount}
									onChange={(event) => editEffort(parseInt(event), 'effort')}
								></NexusSlider>
							</Box>

							<Box
								style={{
									paddingTop: '5px',
									paddingLeft: '10px',
									textAlign: 'left'
								}}
							>
								{' '}
								Resources
								<CheckerPick
									labelKey='name'
									valueKey='_id'
									data={myAssets.filter((el) => actionType.resourceTypes.some((ty) => ty.toLowerCase() === el.type.toLowerCase()))}
									style={{ width: '100%' }}
									disabledItemValues={formattedUsedAssets}
									onChange={(event) => setResources(event)}
									value={resources}
								/>
							</Box>
						</Flex>
					</form>
				</ModalBody>

				<ModalFooter>
					<Button
						isLoading={actionLoading}
						onClick={() => handleSubmit()}
						disabled={effort.amount <= 0 || description.length < 10 || intent.length < 10 || name.length < 10}
						colorScheme={description.length > 10 && intent.length > 10 ? 'green' : 'red'}
						appearance='primary'
					>
						<b>Submit</b>
					</Button>
					<Button onClick={handleClose} appearance='subtle'>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default EditAction;
