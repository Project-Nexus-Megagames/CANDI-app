import React, { Component } from 'react';
import { Container, Sidebar, Input, Panel, List, PanelGroup, Button, Content, FlexboxGrid, IconButton, Icon } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';

class Control extends Component {
	state = { 
		selected: {}
	 }

	componentDidMount() {
		this.setState({ selected: null });
	}

	listStyle (item) {
		if (item === this.state.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return({cursor: 'pointer'});
	}

	render() { 
		return ( 
			<Container>
				<Sidebar style={{backgroundColor: "black"}}>
					<PanelGroup>					
						<Panel style={{ backgroundColor: "#000101"}}>
							<Input placeholder="Search"></Input>
						</Panel>
						<Panel bodyFill >
							<List hover size="sm" style={{maxHeight: 650, overflow: 'auto'}}>
								{controllers.map((controller, index) => (
									<List.Item key={index} index={index} onClick={() => this.setState({ selected: controller })} style={this.listStyle(controller)}>
										<b>{controller.name}</b>
										<p>
											{controller.role}
										</p>
									</List.Item>
								))}
							</List>						
						</Panel>						
					</PanelGroup>
				</Sidebar>
					{this.state.selected && 
					<Content>
						<FlexboxGrid >
							<FlexboxGridItem colspan={4} >

							</FlexboxGridItem>
							<FlexboxGrid.Item colspan={16} >
								<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e"}}>
									<h3>{this.state.selected.role}</h3>		
									<p>
									  Name:	
									</p>
									<p>
										<h5>{this.state.selected.name}</h5>			
									</p>
									<p>
										Email
									</p>
									<p>
										<FlexboxGrid>
											<FlexboxGridItem colspan={22}>
												<h5>{this.state.selected.email}</h5> 
											</FlexboxGridItem>
											<FlexboxGridItem >
												<IconButton icon={<Icon icon="envelope"/>} color="blue" circle />										
											</FlexboxGridItem>
										</FlexboxGrid>
									</p>
									<p>
										<Button appearance='ghost' block>Copy email to clipboard</Button>
									</p>
									<p>
									  Time Zone:	
									</p>
									<p>
										<h5>{this.state.selected.timezone}</h5>			
									</p>
									<p>Control ResponsabilitiesTime Zone:	
									</p>
									<p>
										<h5>{this.state.selected.responisble}</h5>			
									</p>
								</Panel>
							</FlexboxGrid.Item>
						</FlexboxGrid>	
					</Content>			
					}	
			</Container>

		 );
	}
}
 
export default Control;

const controllers = [
	{
		name: "John",
		role: "Game Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "David",
		role: "Political Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Larry",
		role: "Political Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Eli",
		role: "Criminal Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Patrick",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Steve",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Bob",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Rick",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "AAAAAA",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Morty",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Carl",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Ned",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Ted",
		role: "Envoy Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	},
	{
		name: "Ed",
		role: "Academics Control",
		email: "example@gmail.com",
		responsibilites: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
		timezone: "Pcific",
		responisble: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
	}
]