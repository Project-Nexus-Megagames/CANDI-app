import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, List, PanelGroup, Button, Content, FlexboxGrid, Loader, } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';

class Control extends Component {
	state = { 
		selected: null, 
		filtered: []
	}

	componentDidMount() {
		this.setState({ selected: null, filtered: controllers });
	}

	listStyle (item) {
		if (item === this.state.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429", height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', })
		}
		else return({cursor: 'pointer', height: '80px',   display: 'flex', justifyContent: 'center', alignItems: 'center',  });
	}

	copyToClipboard (email) {
		navigator.clipboard.writeText(email);
	}

	filter = (fil) => {
		const filtered = controllers.filter(controller => controller.name.toLowerCase().includes(fil.toLowerCase()) || 
		controller.email.toLowerCase().includes(fil.toLowerCase()) || 
		controller.role.toLowerCase().includes(fil.toLowerCase())
		);
		this.setState({ filtered });
	}

	render() { 
		if (!this.props.login) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		return ( 
			<Container>
				<Sidebar style={{backgroundColor: "black"}}>
					<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.filter(value)} placeholder="Search"></Input>
					</Panel>
						<Panel bodyFill style={{borderRadius: '0px'}}>
							<List hover size="md" style={{height: 'calc(100vh - 130px)', scrollbarWidth: 'none', overflow: 'auto', borderRight: '1px solid rgba(255, 255, 255, 0.12)'}}>
								{this.state.filtered.map((controller, index) => (
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
										</FlexboxGrid>
									</p>
									<p>
										<Button appearance='ghost' block onClick={()=> this.copyToClipboard(this.state.selected.email)}>Copy email to clipboard</Button>
									</p>
									<p>
										Time Zone:	
									</p>
									<p>
										<h5>{this.state.selected.timezone}</h5>			
									</p>
									<p>Control Responsibilities:	
									</p>
									<p>
										<h5>{this.state.selected.responsibilities}</h5>			
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


const mapStateToProps = (state) => ({
	login: state.auth.login,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Control);

const controllers = [
	{
   name: "Stuart",
   role: "Game Control",
   email: "afterlifecontrol@gmail.com",
   timezone: "GMT",
   responsibilities: "The First Angel, The First Demon, The Librarian, The Archivist, The Eremite, The Chronicler (Press), The Crier (Press), Gallowglass"
	},
	{ 
		name: "Mickey",
		role: "Beta Control",
		email: "afterlifebeta@gmail.com",
		timezone: "GMT",
		responsibilities: "The Penitent, The Thorn, The Claviger, The Steward, The Gossip, Madame, The Margrave of the Grey Borders, The Baptist, The Speaker of Truth, The Flagellant, The Gaoler, The Warden, She Who Bears The Scale, The Medium" 
	},
	{
		name: "Andrew",
		role: "Delta Control",
		email: "afterlifedelta@gmail.com",
		timezone: "CSTGMT",
		responsibilities: "The Seeker, The Unknown Soldier, The Ranger, The Seneschal, The Warlord, The Field Marshal, The Conductor of Souls, The Taxi Driver"
	},
	{
		name: "Dan",
		role: "Gamma Control",
		email: "afterlifegamma@gmail.com",
		timezone: "MST",
		responsibilities: "The Gnostic, The Gourmand, The House, The Upstart, The Jester, The High-Roller, Sam the Barman"
	},
	{
		name: "Mike",
		role: "Epsilon Control",
		email: "afterlifeepsilon@gmail.com",
		timezone: "CST",
		responsibilities: "The Scholar, The Avenging Fury, The Implacable Fury, The Forman, The Sculptor, The Overseer, The Rampant Fury, The Bailiff, The Smith, The Sommelier, The Songbird, The Executioner"
		},
	{
    name: "Scott",
    role: "Tech Support",
    email: "Use the #tech-support channel on the Afterlife discord server",
    timezone: "PST",
    responsibilities: "Keeping the App and Discord running"
 }
]