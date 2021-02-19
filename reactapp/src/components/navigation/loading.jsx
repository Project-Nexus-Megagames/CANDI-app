import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Content, FlexboxGrid, Progress } from 'rsuite';
const { Line, Circle } = Progress;

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
    }

    render() {
        return ( 
            <React.Fragment>
            <Content>
                <FlexboxGrid justify="center">
                <FlexboxGrid.Item key={1} colspan={12} style={{marginTop: '50px'}}>
                    <img src={spook[rand]} alt={'Loading...'} />  
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
                   </FlexboxGrid.Item>  

                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10 }}>
                        Characters: <Circle percent={this.state.characters ? 100 : 0} showInfo={this.state.characters ? true: false} status={this.state.characters ? 'success' : 'active'} />
                    </div>
                    </FlexboxGrid.Item>                  

                    <FlexboxGrid.Item colspan={4}>
                    <div style={{ width: 160, marginTop: 10 }}>
                        Actions: <Circle percent={this.state.actions ? 100 : 0} showInfo={this.state.actions ? true: false} status={this.state.actions ? 'success' : 'active'} />               
                    </div>
                   </FlexboxGrid.Item>


                </FlexboxGrid>
            </Content> <b>Loading...</b>
        </React.Fragment>
        );        
    }
}

const mapStateToProps = (state) => ({
	assets: state.assets.list,
	characters: state.characters.list,
    actions: state.actions.list,
    gamestate: state.gamestate,
});

const mapDispatchToProps = (dispatch) => ({

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
    'https://media3.giphy.com/media/hS9SwD4UcQH5OJBeV4/giphy.gif'
]

const rand = (Math.floor(Math.random() * spook.length ));
