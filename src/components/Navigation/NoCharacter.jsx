import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Content, FlexboxGrid } from 'rsuite';
import { signOut } from '../../redux/entities/auth';
// const { Circle } = Progress;

class NoCharacter extends Component {
    constructor(props) {
		super(props);
		this.state = {
		};
	}

    componentDidUpdate = (prevProps) => {
    }

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
            <p>Looks like you have no character assigned to your user. If you think this is in error then please contact Tech Support. Or just spam f5. It's a free world.</p>
			<Button onClick={()=> this.handleLogOut()}>Log Out</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NoCharacter);

