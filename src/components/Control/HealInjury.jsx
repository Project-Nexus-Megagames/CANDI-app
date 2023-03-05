import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../socket';
import _ from 'lodash';
import { getCharacterById } from '../../redux/entities/characters';
import { Box } from '@chakra-ui/layout';
import { Button, ButtonGroup } from '@chakra-ui/button';
import SelectPicker from '../Common/SelectPicker';
import { CandiModal } from '../Common/CandiModal';
import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';

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
			// eslint-disable-next-line no-empty
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
								<b>{injury.name}</b> received from action &quot;
								{injury.actionTitle}
								&quot;. ({autoheal}).
							</Checkbox>
						);
					})}
				</CheckboxGroup>
			</div>
		);
	};

	return (
    <CandiModal open={props.show} title={"Play God and Heal a Character's Injuries"} 
    onHide={() => {
      handleExit();
    }}>
    <Box>
    <SelectPicker					
				placeholder="Heal an Injury"
				onChange={(event) => handleCharChange(event)}
				data={sortedCharacters}
				valueKey="_id"
				labelKey="characterName"
				/>
    </Box>
    <Box>{renderCharacter()}</Box>
    <ButtonGroup>
        <Button onClick={() => handleSubmit()} color="red">
        Play God and Heal
        </Button>
      </ButtonGroup>        
  </CandiModal>
	);
};

export default HealInjury;
