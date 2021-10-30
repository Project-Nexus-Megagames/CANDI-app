import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Content, FlexboxGrid, Loader } from 'rsuite';
import { signOut } from '../../redux/entities/auth';
// const { Circle } = Progress;

class Down extends Component {

    render() {
        return ( 
            <React.Fragment>
            <Content>
                <FlexboxGrid justify="center">
                <FlexboxGrid.Item key={1} colspan={12} style={{marginTop: '50px', cursor: 'pointer'}}>
                    <img src='http://cdn.lowgif.com/full/02b057d73bf288f7-.gif' alt={'No Character...'} onClick={()=> this.bored()} />  
                </FlexboxGrid.Item>
                </FlexboxGrid>
            </Content>
            <p>CANDI is offline for maintenence. Please check in Discord for annoncements regarding this down time.</p>
			{this.props.user && this.props.user.roles.some(el=> el === 'Control') && <div>
				<p>... unless you are control. Which if you can read this, you are. Go right in but shit might break yo</p>
				<Button onClick={()=> this.props.history.push('/control')}>Take me to Control Terminal</Button>
				<Button onClick={()=> this.props.history.push('/actions')}>Take me to Actions</Button>
				<Button onClick={()=> this.props.history.push('/others')}>Take me to Other Characters</Button>
			</div>}
        </React.Fragment>
        );        
    }

		handleLogOut = async () => {
			this.props.logOut()
			this.props.history.push('/login');
		}
}

const mapStateToProps = (state) => ({
	assets: state.assets.list,
	characters: state.characters.list,
    actions: state.actions.list,
    actionsFailed: state.actions.failedAttempts,
    charactersFailed: state.characters.failedAttempts,
    assetsFailed: state.assets.failedAttempts,
    gamestate: state.gamestate,
    user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
	logOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Down);

