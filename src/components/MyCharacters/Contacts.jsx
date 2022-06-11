import React, { useState } from 'react';
import {
	CheckPicker,
	Modal,
	Button,
	SelectPicker,
	ButtonGroup,
	Panel,
	Divider,
	Placeholder
} from 'rsuite';
import { useSelector } from 'react-redux';
import {
	getPlayerCharacters,
	getMyCharacter,
	getMyUnlockedCharacters
} from '../../redux/entities/characters';
import socket from '../../socket';
import _ from 'lodash';

// TODO REFACTOR TO KNOWNCONTACTS

const Contacts = (props) => {
	const [selected, setSelected] = useState('');
	const [charsToShare, setCharsToShare] = useState([]);
	const myChar = useSelector(getMyCharacter);
	const playerCharacters = useSelector(getPlayerCharacters);
	const myUnlockedCharacters = useSelector(getMyUnlockedCharacters);
	console.log(myUnlockedCharacters);
	const charactersToShareWith = _.sortBy(
		myUnlockedCharacters.filter((el) => el.tags.some((tag) => tag === 'PC')),
		'characterName'
	);

	const contactShare = async () => {
		const data = {
			charId: selected._id, // character I'm sharing contacts with
			chars: charsToShare
		};
		socket.emit('request', { route: 'character', action: 'share', data });
		handleExit();
	};

	const handleChange = (event) => {
		if (event) {
			setSelected(playerCharacters.find((el) => el._id === event));
			setCharsToShare([]);
		}
	};

	const handleShare = (event) => {
		if (event) {
			setCharsToShare(event);
		}
	};

	const handleExit = () => {
		props.closeModal();
		setSelected('');
		setCharsToShare([]);
	};

	const renderCharacters = () => {
		console.log(selected);
		if (selected) {
			let unlockedCharactersToShare = [];
			for (const el of myUnlockedCharacters) {
				if (el._id !== selected._id) unlockedCharactersToShare.push(el);
			}
			unlockedCharactersToShare = _.sortBy(
				unlockedCharactersToShare,
				'characterName'
			);

			return (
				<Panel>
					Selected: {selected.characterName}
					{selected && (
						<CheckPicker
							block
							value={charsToShare}
							placeholder="Select Contact(s) to Share"
							onChange={(event) => handleShare(event)}
							data={unlockedCharactersToShare}
							valueKey="_id"
							labelKey="characterName"
						></CheckPicker>
					)}
					<Divider />
				</Panel>
			);
		} else {
			return (
				<Placeholder.Paragraph rows={5}>
					Awaiting Selection
				</Placeholder.Paragraph>
			);
		}
	};

	return (
		<Modal size="sm" show={props.show} onHide={() => handleExit()}>
			<SelectPicker
				block
				placeholder="Select Character to Share with"
				onChange={(event) => handleChange(event)}
				data={charactersToShareWith}
				valueKey="_id"
				labelKey="characterName"
			></SelectPicker>
			{renderCharacters()}
			<Modal.Footer>
				{selected && (
					<ButtonGroup>
						<Button onClick={() => contactShare()} color="blue">
							Share-yo-ho!
						</Button>
					</ButtonGroup>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default Contacts;
