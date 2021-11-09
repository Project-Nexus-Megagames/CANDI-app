import React, { useEffect } from 'react';
import { connect } from 'react-redux'; // Redux store provider
import { Alert, Modal, SelectPicker, CheckPicker, Divider, Tag, Button, TagGroup, FlexboxGrid, List, ButtonGroup, Loader, Row, Col, Panel, InputPicker, Placeholder, InputNumber } from 'rsuite';
import socket from '../../socket';
import { getGods, } from '../../redux/entities/characters';

const NewEffects = (props) => {
	const [type, setType] = React.useState('');
	const [selected, setSelected] = React.useState(undefined);
	const [array, setArray] = React.useState([]);

	useEffect(() => {
		switch (type) {
			case 'bond':
				let bonds = [];
				for (const bond of props.assets.filter(el => (el.type === 'GodBond' || el.type === 'MortalBond') && el.ownerCharacter === props.selected.creator._id)) {
					const bondData = {
						name: `${bond.name} - ${bond.with.characterName} - ${bond.level}`,
						level: bond.level,
						type: bond.type,
						_id: bond._id
					};
					bonds.push(bondData)			
				}
				setArray(bonds);
				break;
			case 'asset':
				let assets = [];
				for (const bond of props.assets.filter(el => (el.type !== 'GodBond' && el.type !== 'MortalBond') && el.ownerCharacter === props.selected.creator._id)) {
					console.log(bond.with)
					const bondData = {
						name: `${bond.type} '${bond.name}' - (${bond.dice})`,
						type: bond.type,
						_id: bond._id
					};
					assets.push(bondData)			
				}
				setArray(assets);
				break;
				case 'aspect':
					setSelected(props.selected.creator);
					break;
				case 'new':
					setSelected({ name: '', description: '', dice: '', level: '', ownerCharacter: props.selected.creator._id, });
					break;
			default:
				break;
		}
	}, [type])

	const handleExit = () => {
		setType('')
		setSelected(undefined);
		props.hide();
	}

	const handleSelect = (selected) => {
		selected = props.assets.find(el => el._id === selected)
		setSelected(selected);
	}

	const handleType = (type) => {
		setType(type);
		setSelected(undefined);
	}

	const handleEdit = (type, change) => {
		let temp = {...selected};
		temp[type] = change;
		setSelected(temp);
	}

	const handleSubmit = async () => { 
		try {
			// props.assetDispatched();
			const data = {
				type,
				action: props.action._id,
				document: selected
			}
			socket.emit('actionRequest', 'effect',  data ); // new Socket event	
		} catch (err) {
				Alert.error(`Error: ${err.body} ${err.message}`, 5000)
		}
		handleExit();
	}

	const renderAss = () => {
		if (selected) {
			return (
				<Panel>
					Name: {selected.name}
					<textarea value={selected.name} className='textStyle' onChange={event => handleEdit('name', event.target.value)}></textarea>	
					Description:
					<textarea rows='4' value={selected.description} className='textStyle' onChange={event => handleEdit('description', event.target.value)}></textarea>	
					Dice
					<textarea value={selected.dice} className='textStyle' onChange={event => handleEdit('dice', event.target.value)}></textarea>	
					Uses
					<InputNumber value={selected.uses} onChange={(value) => handleEdit('uses', value)}/>
					{selected.type === 'GodBond' && <div>
						Bond Level
						<InputPicker labelKey='label' valueKey='value' data={godPickerData} defaultValue={selected.level} style={{ width: '100%' }} onChange={event => handleEdit('level', event)}/>						
					</div>}
					{selected.type === 'MortalBond' && <div>
						Bond Level
						<InputPicker labelKey='label' valueKey='value' data={mortalPickerData} defaultValue={selected.level} style={{ width: '100%' }} onChange={event => handleEdit('level', event)}/>						
					</div>}
				</Panel>			
			)			
		}
		else {
			return (
				<Placeholder.Paragraph rows={5} >Awaiting Selection</Placeholder.Paragraph>
			)
		}
	}

	return (
		<Modal size='sm' placement='right' show={props.show} onHide={handleExit}>
			<Modal.Header>
			</Modal.Header>
			{<Modal.Body>

				<ButtonGroup>
					<Button appearance={type !== 'bond' ? 'ghost' : 'primary'} color={'cyan'} onClick={type !== 'bond' ? () => handleType('bond') : undefined} >Edit Bond</Button>
					<Button appearance={type !== 'asset' ? 'ghost' : 'primary'} color={'blue'} onClick={type !== 'asset' ? () => handleType('asset') : undefined} >Edit Resource</Button>
					<Button appearance={type !== 'aspect' ? 'ghost' : 'primary'} color={'orange'} onClick={type !== 'aspect' ? () => handleType('aspect') : undefined} >Change Aspect Point</Button>
					<Button appearance={type !== 'new' ? 'ghost' : 'primary'} color={'green'} onClick={type !== 'new' ? () => handleType('new') : undefined} >New Resource</Button>
				</ButtonGroup>
				<Divider />
				{(type === 'new') && selected && <div>
					Type
					<InputPicker labelKey='label' valueKey='value' data={pickerData} defaultValue={selected.level} style={{ width: '100%' }} onChange={event => handleEdit('type', event)}/>
					{(selected.type === 'GodBond') && <SelectPicker block placeholder={`${selected.type} with...`} onChange={(event) => handleEdit('with', event)} data={props.gods} valueKey='_id' labelKey='characterName' />}
					{renderAss()}
				</div>}
				{(type === 'bond' || type === 'asset') && <div>
					<SelectPicker block placeholder={`Edit ${type}`} onChange={(event) => handleSelect(event)} data={array} valueKey='_id' labelKey='name' groupBy='type'></SelectPicker>
					{renderAss()}
				</div>}
				{(type === 'aspect') && selected && <div>
					<FlexboxGrid>
						{aspects.sort((a, b) => { // sort the catagories alphabetically 
							if(a < b) { return -1; }
							if(a > b) { return 1; }
							return 0;
						}).map((aspect, index) => (
							<FlexboxGrid.Item index={index} colspan={8}>
								{aspect}
								<InputNumber index={index} value={selected[aspect]} onChange={(value) => handleEdit(aspect, value)}/>
							</FlexboxGrid.Item>
						))}
					</FlexboxGrid>
				</div>}
			</Modal.Body>}
			<Modal.Footer>
					<Button disabled={type === ''} onClick={handleSubmit} appearance="primary">Confirm</Button>
					<Button onClick={handleExit} appearance="subtle">Cancel</Button>
			</Modal.Footer>
	</Modal>
	);
}

const godPickerData = [
	{
		label: 'Condemned',
		value: 'Condemned',
	},
	{
		label: 'Disfavoured',
		value: 'Disfavoured',
	},
	{
		label: 'Neutral',
		value: 'Neutral',
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
	},
];

const mortalPickerData = [
	{
		label: 'Loathing',
		value: 'Loathing',
	},
	{
		label: 'Unfriendly',
		value: 'Unfriendly',
	},
	{
		label: 'Neutral',
		value: 'Neutral',
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
	},
];

let aspects = [
	"Justice",
	"Trickery",
	"Balance",
	"Hedonism",
	"Bonding",
	"Arts",
	"Sporting",
	"Fabrication",
	"Scholarship",
	"Pugilism",
	"Glory",
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
		label: 'GodBond',
		value: 'GodBond'
	},
	{
		label: 'MortalBond',
		value: 'MortalBond'
	},
]

const mapStateToProps = state => ({
	assets: state.assets.list,
	characters: state.characters.list,
	gods: getGods(state),
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(NewEffects);