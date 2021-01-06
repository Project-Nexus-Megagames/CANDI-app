import React, { Component } from 'react';
import { FlexboxGrid, Panel, IconButton, Icon, Form, FormGroup, Button, ButtonToolbar, FormControl, ControlLabel, Divider, Content } from 'rsuite';

class MyCharacter extends Component {
	state = {  }

	openAnvil (url) {
		const win = window.open(url, '_blank');
		win.focus();
	}

	render(){ 
		const {playerCharacter} = this.props;
		return ( 
			<Content>
			<Panel>
				<FlexboxGrid justify="start" style={{textAlign: 'left'}}>
					<FlexboxGrid.Item colspan={6}>
							<img
								src={playerCharacter.icon} alt='Unable to load img' width="95%" height="320" 
							/>	
						<Divider style={{ width: "95%" }} >Wealth</Divider>
						<Panel style={{backgroundColor: "#bfb606", textAlign: 'center', width: '95%', }} shaded bordered >
							<h4 style={{color: 'black'}} >{playerCharacter.wealth.level}</h4>
						</Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={12} >
						<Panel style={{width: '95%', height: 'calc(50vh)'}}>
							<p>
								<b>{playerCharacter.characterName}</b> {playerCharacter.tag}
							</p>
							<p>
								<b>World Anvil Link 				<IconButton onClick={()=> this.openAnvil(playerCharacter.worldAnvil)} icon={<Icon icon="link"/>} appearance="primary"/></b>
							</p>
							<p>
								<b>Bio:</b> {playerCharacter.bio}
							</p>
							<Divider>Memory Triggers</Divider>
							<p>
								<b>1st) </b> {playerCharacter.memories.first.trigger}
							</p>
							<p>
								<b>2nd) </b> {playerCharacter.memories.second.trigger}
							</p>
							<p>
								<b>3rd) </b> {playerCharacter.memories.third.trigger}
							</p>
							<br></br>							
						</Panel>
						<Panel header="Standing Orders" bordered style={{width: '95%'}}>
							<Form fluid>
							<FormGroup>
								<ControlLabel></ControlLabel>
								<FormControl name="textarea" componentClass="textarea" placeholder="Orders for if you miss a turn..."/>
							</FormGroup>
							<FormGroup>
								<ButtonToolbar>
									<Button appearance="primary">Submit</Button>
								</ButtonToolbar>
							</FormGroup>
							</Form>
						</Panel>
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={6} >
						<Divider>Traits</Divider>
							{playerCharacter.traits.map((trait, index) => (
								<Panel style={{backgroundColor: "#1a1d24"}} shaded header={trait.name} bordered collapsible>
									<text  >{trait.description}</text>
								</Panel>
							))}
						<Divider>Assets</Divider>
							{playerCharacter.assets.map((trait, index) => (
								<Panel style={{backgroundColor: "#1a1d24"}} shaded header={trait.name} bordered collapsible>
									<text >{trait.description}</text>
								</Panel>
							))}
					</FlexboxGrid.Item>
				</FlexboxGrid>
			</Panel>
			</Content>

		 );
	}
}
 
export default MyCharacter;