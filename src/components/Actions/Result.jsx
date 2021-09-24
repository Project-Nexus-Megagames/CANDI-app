import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Slider, Panel, FlexboxGrid, Tag, TagGroup, ButtonGroup, Button, Modal, Alert, InputPicker, InputNumber, Divider, Progress, Toggle, IconButton, Icon, Avatar, ButtonToolbar, Loader } from 'rsuite';
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
		id: this.props.result._id,
		description: this.props.result.description ? this.props.result.description : '',
		dice: this.props.result.dice ? this.props.result.dice : '',

		infoModal: false,
		infoAsset: {}
	}

	componentDidMount = () => {
		// localStorage.removeItem('newActionState');
		const stateReplace = JSON.parse(localStorage.getItem('EditResult'));
		if (stateReplace) this.setState(stateReplace); 
		console.log(this.props.result)
		this.setState({ 	
			id: this.props.result._id,
			description: this.props.result.description,
			dice: this.props.result.dice,
	
		});		
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.state !== prevState) {
			localStorage.setItem('EditResult', JSON.stringify(this.state));
		};
		if (this.props.result !== prevProps.result) {
			this.setState({ 	
				id: this.props.result._id,
				description: this.props.result.description,
				dice: this.props.result.dice,
		
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

	handleEditSubmit = async () => {
		this.props.actionDispatched();
		// 1) make a new action
		const data = {
			id: this.props.selected._id,
			result: {
				description: this.props.description,
				dice: this.props.dice,
				resolver: this.props.myCharacter.characterName
			},
		}
		socket.emit('actionRequest', 'updateSubObject', data); // new Socket event	
		this.setState({ commentEdit: false });
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
								<IconButton onClick={() => this.setState({ resEdit: true })} color='blue' icon={<Icon icon="pencil" />} />
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
			show={this.props.show} 
			onHide={() => this.props.closeNew()}>
				<Modal.Header>
					<Modal.Title>Submit a new Result</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.actionLoading && <Loader backdrop content="loading..." vertical />}
					<form>
						<FlexboxGrid> Description
							<textarea rows='6' value={this.state.description} style={textStyle} onChange={(event)=> this.setState({description: event.target.value})}></textarea>							
						</FlexboxGrid>
						<br></br>

						<FlexboxGrid>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} align="middle" colspan={4}>
								<h5>Dice Pool</h5>
								{this.props.selected.submission.assets.map((asset, index) => (
									this.renderDice(asset)
								))} 
							</FlexboxGrid.Item>
							<FlexboxGrid.Item style={{paddingTop: '25px', paddingLeft: '10px', textAlign: 'left'}} colspan={20}>
								Dice Roll Result
								<textarea rows='2' value={this.state.dice} style={textStyle} onChange={(event)=> this.setState({dice: event.target.value})}></textarea>	
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={4}>
							</FlexboxGrid.Item>

						</FlexboxGrid>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => this.handleSubmit()}  disabled={this.isDisabled()} appearance="primary">
            {this.state.description.length < 11 ? <b>Description text needs {11 - this.state.description.length} more characters</b> :
						this.state.dice.length < 5 ? <b>Dice text need {5 - this.state.dice.length} more characters</b> :
						<b>Submit</b>}
    	    </Button>
					<Button onClick={() => this.props.closeNew()} appearance="subtle">
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

	}

	isDisabled () {
		if (this.state.description.length < 10 || this.state.dice.length > 5) return false;
		else return true;
	}

	handleResultSubmit = async () => {

	}

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