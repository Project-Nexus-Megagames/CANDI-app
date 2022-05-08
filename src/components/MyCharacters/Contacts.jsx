import React, { useEffect, useState } from 'react';
import {
	CheckPicker,
	Modal,
	Button,
	SelectPicker,
	ButtonGroup,
	Panel,
	InputNumber,
	Divider,
	Toggle,
	Placeholder
} from 'rsuite';
import { useSelector } from 'react-redux';
import {
	getMyCharacter,
	getPlayerCharacters
} from '../../redux/entities/characters';
import socket from '../../socket';
import _ from 'lodash';

const Contacts = (props) => {
	const [selected, setSelected] = useState('');
	const [charsToUnlock, setCharsToUnlock] = useState([]);
	const myCharacter = useSelector(getMyCharacter);
	const playerCharacters = useSelector(getPlayerCharacters);
	const allCharacters = useSelector((state) => state.characters.list);

	const charactersToDisplay = _.sortBy(
		playerCharacters.filter((el) => el._id !== myCharacter._id),
		'characterName'
	);

	const contactShare = async () => {
		const data = {
			_id: selected._id, // character I'm sharing contacts with
			chars: charsToUnlock
		};
		socket.emit('request', { route: 'character', action: 'share', data });
		handleExit();
	};

	const handleChange = (event) => {
		if (event) {
			setSelected(playerCharacters.find((el) => el._id === event));
			setCharsToUnlock([]);
		}
	};

	const handleShare = (event) => {
		if (event) {
			setCharsToUnlock(event);
		}
	};

	const handleExit = () => {
		props.closeModal();
		setSelected('');
		setCharsToUnlock([]);
	};

	const renderCharacters = () => {
		if (selected) {
			let myUnlockedCharacters = [];
			for (const el of allCharacters) {
				if (el.unlockedBy.some((id) => id === myCharacter._id))
					if (el._id !== selected._id) myUnlockedCharacters.push(el);
				myUnlockedCharacters = _.sortBy(myUnlockedCharacters, 'characterName');
			}
			return (
				<Panel>
					Selected: {selected.characterName}
					{selected && (
						<CheckPicker
							block
							value={charsToUnlock}
							placeholder="Select Contact(s) to Share"
							onChange={(event) => handleShare(event)}
							data={myUnlockedCharacters}
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
				data={charactersToDisplay}
				valueKey="_id"
				labelKey="characterName"
			></SelectPicker>
			{renderCharacters()}
			<Modal.Footer>
				{selected && (
					<ButtonGroup>
						<Button onClick={() => contactShare()} color="blue">
							Edit
						</Button>
					</ButtonGroup>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default Contacts;
