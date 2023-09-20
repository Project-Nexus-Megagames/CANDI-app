import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../../socket';
import _ from 'lodash';
import {	getCharacterById,	getGods,	getMyCharacter,	getNonPlayerCharacters,	getUnlockedCharacters} from '../../../redux/entities/characters';
import WordDivider from '../../WordDivider';
import InputNumber from '../../Common/InputNumber';
import { Box, Button, ButtonGroup, Center, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, SimpleGrid, Switch, Text, VStack } from '@chakra-ui/react';
import CheckerPick from '../../Common/CheckerPick';
import SelectPicker from '../../Common/SelectPicker';
import AssetForm from '../../Common/AssetForm';
import CharacterListItem from '../../OtherCharacters/CharacterListItem';

const NewEffects = (props) => {
	const [type, setType] = useState('');
	const [selected, setSelected] = useState(undefined);
	const [character, setCharacter] = useState(undefined);
	const [array, setArray] = useState([]);
	const [locationsToDisplay, setLocationsToDisplay] = useState([]);
	const [charactersToDisplay, setCharactersToDisplay] = useState([]);
	const myChar = useSelector(getMyCharacter);

	const assets = useSelector((state) => state.assets.list);
	const locations = useSelector((state) => state.locations.list);
	const characters = useSelector((state) => state.characters.list);
	const loggedInUser = useSelector((state) => state.auth.user);
	const gameConfig = useSelector((state) => state.gameConfig);
	const sortedCharacters = _.sortBy(charactersToDisplay, 'characterName');
	const sortedLocations = _.sortBy(locationsToDisplay, 'name');
	const creatorChar = useSelector(getCharacterById(props.selected.creator._id));
	let playerContacts = useSelector(getUnlockedCharacters(creatorChar));

	useEffect(() => {
		switch (type) {
			case 'bond':
			case 'asset':
				let newAsset = [];
				for (const bond of assets.filter((el) => el.ownerCharacter === props.selected.creator._id)) {
          
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
        setCharacter(props.selected.creator._id)
        setArray([ props.selected.creator, ...props.selected.collaborators]);
				break;
			case 'aspect':
				setSelected({
					gcHappiness: 0,
					gcSecurity: 0,
					gcDiplomacy: 0,
					gcPolitics: 0,
					gcHealth: 0
				});
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
			case 'map':
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

	const handleSelect = (selected) => {
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

	const handleEdit = (type, change) => {
		let temp = { ...selected };
		temp[type] = change;
		setSelected(temp);
	};

	const renderAspects = () => {
		return (
			<div>
				<WordDivider word="Please enter how much you want to ADD (positive number) or SUBTRACT (negative number) from one
					or more aspects" />

          {gameConfig.globalStats.map(stat => (
            <div key={stat._id}>
              <label>{stat.type}: ({stat.statAmount}) </label>
              <InputNumber
                defaultValue="0"
                onChange={(value) => handleEdit(stat.type, value)}
              />
            </div>
          ))}
			</div>
		);
	};

  const renderCharacterStats = () => {
		const char = characters.find((el) => el._id === props.selected.creator._id);
		return (
			<div>
				<WordDivider word="Please enter how much you want to ADD (positive number) or SUBTRACT (negative number) from one
					or more aspects" />

          {char?.characterStats.map(stat => (
            <div key={stat._id}>
              <label>{stat.type}: ({stat.statAmount}) </label>
              <InputNumber
                defaultValue="0"
                onChange={(value) => handleEdit(stat.type, value)}
              />
            </div>
          ))}
			</div>
		);
	};

	const renderInjuries = () => {
		const char = characters.find((el) => el._id === props.selected.creator._id);
		if (!char || char?.injuries?.length === 0) return <div>{char?.characterName} currently does not have any injuries</div>;
		return (
			<div>
				<VStack
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
							autoheal = `Autoheal at the end of round ${expires}`;
						}
						return (
							<Checkbox
								value={injury._id}
								key={index}
							>
								{injury.name} ({autoheal}).
							</Checkbox>
						);
					})}
				</VStack>
			</div>
		);
	};

	const handleSubmit = async (aaaa) => {
    if (character) aaaa.ownerCharacter = character

		try {
			const data = {
				type,
				action: props.action._id,
				document: aaaa,
				owner: props.selected.creator._id,
				effector: myChar._id,
				loggedInUser
			};
      // console.log(data)
			socket.emit('request', { route: 'action', action: 'effect', data });
		} catch (err) {
      console.log(err)
			// Alert.error(`Error: ${err.body} ${err.message}`, 5000);
		}
		// handleExit();
	};

	const renderAss = () => {
		if (selected) {
			return (
				<Box>
          <AssetForm handleSubmit={handleSubmit} asset={selected} />
				</Box>
			);
		} else {
			return <Text rows={5}>Awaiting Selection</Text>;
		}
	};

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
						<Button
							variant={type !== 'asset' ? 'ghost' : 'solid'}
							colorScheme={'blue'}
							onClick={type !== 'asset' ? () => handleType('asset') : undefined}
						>
							Edit Resource
						</Button>
						{/* <Button variant={type !== 'map' ? 'ghost' : 'solid'} colorScheme={'orange'} onClick={type !== 'map' ? () => handleType('map') : undefined}>
							Unlock Map Tile
						</Button> */}
						<Button
							variant={type !== 'character' ? 'ghost' : 'solid'}
							colorScheme={'orange'}
							onClick={type !== 'character' ? () => handleType('character') : undefined}
						>
							Unlock Character
						</Button>
						{/* <Button variant={type !== 'addInjury' ? 'ghost' : 'solid'} colorScheme={'red'} onClick={type !== 'addInjury' ? () => handleType('addInjury') : undefined}>
							Add an injury
						</Button>
						<Button variant={type !== 'healInjuries' ? 'ghost' : 'solid'} colorScheme={'orange'} onClick={type !== 'healInjuries' ? () => { setSelected(props.action.creator); handleType('healInjuries')} : undefined}>
							Heal Injuries
						</Button> */}
						<Button
							variant={type !== 'aspect' ? 'ghost' : 'solid'}
							colorScheme={'orange'}
							onClick={type !== 'aspect' ? () => handleType('aspect') : undefined}
						>
							Edit Global Stat(s)
						</Button>
            <Button
							variant={type !== 'characterStats' ? 'ghost' : 'solid'}
							colorScheme={'orange'}
							onClick={type !== 'characterStats' ? () => handleType('characterStats') : undefined}
						>
							Edit Character Stat(s)
						</Button>
						<Button
							variant={type !== 'new' ? 'ghost' : 'solid'}
							colorScheme={'green'}
							onClick={type !== 'new' ? () => handleType('new') : undefined}
						>
							New Resource
						</Button>
					</ButtonGroup>

					<Divider/>

					{type === 'new' && selected && (
						<div>
							Type {type}?
							<SelectPicker
								block
								placeholder={`Select Character`}
								onChange={(event) => setCharacter(event)}
								data={array}
                value={character}
								valueKey="_id"
								label="characterName"
							></SelectPicker>

							{renderAss()}
						</div>
					)}

					{(type === 'bond' || type === 'asset') && (
						<div>
							<SelectPicker
								block
								placeholder={`Edit ${type}`}
								onChange={(event) => handleSelect(event)}
								data={array}
								valueKey="_id"
								label="name"
								groupBy="type"
							></SelectPicker>
							{renderAss()}
              
						</div>
					)}

					{type === 'aspect' && <div>{renderAspects()}</div>}

          {type === 'characterStats' && <div>
            {renderCharacterStats()}
            <Center>
              <Button
                  disabled={type === ''}
                  onClick={() => handleSubmit(selected)}
                  variant="solid"
                  colorScheme='green'
                >
                  Confirm
                </Button> 
            </Center>

            </div>}

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
              <SimpleGrid  columns={2} minChildWidth='520px' spacing='40px'>
                {array && array.map(el => (
                  <Box key={el}>
                    <CharacterListItem key={el} character={sortedCharacters.find(ch => ch._id === el)} />

                  </Box>
                ))}                
              </SimpleGrid>
              <Button
                disabled={type === ''}
                onClick={() => handleSubmit(array)}
                variant="solid"
              >
                Confirm
              </Button> 
						</div>
					)}

					{type === 'healInjuries' && (
						<div>
							<Divider>Heal Injuries</Divider>
							{renderInjuries()}
						</div>
					)}

					{type === 'addInjury' && selected && (
						<div>
							<WordDivider word={"Add Injury"} >Add Injury</WordDivider>
							<div>Title:</div>
							<Input
								onChange={(value) => handleAddInjury('name', value)}
								style={{marginBottom: ' 10px'}}
                value={selected.name}
							></Input>
							{!selected.permanent && (
								<div>
									Duration:
									<InputNumber
										min={0}
										onChange={(value) => handleAddInjury('duration', value)}
										style={{marginBottom: ' 10px'}}
                    value={selected.duration}
									/>
								</div>
							)}
							<Switch
								onChange={(checked) => handleAddInjury('permanent', checked)}
								isChecked={selected.permanent}
								// checkedChildren="Permanent Injury"
								// unCheckedChildren="Not Permanent"
							></Switch>
              <Button
                disabled={type === ''}
                onClick={() => handleSubmit(selected)}
                variant="solid"
              >
                Confirm
              </Button> 
						</div>
					)}
				</ModalBody>

        <ModalFooter>
          {/* <Button
            disabled={type === ''}
            onClick={handleSubmit}
            variant="solid"
          >
            Confirm
          </Button> */}
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
