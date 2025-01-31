import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../socket';
import { getCharacterById, getPlayerCharacters } from '../../redux/entities/characters';
import _ from 'lodash';
import SelectPicker from '../Common/SelectPicker';
import { Box, CheckboxGroup, Checkbox, Input, Stack, Tag, Button, ButtonGroup } from '@chakra-ui/react';
import { CandiModal } from '../Common/CandiModal';
import CharacterTag from '../Common/CharacterTag';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const ManageContacts = (props) => {
	const characters = useSelector((state) => state.characters.list);
	const playerCharacters = useSelector(getPlayerCharacters);
	const sortedCharacters = _.sortBy(playerCharacters, 'characterName');
	const [selectedChar, setSelectedChar] = useState(props.defaultCharacter || '');
	const char = useSelector(getCharacterById(selectedChar));
	const [contacts, setContacts] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		if (char) {
			setContacts(char.knownContacts.map((el) => el));
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
    contactsToManage = contactsToManage.filter(
      (char) =>
        char.characterName.toLowerCase().includes(filter.toLowerCase()) ||
        char.characterTitle.toLowerCase().includes(filter.toLowerCase()) ||
        char.tags.some((el) => el.toLowerCase().includes(filter.toLowerCase()))
    )
		contactsToManage = _.sortBy(contactsToManage, 'characterName');
		return (
			<CheckboxGroup value={contacts} onChange={(value) => handleContactChange(value)}>
        <Stack>
          {contactsToManage.map((item) => (
            <Checkbox value={item._id} key={item._id}>
              <CharacterTag character={item} handleSelect={() => handleContactChange(item)} />
              {item.tags && item.tags.map((item) =>
                <Tag key={item} variant={'solid'} style={{ backgroundColor: getFadedColor(item), color: getTextColor(item), textTransform: 'capitalize', margin: '4px' }} >{item}</Tag>
              )}
            </Checkbox>
          ))}          
        </Stack>

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
      <CandiModal onClose={handleExit} open={props.show} title={"Manage a PC's Contacts"}>
        <Box>
          <SelectPicker 
          value={char?._id}
          block 
          placeholder="Choose PC" 
          onChange={(event) => handleCharChange(event)} 
          data={sortedCharacters} 
          valueKey="_id" 
          label="characterName" />
        </Box>

        <Input onChange={(e) =>setFilter(e.target.value)} />
        {filter}
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
