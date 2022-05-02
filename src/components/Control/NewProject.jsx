import React, { Component } from 'react';
import { Modal, Button, InputNumber, TagPicker } from 'rsuite';
import { connect } from 'react-redux';
import socket from '../../socket';
import { getMyCharacter } from '../../redux/entities/characters';

class NewProject extends Component {
	state = { 
		formValue: {
			projName: '',
			projDescription: '',
			progress: 0,
			players: [],
			characters: [],
		},
		loading: false
	}

	// componentDidMount = () => {
	// 	// localStorage.removeItem('newActionState');
	// 	const stateReplace = JSON.parse(localStorage.getItem('newProjectStateGW'));
	// 	if (stateReplace) this.setState(stateReplace); 
	// }

	componentDidUpdate = (prevProps, prevState) => {
		// if (this.state !== prevState) {
		// 	localStorage.setItem('newProjectStateGW', JSON.stringify(this.state));
		// };
	}

	newProject = async () => {
		const data = {
			description: this.state.projName,
			intent: this.state.projDescription,
			effort: 0,
			progress: this.state.progress,
			type: "Project",
			players: this.state.players,
			creator: this.props.playerCharacter.characterName,
			round: this.props.gamestate.round, 
			status: 'Published',
		}
		socket.emit('request', { route: 'action', action: 'createProject', data });
		this.props.closeModal()
	}

	render() { 
		return ( 
			<Modal 
			backdrop='static' 
			size='md' 
			show={this.props.show} 			
			onHide={() => this.props.closeModal()}>
			<p>
				Name		
			</p> 
				<textarea value={this.state.projName} className='textStyle' onChange={(event)=> this.setState({ projName: event.target.value })}></textarea>	
			<p>
				Description		
			</p> 
			<textarea rows='4' className='textStyle' value={this.state.projDescription} onChange={(event)=> this.setState({projDescription: event.target.value})}></textarea>	
			<p>
				Progress
			</p>
			<InputNumber value={this.state.progress} onChange={(event)=> this.setState({progress: event})}></InputNumber>
			<p>
				Players
			</p>
				<TagPicker data={this.props.characters} labelKey='characterName' valueKey='characterName' block onChange={(event)=> this.setState({ players: event })}></TagPicker>
				<Modal.Footer>
			<Button onClick={() => this.newProject()} appearance="primary">
				Submit
			</Button>
			<Button onClick={() => this.props.closeModal()} appearance="subtle">
				Cancel
			</Button>
			</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	assetLoading: state.assets.loading,
	assets: state.assets.list,
	gamestate: state.gamestate,
	characters: state.characters.list,
	actions: state.actions.list,
	playerCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(NewProject);