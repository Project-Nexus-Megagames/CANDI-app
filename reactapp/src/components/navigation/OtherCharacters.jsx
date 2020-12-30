import React, { Component } from 'react';
import { Button, Content, Container, Sidebar, Input, Panel, List, PanelGroup, FlexboxGrid, Avatar, IconButton, Icon} from 'rsuite';



class OtherCharacters extends Component {
	state = { 
		selected: {},
		catagories: []
	 }

	listStyle (item) {
		if (item === this.state.selected) {
			return ({cursor: 'pointer', backgroundColor: "#212429"})
		}
		else return ({cursor: 'pointer'})
	}

	copyToClipboard (email) {
		navigator.clipboard.writeText(email);
	}
	
	componentDidMount() {
		this.setState({ selected: null });
		const catagories = [];
		for (const character of this.props.characters) {
			if (!catagories.some(el => el === character.tag || character.tag === 'NPC')) catagories.push(character.tag);
		}
		catagories.sort((a, b) => { // sort the catagories alphabetically 
				if(a < b) { return -1; }
				if(a > b) { return 1; }
				return 0;
			});
		catagories.push('NPC');
		this.setState({ catagories });
	}

	render() { 
		return ( 
			<Container>
			<Sidebar style={{backgroundColor: "black"}}>
				<PanelGroup>					
					<Panel style={{ backgroundColor: "#000101"}}>
						<Input placeholder="Search"></Input>
					</Panel>
					<Panel bodyFill style={{maxHeight: 650, overflow: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255, 255, 255, 0.12)' }}>					
					{this.state.catagories.map((catagory, index) => (
						<React.Fragment>
						<h6 style={{backgroundColor: "#61342e"}}>{catagory}</h6>	
							<List hover size="sm" >
								{this.props.characters.filter(el => el.tag === catagory).sort((a, b) => { // sort the catagories alphabetically 
									if(a.charName < b.charName) { return -1; }
									if(a.charName > b.charName) { return 1; }
									return 0;
								}).map((character, index) => (
									<List.Item key={index} index={index} onClick={() => this.setState({ selected: character })} style={this.listStyle(character)}>
										<FlexboxGrid>
											<FlexboxGrid.Item colspan={5} style={styleCenter}>
												<Avatar src={character.icon ? character.icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"} circle/>
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={16} style={{...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden'}}>
												<div style={titleStyle}>{character.characterName}</div>
												<div style={slimText}>{character.email}</div>
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</List.Item>
								))}
							</List>												
						</React.Fragment>	
					))}			
					</Panel>							
				</PanelGroup>
			</Sidebar>
			{this.state.selected &&
				<Content>
					<FlexboxGrid >
						<FlexboxGrid.Item colspan={4} >
						</FlexboxGrid.Item>
						<FlexboxGrid.Item colspan={16} >
							<Panel style={{padding: "0px", textAlign: "left", backgroundColor: "#15181e"}}>
								<h3>{this.state.selected.characterName}</h3>		
								<p>
									<h6>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} appearance="primary"/></h6>
								</p>
								<p>
									Email
								</p>
								<p>
									<FlexboxGrid>
										<FlexboxGrid.Item colspan={22}>
											<h5>{this.state.selected.email}</h5> 
										</FlexboxGrid.Item>
										<FlexboxGrid.Item >
											<IconButton icon={<Icon icon="envelope"/>} color="blue" circle />										
										</FlexboxGrid.Item>
									</FlexboxGrid>
								</p>
								<p>
									<Button appearance='ghost' block onClick={()=> this.copyToClipboard(this.state.selected.email)}>Copy email to clipboard</Button>
								</p>
								<p>
									Faction:	
								</p>
								<p>
									<b>{this.state.selected.tag}</b>			
								</p>
								<p>
									Time Zone:	
								</p>
								<p>
									{this.state.selected.timeZone}			
								</p>
								<p>Bio:	
								</p>
								<p>
									{this.state.selected.bio}			
								</p>
								<p>
									<img src={this.state.selected.icon ? this.state.selected.icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"} alt="Img could not be displayed" width="320" height="320" />
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

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px'
};

const titleStyle = {
  whiteSpace: 'nowrap',
  fontWeight: 500,
	paddingLeft: 2
};

const slimText = {
  fontSize: '0.866em',
  color: '#97969B',
  fontWeight: 'lighter',
	paddingBottom: 5,
	paddingLeft: 2
};

 

export default OtherCharacters;