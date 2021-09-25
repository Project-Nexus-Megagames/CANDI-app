import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Slider, Panel, FlexboxGrid, Tag, CheckPicker, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon, ButtonToolbar, Loader } from 'rsuite';
import { getMyAssets, getMyUsedAssets } from '../../redux/entities/assets';
import { characterUpdated, getMyCharacter } from '../../redux/entities/characters';
import { actionDeleted, playerActionsRequested } from '../../redux/entities/playerActions';
import socket from '../../socket';
import AssetInfo from './AssetInfo';
/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class Submission extends Component {
	state = { 
		edit: false, // used to open edit action popup
		deleteWarning: false, // used to open delete action popup
		loading: false, //used for loading button 
		effort: this.props.sumbission.effort,
		assets: this.props.sumbission.assets,
		id: this.props.action._id,
		description: this.props.sumbission.description,
		intent: this.props.sumbission.intent,	

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
		if (this.props.sumbission !== prevProps.sumbission) {
			this.setState({ 
				effort: this.props.sumbission.effort,
				assets: this.props.sumbission.assets,
				id: this.props.action._id,
				description: this.props.sumbission.description,
				intent: this.props.sumbission.intent,	
				// status: this.props.action.status,
			});		
		}
	}

	getTime = (date) => {
		let day = new Date(date).toDateString();
		let time = new Date(date).toLocaleTimeString();
		return (<b>{day} - {time}</b>)
	}

	render() { 
		const sumbission = this.props.sumbission;
		return ( 
			<div style={{ border: '3px solid #22a12a', borderRadius: '5px', width: '100%', normalText }} >
				<FlexboxGrid align="middle" style={{ backgroundColor: '#22a12a' }} justify="center">

					<FlexboxGrid.Item style={{ margin: '5px' }} colspan={4}>
							<Avatar circle size="md" src={`/images/${this.props.creator.characterName}.jpg`} alt="Img could not be displayed" style={{ maxHeight: '50vh' }} />
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={15}>
						<h5>{this.props.creator.characterName}'s Action Submission</h5>
						<p style={slimText}>{this.getTime(this.props.sumbission.createdAt)}</p>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={4}>
						<ButtonToolbar>
							<ButtonGroup>
								<IconButton size='xs'  onClick={() => this.setState({ edit: true })} color='blue' icon={<Icon icon="pencil" />} />
								<IconButton size='xs'  onClick={() => this.setState({ deleteWarning: true })} color='red' icon={<Icon icon="trash2" />} /> 
							</ButtonGroup>							
						</ButtonToolbar>
					</FlexboxGrid.Item>
				</FlexboxGrid>
				
				<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e", whiteSpace: 'pre-line'}}>
					<p style={slimText}>
						Description
					</p>
					<p>
						{sumbission.description}	
					</p>
					<p style={slimText}>
						Intent
					</p>
					<p>
						{sumbission.intent}	
					</p>
					{/* <p style={slimText}>
						Effort
					</p>
					<p style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: 20 }} >{sumbission.effort}</p>
					<Progress.Line percent={sumbission.effort * 33 + 1} showInfo={false}>  </Progress.Line> */}
					<Divider>Resources</Divider>
					<FlexboxGrid>

						<FlexboxGrid.Item colspan={8}>
							{this.renderAsset(sumbission.assets[0])}
							{this.props.user.roles.some(el=> el === 'Control') && sumbission.asset1 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset1')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>
						{this.renderAsset(sumbission.assets[1])}
						{this.props.user.roles.some(el=> el === 'Control') && sumbission.asset2 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset2')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

						<FlexboxGrid.Item colspan={8}>
						{this.renderAsset(sumbission.assets[2])}
						{this.props.user.roles.some(el=> el === 'Control') && sumbission.asset3 &&
							<Panel style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
								<Button onClick={() => this.controlRemove('asset3')} color='red'>Control Remove Asset</Button>									
							</Panel>}
						</FlexboxGrid.Item>

					</FlexboxGrid>
				</Panel>		

				<Modal overflow
					style={{ width: '90%' }}
					size='md'    
					show={this.state.edit} 
					onHide={() => this.setState({edit: false}) }>
						<Modal.Header>
							<Modal.Title>Submit a new action</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}
							<form>
								<FlexboxGrid> Description
									<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>							
								</FlexboxGrid>
								<br></br>
								<FlexboxGrid> What you would like to happen
									<textarea rows='6' value={this.state.intent} style={textStyle} onChange={(event)=> this.setState({intent: event.target.value})} ></textarea>							
								</FlexboxGrid>
								<FlexboxGrid>
									<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={6}>
										{/* <Slider graduated
										min={0}
										max={this.props.myCharacter.effort}
										defaultValue={0}
										progress
										value={this.state.effort}
										onChange={(event)=> this.setState({effort: event})}>
										</Slider> */}
										<div style={{ paddingTop: '20px', fontSize: '2em', }} >
											Current Actions Left: {this.props.myCharacter.effort}		
										</div>
									
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={2}>
										{/* <InputNumber value={this.state.effort} max={this.props.myCharacter.effort} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								 */}
									</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={4}>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item style={{paddingTop: '5px', paddingLeft: '10px', textAlign: 'left'}}  colspan={10}> Resources	
										<CheckPicker labelKey='name' valueKey='_id' defaultValue={this.state.assets} data={this.props.getMyAssets} style={{ width: '100%' }} disabledItemValues={this.formattedUsedAssets()} onChange={(event)=> this.setState({ assets: event })}/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</form>
						</Modal.Body>
						<Modal.Footer>
							<Button loading={this.props.actionLoading} onClick={() => this.handleSubmit()}  disabled={this.state.description.length > 10 && this.state.intent.length > 10 ? false : true} color={this.state.description.length > 10 && this.state.intent.length > 10 ? 'green' : 'red'} appearance="primary">
    		        {this.state.description.length < 11 ? <b>Description text needs {11 - this.state.description.length} more characters</b> :
								this.state.intent.length < 11 ? <b>Intent text need {11 - this.state.intent.length} more characters</b> :
								<b>Submit</b>}
    			    </Button>
							<Button onClick={() => this.setState({edit: false})} appearance="subtle">
    		        Cancel
    		   		</Button>
    		    </Modal.Footer>
					</Modal>
			<AssetInfo asset={this.state.infoAsset} showInfo={this.state.infoModal} closeInfo={()=> this.setState({infoModal: false})}/>			

			<Modal  size='sm' show={this.state.deleteWarning} 
			onHide={() => this.setState({ deleteWarning: false })}>
				<Modal.Body>
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
						{'  '}
						Warning! Are you sure you want delete your action?
					<Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
				</Modal.Body>
				<Modal.Footer>
           <Button onClick={() => this.deleteAction()} appearance="primary">
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
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.action._id,
			submission: {
				effort: 1,
				assets: this.state.assets, //this.state.asset1._id, this.state.asset2._id, this.state.asset3._id
				description: this.state.description,
				intent: this.state.intent,			
				round: this.props.gamestate.round	
			},
		}
		socket.emit('actionRequest', 'update', data); // new Socket event	
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
			return (
				<Panel style={{backgroundColor: "#272b34", cursor: 'pointer', textAlign: 'center', minWidth: '15vw' }} onClick={() => this.openInfo(asset)} shaded bordered >
					<b style={normalText}>{asset.type}</b>
					<p style={slimText}>{asset.name}</p>
				</Panel>	
			)
		}
		else {
			return (
					<Panel style={{backgroundColor: "#0e1013", minWidth: '15vw'}} shaded bordered >
						<b>Empty Slot</b>
					</Panel>	
			)
		}
	}

	openInfo = (asset) => {
		const found = this.props.assets.find(el => el._id === asset._id);
		this.setState({ infoAsset: found, infoModal: true });
	}


	deleteAction = async () => {
		socket.emit('actionRequest', 'delete', {id: this.props.action._id}); // new Socket event
		this.props.handleSelect(null);
		this.setState({ deleteWarning: false });
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
	actionLoading: state.actions.loading,
	gamestate: state.gamestate,
	actions: state.actions.list,
	assets: state.assets.list,
	usedAssets: getMyUsedAssets(state),
	getMyAssets: getMyAssets(state),
	myCharacter: state.auth.user ? getMyCharacter(state): undefined
});

const mapDispatchToProps = (dispatch) => ({
	deleteAction: (data) => dispatch(actionDeleted(data)),
	actionDispatched: (data) => dispatch(playerActionsRequested(data))
});

const slimText = {
	fontSize: '0.966em',
	fontWeight: '300',
	whiteSpace: ' pre-line;',
	textAlign: "center"
};

const normalText = {
	fontSize: '.966em',
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