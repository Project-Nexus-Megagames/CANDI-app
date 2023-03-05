import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../socket';
import { getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';
import _ from 'lodash';
import SelectPicker from '../Common/SelectPicker';
import { Box } from '@chakra-ui/layout';
import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';
import { Modal, ModalBody } from '@chakra-ui/modal';
import { Button, ButtonGroup } from '@chakra-ui/button';
import { CandiModal } from '../Common/CandiModal';

const ManageContacts = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const playerCharacters = useSelector(getPlayerCharacters);
	const sortedCharacters = _.sortBy(playerCharacters, 'characterName');
	const [selectedChar, setSelectedChar] = useState('');
	const char = useSelector(getCharacterById(selectedChar));
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		if (char) {
			setContacts(char.knownContacts.map((el) => el._id));
		}
	}, [char]);

	const handleExit = () => {
		setContacts([]);
		setSelectedChar('');
		props.closeModal();
	};

	const handleSubmit = () => {
		const data = { charId: char._id, contacts };
		try {
			socket.emit('request', { route: 'character', action: 'manageContacts', data });
		} catch (err) {
			console.log(err);
		}
		handleExit();
	};

	const handleCharChange = (event) => {
		if (event) {
			setSelectedChar(event);
		}
	};

	const handleContactChange = (charIds) => {
		setContacts(charIds);
	};

	const renderContacts = (char) => {
		let contactsToManage = characters.filter((el) => el._id !== char._id);
		contactsToManage = _.sortBy(contactsToManage, 'characterName');
		return (
			<CheckboxGroup value={contacts} onChange={(value) => handleContactChange(value)}>
				{contactsToManage.map((item) => (
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
				<div style={{ fontWeight: 'bold', fontSize: '16px' }}>{char.characterName}</div>
				{renderContacts(char)}
			</div>
		);
	};

	return (
      <CandiModal open={props.show} title={"Manage a PC's Contacts"}>
        <Box>
          <SelectPicker block placeholder="Choose PC" onChange={(event) => handleCharChange(event)} data={sortedCharacters} valueKey="_id" label="characterName" />
        </Box>
        <Box>{renderCharacter()}</Box>
        <ButtonGroup>
            <Button onClick={() => handleSubmit()} color="red">
              Change Contacts
            </Button>
          </ButtonGroup>        
      </CandiModal>
	);
};

export default ManageContacts;
