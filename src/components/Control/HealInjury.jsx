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
import _ from 'lodash';
import { getCharacterById } from '../../redux/entities/characters';

const HealInjury = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const sortedCharacters = _.sortBy(characters, 'characterName');
	const [selectedChar, setSelectedChar] = useState('');
	const [injuriesToHeal, setInjuriesToHeal] = useState('');
	const char = useSelector(getCharacterById(selectedChar));

	const handleExit = () => {
		setInjuriesToHeal('');
		setSelectedChar('');
		props.closeModal();
	};

	const handleSubmit = () => {
		const data = { char, injuriesToHeal };
		try {
			socket.emit('request', {
				route: 'character',
				action: 'healInjury',
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

	const handleHealInjuries = (injIds) => {
		setInjuriesToHeal(injIds);
	};

	const renderCharacter = () => {
		if (!char) return <div>Please Select a character!</div>;

		return (
			<div>
				<div style={{ fontWeight: 'bold', fontSize: '16px' }}>
					{char.characterName}
				</div>
				{renderInjuries(char)}
			</div>
		);
	};

	const renderInjuries = (char) => {
		if (!char) return <div>Please Select a character!</div>;
		if (char.injuries.length === 0)
			return (
				<div>{char.characterName} currently does not have any injuries</div>
			);
		return (
			<div>
				<CheckboxGroup
					name="injuryList"
					onChange={(value) => {
						handleHealInjuries(value);
					}}
				>
					{char.injuries.map((injury, index) => {
						let autoheal = '';
						if (injury.permanent) {
							autoheal = 'Permanent injury';
						} else {
							const expires = injury.duration + injury.received;
							autoheal = `Will heal at the end of round ${expires}`;
						}
						return (
							<Checkbox value={injury._id} key={index}>
								<b>{injury.name}</b> received from action "{injury.actionTitle}
								". ({autoheal}).
							</Checkbox>
						);
					})}
				</CheckboxGroup>
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
				<Modal.Title>Play God and Heal a Character's Injuries</Modal.Title>
			</Modal.Header>
			<Panel>
				<SelectPicker
					block
					placeholder="Heal an Injury"
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
						Play God and Heal
					</Button>
				</ButtonGroup>
			</Modal.Footer>
		</Modal>
	);
};

export default HealInjury;
