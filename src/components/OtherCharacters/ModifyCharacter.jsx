import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Tag, Icon, IconButton, Drawer, Button, InputNumber, Input, TagGroup } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

const disabled = ['_id', '__v', 'model'];
class ModifyCharacter extends Component {
	constructor(props) {
    super(props)
    this.state = {
		formValue: { ...this.props.selected },
		formArray: [],
		add: false,
		inputValue: '',

    }
	this.handleInput = this.handleInput.bind(this);
	}

	componentDidMount = () => {	
		let test = [];
		for (const el in this.props.selected) {
			// console.log(el)
			typeof this.props.selected[el] !== 'object' ? test.push(el) : console.log(el);
		}
		test.sort((a, b) => { // sort the catagories alphabetically 
			if(a < b) { return -1; }
			if(a > b) { return 1; }
			return 0;
		});
		this.setState({ formValue: this.props.selected, formArray: test });	
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.selected !== prevProps.selected) {
			this.setState({ formValue: this.props.selected });		
		}
	}

	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
    socket.emit('request', { route: 'character', action: 'modify', data: this.state.formValue });
		this.props.closeDrawer()
		this.setState({ loading: false });		
	}

	handleControlInputConfirm = () => {
    const nextTags = this.state.inputValue ? [...this.state.formValue.control, this.state.inputValue] : this.state.formValue.control;
		this.handleInput(nextTags, 'control');
    this.setState({
      add: false,
			addControl: false,
      inputValue: ''
    });
	}

	handleInputConfirm = () => {
    const nextTags = this.state.inputValue ? [...this.state.formValue.tags, this.state.inputValue] : this.state.formValue.tags;
		this.handleInput(nextTags, 'tags');
    this.setState({
      add: false,
      inputValue: ''
    });
  }

  handleInput = (value, id) => {
    if (id === '_id') {
			console.log('id!!!!')
    }
		else {
			let formValue = { ...this.state.formValue };
			formValue[id] = value;
			this.setState({ formValue });			
		}
  };


	handleTagRemove = (tag, type) => {
    const nextTags = this.state.formValue.tags.filter(item => item !== tag);
		this.handleInput(nextTags, type);
  }

  handleControlTagRemove = (tag, type) => {
    const nextTags = this.state.formValue.control.filter(item => item !== tag);
		this.handleInput(nextTags, type);
  }

	renderTagAdd = () => {
		if (this.state.add)
			return(
				<Input 
					size="xs"
					style={{ width: 70, display: 'inline-block', }}
					value={this.state.inputValue}
					onChange={(inputValue) => this.setState({ inputValue })}
					onBlur={this.handleInputConfirm}
					onPressEnter={this.handleInputConfirm}/>
			)
		else 
			return (
				<IconButton
					className="tag-add-btn"
					onClick={() => this.setState({ add: true })}
					icon={<Icon icon="plus" />}
					appearance="ghost"
					size="xs"
				/>
			)
	}

	renderControlTagAdd = () => {
		if (this.state.addControl)
			return(
				<Input 
					size="xs"
					style={{ width: 70, display: 'inline-block', }}
					value={this.state.inputValue}
					onChange={(inputValue) => this.setState({ inputValue })}
					onBlur={this.handleControlInputConfirm}
					onPressEnter={this.handleControlInputConfirm}/>
			)
		else 
			return (
				<IconButton
					className="tag-add-btn"
					onClick={() => this.setState({ addControl: true })}
					icon={<Icon icon="plus" />}
					appearance="ghost"
					size="xs"
				/>
			)
	}

	renderSwitch = (el) => {
		let formValue = this.state.formValue;
		switch(typeof formValue[el]) {
			case 'string':
				return(
					<div>
						<h5>{el}</h5>
						<Input
							id={el}
							disabled={disabled.some(dis => dis === el)}
							type="text"
							value={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={value => this.handleInput(value, el)}
						/>								
					</div>				
				)
				case 'number':
					return(
					<div>
						<h5>{el}</h5>
						<InputNumber
							id={el}
							disabled={disabled.some(dis => dis === el)}
							value={formValue[el]}
							name={el}
							label={el}
							placeholder={el}
							onChange={value => this.handleInput(value, el)}
						/>
					</div>
					)
			default:
				return(<b>{formValue[el]}</b>)	
		}	
	}


	render() { 
		return ( 
			<Drawer
			overflow
			size='sm'  
			show={this.props.show} 
			onHide={() => this.props.closeDrawer()}>
				<Drawer.Header>
					<Drawer.Title>Modify Character "{this.state.formValue.characterName}"</Drawer.Title>			
					<b>Tags</b>		
					<TagGroup>
					{this.state.formValue && this.state.formValue.tags && this.state.formValue.tags.map((item, index) => (
						<Tag index={index} closable onClose={() => this.handleTagRemove(item, 'tags')}>
							{item}
						</Tag>
					))}	
					{this.renderTagAdd()}	
					</TagGroup>

					
					<b>Control</b>
					<br/>		
					<TagGroup>
					{this.state.formValue && this.state.formValue.control && this.state.formValue.control.map((item, index) => (
						<Tag index={index} closable onClose={() => this.handleControlTagRemove(item, 'control')}>
							{item}
						</Tag>
					))}	
					{this.renderControlTagAdd()}	
					</TagGroup>
				</Drawer.Header>
				<Drawer.Body>
					{this.state.formArray.map((el, index) => (
							this.renderSwitch(el)
						))}						
				</Drawer.Body>
				<Drawer.Footer>
        <Button disabled={(this.state.formValue.status === null)} onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => {
				this.props.closeDrawer();
				// localStorage.removeItem('modifyCharacterState');
			}} appearance="subtle">
            Cancel
        </Button>
        </Drawer.Footer>
			</Drawer>
		);
	}
}

// const pickerData = [
// 	{
// 		label: 'Poor',
// 		value: 'Poor'
// 	},
// 	{
// 		label: 'Laborer',
// 		value: 'Laborer'
// 	},
// 	{
// 		label: 'Comfortable',
// 		value: 'Comfortable'
// 	},
// 	{
// 		label: 'Affluent',
// 		value: 'Affluent'
// 	},
// 	{
// 		label: 'Luxury',
// 		value: 'Luxury'
// 	}
// ]

const mapStateToProps = (state) => ({
	characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCharacter);