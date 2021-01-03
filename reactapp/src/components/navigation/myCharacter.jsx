import React, { Component } from 'react';
import { FlexboxGrid, Panel, IconButton, Icon, Form, FormGroup, Button, ButtonToolbar, FormControl, ControlLabel } from 'rsuite';

class MyCharacter extends Component {
	state = {  }

	openAnvil (url) {
		const win = window.open(url, '_blank');
		win.focus();
	}

	render(){ 
		const {playerCharacter} = this.props;
		return ( 
			<Panel>
				<FlexboxGrid justify="start" style={{textAlign: 'left'}}>
					<FlexboxGrid.Item colspan={6}>
							<img
								src={playerCharacter.icon} alt='Unable to load img' width="320" height="320" 
							/>	
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={12} >
								<p>
									<b>{playerCharacter.characterName}</b> {playerCharacter.tag}
								</p>
								<p>
									<b>World Anvil Link 				<IconButton onClick={()=> this.openAnvil(playerCharacter.worldAnvil)} icon={<Icon icon="link"/>} appearance="primary"/></b>
								</p>
								<p>
									<b>Bio:</b> {playerCharacter.bio}
								</p>
								<p>
									<b>Strengths:</b> Aether, Masks
								</p>
								<p>
									<b>Weakness:</b> Malice
								</p>
								<p>
									<b>Goals:</b> 
								</p>
								<p>
									1) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
								</p>
								<p>
									2) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
								</p>
								<p>
									3) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
								</p>
								<br></br>
								<Panel header="Standing Orders" bordered>
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
				</FlexboxGrid>
			</Panel>
		 );
	}
}
 
export default MyCharacter;