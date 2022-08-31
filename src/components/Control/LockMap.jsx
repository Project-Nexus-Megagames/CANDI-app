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
import { getLocationsByCharacterId } from '../../redux/entities/locations';
import { getCharacterById } from '../../redux/entities/characters';
import _ from 'lodash';

const LockMap = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const sortedCharacters = _.sortBy(characters, 'characterName');
	const [selectedChar, setSelectedChar] = useState('');
	const [locsToRemove, setLocsToRemove] = useState('');
	const char = useSelector(getCharacterById(selectedChar));
	const unlockedLocations = useSelector(
		getLocationsByCharacterId(selectedChar)
	);
	const sortedLocations = _.sortBy(unlockedLocations, 'name');

	const handleExit = () => {
		setSelectedChar('');
		setLocsToRemove('');
		props.closeModal();
	};

	const handleSubmit = () => {
		const data = { selectedChar, locsToRemove };
		try {
			socket.emit('request', {
				route: 'location',
				action: 'lockLocation',
				data
			});
			// eslint-disable-next-line no-empty
		} catch (err) {}
		handleExit();
	};

	const handleCharChange = (event) => {
		if (event) {
			setSelectedChar(event);
		}
	};

	const handleLocChange = (locIds) => {
		setLocsToRemove(locIds);
	};

	const renderUnlockedLocations = () => {
		if (unlockedLocations.length === 0)
			return <div>This characters hasn't unlocked any locations yet!</div>;
		return (
			<CheckboxGroup onChange={(value) => handleLocChange(value)}>
				{sortedLocations.map((item) => (
					<Checkbox value={item._id} key={item._id}>
						{item.name}
					</Checkbox>
				))}
			</CheckboxGroup>
		);
	};

	const renderLocation = () => {
		if (!selectedChar) return <div>Please Select a Character!</div>;

		return (
			<div>
				<div style={{ fontWeight: 'bold', fontSize: '16px' }}>
					{char.characterName}
				</div>
				{renderUnlockedLocations(selectedChar)}
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
				<Modal.Title>Lock Map Tile for Character</Modal.Title>
			</Modal.Header>
			<Panel>
				<SelectPicker
					block
					placeholder="Select a Character"
					onChange={(event) => handleCharChange(event)}
					data={sortedCharacters}
					valueKey="_id"
					labelKey="characterName"
				/>
			</Panel>
			<Panel>{renderLocation()}</Panel>
			<Modal.Footer>
				<ButtonGroup>
					<Button onClick={() => handleSubmit()} color="red">
						Lock Map
					</Button>
				</ButtonGroup>
			</Modal.Footer>
		</Modal>
	);
};

export default LockMap;
