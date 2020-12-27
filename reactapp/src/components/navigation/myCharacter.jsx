import React, { Component } from 'react';
import { FlexboxGrid, Panel, IconButton, Icon, Form, FormGroup, Button, ButtonToolbar, FormControl, ControlLabel } from 'rsuite';

class MyCharacter extends Component {
	state = {  }
	render() { 
		return ( 
			<Panel>
				<FlexboxGrid justify="start" style={{textAlign: 'left'}}>
					<FlexboxGrid.Item colspan={6}>
							<img
								src={'https://preview.redd.it/rgtrs9tube361.jpg?width=513&auto=webp&s=4c0d6ba5218ce19f7b4918e2ec27aa04ab26a3d1'} width="320" height="320" 
							/>	
					</FlexboxGrid.Item>
					<FlexboxGrid.Item colspan={12} >
								<p>
									<b>Charity</b> smcmann42@gmail.com
								</p>
								<p>
									<b>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} appearance="primary"/></b>
								</p>
								<p>
									<b>Description:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
											<Button appearance="default">Cancel</Button>
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