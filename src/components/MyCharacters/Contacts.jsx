import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPlayerCharacters, getMyUnlockedCharacters } from '../../redux/entities/characters';
import socket from '../../socket';
import _ from 'lodash';
import { Box, Button, ButtonGroup, Divider, Modal } from '@chakra-ui/react';
import CheckerPick from '../Common/CheckerPick';
import SelectPicker from '../Common/SelectPicker';

// TODO REFACTOR TO KNOWNCONTACTS

const Contacts = (props) => {
	const [selected, setSelected] = useState('');
	const [charsToShare, setCharsToShare] = useState([]);
	const playerCharacters = useSelector(getPlayerCharacters);
	const myUnlockedCharacters = useSelector(getMyUnlockedCharacters);
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
		if (selected) {
			let unlockedCharactersToShare = [];
			for (const el of myUnlockedCharacters) {
				if (el._id !== selected._id) unlockedCharactersToShare.push(el);
			}
			unlockedCharactersToShare = _.sortBy(unlockedCharactersToShare, 'characterName');

			return (
				<Box>
					Selected: {selected.characterName}
					{selected && (
						<CheckerPick
							block
							value={charsToShare}
							placeholder="Select Contact(s) to Share"
							onChange={(event) => handleShare(event)}
							data={unlockedCharactersToShare}
							valueKey="_id"
							labelKey="characterName"
						></CheckerPick>
					)}
					<Divider />
				</Box>
			);
		} else {
			return <div >Awaiting Selection</div>;
		}
	};

	return (
		<Modal size="sm" isOpen={props.show} onClose={() => handleExit()}>
			<SelectPicker block placeholder="Select Character to Share with" onChange={(event) => handleChange(event)} data={charactersToShareWith} valueKey="_id" labelKey="characterName"></SelectPicker>
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
