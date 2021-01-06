import React, { Component } from 'react';
import { Container, Icon, IconButton, Divider } from 'rsuite';

class HomePage extends Component {
	state = {  }
	render() { 
		return ( 
			<Container style={{backgroundColor:'#15181e', padding:'15px', width: '660px', position: 'relative', display: 'inline-block', textAlign: 'left'}}>
			<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} alt='Unable to load img' width="630" height="220"/>
			<Divider className='catagory-underline'/>
				<h6>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} appearance="primary"/></h6>
				<div > <b>Current Turn:</b>
					<span> {this.props.gamestate.round} </span>
				</div>
				<div > <b>Time Ends:</b>
					<span> 11/12/2020 23:59 PST</span>
				</div>
			</Container>
		 );
	}
}
 
export default HomePage;

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>