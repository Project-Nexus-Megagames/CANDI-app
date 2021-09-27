import React, { Component } from 'react';
import { ControlLabel, Form, FormControl, InputPicker, Modal, Button, SelectPicker, ButtonGroup, Panel, InputNumber, Divider, Toggle, Placeholder } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';
import { assetsRequested } from '../../redux/entities/assets';

class ModifyResource extends Component {
	state = { 
		name: '',
		description: '',
		uses: 0,
		influence: 0,
		id: '',
		currentOwner: '',
		level: '',
		type: '',
		selected: false,
		loading: false
	}

	componentDidMount = () => {
		if (this.props.bond) {
			this.handleChage(this.props.bond._id)
		}
	}
		
	assetModify = async () => {
		this.props.assetDispatched();
		const data = {
			id: this.state.selected,
			name: this.state.name,
			description: this.state.description,
			uses: this.state.uses,
			owner: this.state.owner,
			used: this.state.used,
			level: this.state.level,
			lendable: this.state.lendable,
			hidden: this.state.hidden	
		}
		socket.emit('assetRequest', 'modify',  data ); // new Socket event	
		this.setState({ selected: null, });
		this.props.closeModal()
	}

	render() { 
		return ( 
			<Modal 
			loading={this.props.assetLoading} 
			size='sm' 
			show={this.props.show} 
			onHide={() => this.props.closeModal()}>
			<SelectPicker block placeholder="Edit or Delete Asset/Trait" onChange={(event) => this.handleChage(event)} data={this.props.assets.filter(el => el.model !== 'Wealth')} valueKey='_id' labelKey='name'></SelectPicker>
				{this.renderAss()}
				<Modal.Footer>
					{this.state.selected && 
					<ButtonGroup>
						<Button loading={this.props.assetLoading} onClick={() => this.assetModify()} color="blue">Edit</Button>
						<Button loading={this.props.assetLoading} onClick={() => this.handleDelete()} color="red">Delete</Button>								
					</ButtonGroup>}
				</Modal.Footer>
		</Modal>
		);
	}

	handleChage = (event) => {
		if (event) {
			const selected = this.props.assets.find(el => el._id === event);
			this.setState({ selected: event, name: selected.name, description: selected.description, level: selected.level, type: selected.type, uses: selected.uses, owner: selected.owner, used: selected.status.used, lendable: selected.status.lendable, hidden: selected.status.hidden })			
		}
		else this.setState({ selected: '', name: '', description: '', uses: 0 })			
	}

	handleDelete = async () => {
		socket.emit('assetRequest', 'delete', { id: this.state.selected }); // new Socket event	
	}

	renderAss = () => {
		if (this.state.selected) {
			return (
				<Panel>
					Name: {this.state.name}
					{/* <textarea value={this.state.name} className='textStyle' onChange={(event)=> this.setState({ name: event.target.value })}></textarea>	 */}
					<Divider />
					Description:
					<textarea rows='4' value={this.state.description} className='textStyle' onChange={(event)=> this.setState({description: event.target.value})}></textarea>	
					Uses: <InputNumber value={this.state.uses} onChange={(event)=> this.setState({uses: event})}></InputNumber>
					Owner (Match Character's name exactly):
					<textarea value={this.state.owner} className='textStyle' onChange={(event)=> this.setState({ owner: event.target.value })}></textarea>	
					{this.state.type === 'GodBond' && <div>
						Bond Level
						<InputPicker labelKey='label' valueKey='value' data={godPickerData} defaultValue={this.state.level} style={{ width: '100%' }} onChange={(event)=> this.setState({level: event})}/>						
					</div>}
					<Divider>Statuses</Divider>
					<Toggle checked={this.state.used} onChange={()=> this.setState({ used: !this.state.used })} checkedChildren="Used" unCheckedChildren="Un-used"/>
					<Toggle checked={this.state.hidden} onChange={()=> this.setState({ hidden: !this.state.hidden })} checkedChildren="hidden" unCheckedChildren="Un-hidden"/>
					<Toggle checked={this.state.lendable} onChange={()=> this.setState({ lendable: !this.state.lendable })} checkedChildren="lendable" unCheckedChildren="Un-lendable"/>
				</Panel>			
			)			
		}
		else {
			return (
				<Placeholder.Paragraph rows={5} >Awaiting Selection</Placeholder.Paragraph>
			)
		}
	}
}

const godPickerData = [
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
]

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
		label: 'Wealth',
		value: 'Wealth'
	},
	{
		label: 'GodBond',
		value: 'GodBond'
	},
	{
		label: 'MortalBond',
		value: 'MortalBond'
	},
	{
		label: 'Territory',
		value: 'Territory'
	},
	{
		label: 'Power',
		value: 'Power'
	}
]

const mapStateToProps = (state) => ({
	user: state.auth.user,
	assetLoading: state.assets.loading,
	assets: state.assets.list,
	login: state.auth.login,
	gamestate: state.gamestate,
	characters: state.characters.list,
	actions: state.actions.list,
});

const mapDispatchToProps = (dispatch) => ({
	assetDispatched: (data) => dispatch(assetsRequested(data))});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyResource);