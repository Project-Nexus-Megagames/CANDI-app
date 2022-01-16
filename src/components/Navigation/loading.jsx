import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Divider, FlexboxGrid, Progress } from 'rsuite';
import { loadAssets } from '../../redux/entities/assets';
import { loadCharacters } from '../../redux/entities/characters';
import { loadGamestate } from '../../redux/entities/gamestate';
import { loadLocations } from '../../redux/entities/locations';
import { loadplayerActions, loadAllActions } from '../../redux/entities/playerActions';
const { Circle } = Progress;

class Loading extends Component {

    componentDidUpdate = (prevProps) => {
        if(this.props.actionsFailed > prevProps.actionsFailed && this.props.actionsFailed < 10) {
            if (this.props.actionsFailed < 4) {
                this.props.loadAction(this.props.user);
            }
            else {
                this.props.loadAllActions();
            }
        }
        if(this.props.assetsFailed > prevProps.assetsFailed && this.props.assetsFailed < 10) {
            this.props.loadAssets();
        }    
        if(this.props.locationsFailed > prevProps.locationsFailed && this.props.locationsFailed < 10) {
            this.props.loadLocations();
        }    
        if(this.props.charactersFailed > prevProps.charactersFailed && this.props.charactersFailed < 10) {
            this.props.loadChar();
        }    
    }

    render() {
        return ( 
            <React.Fragment>
            <Content>
                <FlexboxGrid justify="center">
                <FlexboxGrid.Item key={1} colspan={24} style={{marginTop: '50px', cursor: 'pointer'}}>
                    <img style={{ maxHeight: '400px', height: '30vh' }} src={gamePhotos[rand]}  alt={'Loading...'} onClick={()=> this.bored()} />  
                    {/* src={spook[rand]} */}
                </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid  justify="center" >
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ fontSize: '0.9em', width: '10vw', marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
                        Gamestate: <Circle percent={this.props.gamestateLoaded ? 100 : 0} showInfo={this.props.gamestateLoaded ? true: false} status={this.props.gamestateLoaded ? 'success' : 'active'} />
                    </div>  
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ fontSize: '0.9em', width: '10vw', marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
                        Assets: <Circle percent={this.props.assetsLoaded ? 100 : 0} showInfo={this.props.assetsLoaded ? true: false} status={this.props.assetsLoaded ? 'success' : 'active'} />                  
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
                    <div style={{ fontSize: '0.9em', width: '10vw', marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
                        Characters: <Circle percent={this.props.characterLoaded ? 100 : 0} showInfo={this.props.characterLoaded ? true: false} status={this.props.characterLoaded ? 'success' : 'active'} />
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
                    <div style={{ fontSize: '0.9em', width: '10vw', marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
                        Actions: <Circle percent={this.props.actionsLoaded ? 100 : 0} showInfo={this.props.actionsLoaded ? true: false} status={this.props.actionsLoaded ? 'success' : 'active'} />               
                    </div>
                    {this.props.actionsFailed > 0 && this.props.actionsFailed < 11 && <div>
                        <div>
                            <span>Action Request Failed! Re-attempting...</span> 
                        </div>
                        <div>
                            <span>Number of attempts: {this.props.actionsFailed}</span>         
                        </div>               
                    </div>}   
                    {this.props.actionsFailed > 9 && <div>
                        <div>
                            <span>Action Request Failed! Please close tab and try again later</span> 
                        </div>
                        <div>
                            <span>Number of attempts: Too Many</span>         
                        </div>               
                    </div>} 
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={4}>
                    <div style={{ fontSize: '0.9em', width: '10vw', marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center"}}>
                        Locations: <Circle percent={this.props.locationsLoaded ? 100 : 0} showInfo={this.props.locationsLoaded ? true: false} status={this.props.locationsLoaded ? 'success' : 'active'} />               
                    </div>
                    {this.props.locationsFailed > 0 && this.props.locationsFailed < 11 && <div>
                        <div>
                            <span>Action Request Failed! Re-attempting...</span> 
                        </div>
                        <div>
                            <span>Number of attempts: {this.props.locationsFailed}</span>         
                        </div>               
                    </div>}   
                    {this.props.locationsFailed > 9 && <div>
                        <div>
                            <span>Action Request Failed! Please close tab and try again later</span> 
                        </div>
                        <div>
                            <span>Number of attempts: Too Many</span>         
                        </div>               
                    </div>} 
                </FlexboxGrid.Item>

                </FlexboxGrid>
            </Content>
            <Divider/>
              {rand1 % 2 === 1 && <b>The Queen is not Amused</b>}
              {rand1 % 2 === 0 && <b>{loadingMsg[rand1]}</b>}
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
    locationsFailed: state.locations.failedAttempts,

    gamestate: state.gamestate,
    user: state.auth.user,

    actionsLoaded: state.actions.loaded,
    assetsLoaded: state.assets.loaded,
    gamestateLoaded: state.gamestate.loaded,
    characterLoaded: state.characters.loaded,
    locationsLoaded: state.locations.loaded,
});

const mapDispatchToProps = (dispatch) => ({
	loadAction: (data) => dispatch(loadplayerActions(data)),
    loadAllActions: (data) => dispatch(loadAllActions(data)),
    loadChar: (data) => dispatch(loadCharacters()),
	loadAssets: (data) => dispatch(loadAssets()),
    loadLocations: (data) => dispatch(loadLocations()),
	loadGamestate: (data) => dispatch(loadGamestate())
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


const gamePhotos = [
'https://i.pinimg.com/originals/19/eb/f3/19ebf370a04aa86972768fe7435c4d94.gif'
]

const bored = [
    'https://www.youtube.com/watch?v=QSS3GTmKWVA', // Freddie Mercury gets Trapped in a Slide and Calls out for Mamma (ASMR)
    'https://www.youtube.com/watch?v=Q6EIUo1q4lc&lc=UgwLB6d6w9RNlqJHQ1t4AaABAg&ab_channel=BobtheNinjaMan', // Dummy Thicc
    'https://youtu.be/Rc-Jh3Oe0Gc', // Racism In Teen Titans
    'https://www.youtube.com/watch?v=BP9uI4rFVHU', // you dare speak to me in that tone of voice?
    'https://www.youtube.com/watch?v=j0HN7bvBODE', // Ding (toto car alarm)
    'https://www.youtube.com/watch?v=fhmeYoJZeOw', // When I Make a Good Pun (Brian David Gilbert)
    'https://www.youtube.com/watch?v=Oct2xKMGOno', // WednesdayOS
    'https://www.youtube.com/watch?v=5tFZof9EDhc', // what's your team's name?
    'https://www.youtube.com/watch?v=Qz7tMKlkPOc&t=1', // The Male Fantasy
    'https://www.youtube.com/watch?v=nWIzwQui-xg', // Awkward moments with... Daniel Radcliffe - Pathé
    'https://www.youtube.com/watch?v=cHoGhisiBg8&feature=youtu.be', // WW2 - Pearl Harbor
    'https://www.youtube.com/watch?v=9xX6QPIQdZs&feature=youtu.be', // Waiting in line for 10 hours for a Supreme crowbar
    'https://www.youtube.com/watch?v=it8vJ03E8c8', // shingle jingle
    'https://www.youtube.com/watch?v=bTS9XaoQ6mg&list=WL&index=130', // chess king sacrifice
    'https://www.youtube.com/watch?v=zo7fgswQPJ8&list=WL&index=37&ab_channel=ThomasSchuler', // Someone Hacked Lime Scooters
    'https://www.youtube.com/watch?v=G_rWl-jaAiU', // buy my bed
    'https://www.youtube.com/watch?v=D5fH5j7ux0U', // Spongebob also knows the rules
    'https://www.youtube.com/watch?v=B62ACxuq8Pw', // Discombobulate
    'https://www.youtube.com/watch?v=dGDH3meSPyk&ab_channel=dakooters', // god is dead OwO
    'https://www.youtube.com/watch?v=WGNuDe3OwFY&feature=youtu.be', // Annihilation Deleted Scene
    'https://www.youtube.com/watch?v=AauAyjBxaIQ', // Siblings
    'https://www.youtube.com/watch?v=ihSaGAVHmvw', // Bikie Wars
    'https://www.youtube.com/watch?v=gp1lCem43lg', // Tactical Reload
    'https://www.youtube.com/watch?v=nHc288IPFzk', // Duck Army
    'https://www.youtube.com/watch?v=Z47xwzYGop8', // that's just a stupid boulder [2]
    'https://www.youtube.com/watch?v=GPUgjy-Pn-4', // a villain who unintentionally always does helpful things
    'https://www.youtube.com/watch?v=St7S3YrxqW0', // Dog concerto in A♭m
    'https://www.youtube.com/watch?v=otIrDM4RBpo', // Modern Romance
    'https://www.youtube.com/watch?v=mnE8A9cfGio', // Send This to a Fellow King
    'https://www.youtube.com/watch?v=0_7WwPkqqvA', // Being Bigoted in the Workplace - 1999 Ep01
    'https://www.youtube.com/watch?v=1fjuaBZQtOI', // fine dining dakooters
    'https://www.youtube.com/watch?v=n3GOL_KHxX4', // you fool dakooters
    'https://www.youtube.com/watch?v=IdoD2147Fik', // Dumbledore asked calmly
    'https://www.youtube.com/watch?v=3NCyD3XoJgM', // Hi, I'm Daisy
    'https://www.youtube.com/watch?v=JFtUHVgw-gQ', // Boston Dynamics: Rise of the Dance of the Machines
    'https://www.youtube.com/watch?v=vYud9sZ91Mc', // Music really makes a difference
    'https://www.youtube.com/watch?v=PPgLTgWa99w', // "WAAfrica" (Five Waluigis sing Africa)
    'https://www.youtube.com/watch?v=kGj_HkKhhSE', // Wire
    'https://www.youtube.com/watch?v=pMN_bvk4KTo', // vacuum sealed tupperware
    'https://www.youtube.com/watch?v=xI39jU24InY', // Vader being a jerk
    'https://www.youtube.com/watch?v=s-09gNDsPzQ', // gamers
    'https://www.youtube.com/watch?v=9fjk8cNiptU', // Hard Ticket to Hawaii (1987) - Skate or Die
    'https://www.youtube.com/watch?v=yUZfkbKFtKA', // He must have taken him back to his village
    'https://www.youtube.com/watch?v=iP897Z5Nerk', // BINARY search with FLAMENCO dance
    'https://www.youtube.com/watch?v=fC7oUOUEEi4', // Get Stick Bugged lol
    'https://www.youtube.com/watch?v=d1rtJ3DbwIw', // Just a Jug of Chocolate Milk being Cut in Half
    'https://www.youtube.com/watch?v=EwAajOtfNT8', // two dudes in a hot tub
    'https://www.youtube.com/watch?v=XKqqqO83yp0', // Guy blow dries his tongue then eats a cracker...
    'https://www.youtube.com/watch?v=GfCqnHgXwBo',  // How to troll a parade
    'https://www.youtube.com/watch?v=TLV30GuX-ug', // this is the ideal doggy type
    'https://www.youtube.com/watch?v=nqhLn76kCv0', // Epic Skeletor He Man Money Super Market Commercial
    'https://pointerpointer.com/',
    'https://www.youtube.com/watch?v=Cv42itgRU6o', // Randall is banished to the shadow realm
    'https://www.youtube.com/watch?v=U_ILg-oZK-Q', // Playtime (Dan harmon)
    'https://www.youtube.com/watch?v=B0Td48JLgow', // FELLINLOVEWITHAGIRLLLL
    'https://www.youtube.com/watch?v=5KO2IjWI9fA', // Witches On Tinder
    'https://www.youtube.com/watch?v=ETbMj3cE7YA', // Star Fox 64 Ligma
    'https://www.youtube.com/watch?v=gnXUFXc2Yns', // Socialism is when the government does stuff but I vocoded it
    'https://www.youtube.com/watch?v=R4GlR6X4ljU&t=3s&ab_channel=PopCultureFish', // Oblivion npc conversation
    'https://www.youtube.com/watch?v=gBCKZtpMSNE&ab_channel=JCFosterTakesItToTheMoon', // Maslow Pyramid Any% Speedrun | 8.1 Seconds
    'https://www.youtube.com/watch?v=D4D5fZb-sEM&ab_channel=ProZD', // A Sexy RP with Walter White and Joseph Stalin
    'https://www.youtube.com/watch?v=D6aVzIWT7oM&t=14s&ab_channel=AllyourbasicGerrard', // Global Club Soccer Rankings
    'https://www.youtube.com/watch?v=x0WQOGVLLGw&ab_channel=weyrdmusicman', // Xenophobia
    'https://www.youtube.com/watch?v=9klzZsVw-cQ&ab_channel=KotteAnimation'
] // https://youtu.be/_17xBPv6-c0?t=4 shut the heeeelll up

const birthday = [
    'https://i.pinimg.com/originals/43/3c/42/433c420a99ffccb150b9981bd6bba9cf.gif',
    'https://i.pinimg.com/originals/54/5b/fd/545bfd1c316ee9fce8c30b9414c4421d.gif',
    'https://media1.tenor.com/images/b7e33bd26c649ee7ee5114835cad8898/tenor.gif?itemid=13929089',
    'https://media1.tenor.com/images/b7e33bd26c649ee7ee5114835cad8898/tenor.gif?itemid=13929089'
]

const loadingMsg = [
    // 'Thank you all for taking time to make this game happen.',  
    'pɐol oʇ pǝʍollɐ ʇou ǝɹɐ noʎ \'sᴉɥʇ pɐǝɹ uɐɔ noʎ ɟI',
    'Help I\'m a man stuck inside a loading screen let me out!',
    'C.A.N.D.I stands for the "Controling Actions \'N Distributing Inputs"! \nLook I really just wanted to call it CANDI. It\'s my app and I\'ll call it whatever I want!',

]

const rand = (Math.floor(Math.random() * gamePhotos.length ));
const rand1 = (Math.floor(Math.random() * loadingMsg.length ));
