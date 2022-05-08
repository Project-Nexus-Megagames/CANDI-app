import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import {
	Modal,
	SelectPicker,
	ButtonGroup,
	Button,
	CheckboxGroup,
	Checkbox,
	Panel
} from 'rsuite';
import socket from '../../socket';
import { getCharacterById } from '../../redux/entities/characters';
import _ from 'lodash';

const LockCharacter = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const sortedCharacters = _.sortBy(characters, 'characterName');
	const [selectedChar, setSelectedChar] = useState('');
	const [charsToRemove, setCharsToRemove] = useState('');
	const char = useSelector(getCharacterById(selectedChar));

	const handleExit = () => {
		setCharsToRemove('');
		setSelectedChar('');
		props.closeModal();
	};

	const handleSubmit = () => {
		const data = { char, charsToRemove };
		try {
			socket.emit('request', {
				route: 'character',
				action: 'lockCharacter',
				data
			});
		} catch (err) {}
		handleExit();
	};

	const handleCharChange = (event) => {
		if (event) {
			setSelectedChar(event);
		}
	};

	const handleCharsToRemoveChange = (charIds) => {
		setCharsToRemove(charIds);
	};

	const filterForUnlockedCharacters = (charIds) => {
		let chars = [];
		for (const el of charIds) {
			chars.push(characters.find((char) => char._id === el));
		}
		chars = _.sortBy(chars, 'characterName');
		return chars;
	};

	const renderUnlockedCharacters = (char) => {
		const data = char.unlockedBy;
		console.log(data);
		if (data.length === 0)
			return <div>No character has unlocked this character yet!</div>;
		const chars = filterForUnlockedCharacters(data);
		console.log(chars);
		return (
			<CheckboxGroup onChange={(value) => handleCharsToRemoveChange(value)}>
				{chars.map((item) => (
					<Checkbox value={item._id} key={item._id}>
						{item.characterName}
					</Checkbox>
				))}
			</CheckboxGroup>
		);
	};

	const renderCharacter = () => {
		if (!char) return <div>Please Select a character!</div>;

		return (
			<div>
				<div style={{ fontWeight: 'bold', fontSize: '16px' }}>
					{char.characterName}
				</div>
				{renderUnlockedCharacters(char)}
			</div>
		);
	};

	return (
		<Modal
			overflow
			full
			size="lg"
			show={props.show}
			onHide={() => {
				handleExit();
			}}
		>
			<Modal.Header>
				<Modal.Title>Lock Character for Character</Modal.Title>
			</Modal.Header>
			<Panel>
				<SelectPicker
					block
					placeholder="Lock a Character"
					onChange={(event) => handleCharChange(event)}
					data={sortedCharacters}
					valueKey="_id"
					labelKey="characterName"
				/>
			</Panel>
			<Panel>{renderCharacter()}</Panel>
			<Modal.Footer>
				<ButtonGroup>
					<Button onClick={() => handleSubmit()} color="red">
						Lock Character
					</Button>
				</ButtonGroup>
			</Modal.Footer>
		</Modal>
	);
};

export default LockCharacter;
