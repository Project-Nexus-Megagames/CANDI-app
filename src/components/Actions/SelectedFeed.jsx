import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';

import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class SelectedFeed extends Component {
	state = { 
		edit: null, // used to open edit action popup
		resEdit: null,	// used to open action result popup
		loading: false, //used for loading button 
		effort: 1,
		asset1: '',
		id: '',
		description: '',
		intent: this.props.action.intent,	
		result: this.props.action.result,
		dieResult: this.props.action.dieResult,
		status: '',
		mechanicalEffect: this.props.action.mechanicalEffect,
		usedAssets: []
	}

	componentDidUpdate = (prevProps) => {
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

	render() { 
		const action = this.props.action;
		return ( 
			<Content style={{overflow: 'auto', height: '100%'}} >
			<FlexboxGrid >
				<FlexboxGrid.Item colspan={2} >
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={16} >
					<Panel style={{backgroundColor: "#15181e", textAlign: 'center', fontSize: '4em'}} shaded bordered >Type: {action.type}</Panel>	
					<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
						<p style={{ fontSize: '300', color: '#97969B', fontWeight: 'lighter',	whiteSpace: 'nowrap',}}>
							Created by: {action.creator}
						</p>
						<p style={slimText}>
							Intent
						</p>
						<p>
							{action.intent}	
						</p>
						<p style={slimText}>
							Overfeed Level
						</p>
						<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }} >{action.effort}</p>
						<Progress.Line percent={action.effort * 33 + 1} showInfo={false}>  </Progress.Line>
						<Divider>Bond/Territory</Divider>

							{this.renderAsset(action.asset1)}

					</Panel>
					{(action.status === 'Published' || this.props.user.roles.some(el=> el === 'Control')) && 
					<React.Fragment>
						<Divider>Action Result</Divider>
						<Panel style={{textAlign: "left", backgroundColor: "#61342e",  whiteSpace: 'pre-line'}}>
							<p style={slimText}>Result</p>
							<p>
							{action.result}	
						</p>
						</Panel>						
					</React.Fragment>}

				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={1} />
				<FlexboxGrid.Item colspan={5}>
					<Panel style={{backgroundColor: '#15181e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
						<TagGroup >Status:
							{action.status === 'Draft' && <Tag color='red'>Draft</Tag>}
							{!action.status === 'Awaiting' && <Tag color='blue'>Awaiting Resolution</Tag>}
							{action.status === 'Ready' && <Tag color='violet'>Ready for Publishing</Tag>}
							{action.status === 'Published' && <Tag color='green'>Published</Tag>}
						</TagGroup>
							<ButtonGroup style={{ marginTop: '5px' }} >
								<Button appearance={"ghost"} disabled={action.status !== 'Draft'} onClick={() => this.openEdit()} >Edit</Button>
								<Button color='red' appearance={"ghost"} disabled={action.status !== 'Draft'} onClick={() => this.deleteAction()}>Delete</Button>
							</ButtonGroup>
					</Panel>
					{this.props.user.roles.some(el=> el === 'Control') && 
						<Panel header={"Control Panel"} style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
							<ButtonGroup style={{marginTop: '5px', }} >
								<Button appearance={"ghost"} onClick={() => this.setState({ resEdit: true })}>Edit Result</Button>
							</ButtonGroup>
						</Panel>}
				</FlexboxGrid.Item>
			</FlexboxGrid>	

			<Modal overflow 
			full
			size='lg'  
			show={this.state.edit} 
			onHide={() => this.closeEdit()}>
				<Modal.Header>
					<Modal.Title>Edit a Feed Action</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<b>What are you doing with this feed?</b>
					<form>
						<textarea rows='6' value={this.state.intent} style={textStyle} onChange={(event)=> this.setState({ intent: event.target.value })}></textarea>							
						<br></br>				
						<FlexboxGrid style={{padding: '5px', textAlign: 'left', width: '100%'}} align="middle">
							<FlexboxGrid.Item  align="middle" colspan={10}>Overfeeding Level
								<Slider graduated
									min={0}
									max={4}
									defaultValue={0}
									progress
									value={this.state.effort}
									onChange={(event)=> this.setState({ effort: event})}>
								</Slider>
								<InputNumber value={this.state.effort} max={4} min={0} onChange={(event)=> this.setState({ effort: event})}></InputNumber>	
							</FlexboxGrid.Item>	
							<FlexboxGrid.Item colspan={1} />
							<FlexboxGrid.Item  align="middle" colspan={10}>Bond/Territory
								<InputPicker  style={{ width: '50%' }} placeholder="Slot 1" defaultValue={this.state.asset1} labelKey='name' valueKey='name' data={this.props.getMyAssets.filter(el => (el.type === 'Bond' || el.type === 'Territory'))} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({ asset1: event})}/>
							</FlexboxGrid.Item>
						</FlexboxGrid>
				</form>
				</Modal.Body>
		<Modal.Footer>
			<Button loading={this.props.loading} onClick={() => {
					this.handleSubmit()
				}} appearance="primary">
				Submit
			</Button>
		</Modal.Footer>
	</Modal> 

			<Modal overflow
			full
			size='lg'  
			show={this.state.resEdit} 
			onHide={() => this.closeResult()}>
				<Modal.Header>
					<Modal.Title>Edit {action.creator}'s Feed Result</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FlexboxGrid>
						<FlexboxGrid.Item colspan={10}>
							<p style={{  fontSize: '0.966em', color: '#97969B', 	fontWeight: '300',}}>
								Description
							</p>
							<p>
								{action.description}	
							</p>
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={10}>
							<p style={{ fontSize: '0.966em', color: '#97969B', 	fontWeight: '300', }}>
								Intent
							</p>
							<p>
								{action.intent}	
							</p>							
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={4}>
							<p style={{ 	textAlign: "center", fontSize: '0.966em', color: '#97969B', 	fontWeight: '300',}}>
								Effort
							</p>
							<p style={{ fontWeight: 'bolder', 	textAlign: "center", fontSize: 20 }} >{action.effort}</p>
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
					<Button loading={this.state.loading} onClick={() => this.handleSubmit()} appearance="primary">
						Submit
					</Button>
					<Button onClick={() => this.closeResult()} appearance="subtle">
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</Content>		
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
		const action = {
			effort: this.state.effort,
			asset1: this.state.asset1,
			asset2: this.state.asset2,
			asset3: this.state.asset3,
			description: this.state.description,
			intent: this.state.intent,
			result: this.state.result,
			dieResult: this.state.dieResult,
			status: this.state.status,
			mechanicalEffect: this.state.mechanicalEffect,
			id: this.props.action._id,
			playerBoolean: this.state.edit	
		}
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

	renderAsset = (asset) => {
		if (asset) {
			return (
					<Panel style={{backgroundColor: "#272b34"}} shaded header={asset} bordered ></Panel>	
			)
		}
		else {
			return (
					<Panel style={{backgroundColor: "#0e1013"}} shaded header='Empty Slot' bordered ></Panel>	
			)
		}
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

const mapStateToProps = (state) => ({
	user: state.auth.user,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assetsRedux: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	// handleLogin: (data) => dispatch(loginUser(data))
	deleteAction: (data) => dispatch(actionDeleted(data)),
	updateCharacter: (data) => dispatch(characterUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedFeed);