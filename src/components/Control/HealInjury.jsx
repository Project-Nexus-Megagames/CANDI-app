import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../socket';
import _ from 'lodash';
import { getCharacterById } from '../../redux/entities/characters';
import SelectPicker from '../Common/SelectPicker';
import { CandiModal } from '../Common/CandiModal';
import { Box, Tag, TagLabel, Button, ButtonGroup, Checkbox, CheckboxGroup } from '@chakra-ui/react';

const HealInjury = ({ show, character, closeModal }) => {
  const characters = useSelector((state) => state.characters.list);
  const sortedCharacters = _.sortBy(characters, 'characterName');
  const [selectedChar, setSelectedChar] = useState(character ? character : '');
  const [injuriesToHeal, setInjuriesToHeal] = useState('');
  const char = useSelector(getCharacterById(selectedChar));

  const handleExit = () => {
    setInjuriesToHeal('');
    setSelectedChar('');
    closeModal();
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
    } catch (err) {
      console.log(err)
    }
    handleExit();
  };

  const handleCharChange = (event) => {
    if (event) {
      setSelectedChar(event);
    }
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
            setInjuriesToHeal(value);
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
                <Tag margin={'3px'} variant={'solid'} colorScheme='red'  >
                  <img src="/images/injury.png" alt="injury" width={'35px'} style={{ margin: '3px 3px 3px 0px' }} />
                  <TagLabel>{injury.name}</TagLabel>

                </Tag>
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </div>
    );
  };

  return (
    <CandiModal open={show} title={"Play God and Heal a Character's Injuries"}
      onHide={() => {
        handleExit();
      }}>
      <Box>
        <SelectPicker
          placeholder="Heal an Injury"
          onChange={(event) => handleCharChange(event)}
          data={sortedCharacters.filter(el => el.injuries.length > 0)}
          valueKey="_id"
          label="characterName"
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
