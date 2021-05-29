import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Sidebar, Input, Panel, List, PanelGroup, Button, Content, FlexboxGrid, Loader, } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import NavigationBar from '../Navigation/NavigationBar';

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
		if (email === 'Use the #tech-support channel on the Dusk City discord server') {
			const win = window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
			win.focus();
		}
		else 
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
			<React.Fragment>
			<NavigationBar/>
			<Container style={{ height: '94vh'}}>
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
			</React.Fragment>

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
		name: "Kyle",
		role: "Game Control",
		email: "duskcitycontrol@gmail.com",
		timezone: "GMT+8",
		responsibilities: "Diego Armando, Cassandra Hasapi, Father Rex Davidson, Mayor Shivani Chowdhury, Maxine Hawthorne, DJ Pyro, Melanie Yeoh, Josephine Rosales, Eli Kaufmann, Mark Cordero"
	},
	{
		name: "Stuart",
		role: "East Control",
		email: "stuart.pbem@gmail.com",
		timezone: "GMT",
		responsibilities: "To be updated"
	},
	{
		name: "Dan",
		role: "Central Control",
		email: "duskcontrolcentral@gmail.com",
		timezone: "MDT",
		responsibilities: "Bobby Weber, Chelsea Hubbard, Dave Busters, Devin Slater, Duncan Buchanan,  Reginald 'Reggie' Royce,  Steven Davies, Susan Chandler Timothy Ipswich"
	},
	{
		name: "LJ",
		role: "North Control",
		email: "duskcontrolnorth@gmail.com",
		timezone: "EST",
		responsibilities: "Razmus, Alfie Barnes, Alias, Christopher Foster, Dead Gorgeous, Sanoh Prasansapakit, Shani Blake, Jean-Luc Leroux, Layla Chambers"
	},
		{
			name: "Alex",
			role: "South Control",
			email: "duskcontrolsouth@gmail.com",
			timezone: "GMT",
			responsibilities: "Aaron Storme, Dominik, Gustave, Helga Adler, Jennifer Yuen, Letitia Mayhew, Maisie Walliams, Orla Kuchler, Roger Broom"
		},
	{
    name: "Scott",
    role: "Tech Support",
    email: "Use the #tech-support channel on the Dusk City discord server",
    timezone: "PST",
    responsibilities: "Keeping CANDI running"
	}
]