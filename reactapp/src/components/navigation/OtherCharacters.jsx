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
			if (!catagories.some(el => el === character.role || character.role === 'NPC')) catagories.push(character.role);
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
								{this.props.characters.filter(el => el.role === catagory).sort((a, b) => { // sort the catagories alphabetically 
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
									{this.state.selected.timezone}			
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

const characters = [
	{
	name: "Steve",
	charName: "Mr. Bones",
	role: "Scoundrel",
	email: "example@gmail.com",
	timezone: "Pacific",
	bio: "The Chair of Mollified Eschatology is a member of the Mist family - \n a cadet branch of Ignis. With a title to live up to, and no fortune to speak of, a career within the University was a natural choice. Their keen mind and ability to convincingly argue any point of view made them a natural fit for the Department of Eschatology, and their family ties helped their career accelerate. Now free to pursue their own research, with a generous Lost Society grant and their pick of the Readers for assistants, they are beginning to uncover strange mysteries - mysteries which, if pursued, might reveal dangerous truths...",
	icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
},
{
	name: "Roger",
	charName: "The Tickler",
	role: "Criminal",
	email: "example@gmail.com",
	timezone: "Atlantic",
	bio: "Watch out he tickles ya",
	icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
},
{
	name: "Billy",
	charName: "Mrs. Bones",
	role: "Divine",
	email: "example@gmail.com",
	timezone: "Pacific",
	bio: "Happily married to Mr. Bones",
	icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
},
{
	name: "Bob",
	charName: "Angry Skeltor Man",
	role: "Criminal",
	email: "example@gmail.com",
	timezone: "Atlantic",
	bio: "NYYAAHHHHH",
	icon: "https://preview.redd.it/rgtrs9tube361.jpg?width=513&auto=webp&s=4c0d6ba5218ce19f7b4918e2ec27aa04ab26a3d1"
},
{
	name: "Larry",
	charName: "Throgg the Barbarian",
	role: "Divine",
	email: "example@gmail.com",
	timezone: "Pacific",
	bio: "Vote for Throgg, he'll smash corruption",
	icon: "https://i.pinimg.com/236x/f9/fe/c8/f9fec8df840adde275c1f2337b1a239e--barbarian-king-fantasy-characters.jpg"
},
{
	name: "Dany",
	charName: "Tim the Enchanter",
	role: "NPC",
	email: "example@gmail.com",
	timezone: "GMT",
	bio: "Some call him.... Tim?",
	icon: "https://www.ancient-origins.net/sites/default/files/field/image/ancient-wizard.jpg"
},
{
	name: "Mac",
	charName: "A Frog",
	role: "Divine",
	email: "example@gmail.com",
	timezone: "Pacific",
	bio: "Ribbit",
	icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
},
{
	name: "Dannis",
	charName: "A log",
	role: "Criminal",
	email: "example@gmail.com",
	timezone: "Atlantic",
	bio: "....",
	icon: "data:image/jpeg;base64,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"
},	{
	name: "Charlie",
	charName: "A Bog",
	role: "Divine",
	email: "example@gmail.com",
	timezone: "GMT",
	bio: "Blub blub",
	icon: "https://ychef.files.bbci.co.uk/624x351/p04c1c35.jpg"
},	{
	name: "Dee",
	charName: "The Hog",
	role: "Divine",
	email: "example@gmail.com",
	timezone: "Pacific",
	bio: "Oink",
	icon: "https://pyxis.nymag.com/v1/imgs/e11/2b4/6305f190728ca4438f443142453ec5f267-16-feral-hog.rsquare.w700.jpg"
},	{
	name: "Frank",
	charName: "The Duke",
	role: "Criminal",
	email: "example@gmail.com",
	timezone: "GMT",
	bio: "Chhaarrmedd charmed charmed",
	icon: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
},
];
 

export default OtherCharacters;