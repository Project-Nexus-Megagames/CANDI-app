import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import _ from 'lodash';
import { getCharacterById, getMyCharacter, getUnlockedCharacters } from '../../../redux/entities/characters';
import WordDivider from '../../Common/WordDivider';
import InputNumber from '../../Common/InputNumber';
import { Box, Button, ButtonGroup, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, SimpleGrid, Switch, Text, VStack } from '@chakra-ui/react';
import CheckerPick from '../../Common/CheckerPick';
import SelectPicker from '../../Common/SelectPicker';
import AssetForm from '../../Common/AssetForm';
import CharacterListItem from '../../Common/CharacterListItem';
import socket from '../../../socket';

const NewEffects = (props) => {
  const [type, setType] = useState('');
  const [selected, setSelected] = useState(undefined);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [array, setArray] = useState([]);
  const [locationsToDisplay, setLocationsToDisplay] = useState([]);
  const [charactersToDisplay, setCharactersToDisplay] = useState([]);
  const myChar = useSelector(getMyCharacter);

  const assets = useSelector((state) => state.assets.list);
  const locations = useSelector((state) => state.locations.list);
  const characters = useSelector((state) => state.characters.list);
  const loggedInUser = useSelector((state) => state.auth.user);
  const sortedCharacters = _.sortBy(charactersToDisplay, 'characterName');
  const sortedLocations = _.sortBy(locationsToDisplay, 'name');
  const creatorChar = useSelector(getCharacterById(props.selected.creator._id));
  let playerContacts = useSelector(getUnlockedCharacters(creatorChar));

  useEffect(() => {
    switch (type) {
      case 'bond':
      case 'asset':
        let newAsset = [];
        for (const bond of assets.filter((el) => el.account == props.selected.account || el.account == props.selected.account._id)) {
          const bondData = {
            name: `${bond.type} '${bond.name}'`,
            type: bond.type,
            _id: bond._id
          };
          newAsset.push(bondData);
        }
        setArray(newAsset);
        break;
      case 'new':
        setSelected({
          name: '',
          description: '',
          dice: '',
          level: '',
          ownerCharacter: props.selected.creator._id
        });
        break;
      case 'aspect':
      case 'locationStats':
        let asdasd = locations.find(el => el._id == props.selected?.location?._id);
        if (!asdasd) break;
        setSelected(asdasd.locationStats);
        setSelectedLocation(props.selected?.location?._id)
        break;
      case 'addInjury':
        setSelected({
          name: '',
          duration: '0',
          ownerCharacter: props.selected.creator._id,
          permanent: false
        });
        break;
      case 'character':
        let charSelect = [];
        characters.forEach((char) => {
          if (playerContacts.findIndex((id) => id === char._id) !== -1) return;
          else if (char._id === props.selected.creator._id) return;
          else charSelect.push(char);
        });
        setCharactersToDisplay(charSelect);
        break;
      case 'unlockMapTile':
        let locSelect = [];
        locations.forEach((el) => {
          if (el.unlockedBy.findIndex((id) => id._id === props.selected.creator._id) !== -1) return;
          locSelect.push(el);
        });
        setLocationsToDisplay(locSelect);
        break;
      default:
        break;
    }
  }, [type]);

  const handleExit = () => {
    setType('');
    setSelected(undefined);
    props.hide();
  };

  const handleAssetSelect = (selected) => {
    selected = assets.find(el => el._id === selected)
    setSelected(selected);
  };

  const handleLocSelect = (selected) => {
    let selectedLocations = [];
    for (const el of selected) {
      const loc = locations.find((loc) => loc._id === el);
      selectedLocations.push(loc._id);
    }
    setSelected(selectedLocations);
  };

  const handleCharSelect = (selected) => {
    setArray(selected);
  };

  const handleAddInjury = (type, change) => {
    let temp = { ...selected };
    temp[type] = change;
    temp.received = props.selected.round;
    temp.actionTitle = props.selected.name;
    setSelected(temp);
  };

  const handleHealInjuries = (injuries) => {
    setSelected(injuries);
  };

  const handleType = (type) => {
    setType(type);
    setSelected(undefined);
  };

  const handleEditObject = (type, change) => {
    let temp = [ ...selected ];
    let statIndex = temp.findIndex(el => el.type == type)
    let temp0 = { ...temp[statIndex] };
    temp0['statAmount'] = parseInt(change);

    temp[statIndex] = temp0;
    setSelected(temp);
  };

  const handleEditArray = (type, change) => {
    let temp = [ ...selected ];
    const index = temp.findIndex(el => el.type == type)
    temp[index].type = change;
    setSelected(temp);
  };

  const renderAspects = () => {
    return (
      <div>
        <WordDivider word="Please enter how much you want to ADD (positive number) or SUBTRACT (negative number) from one
					or more aspects" />
          {selected?.name}

          {selected &&  selected.map(stat => (
            <div key={stat._id}>
              <label>{stat.type}: </label>
              <InputNumber
                defaultValue="0"
                onChange={(value) => handleEditObject(stat.type, value)}
              />
            </div>
          ))}
          {type !== 'new' && <Button
            disabled={type === ''}
            onClick={() => handleSubmit(selected)}
            variant="solid"
          >
            Submit
          </Button>}
      </div>
    );
  };

  const handleSubmit = async (aaaa) => {
    try {
      const data = {
        type,
        action: props.action._id,
        document: aaaa,
        owner: props.selected.creator._id,
        effector: myChar._id,
        loggedInUser
      };
      socket.emit('request', { route: 'action', action: 'effect', data });
    } catch (err) {
      // Alert.error(`Error: ${err.body} ${err.message}`, 5000);
    }
    // handleExit();
  };

  const renderAss = () => {
    if (selected) {
      return (
        <Box>
          <AssetForm handleSubmit={handleSubmit} asset={selected} closeModal={handleExit} />
        </Box>
      );
    } else {
      return <Text rows={5}>Awaiting Selection</Text>;
    }
  };

  const buttons = [
    { type: 'new', color: 'green', name: 'New Asset' },
    { type: 'asset', color: 'green', name: 'Edit Asset' },
    { type: 'character', color: 'orange', name: 'Edit Character Contacts', disabled: true },
    { type: 'newLocation', color: 'blue', name: 'New Location' },
    { type: 'locationStats', color: 'blue', name: 'Edit Location Stats',  },
    { type: 'unlockMapTile', color: 'blue', name: 'Unlock Location',  },
    // { type: 'addInjury', color: 'green', name: 'addInjury' },
  ]

  return (
    <Modal
      size="6xl"
      placement="right"
      isOpen={props.show}
      onClose={handleExit}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <ButtonGroup>
            {buttons.map(button =>
              <Button
                isDisabled={button.disabled}
                key={button.name}
                variant={type !== button.type ? 'ghost' : 'solid'}
                colorScheme={button.color}
                onClick={type !== button.type ? () => handleType(button.type) : undefined}>
                {button.name}
              </Button>)}
          </ButtonGroup>

          <Divider />

          

          {type === 'new' && selected && (
            <div>
              {renderAss()}
            </div>
          )}

          {(type === 'bond' || type === 'asset') && (
            <div>
              <SelectPicker
                block
                placeholder={`Edit ${type}`}
                onChange={(event) => handleAssetSelect(event)}
                data={array}
                valueKey="_id"
                label="name"
                groupBy="type"
              ></SelectPicker>
              {renderAss()}

            </div>
          )}

          {type === 'locationStats' && <div>
            <SelectPicker
                block
                placeholder={`Edit location's stats`}
                onChange={(event) => setSelectedLocation(event)}
                data={locations}
                valueKey="_id"
                label="name"
                groupBy="type"
              ></SelectPicker>
            {renderAspects()}
            </div>}

          {type === 'unlockMapTile' && (
						<div>
							<CheckerPick
								placeholder="Select Location(s) to unlock..."
								onChange={(event) => handleLocSelect(event)}
								data={sortedLocations}
                value={selected}
								valueKey="_id"
								label="name"
							/>
              <Button
                disabled={type === ''}
                onClick={() => handleSubmit(selected)}
                variant="solid"
              >
                Submit
              </Button>
						</div>
					)}

          {type === 'character' && (
            <div>
              <CheckerPick
                placeholder="Select character(s) to unlock..."
                onChange={(event) => handleCharSelect(event)}
                data={sortedCharacters}
                valueKey="_id"
                labelKey="characterName"
                value={array}
              />
              <SimpleGrid columns={2} minChildWidth='120px' spacing='40px'>
                {array && array.map(el => (
                  <CharacterListItem key={el} character={sortedCharacters.find(ch => ch._id === el)} />
                ))}
              </SimpleGrid>

            </div>
          )}

        </ModalBody>

        <ModalFooter>
          <Button
            onClick={handleExit}
            variant="subtle"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>

    </Modal>
  );
};

export default NewEffects;
