import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Drawer, Button, InputNumber, Input, IconButton, Icon, TagGroup, Tag } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';

class NewCharacter extends Component {
	state = { 
		formValue: {
			characterName: '',
			email: '',
			wiki: '',
			tags: ['NPC'], 
			control: ['Add Controller\'s Name'],
			playerName: '',
			timeZone: '',
			bio: '',
			characterTitle: 'ex: The Agent',
			pronouns: '',
			Justice: 0,
			Trickery: 0,
			Balance: 0,
			Hedonism: 0,
			Bonding: 0,
			Arts: 0,
			Sporting: 0,
			Fabrication: 0,
			Scholarship: 0,
			Pugilism: 0,
			Glory: 0,
			effort: 0,
			username: 'temp'
		},
		loading: false,
		formArray: []
	}

	componentDidMount = () => {	
		let test = [];
		for (const el in this.state.formValue) {
			// console.log(el)
			typeof this.state.formValue[el] !== 'object' ? test.push(el) : console.log(el);
		}
		test.sort((a, b) => { // sort the catagories alphabetically 
			if(a < b) { return -1; }
			if(a > b) { return 1; }
			return 0;
		});
		this.setState({ formArray: test });	
	}


	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('newCharacterState', JSON.stringify(this.state));
		};
	}

	handleSubmit = async () => {
		// 1) make a new action
		this.setState({ loading: true });			
		socket.emit('characterRequest', 'create', this.state.formValue ); // new Socket event
		this.props.closeModal()
		this.setState({ loading: false });		
	}

	handleInputConfirm = () => {
    const nextTags = this.state.inputValue ? [...this.state.formValue.tags, this.state.inputValue] : this.state.formValue.tags;
		this.handleInput(nextTags, 'tags');
    this.setState({
      add: false,
			addControl: false,
      inputValue: ''
    });
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
			show={this.props.show} 
			onHide={() => this.props.closeDrawer()}>
				<Drawer.Header>
					<Drawer.Title>New Character "{this.state.formValue.characterName}"</Drawer.Title>
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
						<Tag index={index} closable onClose={() => this.handleTagRemove(item, 'control')}>
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
        <Button loading={this.state.loading} disabled={(this.state.formValue.status === null)} onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => this.props.closeDrawer()} appearance="subtle">
            Cancel
        </Button>
        </Drawer.Footer>
			</Drawer>
		);
	}
}

const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}

const mapStateToProps = (state) => ({
	characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NewCharacter);