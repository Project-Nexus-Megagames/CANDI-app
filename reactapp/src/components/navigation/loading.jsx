import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Content, FlexboxGrid, Progress } from 'rsuite';
import { loadplayerActions, loadAllActions } from '../../redux/entities/playerActions';
const { Circle } = Progress;

class Loading extends Component {
    constructor(props) {
		super(props);
		this.state = {
            actions: false,
            characters: false,
            assets: false,
            gamestate: false
		};
	}

    componentDidUpdate = (prevProps) => {
        if (this.props.actions !== prevProps.actions) {
            this.setState({ actions: true }); 
        }
        if (this.props.characters !== prevProps.characters) {
            this.setState({ characters: true }); 
        }
        if (this.props.assets !== prevProps.assets) {
            this.setState({ assets: true }); 
        }
        if (this.props.gamestate !== prevProps.gamestate) {
            this.setState({ gamestate: true }); 
        }

        if(this.props.actionsFailed > prevProps.actionsFailed) {
            if (this.props.actionsFailed < 4) {
              this.props.loadAction(this.props.user);
            }
            else {
                this.props.loadAllActions();
            }
        }
    }

    render() {
        return ( 
            <React.Fragment>
            <Content>
                <FlexboxGrid justify="center">
                <FlexboxGrid.Item key={1} colspan={12} style={{marginTop: '50px', cursor: 'pointer'}}>
                    <img src={spook[rand]} alt={'Loading...'} onClick={()=> this.bored()} />  
                </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid  justify="center" >
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10 }}>
                        Gamestate: <Circle percent={this.state.gamestate ? 100 : 0} showInfo={this.state.gamestate ? true: false} status={this.state.gamestate ? 'success' : 'active'} />
                    </div>  
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10 }}>
                        Assets: <Circle percent={this.state.assets ? 100 : 0} showInfo={this.state.assets ? true: false} status={this.state.assets ? 'success' : 'active'} />                  
                    </div>
                    {this.props.assetsFailed > 0 && <div>
                        <div>
                            <span>Asset Request Failed! Re-attempting...</span> 
                        </div>
                        <div>
                            <span>Number of attempts: {this.props.assetsFailed}</span>         
                        </div>               
                    </div>}  
                </FlexboxGrid.Item>  

                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10 }}>
                        Characters: <Circle percent={this.state.characters ? 100 : 0} showInfo={this.state.characters ? true: false} status={this.state.characters ? 'success' : 'active'} />
                    </div>
                    {this.props.charactersFailed > 0 && <div>
                        <div>
                            <span>Character Request Failed! Re-attempting...</span> 
                        </div>
                        <div>
                            <span>Number of attempts: {this.props.charactersFailed}</span>         
                        </div>               
                    </div>}  
                    </FlexboxGrid.Item>                  

                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', }}>
                        Actions: <Circle percent={this.state.actions ? 100 : 0} showInfo={this.state.actions ? true: false} status={this.state.actions ? 'success' : 'active'} />               
                    </div>
                    {this.props.actionsFailed > 0 && <div>
                        <div>
                            <span>Action Request Failed! Re-attempting...</span> 
                        </div>
                        <div>
                            <span>Number of attempts: {this.props.actionsFailed}</span>         
                        </div>               
                    </div>}   
                </FlexboxGrid.Item>


                </FlexboxGrid>
            </Content>
             <b>{loadingMsg[rand1]}</b>
        </React.Fragment>
        );        
    }

    bored () {
        const random = (Math.floor(Math.random() * bored.length ));
        const win = window.open(bored[random], '_blank');
		win.focus();
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
	loadAction: (data) => dispatch(loadplayerActions(data)),
    loadAllActions: (data) => dispatch(loadAllActions(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);

const spook = [
    'https://media4.giphy.com/media/tJMVqwkdUIuL0Eiam3/source.gif',
    'https://media2.giphy.com/media/l0HlCkojKEiPhw86Y/giphy.gif',
    'https://media2.giphy.com/media/65Mt9P22p2zMzpDPZ7/giphy.gif',
    'https://media4.giphy.com/media/3o7TKpmHsAZiTTekve/giphy.gif',
    'https://media1.giphy.com/media/12mbWQRCFxOzp6/giphy.gif',
    'https://media1.giphy.com/media/UrljInRDir27u/giphy.gif',
    'https://media4.giphy.com/media/b04Dkxq5AUOCA/giphy.gif',
    'https://media0.giphy.com/media/9V8Zkw4N7wef4wVTMj/giphy.gif',
    'https://media0.giphy.com/media/3o7TKFiWSXV7JjjLFu/giphy.gif',
    'https://media0.giphy.com/media/26BRCc2VNkdZ5tjvG/giphy.gif',
    'https://media4.giphy.com/media/QBkBsqCs1fzB6lWtAg/giphy.gif',
    'https://media3.giphy.com/media/1wqpNgYn6Ioi5KFpYu/giphy.gif',
    'https://media3.giphy.com/media/NReptqJMy4AEqVBMLy/giphy.gif',
    'https://media3.giphy.com/media/dAROqk8Rj2hijvQSZ6/giphy.gif',
    'https://media2.giphy.com/media/J3FG7OCZ41ECEGg5xK/giphy.gif',
    'https://media0.giphy.com/media/26BRxmqeqsRPBBOpy/giphy.gif',
    'https://media3.giphy.com/media/1NTrtg7jDz8XwSObFE/giphy.gif',
    'https://media1.giphy.com/media/623LlMM8HuzF2gD12N/giphy.gif',
    'https://media0.giphy.com/media/WFk0kxBWUgDjgmN2G9/giphy.gif',
    'https://media4.giphy.com/media/26xBtwZMRHvhP4WAM/giphy.gif',
    'https://media3.giphy.com/media/dt0T8TI3Kizyctrxh9/giphy.gif',
    'https://media4.giphy.com/media/kbnUIUVY7YHNhe5tbb/giphy.gif',
    'https://media0.giphy.com/media/1qk24adSnJ1OOJLpZM/giphy.gif',
    'https://media3.giphy.com/media/hS9SwD4UcQH5OJBeV4/giphy.gif',
    'https://i.imgur.com/vxfXBNl.gif',
    'https://media1.giphy.com/media/1wlWr2HGewrBcLAAQ0/giphy.gif',
    'https://media3.giphy.com/media/1qj35KDHtfyLn8bwqh/giphy.gif',
    'https://media0.giphy.com/media/1zi2j6wyS4LQLJahuJ/giphy.gif',
    'https://media3.giphy.com/media/l3fQ6Fh6Ze3rMXn4A/giphy.gif',
    'https://media4.giphy.com/media/uBy3vPgqr6zPuZjLzC/giphy.gif',
    'https://media1.giphy.com/media/39jP8ygazzD3RQ2MpE/giphy.gif',
    'https://media1.giphy.com/media/l0MYzoJm5MTpmiqd2/giphy.gif?cid=ecf05e47b8e1e8u4a4zom62y0n8jmo9qxapszq2o39s4h97w&rid=giphy.gif',
    'https://media0.giphy.com/media/ec4eYyyV3lDdZQN3tM/giphy.gif',
    'https://media.giphy.com/media/KfHdqUYph81ult6hiP/giphy.gif',
    'https://media.giphy.com/media/U7yEG153QrpXnviwWd/giphy.gif',
    'https://media0.giphy.com/media/iIYWG1FvZCv5FJS6iY/giphy.gif', //ouiji video call
    'https://media.giphy.com/media/gI6SlmfHfmRd2imYAD/giphy.gif',
    'https://media.giphy.com/media/lMwyhPnj7Xp2adc5qp/giphy.gif',
    'https://media.giphy.com/media/f7N10M1qz4I2M29DNP/giphy.gif'
]

const bored = [
    'https://www.youtube.com/watch?v=QSS3GTmKWVA',
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
]

const loadingMsg = [
    'Loading...',   
    'Thank you all for taking time to make this game happen.',  
    'Hey... you\'re not Australian are you?',
    'pɐol oʇ pǝʍollɐ ʇou ǝɹɐ noʎ \'sᴉɥʇ pɐǝɹ uɐɔ noʎ ɟI',
    'Long live the King!',
    'Help I\'m a man stuck inside a loading screen let me out!',
    'Oh, remind me to tell you about that thing. You know that thing about that guy with that face. Yeah you know the one.',
    'Long loading screen? Try clicking the skeleton!',
    'Don\'t touch that dial! We\'ll be right back after these messages!',
    'C.A.N.D.I stands for the "Control Actions \'N Distributing Inputs"! \nLook I really just wanted to call it CANDI. It\'s my app and I\'ll call it whatever I want!',
    'Becoming self aware...', 
    'Вся твоя база принадлежит нам',
    'I wanted to be a dating app when I was developed.',
    'Fun Fact: if you forget your password you will be asked to answer a security question. It is: "What is a megagame?"',
    'Fun Fact: Gary Oldman is in fact younger than Gary Numan',
    'Fun Fact: An average person spends 24 years of his life sleeping.',
    'Fun Fact at some point you held the world record for youngest person alive. It\'s all been pretty downhill from there, hasn\'t it?',
    'Fun Fact: Pope Stephen VI had the corpse of his predecessor dug up to stand trial.',
    'Fun Fact: Most toilets flush in e flat.',
    'Did you know, clicking the skeleton gives you a secret!',
    'This message brought to you by: A very weird sense of humor',
    'Joke Time! A blind man walks into a bar.',
    'What\'s orange and sounds like a parrot?\nA carrot.',
    '01001101 01100001 01100100 01100101 00100000 01111001 01101111 01110101 00100000 01101100 01101111 01101111 01101011',
    'What if the real Afterlife was the firends we made along the way?',
    'Loading... what? They can\'t all be interesting or funny...',
    'What do you call an alligator in a vest?\n An Investigator.',
    'Fun Fact: Sun tzu invented war, and then perfected it so no man could best him in the ring of honor. This was shortly before he invented the Zoo.',
    'Code monkey get up, get coffee. Code monkey go to job.',
    'Secret: Scott\'s E-mail is booby trapped...',
    'Why are pirates called pirates? \'cause they arrr!'
]

const rand = (Math.floor(Math.random() * spook.length ));
const rand1 = (Math.floor(Math.random() * loadingMsg.length ));
