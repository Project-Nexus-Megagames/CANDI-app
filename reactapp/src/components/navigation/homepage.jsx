import React, { Component } from 'react';
import { Container, Icon, IconButton, Divider, Content, Footer } from 'rsuite';

class HomePage extends Component {
	state = {  }

	openAnvil () {
		const win = window.open('https://www.worldanvil.com/w/afterlife3A-a-postmortem-megagame-afterlife-control', '_blank');
		win.focus();
	}

	openNexus () {
		const win = window.open('https://www.patreon.com/wcmprojectnexus', '_blank');
		win.focus();
	}
	

	render() { 
		return ( 
			<Container style={{backgroundColor:'#15181e', padding:'15px', width: '860px', position: 'relative', display: 'inline-block', textAlign: 'left'}}>
				<Content>
					<img src={"https://www.worldanvil.com/media/cache/cover/uploads/images/d2a671e443bd62d71dd72fb872c2f887.jpg"} alt='Unable to load img' width="830" height="320"/>
					<Divider className='catagory-underline'/>
					<h6>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} onClick={() =>this.openAnvil()} appearance="primary"/></h6>
					<div > <b>Current Turn:</b>
						<span> {this.props.gamestate.round} </span>
					</div>
					<div > <b>Game Version:</b>
						<span> 1.0</span>
					</div>
				</Content>
			<Footer>
				<div style={{ display: 'flex',  justifyContent: 'center',  alignItems: 'center', cursor: 'pointer',  }}>
				<img width='60%' onClick={()=> this.openNexus()} src={"https://lh6.googleusercontent.com/jw6yV54kBTA52cEaz_wO5ddXUVV7JSEvi9iazmsSK01uo-h6D76ca84WjsTWb7dbSw3iuZzdYlqx2qCABGl_v-nXRV2qI0scFcGV7PTxhfAaYPRGFsg=w1280"} alt='Powered by Project Nexus' />
				</div>
			</Footer>
			</Container>

		 );
	}
}
 
export default HomePage;

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>