import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted } from '../../redux/entities/playerActions';
import socket from '../../socket';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class SelectedAction extends Component {
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
						<p style={slimText}>
							Effort
						</p>
						<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }} >{action.effort}</p>
						<Progress.Line percent={action.effort * 33 + 1} showInfo={false}>  </Progress.Line>
						<Divider>Resources</Divider>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={8}>
								{this.renderAsset(action.asset1)}
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
							{this.renderAsset(action.asset2)}
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={8}>
							{this.renderAsset(action.asset3)}
							</FlexboxGrid.Item>
						</FlexboxGrid>
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
						{action.mechanicalEffect !== 'No Mechanical Effect Recorded Yet...' && action.mechanicalEffect !== '' && <div>
							<Divider>Mechanical Effect</Divider>
							<Panel style={{textAlign: "left", backgroundColor: "#61342e",  whiteSpace: 'pre-line'}}>
							<p>
							{action.mechanicalEffect}	
						</p>		
						</Panel>						
						</div>}				
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
								<Button color='red' appearance={"ghost"} disabled={(action.status !== 'Draft')} onClick={() => this.deleteAction()}>Delete</Button>
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
        <Button loading={this.state.loading} onClick={() => this.handleSubmit()} disabled={this.state.effort === 0} appearance="primary">
            Submit
        </Button>
        <Button onClick={() => this.closeEdit()} appearance="subtle">
            Cancel
        </Button>
        </Modal.Footer>
			</Modal>

			<Modal overflow
			full
			size='lg'  
			show={this.state.resEdit} 
			onHide={() => this.closeResult()}>
				<Modal.Header>
					<Modal.Title>Edit {action.creator}'s Action Result</Modal.Title>
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
			id: this.props.action._id,
			type: this.props.action.type,
			mechanicalEffect: this.state.mechanicalEffect,
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectedAction);