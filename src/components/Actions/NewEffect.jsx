import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import {
	Alert,
	Modal,
	SelectPicker,
	CheckPicker,
	Divider,
	Button,
	ButtonGroup,
	Panel,
	InputPicker,
	Placeholder,
	InputNumber,
	Checkbox,
	CheckboxGroup,
	Toggle,
	Input
} from 'rsuite';
import socket from '../../socket';
import _ from 'lodash';

import {
	getGods,
	getNonPlayerCharacters
} from '../../redux/entities/characters';

const NewEffects = (props) => {
	const [type, setType] = useState('');
	const [selected, setSelected] = useState(undefined);
	const [array, setArray] = useState([]);
	const [locationsToDisplay, setLocationsToDisplay] = useState([]);
	const [charactersToDisplay, setCharactersToDisplay] = useState([]);
	const [arcane, setArcane] = useState(false);

	const assets = useSelector((state) => state.assets.list);
	const locations = useSelector((state) => state.locations.list);
	const characters = useSelector((state) => state.characters.list);
	const sortedCharacters = _.sortBy(charactersToDisplay, 'characterName');
	const sortedLocations = _.sortBy(locationsToDisplay, 'name');
	const gods = useSelector(getGods);
	const mortals = useSelector(getNonPlayerCharacters);

	// TODO REFACTOR CONTACT UNLOCK

	useEffect(() => {
		switch (type) {
			case 'bond':
				let bonds = [];

				for (const bond of assets.filter(
					(el) =>
						(el.type === 'GodBond' || el.type === 'MortalBond') &&
						el.ownerCharacter === props.selected.creator._id
				)) {
					const bondData = {
						name: `${bond.name} - ${bond.with.characterName} - ${bond.level}`,
						level: bond.level,
						type: bond.type,
						_id: bond._id
					};
					bonds.push(bondData);
				}
				setArray(bonds);
				break;
			case 'asset':
				let newAsset = [];
				for (const bond of assets.filter(
					(el) =>
						el.type !== 'GodBond' &&
						el.type !== 'MortalBond' &&
						el.ownerCharacter === props.selected.creator._id
				)) {
					console.log(bond.with);
					const bondData = {
						name: `${bond.type} '${bond.name}' - (${bond.dice})`,
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
				let playerContacts = props.selected.creator.knownContacts;
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
					if (
						el.unlockedBy.findIndex(
							(id) => id._id === props.selected.creator._id
						) !== -1
					)
						return;
					locSelect.push(el);
				});
				setLocationsToDisplay(locSelect);
				break;
			default:
				break;
		}
	}, [
		type,
		assets,
		props.selected.creator._id,
		characters,
		locations,
		props.selected.creator.knownContacts
	]);

	const handleExit = () => {
		setType('');
		setSelected(undefined);
		props.hide();
		setArcane(false);
	};

	const handleSelect = (selected) => {
		selected = assets.find((el) => el._id === selected);
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
		setSelected(selected);
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
		setArcane(false);
	};

	const handleEdit = (type, change) => {
		let temp = { ...selected };
		if (change === 'Bond' || change === 'Power') setArcane(false);
		temp[type] = change;
		setSelected(temp);
	};

	const handleArcane = () => {
		setArcane(!arcane);
	};

	const renderInjuries = () => {
		const char = characters.find((el) => el._id === props.selected.creator._id);
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
							autoheal = `Autoheal at the end of round ${expires}`;
						}
						return (
							<Checkbox value={injury._id} key={index}>
								{injury.name} ({autoheal}).
							</Checkbox>
						);
					})}
				</CheckboxGroup>
			</div>
		);
	};

	const handleSubmit = async () => {
		try {
			const data = {
				type,
				action: props.action._id,
				document: selected,
				owner: props.selected.creator._id,
				arcane
			};
			socket.emit('request', { route: 'action', action: 'effect', data });
		} catch (err) {
			Alert.error(`Error: ${err.body} ${err.message}`, 5000);
		}
		handleExit();
	};

	const renderAss = () => {
		if (selected) {
			return (
				<Panel>
					Name: {selected.name}
					<textarea
						value={selected.name}
						className="textStyle"
						onChange={(event) => handleEdit('name', event.target.value)}
					></textarea>
					Description:
					<textarea
						rows="4"
						value={selected.description}
						className="textStyle"
						onChange={(event) => handleEdit('description', event.target.value)}
					></textarea>
					Dice
					<textarea
						value={selected.dice}
						className="textStyle"
						onChange={(event) => handleEdit('dice', event.target.value)}
					></textarea>
					Uses
					<InputNumber
						value={selected.uses}
						onChange={(value) => handleEdit('uses', value)}
					/>
					{selected.type === 'GodBond' && (
						<div>
							Bond Level
							<InputPicker
								labelKey="label"
								valueKey="value"
								data={godPickerData}
								defaultValue={selected.level}
								style={{ width: '100%' }}
								onChange={(event) => handleEdit('level', event)}
							/>
						</div>
					)}
					{selected.type === 'Asset' && (
						<div>
							<Divider />
							Arcane
							<Toggle
								onChange={handleArcane}
								checked={arcane}
								checkedChildren="Arcane"
								unCheckedChildren="Not Arcane"
							></Toggle>
						</div>
					)}
					{selected.type === 'Trait' && (
						<div>
							<Divider />
							<Toggle
								onChange={handleArcane}
								checked={arcane}
								checkedChildren=" Arcane"
								unCheckedChildren=" Not Arcane"
							></Toggle>
						</div>
					)}
					{selected.type === 'MortalBond' && (
						<div>
							Bond Level
							<InputPicker
								labelKey="label"
								valueKey="value"
								data={mortalPickerData}
								defaultValue={selected.level}
								style={{ width: '100%' }}
								onChange={(event) => handleEdit('level', event)}
							/>
						</div>
					)}
				</Panel>
			);
		} else {
			return (
				<Placeholder.Paragraph rows={5}>
					Awaiting Selection
				</Placeholder.Paragraph>
			);
		}
	};

	return (
		<Modal size="lg" placement="right" show={props.show} onHide={handleExit}>
			<Modal.Header></Modal.Header>
			{
				<Modal.Body>
					<ButtonGroup>
						<Button
							appearance={type !== 'bond' ? 'ghost' : 'primary'}
							color={'cyan'}
							onClick={type !== 'bond' ? () => handleType('bond') : undefined}
						>
							Edit Bond
						</Button>
						<Button
							appearance={type !== 'asset' ? 'ghost' : 'primary'}
							color={'blue'}
							onClick={type !== 'asset' ? () => handleType('asset') : undefined}
						>
							Edit Resource
						</Button>
						<Button
							appearance={type !== 'map' ? 'ghost' : 'primary'}
							color={'orange'}
							onClick={type !== 'map' ? () => handleType('map') : undefined}
						>
							Unlock Map Tile
						</Button>
						<Button
							appearance={type !== 'character' ? 'ghost' : 'primary'}
							color={'orange'}
							onClick={
								type !== 'character' ? () => handleType('character') : undefined
							}
						>
							Unlock Character
						</Button>
						<Button
							appearance={type !== 'addInjury' ? 'ghost' : 'primary'}
							color={'red'}
							onClick={
								type !== 'addInjury' ? () => handleType('addInjury') : undefined
							}
						>
							Add an injury
						</Button>
						<Button
							appearance={type !== 'healInjuries' ? 'ghost' : 'primary'}
							color={'orange'}
							onClick={
								type !== 'healInjuries'
									? () => handleType('healInjuries')
									: undefined
							}
						>
							Heal Injuries
						</Button>
						<Button
							appearance={type !== 'new' ? 'ghost' : 'primary'}
							color={'green'}
							onClick={type !== 'new' ? () => handleType('new') : undefined}
						>
							New Resource
						</Button>
					</ButtonGroup>
					<Divider />
					{type === 'new' && selected && (
						<div>
							Type
							<InputPicker
								labelKey="label"
								valueKey="value"
								data={pickerData}
								defaultValue={selected.level}
								style={{ width: '100%' }}
								onChange={(event) => handleEdit('type', event)}
							/>
							{selected.type === 'GodBond' && (
								<SelectPicker
									block
									placeholder={`${selected.type} with...`}
									onChange={(event) => handleEdit('with', event)}
									data={gods}
									valueKey="_id"
									labelKey="characterName"
								/>
							)}
							{selected.type === 'MortalBond' && (
								<SelectPicker
									block
									placeholder={`${selected.type} with...`}
									onChange={(event) => handleEdit('with', event)}
									data={mortals}
									valueKey="_id"
									labelKey="characterName"
								/>
							)}
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
								labelKey="name"
								groupBy="type"
							></SelectPicker>
							{renderAss()}
						</div>
					)}
					{type === 'map' && (
						<div>
							<CheckPicker
								placeholder="Select Location(s) to unlock..."
								onSelect={(event) => handleLocSelect(event)}
								data={sortedLocations}
								valueKey="_id"
								labelKey="name"
							/>
						</div>
					)}
					{type === 'character' && (
						<div>
							<CheckPicker
								placeholder="Select character(s) to unlock..."
								onSelect={(event) => handleCharSelect(event)}
								data={sortedCharacters}
								valueKey="_id"
								labelKey="characterName"
							/>
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
							<Divider>Add Injury</Divider>
							<div>Title:</div>
							<Input
								onChange={(value) => handleAddInjury('name', value)}
								style={{ marginBottom: ' 10px' }}
							></Input>
							{!selected.permanent && (
								<div>
									Duration:
									<InputNumber
										min={0}
										onChange={(value) => handleAddInjury('duration', value)}
										style={{ marginBottom: ' 10px' }}
									/>
								</div>
							)}
							<Toggle
								onChange={(checked) => handleAddInjury('permanent', checked)}
								checked={selected.permanent}
								checkedChildren="Permanent Injury"
								unCheckedChildren="Not Permanent"
							></Toggle>
						</div>
					)}
				</Modal.Body>
			}
			<Modal.Footer>
				<Button
					disabled={type === ''}
					onClick={handleSubmit}
					appearance="primary"
				>
					Confirm
				</Button>
				<Button onClick={handleExit} appearance="subtle">
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const godPickerData = [
	{
		label: 'Condemned',
		value: 'Condemned'
	},
	{
		label: 'Disfavoured',
		value: 'Disfavoured'
	},
	{
		label: 'Neutral',
		value: 'Neutral'
	},
	{
		label: 'Preferred',
		value: 'Preferred'
	},
	{
		label: 'Favoured',
		value: 'Favoured'
	},
	{
		label: 'Blessed',
		value: 'Blessed'
	}
];

const mortalPickerData = [
	{
		label: 'Loathing',
		value: 'Loathing'
	},
	{
		label: 'Unfriendly',
		value: 'Unfriendly'
	},
	{
		label: 'Neutral',
		value: 'Neutral'
	},
	{
		label: 'Warm',
		value: 'Warm'
	},
	{
		label: 'Friendly',
		value: 'Friendly'
	},
	{
		label: 'Bonded',
		value: 'Bonded'
	}
];

const pickerData = [
	{
		label: 'Asset',
		value: 'Asset'
	},
	{
		label: 'Trait',
		value: 'Trait'
	},
	{
		label: 'Power',
		value: 'Power'
	},
	{
		label: 'Bond',
		value: 'bond'
	}
];

export default NewEffects;
