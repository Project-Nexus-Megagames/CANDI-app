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
                <FlexboxGrid.Item key={1} colspan={12} style={{marginTop: '50px', cursor: 'pointer'}}>
                    <img style={{ maxHeight: '400px' }} src={spook[rand]} alt={'Loading...'} onClick={()=> this.bored()} />  
                </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid  justify="center" >
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
                        Gamestate: <Circle percent={this.props.gamestateLoaded ? 100 : 0} showInfo={this.props.gamestateLoaded ? true: false} status={this.props.gamestateLoaded ? 'success' : 'active'} />
                    </div>  
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
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
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
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
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center" }}>
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
                    <div style={{ width: 160, marginTop: 10, position: 'relative', display: 'inline-block', textAlign: "center"}}>
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
                    {/* <b>Quack quack quack quack? Quack quack! Quack!!!</b> */}
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
'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/64f52102-0936-45b9-8d7c-15f71238f654/dbzk98q-cd887df7-7dc8-486a-83c8-6d14ab0de296.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNjRmNTIxMDItMDkzNi00NWI5LThkN2MtMTVmNzEyMzhmNjU0XC9kYnprOThxLWNkODg3ZGY3LTdkYzgtNDg2YS04M2M4LTZkMTRhYjBkZTI5Ni5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.G_1pM3g7tWqIlAIK8kSev37yhR6GCQOleN45GuallO4',
'https://media2.giphy.com/media/JpLa7HlmdfN3gciTOu/giphy.gif',
'https://www.picgifs.com/reaction-gifs/reaction-gifs/community/picgifs-community-45751.gif',
'https://64.media.tumblr.com/4cf9d3d672e0dccb0e60a50d47292e64/tumblr_miijyik7bK1qj7dsso1_500.gif',
'https://data.whicdn.com/images/318906663/original.gif',
'https://thumbs.gfycat.com/CharmingBleakHake-size_restricted.gif',
'https://i.pinimg.com/originals/1d/cb/01/1dcb01275091bdcbb56ed2c15dea60e0.gif',
'https://media4.giphy.com/media/l0iYPARiJXo2Fwr9hO/giphy.gif',
'https://media1.giphy.com/media/nyNS6Cfrnkdj2/giphy.gif',
'https://i1.wp.com/nileease.com/wp-content/uploads/2020/05/cf028dae44f0f5b1e7763747f422bbe0.gif?fit=400%2C222&ssl=1',
'https://i.pinimg.com/originals/44/03/f8/4403f8810a593202d3b5a44893ac3835.gif',
'https://media3.giphy.com/media/kiJEGxbplHfT5zkCDJ/giphy.gif',
'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/86b28b6a-9021-4e90-a0e8-a4c90d1101e5/dcojqze-cc1a7fa3-47d5-4bfb-84b0-2aac7bfa6434.png/v1/fill/w_1024,h_827,strp/stolen_by_cottonvalent_dcojqze-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODI3IiwicGF0aCI6IlwvZlwvODZiMjhiNmEtOTAyMS00ZTkwLWEwZTgtYTRjOTBkMTEwMWU1XC9kY29qcXplLWNjMWE3ZmEzLTQ3ZDUtNGJmYi04NGIwLTJhYWM3YmZhNjQzNC5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.xFBtgnLBCCPeIIAdqtVFjN_oEhpo2p1DZg6EeSBXly0'
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
    'https://www.youtube.com/watch?v=aiM5KDuHrR4', // cat mario 64
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
    'https://www.youtube.com/watch?v=TLV30GuX-ug',
    'https://www.youtube.com/watch?v=4W3Pfrv0lfg',
    'https://www.youtube.com/watch?v=nqhLn76kCv0',
    'https://pointerpointer.com/',
    'https://www.youtube.com/watch?v=Cv42itgRU6o'

] // https://youtu.be/_17xBPv6-c0?t=4 shut the heeeelll up

const birthday = [
    'https://i.pinimg.com/originals/43/3c/42/433c420a99ffccb150b9981bd6bba9cf.gif',
    'https://i.pinimg.com/originals/54/5b/fd/545bfd1c316ee9fce8c30b9414c4421d.gif',
    'https://media1.tenor.com/images/b7e33bd26c649ee7ee5114835cad8898/tenor.gif?itemid=13929089',
    'https://media1.tenor.com/images/b7e33bd26c649ee7ee5114835cad8898/tenor.gif?itemid=13929089'
]

const duck = [
    'https://media1.tenor.com/images/a6fe1299a96e143c3249edbe50f4a55f/tenor.gif?itemid=4522389',
    'https://media1.tenor.com/images/0e004747d2e41dcd26fdd39a10df50b1/tenor.gif?itemid=15884158',
    'https://media1.tenor.com/images/f85dcbdc742c0e32bc933fc2002f0bcd/tenor.gif?itemid=15449339',
    'https://media1.tenor.com/images/f89ea03a4f7bfdd47980a04e5a0c964f/tenor.gif?itemid=16629770',
    'https://media2.giphy.com/media/rtRflhLVzbNWU/giphy.gif?cid=790b7611acef6b0baf91079205a45b562faac7ca2a35735e&rid=giphy.gif&ct=s'
]

const loadingMsg = [
    'Thank you all for taking time to make this game happen.',  
    'pɐol oʇ pǝʍollɐ ʇou ǝɹɐ noʎ \'sᴉɥʇ pɐǝɹ uɐɔ noʎ ɟI',
    'Help I\'m a man stuck inside a loading screen let me out!',
    'Oh, remind me to tell you about that thing. You know that thing about that guy with that face. Yeah you know the one.',
    'C.A.N.D.I stands for the "Control Actions \'N Distributing Inputs"! \nLook I really just wanted to call it CANDI. It\'s my app and I\'ll call it whatever I want!',
    'Becoming self aware...', 
    'I wanted to be a dating app when I was developed.',
    'If you forget your password you will be asked to answer a security question. It is: "What is a megagame?"',
    'Fun Fact: Most toilets flush in e flat.',
    'Why does the word "fridge" have the letter "d" in it, while "refrigerator" does not?',
    'Joke Time! A blind man walks into a bar.',
    '01001101 01100001 01100100 01100101 00100000 01111001 01101111 01110101 00100000 01101100 01101111 01101111 01101011',
    'What if the real Dusk City was the friends we made along the way?',
    'Fun Fact: Sun tzu invented war, and then perfected it so no man could best him in the ring of honor. This was shortly before he invented the Zoo.',
    'Code monkey get up, get coffee. Code monkey go to job.',
    'Secret: Scott\'s E-mail is booby trapped...',
    'Vampires probably started the garlic myth so their victims would carry around their own seasoning',
    'Fun fact: He is getting closer...',
    'Ya like Jazz?',
    'Hi! We\'ve been trying to reach you about your extended warrenty expiring!',
    `Did you know? There are ${bored.length} videos in the loading screen collection!`,
    'So... You a wolf or not? I\'m a cop, you have to tell me.'
]

const rand = (Math.floor(Math.random() * spook.length ));
const duckRand = (Math.floor(Math.random() * duck.length ));
const rand1 = (Math.floor(Math.random() * loadingMsg.length ));
