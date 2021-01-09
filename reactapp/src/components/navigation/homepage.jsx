import React, { Component } from 'react';
import { Container, Icon, IconButton, Divider } from 'rsuite';

class HomePage extends Component {
	state = {  }

	openAnvil () {
		const win = window.open('https://www.worldanvil.com/w/afterlife3A-a-postmortem-megagame-afterlife-control', '_blank');
		win.focus();
	}
	

	render() { 
		return ( 
			<Container style={{backgroundColor:'#15181e', padding:'15px', width: '860px', position: 'relative', display: 'inline-block', textAlign: 'left'}}>
			<img src={"https://www.worldanvil.com/media/cache/cover/uploads/images/d2a671e443bd62d71dd72fb872c2f887.jpg"} alt='Unable to load img' width="830" height="320"/>
			<Divider className='catagory-underline'/>
				<h6>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} onClick={() =>this.openAnvil()} appearance="primary"/></h6>
				<div > <b>Current Turn:</b>
					<span> {this.props.gamestate.round} </span>
				</div>
				<div > <b>Game Version:</b>
					<span> 1.0</span>
				</div>
			</Container>
		 );
	}
}
 
export default HomePage;

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>