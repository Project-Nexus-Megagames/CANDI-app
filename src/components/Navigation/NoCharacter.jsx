import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Content, FlexboxGrid } from 'rsuite';
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

    bored () {
        const random = (Math.floor(Math.random() * bored.length ));
        const win = window.open(bored[random], '_blank');
		win.focus();
    }
		handleLogOut = async () => {
			localStorage.removeItem('CANDI');
			this.props.history.push('/');
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

});

export default connect(mapStateToProps, mapDispatchToProps)(NoCharacter);

const bored = [
	'https://www.youtube.com/watch?v=QSS3GTmKWVA',
	'https://www.youtube.com/watch?v=Q6EIUo1q4lc&lc=UgwLB6d6w9RNlqJHQ1t4AaABAg&ab_channel=BobtheNinjaMan',
	'https://youtu.be/Rc-Jh3Oe0Gc',
	'https://www.youtube.com/watch?v=BP9uI4rFVHU',
	'https://www.youtube.com/watch?v=j0HN7bvBODE',
	'https://www.youtube.com/watch?v=fhmeYoJZeOw',
	'https://www.youtube.com/watch?v=Oct2xKMGOno',
	'https://www.youtube.com/watch?v=5tFZof9EDhc',
	'https://www.youtube.com/watch?v=Qz7tMKlkPOc&t=1',
	'https://www.youtube.com/watch?v=nWIzwQui-xg',
	'https://www.youtube.com/watch?v=4ISDUKG-N90&feature=youtu.be',
	'https://www.youtube.com/watch?v=cHoGhisiBg8&feature=youtu.be',
	'https://www.youtube.com/watch?v=9xX6QPIQdZs&feature=youtu.be',
	'https://www.youtube.com/watch?v=it8vJ03E8c8',
	'https://www.youtube.com/watch?v=bTS9XaoQ6mg&list=WL&index=130',
	'https://www.youtube.com/watch?v=aiM5KDuHrR4',
	'https://www.youtube.com/watch?v=zo7fgswQPJ8&list=WL&index=37&ab_channel=ThomasSchuler',
	'https://www.youtube.com/watch?v=G_rWl-jaAiU',
	'https://www.youtube.com/watch?v=D5fH5j7ux0U',
	'https://www.youtube.com/watch?v=B62ACxuq8Pw',
	'https://www.youtube.com/watch?v=dGDH3meSPyk&list=PLoF28YhYwCLjMcirMvGouxbIeNSqJGi_K&index=22&ab_channel=dakooters',
	'https://www.youtube.com/watch?v=WGNuDe3OwFY&feature=youtu.be',
	'https://www.youtube.com/watch?v=AauAyjBxaIQ',
	'https://www.youtube.com/watch?v=ihSaGAVHmvw',
	'https://www.youtube.com/watch?v=c7_CcBgZ2e4&feature=share',
	'https://www.youtube.com/watch?v=gp1lCem43lg',
	'https://www.youtube.com/watch?v=dh0TkO3sypw',
	'https://www.youtube.com/watch?v=nHc288IPFzk',
	'https://www.youtube.com/watch?v=Z47xwzYGop8',
	'https://www.youtube.com/watch?v=GPUgjy-Pn-4',
	'https://www.youtube.com/watch?v=St7S3YrxqW0',
	'https://www.youtube.com/watch?v=otIrDM4RBpo',
	'https://www.youtube.com/watch?v=mnE8A9cfGio',
	'https://www.youtube.com/watch?v=0_7WwPkqqvA',
	'https://www.youtube.com/watch?v=1fjuaBZQtOI',
	'https://www.youtube.com/watch?v=ozlhNbDJ7DY',
	'https://www.youtube.com/watch?v=n3GOL_KHxX4',
	'https://www.youtube.com/watch?v=IdoD2147Fik',
	'https://www.youtube.com/watch?v=3NCyD3XoJgM',
	'https://www.youtube.com/watch?v=kNr1HBBeCYM',
	'https://www.youtube.com/watch?v=JFtUHVgw-gQ',
	'https://www.youtube.com/watch?v=vYud9sZ91Mc',
	'https://www.youtube.com/watch?v=PPgLTgWa99w'
];
