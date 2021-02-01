import axios from 'axios';
import React, { Component } from 'react';
import { TagPicker, Panel, FlexboxGrid, Content, Alert, ButtonGroup, Button, Modal, InputNumber, Progress, List } from 'rsuite';
import { gameServer } from '../config';

/* To Whoever is reading this code. The whole "action" branch turned into a real mess, for which I am sorry. If you are looking into a better way of implementation, try the OtherCharacters page for lists. I hate forms.... */
class SelectedProject extends Component {
	state = { 
			projectModal: false,
			projName: '',
			projDescription: '',
			progress: 0,
			players: [],
			image: '',
	 }

	 componentDidMount = () => {
			this.setState({ 	
				projName: this.props.project.description,
				projDescription: this.props.project.intent,
				progress: this.props.project.progress,
				players: this.props.project.players,
				image: this.props.project.image, })			
	}

	 componentDidUpdate = (prevProps) => {
		if (this.props.project !== prevProps.project) {
			this.setState({ 	
				projName: this.props.project.description,
				projDescription: this.props.project.intent,
				progress: this.props.project.progress,
				players: this.props.project.players,
				image: this.props.project.image, })			
		}
	}

	render() { 
		const project = this.props.project;
		return ( 
			<Content style={{overflow: 'auto', height: 'calc(100vh - 100px)'}} >
			<FlexboxGrid >
				<FlexboxGrid.Item colspan={2} >
				</FlexboxGrid.Item>
				<FlexboxGrid.Item colspan={16} >
					<Panel shaded style={{padding: "0px", textAlign: "left", backgroundColor: "#274472", position: 'relative', display: 'inline-block', whiteSpace: 'pre-line'}}>
						<p style={slimText}>
							Project Name
						</p>
						<p style={{textAlign: "center"}}>
							{project.description}	
						</p>
						<p style={slimText}>
							Description
						</p>
						<p>
							{project.intent}	
						</p>
						<p style={slimText}>
							Progress
						</p>
					<Progress.Line percent={project.progress} showInfo={true}>  </Progress.Line>
					<div style={{ display: 'flex',  justifyContent: 'center',  alignItems: 'center', cursor: 'pointer',  }}>
						<img style={{ display: 'flex',  justifyContent: 'center',  alignItems: 'center',}} src={project.image} alt='Unable to load img' width="60%" />
					</div>
					
					</Panel>
					</FlexboxGrid.Item>

					<FlexboxGrid.Item colspan={1} />
				<FlexboxGrid.Item colspan={5}>
					<Panel style={{backgroundColor: '#15181e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}} header="Project Members" >
						<List size="md">
							{project.players.map((player, index) => (
								<List.Item key={index} index={index} size='md'>
									<div>{player}</div>
								</List.Item>
							))}
						</List>
					</Panel>
					{this.props.user.roles.some(el=> el === 'Control') && 
						<Panel header={"Control Panel"} style={{backgroundColor: '#61342e', border: '2px solid rgba(255, 255, 255, 0.12)', textAlign: 'center'}}>
							<ButtonGroup style={{marginTop: '5px', }} >
								<Button appearance={"ghost"} onClick={() => this.setState({ projectModal: true})}>Edit Project</Button>
								<Button color='red' appearance={"ghost"} onClick={() => this.deleteAction()}>Delete</Button>
							</ButtonGroup>
						</Panel>}
				</FlexboxGrid.Item>
			</FlexboxGrid>	

			<Modal backdrop='static' size='md' show={this.state.projectModal} onHide={() => this.setState({ projectModal: false })}>
				<p>
					Name		
				</p> 
					<textarea value={this.state.projName} style={textStyle} onChange={(event)=> this.setState({ projName: event.target.value })}></textarea>	
				<p>
					Description		
				</p> 
				<textarea rows='4' value={this.state.projDescription} style={textStyle} onChange={(event)=> this.setState({projDescription: event.target.value})}></textarea>	
				<p>
					Image
				</p>
				<textarea value={this.state.image} style={textStyle} onChange={(event)=> this.setState({ image: event.target.value })}></textarea>	
				<p>
					Progress
				</p>
				<InputNumber value={this.state.progress} onChange={(event)=> this.setState({progress: event})}></InputNumber>
				<p>
					Players
				</p>
					<TagPicker groupBy="tag" defaultValue={this.state.players} data={this.props.characters} labelKey='characterName' valueKey='characterName' block onChange={(event)=> this.setState({ players: event })}></TagPicker>
					<Modal.Footer>
        	  <Button onClick={() => this.newProject()} appearance="primary">
        	    Submit
        	  </Button>
        	  <Button onClick={() => this.setState({ projectModal: false })} appearance="subtle">
        	    Cancel
         	 </Button>
        </Modal.Footer>
				</Modal>

		</Content>		
		 );
	}

	newProject = async () => {
		const data2 = {
			description: this.state.projName,
			intent: this.state.projDescription,
			progress: this.state.progress,
			players: this.state.players,
			image: this.state.image,
			id: this.props.project._id
		}
		try{
			let {data} = await axios.patch(`${gameServer}api/actions/project`, { data: data2 });
			Alert.success('Project Edited');
			this.setState({ projectModal: false });
			this.props.handleSelect(data)
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}		
	}

	deleteAction = async () => {
		let {data} = await axios.delete(`${gameServer}api/actions/${this.props.project._id}`);
		Alert.success(data);		
		this.props.handleSelect(null);
	}

}

const slimText = {
  fontSize: '0.966em',
  color: '#97969B',
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

export default SelectedProject;