import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon, Avatar, ButtonToolbar } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Result extends Component {
	state = { 
		resEdit: false, // used to open edit action popup
		deleteWarning: false, // used to open delete action popup
		id: this.props.action._id,
		description: this.props.action.description,
		dice: this.props.action.dice,

		infoModal: false,
		infoAsset: {}
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('selectedActionState'));
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('selectedActionState', JSON.stringify(this.state));
		};
		if (this.props.action !== prevProps.action) {
			this.setState({ 	
				id: this.props.action._id,
				description: this.props.action.description,
				dice: this.props.action.dice,
		
			});		
		}
	}

	getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (<b>{day} - {time}</b>)
	}

	handleDelete = async () => {
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			result: this.props.result._id
		}
		socket.emit('actionRequest', 'deleteSubObject', data); // new Socket event	
		this.setState({ deleteWarning: false });
	}

	render() { 
		return ( 
			<div style={{ 	border: '3px solid #00a0bd', borderRadius: '5px' }} >
				<FlexboxGrid  style={{ backgroundColor: '#0d73d4' }} align='middle' justify="start">
					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							<Avatar circle size="md" src={`/images/${this.props.result.resolver}.jpg`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>Result</h5>
						<p style={slimText}>{this.getTime(this.props.result.createdAt)}</p>
					</FlexboxGrid.Item>


					<FlexboxGrid.Item colspan={4}>
						<ButtonToolbar>
							<ButtonGroup>
								<IconButton color='blue' icon={<Icon icon="pencil" />} />
								<IconButton onClick={() => this.setState({ deleteWarning: true })} color='red' icon={<Icon icon="trash2" />} />
							</ButtonGroup>							
						</ButtonToolbar>
					</FlexboxGrid.Item>
				</FlexboxGrid>	

				<Panel shaded style={{ padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
					<p style={slimText}>
							{this.state.description}	
						</p>
						<p style={slimText}>
							{this.state.dice}	
						</p>
				</Panel>	

			<Modal overflow
			full
			size='lg'  
			show={this.state.resEdit} 
			onHide={() => this.closeResult()}>
				<Modal.Header>
					<Modal.Title>Edit {this.props.action.creator}'s Action Result</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={10}>
							<p style={{  fontSize: '0.966em', color: '#97969B', fontWeight: '300',}}>
								Description
							</p>
							<p>
								{this.props.action.description}	
							</p>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={10}>
							<p style={{ fontSize: '0.966em', color: '#97969B', 	fontWeight: '300', }}>
								Intent
							</p>
							<p>
								{this.props.action.intent}	
							</p>							
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={4}>
							<p style={{ 	textAlign: "center", fontSize: '0.966em', color: '#97969B', 	fontWeight: '300',}}>
								Effort
							</p>
							<p style={{ fontWeight: 'bolder', 	textAlign: "center", fontSize: 20 }} >{this.props.action.effort}</p>
						</FlexboxGrid.Item>
					</FlexboxGrid>

				<Divider></Divider>
				<form>
					<textarea rows='6' value={this.state.result} style={textStyle} onChange={(event)=> this.setState({result: event.target.value})}></textarea>							
					<Divider></Divider>
					<FlexboxGrid justify="start">
						<FlexboxGrid.Item  colspan={11}>
							<b>Mechanical Effects</b>
							<textarea rows='4' value={this.state.mechanicalEffect} style={textStyle} onChange={(event)=> this.setState({mechanicalEffect: event.target.value})}></textarea>			
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={1}/>
						<FlexboxGrid.Item colspan={12}>
							<FlexboxGrid>
								<FlexboxGrid.Item colspan={24}>
									<b>Status</b>
									<InputPicker labelKey='label' valueKey='value' data={pickerData} defaultValue={this.state.status} style={{ width: '100%' }} onChange={(event)=> this.setState({status: event})}/>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={24}>
									<b>Die Result</b>
									<textarea value={this.state.dieResult} style={textStyle} onChange={(event)=> this.setState({dieResult: event.target.value})}></textarea>									
								</FlexboxGrid.Item>
							</FlexboxGrid>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</form>

				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleResultSubmit()} appearance="primary">
						Submit
					</Button>
					<Button onClick={() => this.closeResult()} appearance="subtle">
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>		

			<Modal backdrop="static" size='sm' show={this.state.deleteWarning} onHide={() => this.setState({ deleteWarning: false })}>
				<Modal.Body>
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
						{'  '}
						Warning! Are you sure you want delete your Result?
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
				</Modal.Body>
				<Modal.Footer>
           <Button onClick={() => this.handleDelete()} appearance="primary">
						I am Sure!
           </Button>
           <Button onClick={() => this.setState({ deleteWarning: false })} appearance="subtle">
						Nevermind
           </Button>
				</Modal.Footer>
			</Modal>	
			</div>
		);
	}

	handleSubmit = async () => {
		this.setState({loading: true}) 
		let action = { ...this.props.action };

		// action.effort= this.state.effort
		action.asset1= this.state.asset1
		action.asset2= this.state.asset2
		action.asset3= this.state.asset3
		action.description= this.state.description
		action.intent= this.state.intent
		action.dieResult= this.state.dieResult
		action.id= this.props.action._id
		action.playerBoolean= this.state.edit	
	
		// console.log(action)
		// 1) make a new action
		try{
			socket.emit('actionRequest', 'update', action); // new Socket event
			this.setState({asset1: '', asset2: '', asset3: '', effort: 0, description: '', intent: '', id: '', result: '', dieResult: 0, status: '', mechanicalEffect: ''});	

			this.closeEdit();
			this.closeResult();
		}
		catch (err) {
			Alert.error(`Error: ${err.response.data}`, 6000)
		}
		this.setState({loading: false});
	}

	handleResultSubmit = async () => {
		this.setState({loading: true}) 
		let action = { ...this.props.action };
		// console.log(action)
		// 1) make a new action
		try{
			socket.emit('actionRequest', 'update', action); // new Socket event
			this.setState({asset1: '', asset2: '', asset3: '', effort: 0, description: '', intent: '', id: '', result: '', dieResult: 0, status: '', mechanicalEffect: ''});	

			this.closeEdit();
			this.closeResult();
		}
		catch (err) {
			Alert.error(`Error: ${err.response.data}`, 6000)
		}
		this.setState({loading: false});
	}

	closeEdit = () => { 
		this.setState({edit: false}) 
	};

	closeResult = () => { 
		this.setState({resEdit: false}) 
	};

	myToggle = () => {
		return (
			<Toggle onChange={()=> this.setState({ hidden: !this.state.hidden })} checkedChildren="Hidden" unCheckedChildren="Revealed"></Toggle>			
		)
	};

	formattedUsedAssets = () => {
		let assets = [];
		for (const asset of this.props.usedAssets) {
			assets.push(asset.name)
		}
		return assets;
	}
}


const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assets: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	// handleLogin: (data) => dispatch(loginUser(data))
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: 'nowrap',
	textAlign: "center"
};

const pickerData = [
	{
		label: 'Draft',
		value: 'Draft'
	},
	{
		label: 'Awaiting Resolution',
		value: 'Awaiting'
	},
	{
		label: 'Ready for Publishing',
		value: 'Ready'
	},
	{
		label: 'Published',
		value: 'Published'
	}
]

const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);