import React, { useEffect, useState } from 'react';
import {
	InputPicker,
	Modal,
	Button,
	SelectPicker,
	ButtonGroup,
	Panel,
	InputNumber,
	Divider,
	Toggle,
	Placeholder
} from 'rsuite';
import { useSelector } from 'react-redux';
import socket from '../../socket';

const ModifyResource = (props) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [uses, setUses] = useState(0);
	const [level, setLevel] = useState('');
	const [loading] = useState(false);
	const [lendable, setLendable] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [owner, setOwner] = useState('');
	const [tags, setTags] = useState([]);
	const [dice, setDice] = useState('');
	const [selected, setSelected] = useState('');
	const [used, setUsed] = useState(false);
	const [type, setType] = useState('');
	const [arcane, setArcane] = useState(false);

	const assets = useSelector((state) => state.assets.list);

	useEffect(() => {
		if (props.bond) {
			handleChange(props.bond._id);
		}
	});

	useEffect(() => {
		setName(selected.name);
		setDescription(selected.description);
		setLevel(selected.level);
		setType(selected.type);
		setUses(selected.uses);
		setOwner(selected.owner);
		setTags(selected.tags);
		if (selected.tags) {
			setArcane(selected.tags.some((el) => el === 'arcane'));
		}
		if (selected.status) {
			setUsed(selected.status.used);
			setLendable(selected.status.lendable);
			setHidden(selected.status.hidden);
			setDice(selected.dice);
		}
	}, [selected]);

	useEffect(() => {
		let tempTags = tags;
		if (arcane) {
			setTags([...tempTags, 'arcane']);
		} else {
			setTags(tags.filter((el) => el !== 'arcane'));
		}
	}, [arcane]);

	const assetModify = async () => {
		const data = {
			_id: selected._id,
			name,
			description,
			dice,
			uses,
			owner,
			used,
			level,
			lendable,
			hidden,
			tags,
			type
		};
		console.log(data);
		socket.emit('request', { route: 'asset', action: 'modify', data });
		props.closeModal();
		setSelected('');
	};

	const handleChange = (event) => {
		if (event) {
			setSelected(assets.find((el) => el._id === event));
			console.log(selected.status);
		}
	};

	const handleArcane = () => {
		setArcane(!arcane);
	};

	const handleDelete = async () => {
		socket.emit('request', {
			route: 'asset',
			action: 'delete',
			data: { id: selected }
		});
		props.closeModal();
		setSelected('');
	};

	const renderAss = () => {
		if (selected) {
			return (
				<Panel>
					Name: {name}
					<textarea
						value={name}
						className="textStyle"
						onChange={(event) => setName(event.target.value)}
					></textarea>
					<Divider />
					Description:
					<textarea
						rows="4"
						value={description}
						className="textStyle"
						onChange={(event) => setDescription(event.target.value)}
					></textarea>
					Dice
					<textarea
						value={dice}
						className="textStyle"
						onChange={(event) => setDice(event.target.value)}
					></textarea>
					Uses:{' '}
					<InputNumber
						value={uses}
						onChange={(event) => setUses(event)}
					></InputNumber>
					Owner
					<textarea
						value={owner}
						className="textStyle"
						onChange={(event) => setOwner(event.target.value)}
					></textarea>
					{type === 'GodBond' && (
						<div>
							Bond Level
							<InputPicker
								labelKey="label"
								valueKey="value"
								data={godPickerData}
								defaultValue={level}
								style={{ width: '100%' }}
								onChange={(event) => setLevel(event)}
							/>
						</div>
					)}
					{type === 'MortalBond' && (
						<div>
							Bond Level
							<InputPicker
								labelKey="label"
								valueKey="value"
								data={mortalPickerData}
								defaultValue={level}
								style={{ width: '100%' }}
								onChange={(event) => setLevel(event)}
							/>
						</div>
					)}
					<Divider>Statuses</Divider>
					<Toggle
						checked={used}
						onChange={() => setUsed(!used)}
						checkedChildren="Used"
						unCheckedChildren="Un-used"
					/>
					<Toggle
						checked={hidden}
						onChange={() => setHidden(!hidden)}
						checkedChildren="hidden"
						unCheckedChildren="Un-hidden"
					/>
					<Toggle
						checked={lendable}
						onChange={() => setLendable(!lendable)}
						checkedChildren="lendable"
						unCheckedChildren="Un-lendable"
					/>
					{type === 'Asset' && (
						<Toggle
							onChange={handleArcane}
							checked={arcane}
							checkedChildren="Arcane"
							unCheckedChildren="Not Arcane"
						></Toggle>
					)}
					{type === 'Trait' && (
						<Toggle
							onChange={handleArcane}
							checked={arcane}
							checkedChildren="Arcane"
							unCheckedChildren="Not Arcane"
						></Toggle>
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
		<Modal
			loading={loading}
			size="sm"
			show={props.show}
			onHide={() => props.closeModal()}
		>
			<SelectPicker
				block
				placeholder="Edit or Delete Asset/Trait"
				onChange={(event) => handleChange(event)}
				data={assets.filter((el) => el.model !== 'Wealth')}
				valueKey="_id"
				labelKey="name"
			></SelectPicker>
			{renderAss()}
			<Modal.Footer>
				{selected && (
					<ButtonGroup>
						<Button
							loading={loading}
							onClick={() => assetModify()}
							color="blue"
						>
							Edit
						</Button>
						<Button
							loading={loading}
							onClick={() => handleDelete()}
							color="red"
						>
							Delete
						</Button>
					</ButtonGroup>
				)}
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

export default ModifyResource;
