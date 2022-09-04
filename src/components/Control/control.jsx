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
		}
		return ( 
			<React.Fragment>
			<NavigationBar/>
			<Container style={{ height: '94vh'}}>
				<Sidebar className="side-bar">
					<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input onChange={(value)=> this.filter(value)} placeholder="Search"></Input>
					</Panel>
						<Panel bodyFill style={{borderRadius: '0px'}}>
							<List hover size="md" style={{height: 'calc(100vh - 130px)',   overflow: 'auto', borderRight: '1px solid rgba(255, 255, 255, 0.12)'}}>
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
    name: "Scott",
    role: "Tech Support",
    email: "Use the #tech-support channel on the discord server",
    timezone: "PST",
    responsibilities: "Keeping CANDI running"
	}
]