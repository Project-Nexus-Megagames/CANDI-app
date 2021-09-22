import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Result extends Component {
	state = { 
		edit: null, // used to open edit action popup
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

	render() { 
		return ( 
			<React.Fragment>
				<Divider>Action Result</Divider>
				<Panel style={{textAlign: "left", backgroundColor: "#61342e",  whiteSpace: 'pre-line'}}>
					<p style={slimText}>Result</p>
					<p>
					{this.state.description}	
				</p>
				</Panel>					
			</React.Fragment>
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
	color: '#97969B',
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