import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Avatar, Container, FlexboxGrid, List, Tag} from 'rsuite';
import {getMyCharacter} from '../../../redux/entities/characters';
import {getFadedColor} from '../../../scripts/frontend';

class ActionList extends Component {
    state = {rounds: []};

    componentDidMount = async () => {
        try {
            this.createListCatagories();
        } catch (err) {
            console.log(err);
        }
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.actions !== prevProps.actions) {
            this.createListCatagories();
        }
    };

    listStyle(item, index) {
        if (item === this.props.selected)
            return {
                cursor: 'pointer',
                opacity: '0.6',
                backgroundColor: '#272b34',
                textAlign: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            };
        if (index === 1)
            return {
                cursor: 'pointer',
                backgroundColor: '#161420',
                textAlign: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            };
        else
            return {
                cursor: 'pointer',
                textAlign: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            };
    }

    createListCatagories = () => {
        const rounds = [];
        console.log('this.props', this.props);
        for (const action of this.props.actions) {
            if (!rounds.some((el) => el === action.round)) rounds.push(action.round);
        }
        rounds.reverse();
        this.setState({rounds});
    };

    tagStyle = (item) => {
        switch (item.toLowerCase()) {
            case 'news':
                return (
                    <Tag style={{color: 'black'}} color="orange" key={item}>
                        {item}
                    </Tag>
                );
            default:
                break;
        }
    };

    render() {
        return (
            <Container>
                {this.state.rounds.map((round, index) => (
                    <div index={index} key={index}>
                        <h5 style={{
                            backgroundColor: getFadedColor('gold', 1 - (this.props.gamestate.round - round) * 0.1),
                            color: 'black'
                        }}>Round {round}</h5>

                        <List hover size="sm">
                            <div index={index} key={index}>
                                <List hover size="sm">
                                    {this.props.actions
                                        .filter((action) => action.round === round)
                                        .sort((a, b) => {
                                            // sort the catagories alphabetically
                                            if (a.creator.characterName < b.creator.characterName) {
                                                return -1;
                                            }
                                            if (a.creator.characterName > b.creator.characterName) {
                                                return 1;
                                            }
                                            return 0;
                                        })
                                        .map(
                                            (
                                                action,
                                                index
                                            ) => (
                                                <List.Item key={index} index={index} size={'sm'}
                                                           onClick={() => this.props.handleSelect(action)}
                                                           style={this.listStyle(action, index % 2)}>
                                                    <FlexboxGrid align='middle' justify="space-around">
                                                        <FlexboxGrid.Item>
                                                            <Avatar circle src={action.creator.profilePicture}/>
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item colspan={18}
                                                                          style={{
                                                                              ...styleCenter,
                                                                              flexDirection: 'column',
                                                                              alignItems: 'flex-start',
                                                                              overflow: 'ellipsis'
                                                                          }}
                                                        >
                                                            <div style={titleStyle}>{action.name}</div>
                                                            <b style={slimText}>
                                                                {
                                                                    <Tag
                                                                        style={{
                                                                            color: 'black',
                                                                            textTransform: 'capitalize',
                                                                            backgroundColor: getFadedColor(action.type)
                                                                        }}
                                                                    >
                                                                        {action.type}
                                                                    </Tag>
                                                                }
                                                                {action.results.length > 0 && action.results[0].ready &&
                                                                    <Tag color="green">R Ready</Tag>}
                                                                {action.effects.length > 0 && <Tag
                                                                    color="violet">{action.effects.length} Effects</Tag>}
                                                                {action.tags.map((tag) => this.tagStyle(tag))}
                                                            </b>
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </List.Item>
                                            )
                                        )}
                                </List>
                            </div>
                        </List>
                    </div>
                ))}
            </Container>
        );
    }
}

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
};
const titleStyle = {
    paddingBottom: 5,
    paddingLeft: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500
};

const slimText = {
    fontSize: '0.966em',
    color: '#97969B',
    fontWeight: 'lighter',
    paddingBottom: 5,
    paddingLeft: 2,
    whiteSpace: 'nowrap'
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    gamestate: state.gamestate,
    myCharacter: state.auth.user ? getMyCharacter(state) : undefined
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
