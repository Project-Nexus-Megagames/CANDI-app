import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Icon, IconButton, Divider, Content, Footer, Loader } from 'rsuite';
import Loading from './loading';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
	}

	openAnvil () {
		const win = window.open('https://www.worldanvil.com/w/afterlife3A-a-postmortem-megagame-afterlife-control', '_blank');
		win.focus();
	}

	openNexus () {
		const win = window.open('https://www.patreon.com/wcmprojectnexus', '_blank');
		win.focus();
	}
	

	render() { 
		if (!this.props.login && !this.props.loading) {
			this.props.history.push('/');
			return (<Loader inverse center content="doot..." />)
		};
		if (this.props.loading || !this.props.actionsLoaded || !this.props.gamestateLoaded || !this.props.charactersLoaded) {
			return (<Loading />)
		}
		else return ( 
			<Container style={{backgroundColor:'#15181e', padding:'15px', width: '860px', position: 'relative', display: 'inline-block', textAlign: 'left'}}>
				<Content>
					<img src={"/images/afterlife banner v1.jpg"} alt='Unable to load img' width="830" height="320"/>
					<Divider className='catagory-underline'/>
					<h6>World Anvil Link 				<IconButton icon={<Icon icon="link"/>} onClick={() =>this.openAnvil()} appearance="primary"/></h6>
					<div > <b>Current Turn:</b>
						<span> {this.props.gamestate.round} </span>
					</div>
					<div > <b>Game Version:</b>
						<span> 2.8.2</span>
					</div>
				</Content>
			<Footer>
				<div style={{ display: 'flex',  justifyContent: 'center',  alignItems: 'center', cursor: 'pointer',  }}>
				<img width='60%' onClick={()=> this.openNexus()} src={"https://cdn.discordapp.com/attachments/582049508825890856/799759707820261496/unnamed.png"} alt='Powered by Project Nexus' />
				</div>
			</Footer>
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
	login: state.auth.login,
	loading: state.auth.loading,
	gamestate: state.gamestate,
	gamestateLoaded: state.gamestate.loaded,
	actionsLoaded: state.actions.loaded,
	charactersLoaded: state.characters.loaded,
	assetsLoaded: state.assets.loaded,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

//<img src={"https://i.ytimg.com/vi/flD5ZTC3juk/maxresdefault.jpg"} width="700" height="220"/>