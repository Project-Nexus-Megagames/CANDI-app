import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon, ButtonToolbar } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Submission extends Component {
	state = { 
		edit: null, // used to open edit action popup
		resEdit: null,	// used to open action result popup
		loading: false, //used for loading button 
		effort: 1,
		asset1: this.props.action.asset1,
		asset2: this.props.action.asset2,
		asset3: this.props.action.asset3,
		id: this.props.action._id,
		description: this.props.action.description,
		intent: this.props.action.intent,	
		result: this.props.action.result,
		dieResult: this.props.action.dieResult,
		status: this.props.action.status,
		mechanicalEffect: this.props.action.mechanicalEffect,
		usedAssets: [],

		infoModal: false,
		infoAsset: {}
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('selectedActionState'));
		console.dir(stateReplace);
		if (stateReplace) this.setState(stateReplace); 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('selectedActionState', JSON.stringify(this.state));
		};
		if (this.props.action !== prevProps.action) {
			this.setState({ 	
				asset1: this.props.action.asset1,
				asset2: this.props.action.asset2,
				asset3: this.props.action.asset3,
				id: this.props.action._id,
				description: this.props.action.description,
				intent: this.props.action.intent,	
				result: this.props.action.result,
				dieResult: this.props.action.dieResult,
				status: this.props.action.status,
				mechanicalEffect: this.props.action.mechanicalEffect,
			});		
		}
	}

	getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (<b>{day} - {time}</b>)
	}

	render() { 
		const action = this.props.action;
		return ( 
			<div style={{ 	border: '3px solid #22a12a', borderRadius: '5px' }} >
				<FlexboxGrid align="middle" style={{ backgroundColor: '#22a12a' }} justify="center">

					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							<Avatar circle size="md" src={`/images/${this.props.creator.characterName}.jpg`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>{this.props.creator.characterName}'s Action Submission</h5>
						<p style={slimText}>{this.getTime(this.props.action.createdAt)}</p>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={4}>
						<ButtonToolbar>
							<ButtonGroup>
								<IconButton color='blue' icon={<Icon icon="pencil" />} />
								<IconButton color='red' icon={<Icon icon="trash2" />} />
							</ButtonGroup>							
						</ButtonToolbar>
					</FlexboxGrid.Item>
				</FlexboxGrid>
				
				<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
					<p style={slimText}>
						Description
					</p>
					<p>
						{action.description}	
					</p>
					<p style={slimText}>
						Intent
					</p>
					<p>
						{action.intent}	
					</p>
					{/* <p style={slimText}>
						Effort
					</p>
					<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }} >{action.effort}</p>
					<Progress.Line percent={action.effort * 33 + 1} showInfo={false}>  </Progress.Line> */}
					<Divider>Resources</Divider>
					<FlexboxGrid>

						<FlexboxGrid.Item colspan={8}>
							{this.renderAsset(action.assets[0])}
							{this.props.user.roles.some(el=> el === 'Control') && action.asset1 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset1')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>
						{this.renderAsset(action.assets[1])}
						{this.props.user.roles.some(el=> el === 'Control') && action.asset2 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset2')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>
						{this.renderAsset(action.assets[2])}
						{this.props.user.roles.some(el=> el === 'Control') && action.asset3 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset3')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

					</FlexboxGrid>
				</Panel>		

				<Modal overflow 
			full
			size='lg'  
			show={this.state.edit} 
			onHide={() => this.closeEdit()}>
				<Modal.Header>
					<Modal.Title>Edit an Action</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<form>
					<FlexboxGrid> Description
						<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>							
					</FlexboxGrid>
					<br></br>
					<FlexboxGrid> What you would like to happen
						<textarea rows='6' value={this.state.intent} style={textStyle} onChange={(event)=> this.setState({intent: event.target.value})} ></textarea>							
					</FlexboxGrid>
					<FlexboxGrid>
						<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>Effort
							<Slider graduated
							min={0}
							max={this.props.myCharacter.effort + this.props.action.effort}
							defaultValue={this.state.effort}
							progress
							value={this.state.effort}
							onChange={(event)=> this.setState({effort: event})}>
							</Slider>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={2}>
							<InputNumber value={this.state.effort} max={this.props.myCharacter.effort + this.props.action.effort} min={0} onChange={(value)=> this.setState({effort: parseInt(value)})}></InputNumber>								
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={4}>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item style={{paddingTop: '5px', paddingLeft: '10px', textAlign: 'left'}}  colspan={10}> Resources
							<InputPicker defaultValue={this.state.asset1} placeholder="Slot 1" labelKey='name' valueKey='name' data={this.props.getMyAssets} style={{ width: '100%' }} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({asset1: event})}/>
							<InputPicker defaultValue={this.state.asset2} placeholder="Slot 2" labelKey='name' valueKey='name' data={this.props.getMyAssets} style={{ width: '100%' }} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({asset2: event})}/>
							<InputPicker defaultValue={this.state.asset3} placeholder="Slot 3" labelKey='name' valueKey='name' data={this.props.getMyAssets} style={{ width: '100%' }} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({asset3: event})}/>
						</FlexboxGrid.Item>
					</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
        <Button onClick={() => this.handleSubmit()} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => this.closeEdit()} appearance="subtle">
            Cancel
        </Button>
        </Modal.Footer>
			</Modal>
			<AssetInfo asset={this.state.infoAsset} showInfo={this.state.infoModal} closeInfo={()=> this.setState({infoModal: false})}/>			
			</div>

		);
	}

	openEdit = () => {
		const action = this.props.action;

		this.setState({ 
			description: action.description, 
			intent: action.intent, 
			effort: action.effort, 
			id: action._id, 
			asset1: action.asset1,
			asset2: action.asset2,
			asset3: action.asset3,
			edit: true })
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

		action.effort= this.state.effort
		action.asset1= this.state.asset1
		action.asset2= this.state.asset2
		action.asset3= this.state.asset3
		action.description= this.state.description
		action.intent= this.state.intent
		action.result= this.state.result
		action.dieResult= this.state.dieResult
		action.status= this.state.status
		action.id= this.props.action._id
		action.mechanicalEffect= this.state.mechanicalEffect
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

	controlRemove = (asset) => {
		const action = {
			asset,
			id: this.props.action._id,
		}
		socket.emit('actionRequest', 'controlReject', action); // new Socket event
	}

	renderAsset = (assetID) => {
		if (assetID) {
			const asset = this.props.assets.find(el => el._id === assetID)
			console.log(asset)
			return (
					<Panel style={{backgroundColor: "#272b34"}} shaded bordered >
						<FlexboxGrid align='middle'>
							<FlexboxGrid.Item colspan={20}>
							<b>{asset.type}</b>
							<b>{asset.name}</b>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}>
								<IconButton onClick={() => this.openInfo(asset)} color='blue' size="sm" icon={<Icon  icon="info"/>} /> 
							</FlexboxGrid.Item >
						</FlexboxGrid>
					</Panel>	
			)
		}
		else {
			return (
					<Panel style={{backgroundColor: "#0e1013"}} shaded bordered >
						<b>Empty Slot</b>
					</Panel>	
			)
		}
	}

	openInfo = (asset) => {
		console.log(asset)
		const found = this.props.assets.find(el => el._id === asset._id);
		this.setState({ infoAsset: found, infoModal: true });
	}

	closeEdit = () => { 
		this.setState({edit: false}) 
	};

	closeResult = () => { 
		this.setState({resEdit: false}) 
	};

	deleteAction = async () => {
		socket.emit('actionRequest', 'delete', {id: this.props.action._id}); // new Socket event
		this.props.handleSelect(null);
	};

	myToggle = () => {
		return (
			<Toggle onChange={()=> this.setState({ assetBoolean: !this.state.assetBoolean })} checkedChildren="Asset" unCheckedChildren="Trait"></Toggle>			
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
	deleteAction: (data) => dispatch(actionDeleted(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: 'nowrap',
	textAlign: "center"
};


const textStyle = {
	backgroundColor: '#1a1d24', 
	border: '1.5px solid #3c3f43', 
	borderRadius: '5px', 
	width: '100%',
	padding: '5px',
	overflow: 'auto', 
	scrollbarWidth: 'none',
}

export default connect(mapStateToProps, mapDispatchToProps)(Submission);